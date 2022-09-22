const Manga = require("../models/Manga");
const moment = require("moment");
const User = require("../models/UserLocal");
const { redirect } = require("../service/redirect");
const { STATUS, ERRORCODE, MESSAGE } = require("../config/httpResponse");
const counter = require("../service/counterVisiter");
const { ErrorResponse, SuccessResponse } = require("../helper/response");
const { setHistory } = require("../service/historyUser");

let contentId = "";
class detailController {
  async showDetailManga(req, res) {
    const slug = req.params.slug;
    try {
      await counter.counterVisitor(req, res);
      const manga = await Manga.findOne({ slug: slug }).populate("contentId");
      if (!manga) {
        redirect(req, res, STATUS.NOT_FOUND);
      }
      let checkFollow = false;
      setHistory(req, res, manga._id);
      contentId = manga.contentId;
      res.render("detail", {
        slug,
        manga,
        user: req.user,
        moment,
        followFlag: checkFollow,
      });
    } catch (error) {
      console.log(error);
      redirect(req, res, STATUS.SERVER_ERROR);
    }
  }

  async readDetailManga(req, res) {
    const { slug } = req.params;
    try {
      await counter.counterVisitor(req, res);
      await counter.counterView(req, res, contentId);
      const results = await Manga.aggregate([
        {
          $match: { slug: slug },
        },
        {
          $addFields: {
            contentId: { $toObjectId: "$contentId" },
          },
        },
        {
          $lookup: {
            from: "Chapters",
            localField: "contentId",
            foreignField: "_id",
            as: "Chapters",
          },
        },
        {
          $unwind: "$Chapters",
        },
        {
          $unwind: "$Chapters.chapters",
        },
        {
          $match: {
            "Chapters.chapters.chapterNumber": Number(
              req.params.chapter.split("-")[1]
            ),
          },
        },
      ]);
      if (!results[0]) {
        redirect(req, res, STATUS.NOT_FOUND);
      }
      res.render("read", {
        user: req.user,
        reading: results[0],
        moment,
      });
    } catch (error) {
      console.log(error);
      redirect(req, res, STATUS.SERVER_ERROR);
    }
  }

  async navigator(req, res) {
    try {
      const mangas = await Manga.aggregate([
        { $match: { slug: req.params.slug } },
        {
          $addFields: {
            contentId: { $toObjectId: "$contentId" },
          },
        },
        {
          $lookup: {
            from: "Chapters",
            localField: "contentId",
            foreignField: "_id",
            as: "Chapters",
          },
        },
        {
          $unwind: "$Chapters",
        },
        {
          $addFields: {
            countChapter: {
              $size: "$Chapters.chapters",
            },
          },
        },
      ]);
      return res
        .status(STATUS.SUCCESS)
        .json(new SuccessResponse(MESSAGE.SUCCESS, mangas[0]));
    } catch (error) {
      console.log(error);
      return res
        .status(STATUS.SERVER_ERROR)
        .json(new ErrorResponse(ERRORCODE.ERROR_SERVER, MESSAGE.ERROR_SERVER));
    }
  }
}

module.exports = new detailController();
