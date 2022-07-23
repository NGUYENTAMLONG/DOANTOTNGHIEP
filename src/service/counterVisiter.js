const { redirect } = require("express/lib/response");
const { STATUS } = require("../config/httpResponse");
const Chapter = require("../models/Chapter");
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
async function counterView(req, res, contentId) {
  try {
    await Chapter.updateOne(
      {
        _id: contentId,
        chapters: {
          $elemMatch: {
            chapterNumber: Number(req.params.chapter.split("-")[1]),
          },
        },
      },
      {
        $inc: { "chapters.$.statistical.views": 1 },
      }
    );
  } catch (error) {
    console.log(error);
    redirect(req, res, STATUS.SERVER_ERROR);
  }
}
module.exports = { counterVisitor, counterView };
