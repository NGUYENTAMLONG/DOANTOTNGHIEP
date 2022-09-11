const { STATUS, MESSAGE, ERRORCODE } = require("../config/httpResponse");
const { SuccessResponse, ErrorResponse } = require("../helper/response");
const Blog = require("../models/Blog");
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
      res
        .status(STATUS.SUCCESS)
        .render("admin/blog/blogDashboard", { admin: req.user, blogs });
    } catch (error) {
      console.log(error);
      redirect(req, res, STATUS.SERVER_ERROR);
    }
  }
  async writeBlog(req, res) {
    const { blogId } = req.params.id;
    try {
      return res.json("CREATE BLOG");
      // res.status(STATUS.SUCCESS).render("blog", { user: req.user });
    } catch (error) {
      console.log(error);
      res
        .status(STATUS.SERVER_ERROR)
        .json(new ErrorResponse(ERRORCODE.ERROR_SERVER, MESSAGE.ERROR_SERVER));
    }
  }
}
module.exports = new BlogController();
