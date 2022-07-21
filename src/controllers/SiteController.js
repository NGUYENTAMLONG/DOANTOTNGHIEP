const lodash = require("lodash");
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
            user: req.AuthPayload,
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
  blogs(req, res, next) {
    res.render("blogs");
  }
  async search(req, res, next) {
    // const regex = new RegExp(escapeRegex(req.query.q), "gi");
    // next();

    try {
      const searchStr = req.query.q.trim();
      const foundManga = await Manga.find({
        // $or: [{ name: regex }, { anotherName: regex }, { author: regex }],
        $or: [
          { name: { $regex: searchStr, $options: "i" } },
          { anotherName: { $regex: searchStr, $options: "i" } },
          { author: { $regex: searchStr, $options: "i" } },
        ],
      }).populate("contentId", {
        chapters: { $slice: -1 },
      });

      res.render("search", {
        status: true,
        moment: moment,
        user: req.AuthPayload,
        mangas: foundManga,
      });
    } catch (error) {
      console.log("HETE", error);
      redirect(req, res, STATUS.SERVER_ERROR);
    }
  }
  async getAvatar(req, res) {
    const avatar = req.params.avatar;
    try {
      res.sendFile(
        path.join("C:/CODE/DO AN TOT NGHIEP/", "images/users/" + avatar)
      );
    } catch (error) {
      res.status(400).json({ error: error });
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
