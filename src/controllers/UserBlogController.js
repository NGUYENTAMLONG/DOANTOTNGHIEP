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
const Behavior = require("../models/Behavior");
dotenv.config();

class UserBlogController {
  async getUserBlogPage(req, res) {
    res.status(200).json("SUCCESS");
  }
  async checkLiked(req, res) {
    const blogId = req.params.id;
    if (!blogId) {
      return res
        .status(STATUS.BAD_REQUEST)
        .json(
          new ErrorResponse(ERRORCODE.ERROR_BAD_REQUEST, MESSAGE.BAD_REQUEST)
        );
    }
    try {
      if (!req.user) {
        return res
          .status(STATUS.NOT_FOUND)
          .json(
            new ErrorResponse(ERRORCODE.ERROR_NOT_FOUND, MESSAGE.NOT_FOUND)
          );
      }

      const checkLiked = await Behavior.findOne({
        userId: req.user.id,
        blogId: blogId,
        like: true,
      });

      return res.status(STATUS.SUCCESS).json(
        new SuccessResponse(MESSAGE.SUCCESS, {
          liked: checkLiked,
        })
      );
    } catch (error) {
      console.log(error);
      res
        .status(STATUS.SERVER_ERROR)
        .json(new ErrorResponse(ERRORCODE.ERROR_SERVER, MESSAGE.ERROR_SERVER));
    }
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
      if (!req.user) {
        return res
          .status(STATUS.UNAUTHORIZED)
          .json(
            new ErrorResponse(
              ERRORCODE.ERROR_UNAUTHORIZED,
              MESSAGE.UNAUTHORIZED
            )
          );
      }
      const userId = req.user.id;
      const checkLiked = await Behavior.findOne({
        userId: userId,
        blogId: blogId,
        like: true,
      });
      if (checkLiked) {
        return res
          .status(STATUS.BAD_REQUEST)
          .json(
            new ErrorResponse(
              ERRORCODE.ERROR_ALREADY_EXISTS,
              MESSAGE.ALREADY_LIKED
            )
          );
      }

      await Behavior.create({
        userId,
        blogId,
        like: true,
        rate: false,
      });
      const updateBlog = await Blog.findByIdAndUpdate(blogId, {
        $inc: { "statistical.likes": 1 },
      });

      return res.status(STATUS.SUCCESS).json(
        new SuccessResponse(MESSAGE.LIKED, {
          counterLike: updateBlog.statistical.likes,
        })
      );
    } catch (error) {
      console.log(error);
      res
        .status(STATUS.SERVER_ERROR)
        .json(new ErrorResponse(ERRORCODE.ERROR_SERVER, MESSAGE.ERROR_SERVER));
    }
  }
  async unlikeBlog(req, res) {
    const { blogId } = req.body;
    if (!blogId) {
      return res
        .status(STATUS.BAD_REQUEST)
        .json(
          new ErrorResponse(ERRORCODE.ERROR_BAD_REQUEST, MESSAGE.BAD_REQUEST)
        );
    }
    try {
      if (!req.user) {
        return res
          .status(STATUS.UNAUTHORIZED)
          .json(
            new ErrorResponse(
              ERRORCODE.ERROR_UNAUTHORIZED,
              MESSAGE.UNAUTHORIZED
            )
          );
      }
      const userId = req.user.id;

      await Behavior.findOneAndDelete({ userId });
      const updateBlog = await Blog.findByIdAndUpdate(blogId, {
        $inc: { "statistical.likes": -1 },
      });

      return res.status(STATUS.SUCCESS).json(
        new SuccessResponse(MESSAGE.UNLIKED, {
          counterLike: updateBlog.statistical.likes,
        })
      );
    } catch (error) {
      console.log(error);
      res
        .status(STATUS.SERVER_ERROR)
        .json(new ErrorResponse(ERRORCODE.ERROR_SERVER, MESSAGE.ERROR_SERVER));
    }
  }
  async rateBlog(req, res) {
    const { blogId, counterStar } = req.body;
    if (!blogId || !counterStar) {
      return res
        .status(STATUS.BAD_REQUEST)
        .json(
          new ErrorResponse(ERRORCODE.ERROR_BAD_REQUEST, MESSAGE.BAD_REQUEST)
        );
    }
    try {
      if (!req.user) {
        return res
          .status(STATUS.UNAUTHORIZED)
          .json(
            new ErrorResponse(
              ERRORCODE.ERROR_UNAUTHORIZED,
              MESSAGE.UNAUTHORIZED
            )
          );
      }
      const userId = req.user.id;
      const checkRated = await Behavior.findOne({
        userId: userId,
        blogId: blogId,
        rate: true,
      });
      if (checkRated) {
        return res
          .status(STATUS.BAD_REQUEST)
          .json(
            new ErrorResponse(
              ERRORCODE.ERROR_ALREADY_EXISTS,
              MESSAGE.ALREADY_REATED
            )
          );
      }
      // Find Manga => rating, counting
      // Tinh rating moi =>
      const foundBlog = await Blog.findById(blogId);
      const oldRating = foundBlog.statistical.rating;
      const oldCounting = foundBlog.statistical.counting;
      const newCounting = oldCounting + 1;
      const newRating = (oldRating * oldCounting + counterStar) / newCounting;

      await Behavior.create({
        userId,
        blogId,
        like: false,
        rate: true,
      });

      await Blog.updateOne(
        { _id: blogId },
        {
          "statistical.counting": newCounting,
          "statistical.rating": parseFloat(newRating.toFixed(1)),
        }
      );
      return res
        .status(STATUS.SUCCESS)
        .json(new SuccessResponse(MESSAGE.RATED, null));
    } catch (error) {
      console.log(error);
      res
        .status(STATUS.SERVER_ERROR)
        .json(new ErrorResponse(ERRORCODE.ERROR_SERVER, MESSAGE.ERROR_SERVER));
    }
  }
}

module.exports = new UserBlogController();
