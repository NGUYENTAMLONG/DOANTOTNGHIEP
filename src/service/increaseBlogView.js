const { redirect } = require("express/lib/response");
const { STATUS } = require("../config/httpResponse");
const Blog = require("../models/Blog");

async function increaseView(req, res, slug) {
  try {
    await Blog.updateOne({ slug: slug }, { $inc: { "statistical.views": 1 } });
  } catch (error) {
    console.log(error);
    redirect(req, res, STATUS.SERVER_ERROR);
  }
}
module.exports = { increaseView };
