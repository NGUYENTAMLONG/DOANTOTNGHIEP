const moment = require("moment");
const getChaptersOfDay = require("../helper/getChaptersOfDay");
const Manga = require("../models/Manga");
const Slide = require("../models/Slide");
const path = require("path");
const { STATUS, ERRORCODE, MESSAGE } = require("../config/httpResponse");
const { ErrorResponse, SuccessResponse } = require("../helper/response");
const { orderManga } = require("../helper/order");
const getRecentlyChapters = require("../helper/getRecentlyChapters");
const { redirect } = require("../service/redirect");
class siteController {
  home(req, res, next) {
    Promise.all([
      Slide.find().populate({
        path: "manga",
        populate: { path: "contentId", select: { chapters: { $slice: -1 } } },
      }), //Lấy ra các slide
      getChaptersOfDay(),
      getRecentlyChapters(),
      Manga.find({}).populate("contentId", {
        chapters: { $slice: -1 },
      }),
      // .limit(24), // Lấy ra tất cả các manga
      Manga.find({ serve: "all" })
        .populate("contentId", {
          chapters: { $slice: -1 },
        })
        .limit(24), // Lấy ra tất cả các manga cho mọi lứa tuổi giới tính,...(giới hạn 24 bản ghi)
      Manga.find({ serve: "male" })
        .populate("contentId", {
          chapters: { $slice: -1 },
        })
        .limit(24), //Lấy ra các manga dành cho nam
      Manga.find({ serve: "female" })
        .populate("contentId", {
          chapters: { $slice: -1 },
        })
        .limit(24), //Lấy ra các manga dành cho nữ
    ])
      .then(
        ([
          slides,
          chaptersOfDay,
          recentlyChapters,
          mangaJustUpdated,
          mangaForAll,
          mangaForMale,
          mangaForFemale,
        ]) => {
          res.render("home", {
            moment: moment,
            user: req.user,
            slides: slides,
            mangaToday: chaptersOfDay, // Lấy ra các manga -> lọc các  manga ra chương mới trong ngày
            recentlyReleasedManga: recentlyChapters, // Lấy ra các manga -> lọc các manga ra chương mới gần đây
            mangas: orderManga(mangaJustUpdated),
            mangaForAll: orderManga(mangaForAll),
            mangaForMale: orderManga(mangaForMale),
            mangaForFemale: orderManga(mangaForFemale),
          });
        }
      )
      .catch(next);
  }
  about(req, res) {
    res.render("about");
  }
  async search(req, res, next) {
    // const regex = new RegExp(escapeRegex(req.query.q), "gi");
    // next();
    if (!req.query) {
      redirect(req, res, STATUS.BAD_REQUEST);
    }
    try {
      const searchStr = req.query.q.trim();
      const counter = await Manga.find({
        // $or: [{ name: regex }, { anotherName: regex }, { author: regex }],
        $or: [
          { name: { $regex: searchStr, $options: "i" } },
          { anotherName: { $regex: searchStr, $options: "i" } },
          { author: { $regex: searchStr, $options: "i" } },
        ],
      }).countDocuments();
      const foundManga = await Manga.find({
        // $or: [{ name: regex }, { anotherName: regex }, { author: regex }],
        $or: [
          { name: { $regex: searchStr, $options: "i" } },
          { anotherName: { $regex: searchStr, $options: "i" } },
          { author: { $regex: searchStr, $options: "i" } },
        ],
      })
        .populate("contentId", {
          chapters: { $slice: -1 },
        })
        .limit(5)
        .skip(0)
        .exec();

      res.render("search", {
        moment: moment,
        counter,
        keyword: searchStr,
        user: req.user,
        mangas: foundManga,
      });
    } catch (error) {
      redirect(req, res, STATUS.SERVER_ERROR);
    }
  }
  async getMoreSearching(req, res, next) {
    const { keyword, skip } = req.body;
    if (!skip || !keyword) {
      return res
        .status(STATUS.BAD_REQUEST)
        .json(new ErrorResponse(ERRORCODE.BAD_REQUEST, MESSAGE.BAD_REQUEST));
    }
    try {
      console.log({ keyword, skip });
      const searchStr = keyword.trim();
      const foundManga = await Manga.find({
        // $or: [{ name: regex }, { anotherName: regex }, { author: regex }],
        $or: [
          { name: { $regex: searchStr, $options: "i" } },
          { anotherName: { $regex: searchStr, $options: "i" } },
          { author: { $regex: searchStr, $options: "i" } },
        ],
      })
        .populate("contentId", {
          chapters: { $slice: -1 },
        })
        .limit(5)
        .skip(Number(skip))
        .exec();

      res.status(STATUS.SUCCESS).json(
        new SuccessResponse(MESSAGE.SUCCESS, {
          status: true,
          moment: moment,
          mangas: foundManga,
        })
      );
    } catch (error) {
      console.log(error);
      redirect(req, res, STATUS.SERVER_ERROR);
    }
  }
  async liveSearch(req, res) {
    const payload = req.body.payload.trim();
    try {
      let search = await Manga.find({
        // $or: [{ name: regex }, { anotherName: regex }, { author: regex }],
        $or: [
          { name: { $regex: payload, $options: "i" } },
          { anotherName: { $regex: payload, $options: "i" } },
          { author: { $regex: payload, $options: "i" } },
        ],
      }).populate("contentId", {
        chapters: { $slice: -1 },
      });

      search = search.slice(0, 10);
      res
        .status(STATUS.SUCCESS)
        .json(new SuccessResponse(MESSAGE.SUCCESS, search));
    } catch (error) {
      return res
        .status(STATUS.SERVER_ERROR)
        .json(new ErrorResponse(ERRORCODE.SERVER_ERROR, MESSAGE.ERROR_SERVER));
    }
  }
}
function escapeRegex(text) {
  return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
}
module.exports = new siteController();
