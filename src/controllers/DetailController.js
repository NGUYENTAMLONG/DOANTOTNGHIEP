const Manga = require("../models/Manga");
const moment = require("moment");
const User = require("../models/User");
const { redirect } = require("../service/redirect");
const { STATUS } = require("../config/httpResponse");
const counterVisitor = require("../service/counterVisiter");
class detailController {
  async showDetailManga(req, res) {
    const slug = req.params.slug;
    try {
      await counterVisitor(req, res);
      const manga = await Manga.findOne({ slug: slug }).populate("contentId");
      if (!manga) {
        redirect(req, res, STATUS.NOT_FOUND);
      }

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
        moment,
        followFlag: checkFollow,
      });
    } catch (error) {
      console.log(error);
      redirect(req, res, STATUS.SERVER_ERROR);
    }
  }

  async readDetailManga(req, res) {
    try {
      await counterVisitor(req, res);
      const foundManga = await Manga.findOne({
        slug: req.params.slug,
      }).populate("contentId");
      const chapterNumber = req.params.chapter.split("-")[1];
      const foundChapter = foundManga.contentId.chapters.filter(
        (chapter) => chapter.chapterNumber === Number(chapterNumber)
      )[0];
      console.log(foundManga.contentId.chapters[0].chapterNumber);

      if (!foundChapter) {
        redirect(req, res, STATUS.NOT_FOUND);
      }

      res.render("read", {
        user: req.AuthPayload,
        manga: foundManga,
        chapter: foundChapter,
        moment,
      });
    } catch (error) {
      console.log("GEAFSDF", error);
      redirect(req, res, STATUS.SERVER_ERROR);
    }
  }
}

module.exports = new detailController();
