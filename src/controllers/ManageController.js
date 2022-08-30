const { STATUS, MESSAGE, ERRORCODE } = require("../config/httpResponse");
const { SuccessResponse, ErrorResponse } = require("../helper/response");
const Admin = require("../models/Admin");
const { sendMailToRetrievalAdminAccount } = require("../service/sendMail");
const jsonwebtoken = require("jsonwebtoken");
const { JWT } = require("../config/default");
const { ValidatePassword } = require("../helper/validate.helper");
const bcrypt = require("bcrypt");
const { redirect } = require("../service/redirect");
class ManageController {
  getLogin(req, res) {
    return res.status(STATUS.SUCCESS).render("./admin/login");
  }
  async adminLogout(req, res) {
    req.session.destroy();
    res.status(STATUS.SUCCESS).redirect("/management");
  }
  async getForgot(req, res) {
    res.status(STATUS.SUCCESS).render("./admin/forgot");
  }
  async sendForgot(req, res) {
    const { email, originUrl } = req.body;
    try {
      const foundAdmin = await Admin.findOne({ email: email });
      if (!foundAdmin) {
        return res
          .status(STATUS.NOT_FOUND)
          .json(
            new ErrorResponse(ERRORCODE.ERROR_NOT_FOUND, MESSAGE.NOT_FOUND)
          );
      }
      await sendMailToRetrievalAdminAccount(
        email,
        foundAdmin.username,
        originUrl
      );
      res
        .status(STATUS.SUCCESS)
        .json(new SuccessResponse(MESSAGE.CREATE_SUCCESS, null));
    } catch (error) {
      console.log(error);
      return res
        .status(STATUS.SERVER_ERROR)
        .json(new ErrorResponse(ERRORCODE.ERROR_SERVER, MESSAGE.ERROR_SERVER));
    }
  }
  async getRecover(req, res) {
    const { jwt } = req.params;
    try {
      const verifyJwt = await jsonwebtoken.verify(jwt, JWT.SERCRET_JWT);
      const foundAdmin = await Admin.findOne({ username: verifyJwt.username });
      if (!foundAdmin) {
        return res
          .status(STATUS.NOT_FOUND)
          .json(
            new ErrorResponse(ERRORCODE.ERROR_NOT_FOUND, MESSAGE.NOT_FOUND)
          );
      }
      res
        .status(STATUS.SUCCESS)
        .render("./admin/recover", { admin: foundAdmin });
    } catch (error) {
      console.log(error);
      if (error.name === "TokenExpiredError") {
        redirect(req, res, STATUS.GATEWAY_TIMEOUT);
      }
      // return res
      //   .status(STATUS.SERVER_ERROR)
      //   .json(new ErrorResponse(ERRORCODE.ERROR_SERVER, error));
    }
  }
  async recoverAccount(req, res) {
    const { username, newPassword } = req.body;
    if (!username || !newPassword) {
      return res
        .status(STATUS.BAD_REQUEST)
        .json(
          new ErrorResponse(ERRORCODE.ERROR_BAD_REQUEST, MESSAGE.BAD_REQUEST)
        );
    }
    try {
      if (!ValidatePassword(newPassword)) {
        return res
          .status(STATUS.BAD_REQUEST)
          .json(
            new ErrorResponse(
              ERRORCODE.ERROR_BAD_REQUEST,
              MESSAGE.PASSWORD_FAIL
            )
          );
      }
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(newPassword, salt);

      await Admin.findOneAndUpdate(
        { username: username },
        {
          password: hashedPassword,
        }
      );

      res
        .status(STATUS.SUCCESS)
        .json(new SuccessResponse(MESSAGE.SUCCESS, null));
    } catch (error) {
      console.log(error);
      res
        .status(STATUS.SERVER_ERROR)
        .json(new ErrorResponse(ERRORCODE.SERVER_ERROR, MESSAGE.ERROR_SERVER));
    }
  }
}

module.exports = new ManageController();
