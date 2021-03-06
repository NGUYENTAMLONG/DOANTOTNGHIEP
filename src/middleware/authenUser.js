const jwt = require("jsonwebtoken");
const { SECRET_KEY } = require("../config/default");
const { STATUS, MESSAGE, ERRORCODE } = require("../config/httpResponse");
const { ErrorResponse } = require("../helper/response");
const User = require("../models/User");
async function AuthenUser(req, res, next) {
  const token = req.cookies.token;
  if (typeof token === "undefined") {
    return next();
  }
  try {
    const verifyToken = jwt.verify(token, SECRET_KEY);
    const foundUser = await User.findById(verifyToken.userId).select([
      "username",
      "avatar",
    ]);
    req.AuthPayload = foundUser;
    next();
  } catch (error) {
    console.log(error);
    res
      .status(STATUS.SERVER_ERROR)
      .json(new ErrorResponse(ERRORCODE.ERROR_SERVER, MESSAGE.ERROR_SERVER));
  }
}
module.exports = AuthenUser;
