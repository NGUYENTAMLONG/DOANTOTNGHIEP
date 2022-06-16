const Comment = require("../models/Comment");
const Manga = require("../models/Manga");
const moment = require("moment");
const User = require("../models/User");
class detailController {
  async showDetailManga(req, res) {
    const slug = req.params.slug;
    try {
      const manga = await Manga.findOne({ slug: slug });
      const comments = await Comment.find({
        mangaId: manga._id,
      })
        .populate("userId", "username avatar")
        .sort({ updatedAt: -1 });
      let checkFollow = false;
      if (req.AuthPayload !== undefined) {
        const foundUser = await User.findById(req.AuthPayload._id);
        checkFollow = foundUser.follows.includes(manga._id);
        console.log(checkFollow);
      }
      res.render("detail", {
        slug,
        manga,
        user: req.AuthPayload,
        comments,
        moment,
        followFlag: checkFollow,
      });
    } catch (error) {
      console.log(error);
    }
  }

  async readDetailManga(req, res) {
    try {
      const manga = await Manga.findOne({ slug: req.params.slug });
      const chapterNumber = req.params.chapter.split("-")[1];
      const comments = await Comment.find({
        mangaId: manga._id,
      })
        .populate("userId", "username avatar")
        .sort({ updatedAt: -1 });
      res.render("read", {
        user: req.AuthPayload,
        manga,
        chapter: manga.chapters.filter(
          (chapter) => chapter.chapterNumber == chapterNumber
        )[0],
        comments,
        moment,
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({ status: "error", error: error });
    }
  }
}

module.exports = new detailController();
