const { STATUS, MESSAGE, ERRORCODE } = require("../config/httpResponse");
const { SuccessResponse, ErrorResponse } = require("../helper/response");
const { ValidateEmail } = require("../helper/validate.helper");
const Email = require("../models/Email");
const { redirect } = require("../service/redirect");
const { sendMailToMany } = require("../service/sendMail");

class EmailController {
  async getCreateMailPage(req, res) {
    try {
      const foundMail = await Email.find({});
      return res.status(STATUS.SUCCESS).render("admin/mail/sendMail", {
        admin: req.user,
        mails: foundMail,
      });
    } catch (error) {
      console.log(error);
      redirect(req, res, STATUS.SERVER_ERROR);
    }
  }
  async getCreateMailPageToOne(req, res) {
    const mailId = req.params.id;
    try {
      const foundMail = await Email.findById(mailId);
      return res.status(STATUS.SUCCESS).render("admin/mail/sendMailToOne", {
        admin: req.user,
        mail: foundMail,
      });
    } catch (error) {
      console.log(error);
      redirect(req, res, STATUS.SERVER_ERROR);
    }
  }
  async submitEmail(req, res) {
    const { email } = req.body;
    if (!email) {
      return res
        .status(STATUS.BAD_REQUEST)
        .json(
          new ErrorResponse(ERRORCODE.ERROR_BAD_REQUEST, MESSAGE.BAD_REQUEST)
        );
    }
    try {
      if (!ValidateEmail(email)) {
        return res
          .status(STATUS.BAD_REQUEST)
          .json(
            new ErrorResponse(ERRORCODE.ERROR_BAD_REQUEST, MESSAGE.BAD_REQUEST)
          );
      }
      const foundEmail = await Email.findOne({ email: email });
      let submitedEmail = null;
      if (!foundEmail) {
        submitedEmail = await Email.create({
          email: email,
        });
      }
      return res
        .status(STATUS.CREATED)
        .json(new SuccessResponse(MESSAGE.CREATE_SUCCESS, submitedEmail));
    } catch (error) {
      console.log(error);
      return res
        .status(STATUS.SERVER_ERROR)
        .json(new ErrorResponse(ERRORCODE.ERROR_SERVER, MESSAGE.ERROR_SERVER));
    }
  }
  async getMailDashboard(req, res) {
    try {
      const emails = await Email.find({});
      res.render("admin/mail/mailDashboard", {
        admin: req.user,
        mails: emails,
      });
    } catch (error) {
      console.log(error);
      redirect(req, res, STATUS.SERVER_ERROR);
    }
  }
  async getMailTrash(req, res) {
    try {
      const foundDeletedMail = await Email.findDeleted({});
      res.render("admin/mail/mailTrash", {
        admin: req.user,
        mails: foundDeletedMail,
      });
    } catch (error) {
      console.log(error);
      redirect(req, res, STATUS.SERVER_ERROR);
    }
  }
  async getMailList(req, res) {
    try {
      const emails = await Email.find({});
      res.status(STATUS.SUCCESS).json({
        rows: emails,
      });
    } catch (error) {
      console.log(error);
      res
        .status(STATUS.SERVER_ERROR)
        .json(new ErrorResponse(ERRORCODE.ERROR_SERVER, MESSAGE.ERROR_SERVER));
    }
  }
  async getDeletedList(req, res) {
    try {
      const emails = await Email.findDeleted({});
      res.status(STATUS.SUCCESS).json({
        rows: emails,
      });
    } catch (error) {
      console.log(error);
      res
        .status(STATUS.SERVER_ERROR)
        .json(new ErrorResponse(ERRORCODE.ERROR_SERVER, MESSAGE.ERROR_SERVER));
    }
  }
  async deleteMail(req, res) {
    const idEmail = req.params.id;
    if (!idEmail) {
      return res
        .status(STATUS.BAD_REQUEST)
        .json(new ErrorResponse(ERRORCODE.BAD_REQUEST, MESSAGE.BAD_REQUEST));
    }
    try {
      await Email.delete({ _id: idEmail });
      res
        .status(STATUS.SUCCESS)
        .json(new SuccessResponse(MESSAGE.DELETE_SUCCESS, null));
    } catch (error) {
      console.log(error);
      res
        .status(STATUS.SERVER_ERROR)
        .json(new ErrorResponse(ERRORCODE.ERROR_SERVER, MESSAGE.ERROR_SERVER));
    }
  }
  async restoreMail(req, res) {
    const idEmail = req.params.id;
    if (!idEmail) {
      return res
        .status(STATUS.BAD_REQUEST)
        .json(new ErrorResponse(ERRORCODE.BAD_REQUEST, MESSAGE.BAD_REQUEST));
    }
    try {
      await Email.restore({ _id: idEmail });
      res
        .status(STATUS.SUCCESS)
        .json(new SuccessResponse(MESSAGE.RESTORE_SUCCESS, null));
    } catch (error) {
      console.log(error);
      res
        .status(STATUS.SERVER_ERROR)
        .json(new ErrorResponse(ERRORCODE.ERROR_SERVER, MESSAGE.ERROR_SERVER));
    }
  }
  async deleteMailChecked(req, res) {
    const idList = req.body;
    try {
      await Email.delete({ _id: { $in: idList } });
      res
        .status(STATUS.SUCCESS)
        .json(new SuccessResponse(MESSAGE.DELETE_SUCCESS, null));
    } catch (error) {
      console.log(error);
      res
        .status(STATUS.SERVER_ERROR)
        .json(new ErrorResponse(ERRORCODE.ERROR_SERVER, MESSAGE.ERROR_SERVER));
    }
  }
  async restoreMailChecked(req, res) {
    const idList = req.body;
    try {
      await Email.restore({ _id: { $in: idList } });
      res
        .status(STATUS.SUCCESS)
        .json(new SuccessResponse(MESSAGE.RESTORE_SUCCESS, null));
    } catch (error) {
      console.log(error);
      res
        .status(STATUS.SERVER_ERROR)
        .json(new ErrorResponse(ERRORCODE.ERROR_SERVER, MESSAGE.ERROR_SERVER));
    }
  }
  async sendMail(req, res) {
    const { emails, content } = req.body;
    try {
      let condition = {};
      if (emails !== null) {
        condition = { email: { $in: emails } };
      }
      console.log(condition);
      const foundEmail = await Email.find(condition).select("email");
      const emailsArr = foundEmail.map((elm) => elm.email);
      await sendMailToMany(emailsArr, content);
      res
        .status(STATUS.SUCCESS)
        .json(new SuccessResponse(MESSAGE.SEND_MAIL_SUCCESS, foundEmail));
    } catch (error) {
      console.log(error);
      res
        .status(STATUS.SERVER_ERROR)
        .json(new ErrorResponse(ERRORCODE.ERROR_SERVER, MESSAGE.ERROR_SERVER));
    }
  }
}
module.exports = new EmailController();
