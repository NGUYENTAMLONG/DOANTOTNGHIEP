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
const { BLOG_ROLE, BLOG_STATUS } = require("../config/default");
dotenv.config();
const mongoose = require("mongoose");

class UserBlogController {
  async getUserBlogPage(req, res) {
    if (!req.user) {
      return redirect(req, res, STATUS.UNAUTHORIZED);
    }
    try {
      const userId = req.user.id;
      const foundBlogs = await Blog.find({
        writtenBy: userId,
      }).sort({ createdAt: -1 });

      return res.status(STATUS.SUCCESS).render("userBlog", {
        user: req.user,
        blogs: foundBlogs,
      });
    } catch (error) {
      console.log(error);
      res
        .status(STATUS.SERVER_ERROR)
        .json(new ErrorResponse(ERRORCODE.ERROR_SERVER, MESSAGE.ERROR_SERVER));
    }
  }
  async getTrashPage(req, res) {
    if (!req.user) {
      return redirect(req, res, STATUS.UNAUTHORIZED);
    }
    try {
      const userId = req.user.id;
      const foundBlogs = await Blog.findDeleted({
        writtenBy: userId,
      }).sort({ createdAt: -1 });
      return res.status(STATUS.SUCCESS).render("userBlogTrash", {
        user: req.user,
        blogs: foundBlogs,
      });
    } catch (error) {
      console.log(error);
      res
        .status(STATUS.SERVER_ERROR)
        .json(new ErrorResponse(ERRORCODE.ERROR_SERVER, MESSAGE.ERROR_SERVER));
    }
  }
  async getUserCreateBlog(req, res) {
    if (!req.user) {
      return redirect(req, res, STATUS.UNAUTHORIZED);
    }
    try {
      return res.status(STATUS.SUCCESS).render("userCreateBlog", {
        user: req.user,
      });
    } catch (error) {
      console.log(error);
      res
        .status(STATUS.SERVER_ERROR)
        .json(new ErrorResponse(ERRORCODE.ERROR_SERVER, MESSAGE.ERROR_SERVER));
    }
  }
  async getUserUpdateBlog(req, res) {
    const blogId = req.params.id;
    if (!req.user) {
      return redirect(req, res, STATUS.UNAUTHORIZED);
    }
    if (!blogId) {
      return redirect(req, res, STATUS.BAD_REQUEST);
    }
    try {
      const foundBlog = await Blog.findById(blogId);
      return res.status(STATUS.SUCCESS).render("userUpdateBlog", {
        user: req.user,
        blog: foundBlog,
      });
    } catch (error) {
      console.log(error);
      res
        .status(STATUS.SERVER_ERROR)
        .json(new ErrorResponse(ERRORCODE.ERROR_SERVER, MESSAGE.ERROR_SERVER));
    }
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
  async createUserBlog(req, res) {
    const {
      title,
      desc,
      author,
      type,
      keywordArray,
      source,
      link,
      image,
      content,
    } = req.body;
    if (
      !title ||
      !desc ||
      !author ||
      !type ||
      keywordArray.length === 0 ||
      !source ||
      !image ||
      !content
    ) {
      return res
        .status(STATUS.BAD_REQUEST)
        .json(
          new ErrorResponse(ERRORCODE.ERROR_BAD_REQUEST, MESSAGE.BAD_REQUEST)
        );
    }
    try {
      const newBlog = new Blog({
        title,
        desc,
        type,
        author,
        cover: image,
        keywords: keywordArray,
        source,
        link,
        writtenBy: req.user.id,
        content,
        role: BLOG_ROLE.MEMBER.CODE,
        status: BLOG_STATUS.PENDING,
        passport: req.user.provider,
      });
      await newBlog.save();
      return res
        .status(STATUS.CREATED)
        .json(new SuccessResponse(MESSAGE.CREATE_SUCCESS, null));
    } catch (error) {
      console.log(error);
      res
        .status(STATUS.SERVER_ERROR)
        .json(new ErrorResponse(ERRORCODE.ERROR_SERVER, MESSAGE.ERROR_SERVER));
    }
  }
  async updateUserBlog(req, res) {
    const {
      title,
      desc,
      author,
      type,
      keywordArray,
      source,
      link,
      image,
      content,
      oldCover,
    } = req.body;

    const blogId = req.params.id;

    if (
      !title ||
      !desc ||
      !author ||
      !type ||
      keywordArray.length === 0 ||
      !source ||
      !content
    ) {
      return res
        .status(STATUS.BAD_REQUEST)
        .json(
          new ErrorResponse(ERRORCODE.ERROR_BAD_REQUEST, MESSAGE.BAD_REQUEST)
        );
    }
    try {
      const payload = {
        title,
        desc,
        type,
        author,
        keywords: keywordArray,
        source,
        link,
        writtenBy: req.user._id,
        content,
      };

      if (image) {
        payload.cover = image;
        fs.unlinkSync(
          path.join(
            appRoot.path,
            `/src/public/blog/covers/${oldCover.split("/")[4]}`
          )
        );
      }

      await Blog.findOneAndUpdate({ _id: blogId }, payload);

      return res
        .status(STATUS.SUCCESS)
        .json(new SuccessResponse(MESSAGE.UPDATE_SUCCESS, null));
    } catch (error) {
      console.log(error);
      res
        .status(STATUS.SERVER_ERROR)
        .json(new ErrorResponse(ERRORCODE.ERROR_SERVER, MESSAGE.ERROR_SERVER));
    }
  }

  async deleteUserBlog(req, res) {
    const blogId = req.params.id;
    if (!blogId) {
      return res
        .status(STATUS.BAD_REQUEST)
        .json(new ErrorResponse(ERRORCODE.BAD_REQUEST, MESSAGE.BAD_REQUEST));
    }
    try {
      await Blog.delete({ _id: blogId });
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
  async recoverUserBlog(req, res) {
    const blogId = req.params.id;
    if (!blogId) {
      return res
        .status(STATUS.BAD_REQUEST)
        .json(new ErrorResponse(ERRORCODE.BAD_REQUEST, MESSAGE.BAD_REQUEST));
    }
    try {
      await Blog.restore({ _id: blogId });
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
  async liveSearchUserBlog(req, res) {
    const payload = req.body.payload.trim();
    if (!req.user) {
      return res
        .status(STATUS.BAD_REQUEST)
        .json(new ErrorResponse(ERRORCODE.BAD_REQUEST, MESSAGE.BAD_REQUEST));
    }
    try {
      let result = await Blog.find({
        // $or: [{ name: regex }, { anotherName: regex }, { author: regex }],
        $or: [
          { title: { $regex: payload, $options: "i" } },
          { desc: { $regex: payload, $options: "i" } },
        ],
        writtenBy: req.user.id,
      });

      res
        .status(STATUS.SUCCESS)
        .json(new SuccessResponse(MESSAGE.SUCCESS, result));
    } catch (error) {
      return res
        .status(STATUS.SERVER_ERROR)
        .json(new ErrorResponse(ERRORCODE.SERVER_ERROR, MESSAGE.ERROR_SERVER));
    }
  }
  async liveSearchUserBlogTrash(req, res) {
    const payload = req.body.payload.trim();
    if (!req.user) {
      return res
        .status(STATUS.BAD_REQUEST)
        .json(new ErrorResponse(ERRORCODE.BAD_REQUEST, MESSAGE.BAD_REQUEST));
    }
    try {
      let result = await Blog.findDeleted({
        // $or: [{ name: regex }, { anotherName: regex }, { author: regex }],
        $or: [
          { title: { $regex: payload, $options: "i" } },
          { desc: { $regex: payload, $options: "i" } },
        ],
        writtenBy: req.user.id,
      });

      res
        .status(STATUS.SUCCESS)
        .json(new SuccessResponse(MESSAGE.SUCCESS, result));
    } catch (error) {
      return res
        .status(STATUS.SERVER_ERROR)
        .json(new ErrorResponse(ERRORCODE.SERVER_ERROR, MESSAGE.ERROR_SERVER));
    }
  }
}

module.exports = new UserBlogController();
