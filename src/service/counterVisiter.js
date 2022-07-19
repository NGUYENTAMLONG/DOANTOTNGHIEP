const { redirect } = require("express/lib/response");
const { STATUS } = require("../config/httpResponse");
const Manga = require("../models/Manga");

async function counterVisitor(req, res) {
  const { slug } = req.params;
  try {
    await Manga.updateOne({ slug: slug }, { $inc: { "statistical.views": 1 } });
  } catch (error) {
    console.log(error);
    redirect(req, res, STATUS.SERVER_ERROR);
  }
}
module.exports = counterVisitor;
