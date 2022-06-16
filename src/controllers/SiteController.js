const lodash = require("lodash");
const filterPopular = require("../helper/filterPopular");
const getChaptersOfDay = require("../helper/getChaptersOfDay");
const Manga = require("../models/Manga");
const Slide = require("../models/Slide");
const path = require("path");
const { STATUS, ERRORCODE, MESSAGE } = require("../config/httpResponse");
const { ErrorResponse } = require("../helper/response");
class siteController {
  home(req, res, next) {
    // return res.json(req.AuthPayload);
    Promise.all([
      Slide.find().populate("manga"), //Lấy ra các slide
      Manga.find({}), // Lấy ra tất cả các manga
      Manga.find({ serve: "all" }).limit(24), // Lấy ra tất cả các manga cho mọi lứa tuổi giới tính,...(giới hạn 24 bản ghi)
      Manga.find({ serve: "male" }), //Lấy ra các manga dành cho nam
      Manga.find({ serve: "female" }), //Lấy ra các manga dành cho nữ
    ])
      .then(
        ([
          slides,
          mangaJustUpdated,
          mangaForAll,
          mangaForMale,
          mangaForFemale,
        ]) => {
          const recentlyReleasedManga = filterPopular(mangaJustUpdated).map(
            (item, index) => {
              return {
                name: item.manga.name,
                slug: item.manga.slug,
                lastChapter: lodash.last(item.manga.chapters),
                period: item.period,
                hot: item.manga.hot,
              };
            }
          );

          // return res.json(getChaptersOfDay(mangaJustUpdated));
          res.render("home", {
            user: req.AuthPayload,
            slides: slides,
            mangaToday: getChaptersOfDay(mangaJustUpdated), // Lấy ra các manga -> lọc các  manga ra chương mới trong ngày
            recentlyReleasedManga, // Lấy ra các manga -> lọc các manga ra chương mới gần đây
            mangaJustUpdated: filterPopular(mangaJustUpdated), // Lấy ra tất cả các manga mới cập nhật
            mangaForAll: filterPopular(mangaForAll),
            mangaForMale: filterPopular(mangaForMale),
            mangaForFemale: filterPopular(mangaForFemale),
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
    const searchStr = req.query.q.trim();
    try {
      const foundManga = await Manga.find({
        // $or: [{ name: regex }, { anotherName: regex }, { author: regex }],
        $or: [
          { name: { $regex: searchStr, $options: "i" } },
          { anotherName: { $regex: searchStr, $options: "i" } },
          { author: { $regex: searchStr, $options: "i" } },
        ],
      });
      if (!foundManga) {
        res.render("search", { status: false, msg: "Not Found !!!" });
      }
      res.render("search", {
        status: true,
        user: req.AuthPayload,
        mangas: filterPopular(foundManga),
      });
    } catch (error) {
      console.log(error);
      res
        .status(STATUS.SERVER_ERROR)
        .json(new ErrorResponse(ERRORCODE.ERROR_SERVER, MESSAGE.ERROR_SERVER));
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
}
function escapeRegex(text) {
  return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
}
module.exports = new siteController();
