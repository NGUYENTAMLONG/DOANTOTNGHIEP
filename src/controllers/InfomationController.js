const Admin = require("../models/Admin");
const bcrypt = require("bcrypt");
const dotenv = require("dotenv");
const moment = require("moment");
const fs = require("fs");
const path = require("path");
const { STATUS, ERRORCODE, MESSAGE } = require("../config/httpResponse");
const { ErrorResponse, SuccessResponse } = require("../helper/response");
const appRoot = require("app-root-path");
const {
  ValidatePassword,
  ValidateEmail,
  ValidateBlank,
} = require("../helper/validate.helper");
const { ROLES } = require("../config/default");
dotenv.config();
class InfomationController {
  //1. Edit Avatar Admin
  async changeAvatarInfoAdmin(req, res) {
    const { id } = req.params;
    try {
      const updateAdmin = await Admin.findByIdAndUpdate(id, {
        avatar: req.file.filename,
      });
      if (req.file) {
        fs.unlinkSync(
          path.join(
            appRoot.path,
            `/src/public/avatars/admin/${updateAdmin.avatar}`
          )
        );
      }
      res
        .status(STATUS.SUCCESS)
        .json(new SuccessResponse(MESSAGE.SUCCESS, req.file));
    } catch (error) {
      console.log(error);
      res
        .status(STATUS.SERVER_ERROR)
        .json(new ErrorResponse(ERRORCODE.SERVER_ERROR, MESSAGE.ERROR_SERVER));
    }
  }
  //2. Change Password Admin
  async changePasswordInfoAdmin(req, res) {
    const { adminId, newPassword } = req.body;
    if (!adminId || !newPassword) {
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

      await Admin.findByIdAndUpdate(adminId, {
        password: hashedPassword,
      });

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
  //3. Change Email Admin
  async changeEmailInfoAdmin(req, res) {
    const { adminId, newEmail } = req.body;
    if (!adminId || !newEmail) {
      return res
        .status(STATUS.BAD_REQUEST)
        .json(
          new ErrorResponse(ERRORCODE.ERROR_BAD_REQUEST, MESSAGE.BAD_REQUEST)
        );
    }
    try {
      if (!ValidateEmail(newEmail)) {
        return res
          .status(STATUS.BAD_REQUEST)
          .json(
            new ErrorResponse(
              ERRORCODE.ERROR_BAD_REQUEST,
              MESSAGE.EMAIL_INVALID
            )
          );
      }
      const checkExistsEmail = await Admin.findOne({ email: newEmail });
      if (checkExistsEmail) {
        return res
          .status(STATUS.BAD_REQUEST)
          .json(
            new ErrorResponse(
              ERRORCODE.ERROR_ALREADY_EXISTS,
              MESSAGE.EMAIL_ALREADY
            )
          );
      }
      await Admin.findByIdAndUpdate(adminId, {
        email: newEmail,
      });

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
  //4. Change Email Admin
  async changeUsernameInfoAdmin(req, res) {
    const { adminId, newUsername } = req.body;
    if (!adminId || !newUsername) {
      return res
        .status(STATUS.BAD_REQUEST)
        .json(
          new ErrorResponse(ERRORCODE.ERROR_BAD_REQUEST, MESSAGE.BAD_REQUEST)
        );
    }
    try {
      if (!ValidateBlank(newUsername)) {
        return res
          .status(STATUS.BAD_REQUEST)
          .json(
            new ErrorResponse(
              ERRORCODE.ERROR_BAD_REQUEST,
              MESSAGE.EMAIL_INVALID
            )
          );
      }
      const checkExistsUsername = await Admin.findOne({
        username: newUsername,
      });
      if (checkExistsUsername) {
        return res
          .status(STATUS.BAD_REQUEST)
          .json(
            new ErrorResponse(
              ERRORCODE.ERROR_ALREADY_EXISTS,
              MESSAGE.USERNAME_ALREADY
            )
          );
      }

      await Admin.findByIdAndUpdate(adminId, {
        username: newUsername,
      });

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
  //5. Change Role Admin
  async changeRoleInfoAdmin(req, res) {
    const { adminId, newRole } = req.body;

    if (!adminId || !newRole) {
      return res
        .status(STATUS.BAD_REQUEST)
        .json(
          new ErrorResponse(ERRORCODE.ERROR_BAD_REQUEST, MESSAGE.BAD_REQUEST)
        );
    }
    try {
      if (
        newRole !== ROLES.CONTENT_ADMIN.CODE &&
        newRole !== ROLES.HR_ADMIN.CODE
      ) {
        return res
          .status(STATUS.BAD_REQUEST)
          .json(
            new ErrorResponse(ERRORCODE.ERROR_BAD_REQUEST, MESSAGE.BAD_REQUEST)
          );
      }
      await Admin.findByIdAndUpdate(adminId, {
        role: newRole,
      });

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

module.exports = new InfomationController();
