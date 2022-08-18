const { ROLES } = require("../config/default");
const { STATUS, ERRORCODE, MESSAGE } = require("../config/httpResponse");
const { ErrorResponse } = require("../helper/response");
const { redirect } = require("../service/redirect");

module.exports.AuthorizationHA = async (req, res, next) => {
  const admin = req.user;
  try {
    if (admin.role === ROLES.HR_ADMIN.CODE) {
      next();
    } else {
      redirect(req, res, STATUS.UNAUTHORIZED);
    }
  } catch (error) {
    console.log(error);
    res.status(STATUS.UNAUTHORIZED).redirect("/management");
  }
};
module.exports.AuthorizationCA = async (req, res, next) => {
  const admin = req.user;
  try {
    if (admin.role === ROLES.CONTENT_ADMIN.CODE) {
      next();
    } else {
      redirect(req, res, STATUS.UNAUTHORIZED);
    }
  } catch (error) {
    console.log(error);
    res.status(STATUS.UNAUTHORIZED).redirect("/management");
  }
};
