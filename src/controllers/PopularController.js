const Manga = require("../models/Manga");
const Slide = require("../models/Slide");
const moment = require("moment");
const { STATUS, ERRORCODE, MESSAGE } = require("../config/httpResponse");
const { ErrorResponse } = require("../helper/response");
const { orderManga } = require("../helper/order");

class PopularController {
  async showJustUpdated(req, res, next) {
    try {
      const mangas = await Manga.find().populate("contentId", {
        chapters: { $slice: -1 },
      });
      const slides = await Slide.find({ active: true }).populate({
        path: "manga",
        populate: { path: "contentId", select: { chapters: { $slice: -1 } } },
      });
      res.render("showPopular", {
        user: req.AuthPayload,
        moment: moment,
        title: `<i class="fab fa-hotjar"></i> Truyện mới cập nhật`,
        slides,
        mangas: orderManga(mangas),
      });
    } catch (error) {
      console.log(error);
      res
        .status(STATUS.SERVER_ERROR)
        .json(new ErrorResponse(ERRORCODE.ERROR_SERVER, MESSAGE.ERROR_SERVER));
    }
  }
  async showAll(req, res, next) {
    try {
      const mangas = await Manga.find({ serve: "all" }).populate("contentId", {
        chapters: { $slice: -1 },
      });
      const slides = await Slide.find({ active: true }).populate({
        path: "manga",
        populate: { path: "contentId", select: { chapters: { $slice: -1 } } },
      });
      res.render("showPopular", {
        user: req.AuthPayload,
        title: `<i class="fas fa-flag-checkered"></i> Truyện tổng hợp`,
        moment: moment,
        slides,
        mangas: orderManga(mangas),
      });
    } catch (error) {
      console.log(error);
      res.status(500).json("ERROR:", error);
    }
  }
  async showMangaForMale(req, res, next) {
    try {
      const mangas = await Manga.find({ serve: "male" }).populate("contentId", {
        chapters: { $slice: -1 },
      });
      const slides = await Slide.find({ active: true }).populate({
        path: "manga",
        populate: { path: "contentId", select: { chapters: { $slice: -1 } } },
      });
      res.render("showPopular", {
        user: req.AuthPayload,
        title: `<i class="fas fa-mars"></i> Truyện con trai`,
        moment: moment,
        slides,
        mangas: orderManga(mangas),
      });
    } catch (error) {
      console.log(error);
      res.status(500).json("ERROR:", error);
    }
  }
  async showMangaForFemale(req, res, next) {
    try {
      const mangas = await Manga.find({ serve: "female" }).populate(
        "contentId",
        {
          chapters: { $slice: -1 },
        }
      );
      const slides = await Slide.find({ active: true }).populate({
        path: "manga",
        populate: { path: "contentId", select: { chapters: { $slice: -1 } } },
      });
      res.render("showPopular", {
        user: req.AuthPayload,
        title: `<i class="fas fa-venus"></i> Truyện con gái`,
        slides,
        moment: moment,
        mangas: orderManga(mangas),
      });
    } catch (error) {
      console.log(error);
      res.status(500).json("ERROR:", error);
    }
  }
}

module.exports = new PopularController();
