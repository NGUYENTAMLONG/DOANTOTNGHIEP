const { STATUS, MESSAGE, ERRORCODE } = require("../config/httpResponse");
const { ErrorResponse } = require("../helper/response");
const Admin = require("../models/Admin");
const UserFacebook = require("../models/UserFacebook");
const UserGoogle = require("../models/UserGoogle");
const UserLocal = require("../models/UserLocal");

async function Authentication(req, res, next) {
  // console.log("---->", req.user);
  if (req.originalUrl.includes("/management/")) {
    if (req.user && req.user.role === "HA") {
      const foundUser = await Admin.findById(req.user._id);
      req.admin = {
        id: foundUser._id,
        avatar: foundUser.avatar,
        username: foundUser.username,
        email: foundUser.email,
      };
      res.redirect("/management/human");
      return;
    } else if (req.user && req.user.role === "CA") {
      const foundUser = await Admin.findById(req.user._id);
      req.admin = {
        id: foundUser._id,
        avatar: foundUser.avatar,
        username: foundUser.username,
        email: foundUser.email,
      };
      res.redirect("/management/content");
      return;
    } else {
      console.log(req.user);
      res.redirect("/management");
      return;
    }
  } else {
    if (req.user && req.user.role === "M") {
      let user;
      if (req.user.passport === "LOCAL") {
        user = await UserLocal.findById(req.user._id);
      } else if (req.user.passport === "GOOGLE") {
        user = await UserGoogle.findById(req.user._id);
      } else if (req.user.passport === "FACEBOOK") {
        user = await UserFacebook.findById(req.user._id);
      }
      // console.log("USER:", user);
      req.user = {
        id: user._id,
        avatar: user.avatar,
        username: user.username,
        email: user.email,
        provider: user.passport,
      };
      next();
      return;
    } else {
      req.user = undefined;
      next();
      return;
    }
  }
}

module.exports = Authentication;

// if (req.user.passport === "LOCAL") {
//   req.user = {
//     id: req.user._id,
//     avatar: req.user.avatar,
//     username: req.user.username,
//     email: req.user.email,
//     provider: req.user.passport,
//   };
//   next();
//   return;
// } else {
//   console.log("HERE=>", req.user);
//   req.user = {
//     // avatar: req.user.photos[0].value,
//     // username: req.user.displayName,
//     // email: req.user.emails[0].value,
//     // provider: req.user.provider,
//     avatar: req.user.avatar,
//     username: req.user.username,
//     email: req.user.email,
//     provider: req.user.provider,
//   };
//   next();
//   return;
// }
