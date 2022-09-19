const dotenv = require("dotenv");
const moment = require("moment");
const fs = require("fs");
const path = require("path");
const appRoot = require("app-root-path");
const { STATUS, ERRORCODE, MESSAGE } = require("../config/httpResponse");
const { ErrorResponse, SuccessResponse } = require("../helper/response");
const { redirect } = require("../service/redirect");
const UserLocal = require("../models/UserLocal");
const UserFacebook = require("../models/UserFacebook");
const UserGoogle = require("../models/UserGoogle");

const Blog = require("../models/Blog");
dotenv.config();

class UserBlogController {
  async getUserBlogPage(req, res) {
    res.status(200).json("SUCCESS");
  }
  async likeBlog(req, res) {
    const { blogId } = req.body;
    if (!blogId) {
      return res
        .status(STATUS.BAD_REQUEST)
        .json(
          new ErrorResponse(ERRORCODE.ERROR_BAD_REQUEST, MESSAGE.BAD_REQUEST)
        );
    }
    try {
      if (req.user) {
        if (req.user.provider === PASSPORT.LOCAL) {
          await UserLocal.findByIdAndUpdate(req.user.id, {
            $push: { likedList: blogId },
          });
        }
        if (req.user.provider === PASSPORT.GOOGLE) {
          await UserGoogle.findByIdAndUpdate(req.user.id, {
            $push: { likedList: blogId },
          });
        }
        if (req.user.provider === PASSPORT.FACEBOOK) {
          await UserFacebook.findByIdAndUpdate(req.user.id, {
            $push: { likedList: blogId },
          });
        }
      }
      await Manga.updateOne(
        { _id: blogId },
        { $inc: { "statistical.likes": 1 } }
      );
      return res
        .status(STATUS.SUCCESS)
        .json(new SuccessResponse(MESSAGE.LIKED, req.user.id));
    } catch (error) {
      console.log(error);
      res
        .status(STATUS.SERVER_ERROR)
        .json(new ErrorResponse(ERRORCODE.ERROR_SERVER, MESSAGE.ERROR_SERVER));
    }
  }
}

module.exports = new UserBlogController();
