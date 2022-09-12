const { BLOG_ROLE, PASSPORT } = require("../config/default");
const { STATUS, MESSAGE, ERRORCODE } = require("../config/httpResponse");
const { SuccessResponse, ErrorResponse } = require("../helper/response");
const Admin = require("../models/Admin");
const Blog = require("../models/Blog");
const UserFacebook = require("../models/UserFacebook");
const UserGoogle = require("../models/UserGoogle");
const UserLocal = require("../models/UserLocal");
const { redirect } = require("../service/redirect");

class BlogController {
  async getBlogPage(req, res) {
    try {
      res.status(STATUS.SUCCESS).render("blog", { user: req.user });
    } catch (error) {
      console.log(error);
      res
        .status(STATUS.SERVER_ERROR)
        .json(new ErrorResponse(ERRORCODE.ERROR_SERVER, MESSAGE.ERROR_SERVER));
    }
  }
  async getBlogCreate(req, res) {
    try {
      res
        .status(STATUS.SUCCESS)
        .render("admin/blog/writeBlog", { admin: req.user });
    } catch (error) {
      console.log(error);
      redirect(req, res, STATUS.SERVER_ERROR);
    }
  }
  async getBlogDashboard(req, res) {
    try {
      const blogs = await Blog.find({});
      return res
        .status(STATUS.SUCCESS)
        .render("admin/blog/blogDashboard", { admin: req.user, blogs });
    } catch (error) {
      console.log(error);
      redirect(req, res, STATUS.SERVER_ERROR);
    }
  }
  async writeBlog(req, res) {
    const { title, author, type, keywordArray, source, link, content, image } =
      req.body;
    if (
      !title ||
      !author ||
      !type ||
      keywordArray.length === 0 ||
      !source ||
      !content ||
      !image
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
        type,
        author,
        cover: image,
        keywords: keywordArray,
        source,
        link,
        content,
        writtenBy: req.user._id,
      });
      const createdBlog = await newBlog.save();
      return res
        .status(STATUS.CREATED)
        .json(new SuccessResponse(MESSAGE.CREATE_SUCCESS, createdBlog));
    } catch (error) {
      console.log(error);
      res
        .status(STATUS.SERVER_ERROR)
        .json(new ErrorResponse(ERRORCODE.ERROR_SERVER, MESSAGE.ERROR_SERVER));
    }
  }
  async getWritor(req, res) {
    const { role, writerId, passport } = req.params;
    if (!role || !writerId) {
      return res
        .status(STATUS.BAD_REQUEST)
        .json(
          new ErrorResponse(ERRORCODE.ERROR_BAD_REQUEST, MESSAGE.BAD_REQUEST)
        );
    }
    try {
      let foundWriter = null;
      if (role === BLOG_ROLE.ADMIN.CODE) {
        foundWriter = await Admin.findById(writerId);
      } else if (role === BLOG_ROLE.MEMBER.CODE) {
        if (passport === PASSPORT.LOCAL) {
          foundWriter = await UserLocal.findById(writerId);
        } else if (passport === PASSPORT.GOOGLE) {
          foundWriter = await UserGoogle.findById(writerId);
        } else if (passport === PASSPORT.FACEBOOK) {
          foundWriter = await UserFacebook.findById(writerId);
        }
      }
      // const blogs = await Blog.find({});
      res.status(STATUS.SUCCESS).json({
        writer: foundWriter,
      });
    } catch (error) {
      console.log(error);
      res
        .status(STATUS.SERVER_ERROR)
        .json(new ErrorResponse(ERRORCODE.ERROR_SERVER, MESSAGE.ERROR_SERVER));
    }
  }
  async getBlogList(req, res) {
    try {
      const blogs = await Blog.find({});
      res.status(STATUS.SUCCESS).json({
        rows: blogs,
      });
    } catch (error) {
      console.log(error);
      res
        .status(STATUS.SERVER_ERROR)
        .json(new ErrorResponse(ERRORCODE.ERROR_SERVER, MESSAGE.ERROR_SERVER));
    }
  }
}
module.exports = new BlogController();
