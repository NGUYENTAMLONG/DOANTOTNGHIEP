const { STATUS, MESSAGE, ERRORCODE } = require("../config/httpResponse");
const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { SECRET_KEY, OPTION_COOKIE } = require("../config/default");
const { SuccessResponse, ErrorResponse } = require("../helper/response");
const {
  ValidatePassword,
  ValidateEmail,
  ValidateBlank,
} = require("../helper/validate.helper");
const { SendRegisterMail } = require("../service/sendMail");
const { GenerateOTP } = require("../helper/generate");

let otpCache = "";

class AccountController {
  async Login(req, res) {
    const { username, password } = req.body;
    if (!username || !password) {
      return res
        .status(STATUS.BAD_REQUEST)
        .json(
          new ErrorResponse(ERRORCODE.ERROR_BAD_REQUEST, MESSAGE.BAD_REQUEST)
        );
    }
    try {
      const foundUser = await User.findOne({ username: username });
      if (!foundUser) {
        return res
          .status(STATUS.NOT_FOUND)
          .json(
            new ErrorResponse(ERRORCODE.ERROR_NOT_FOUND, MESSAGE.DOES_NOT_EXIST)
          );
      }
      const matched = await bcrypt.compare(password, foundUser.password);
      if (!matched) {
        return res
          .status(STATUS.UNAUTHORIZED)
          .json(
            new ErrorResponse(
              ERRORCODE.ERROR_UNAUTHORIZED,
              MESSAGE.PASSWORD_FAIL
            )
          );
      }
      const token = jwt.sign(
        {
          userId: foundUser._id,
          username: foundUser.username,
        },
        SECRET_KEY
      );
      res.cookie("token", token, OPTION_COOKIE);
      res
        .status(STATUS.SUCCESS)
        .json(new SuccessResponse(MESSAGE.LOGIN_SUCCESS, null));
    } catch (error) {
      res
        .status(STATUS.SERVER_ERROR)
        .json(new ErrorResponse(ERRORCODE.ERROR_SERVER, MESSAGE.ERROR_SERVER));
    }
  }

  async VerifyEmail(req, res) {
    // return res.json({ u: req.body.username, p: req.body.password });
    const { username, password, email, dob, otp } = req.body;
    // console.log({ username, password, email, dob, otp });

    if (!username || !password || !email || !dob) {
      return res
        .status(STATUS.BAD_REQUEST)
        .json(
          new ErrorResponse(ERRORCODE.ERROR_BAD_REQUEST, MESSAGE.BAD_REQUEST)
        );
    }
    try {
      //Test Password
      if (!ValidatePassword(password)) {
        return res
          .status(STATUS.BAD_REQUEST)
          .json(
            new ErrorResponse(
              ERRORCODE.ERROR_BAD_REQUEST,
              MESSAGE.PASSWORD_INVALID
            )
          );
      }
      //Test Email
      if (!ValidateEmail(email)) {
        return res
          .status(STATUS.BAD_REQUEST)
          .json(
            new ErrorResponse(
              ERRORCODE.ERROR_BAD_REQUEST,
              MESSAGE.EMAIL_INVALID
            )
          );
      }
      if (!ValidateBlank(username)) {
        return res
          .status(STATUS.BAD_REQUEST)
          .json(
            new ErrorResponse(
              ERRORCODE.ERROR_BAD_REQUEST,
              MESSAGE.ERROR_WHITE_SPACE
            )
          );
      }
      const checkEmail = await User.findOne({ email: email });
      if (checkEmail) {
        return res
          .status(STATUS.BAD_REQUEST)
          .json(
            new ErrorResponse(
              ERRORCODE.ERROR_ALREADY_EXISTS,
              MESSAGE.EMAIL_ALREADY
            )
          );
      }
      const checkUsername = await User.findOne({ username: username });
      if (checkUsername) {
        return res
          .status(STATUS.BAD_REQUEST)
          .json(
            new ErrorResponse(
              ERRORCODE.ERROR_ALREADY_EXISTS,
              MESSAGE.USERNAME_ALREADY
            )
          );
      }
      otpCache = GenerateOTP();
      console.log("Verify step:", otpCache);
      await SendRegisterMail(email, otpCache);

      res
        .status(STATUS.SUCCESS)
        .json(new SuccessResponse(MESSAGE.SEND_MAIL_SUCCESS, null));
    } catch (error) {
      res
        .status(STATUS.SERVER_ERROR)
        .json(new ErrorResponse(ERRORCODE.ERROR_SERVER, MESSAGE.ERROR_SERVER));
    }
  }

  async Register(req, res) {
    const { username, password, email, dob, otp } = req.body;
    // console.log({ username, password, email, dob, otp });
    // console.log("REgister: ", otpCache);
    try {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
      const newUser = new User({
        username,
        password: hashedPassword,
        email,
        dob,
        otp,
      });
      if (otp === otpCache) {
        const createdUser = await newUser.save();
        return res
          .status(STATUS.CREATED)
          .json(new SuccessResponse(MESSAGE.CREATE_SUCCESS, createdUser));
      } else {
        return res
          .status(STATUS.BAD_REQUEST)
          .json(
            new ErrorResponse(ERRORCODE.ERROR_BAD_REQUEST, MESSAGE.OTP_INVALID)
          );
      }
    } catch (error) {
      console.log(error);
      res
        .status(STATUS.SERVER_ERROR)
        .json(new ErrorResponse(ERRORCODE.ERROR_SERVER, MESSAGE.ERROR_SERVER));
    }
  }
  async Logout(req, res) {
    const token = req.cookies.token;
    if (!token) {
      return res
        .status(STATUS.UNAUTHORIZED)
        .json(
          new ErrorResponse(ERRORCODE.ERROR_UNAUTHORIZED, MESSAGE.UNAUTHORIZED)
        );
    }
    try {
      res.clearCookie("token");
      res
        .status(STATUS.SUCCESS)
        .json(new SuccessResponse(MESSAGE.SUCCESS, null));
    } catch (error) {
      console.log(error);
      return res
        .status(STATUS.SERVER_ERROR)
        .json(new ErrorResponse(ERRORCODE.ERROR_SERVER, MESSAGE.ERROR_SERVER));
    }
  }
  async Resend(req, res) {
    const { email } = req.body;
    try {
      otpCache = GenerateOTP();
      // console.log("Resend step: ", otpCache);
      await SendRegisterMail(email, otpCache);
      res
        .status(STATUS.SUCCESS)
        .json(new SuccessResponse(MESSAGE.SEND_MAIL_SUCCESS, null));
    } catch (error) {
      console.log(error);
      res
        .status(STATUS.SERVER_ERROR)
        .json(new ErrorResponse(ERRORCODE.ERROR_SERVER, MESSAGE.ERROR_SERVER));
    }
  }
}
module.exports = new AccountController();
