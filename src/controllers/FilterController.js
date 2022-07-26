const Manga = require("../models/Manga");
const moment = require("moment");
const { STATUS, ERRORCODE, MESSAGE } = require("../config/httpResponse");
const { ErrorResponse, SuccessResponse } = require("../helper/response");
const lodash = require("lodash");
const {
  RANDOM_SIZE,
  types,
  MANGA_STATUS,
  PROLONGATION,
} = require("../config/default");
const pagination = require("../service/pagination");
const filterMangas = require("../service/filterMangas");
const Chapter = require("../models/Chapter");
class FilterController {
  async showRandomManga(req, res, next) {
    try {
      const mangas = await Manga.find().populate("contentId", {
        chapters: { $slice: -1 },
      });
      const randomMangas = lodash.sampleSize(mangas, RANDOM_SIZE);
      res.render("showRandomManga", {
        user: req.user,
        moment: moment,
        title: `<i class="fas fa-random"></i> Truyện ngẫu nhiên`,
        mangas: randomMangas,
      });
    } catch (error) {
      console.log(error);
      res
        .status(STATUS.SERVER_ERROR)
        .json(new ErrorResponse(ERRORCODE.ERROR_SERVER, MESSAGE.ERROR_SERVER));
    }
  }
  async showNewManga(req, res, next) {
    try {
      const match = filterMangas(req);
      const totalMangas = await Manga.countDocuments(match);
      const page = parseInt(req.query.page);
      const limit = parseInt(req.query.limit);
      const startPage = (page - 1) * limit;
      const result = pagination(req, totalMangas);
      result.mangas = await Manga.find(match)
        .sort({ createdAt: -1 })
        .populate("contentId", {
          chapters: { $slice: -1 },
        })
        .limit(limit)
        .skip(startPage)
        .exec();

      res.render("showNewManga", {
        user: req.user,
        moment: moment,
        title: `<i class="fas fa-lightbulb"></i> Truyện mới xuất bản`,
        mangas: result.mangas,
        categories: types,
        navigator: {
          previous: result.previous,
          next: result.next,
          totalPages: Math.ceil(totalMangas / limit),
          limit: limit,
          activePage: page,
          filter: match,
        },
      });
    } catch (error) {
      console.log(error);
      res
        .status(STATUS.SERVER_ERROR)
        .json(new ErrorResponse(ERRORCODE.ERROR_SERVER, MESSAGE.ERROR_SERVER));
    }
  }
  async showCompleteManga(req, res, next) {
    try {
      const match = filterMangas(req);
      match.status = MANGA_STATUS.FINISHED;
      const totalMangas = await Manga.countDocuments(match);
      const page = parseInt(req.query.page);
      const limit = parseInt(req.query.limit);
      const startPage = (page - 1) * limit;
      const result = pagination(req, totalMangas);
      result.mangas = await Manga.find(match)
        .populate("contentId", {
          chapters: { $slice: -1 },
        })
        .limit(limit)
        .skip(startPage)
        .exec();

      res.render("showCompleteManga", {
        user: req.user,
        moment: moment,
        title: `<i class="fas fa-check-circle"></i> Truyện đã hoàn thành`,
        mangas: result.mangas,
        categories: types,
        navigator: {
          previous: result.previous,
          next: result.next,
          totalPages: Math.ceil(totalMangas / limit),
          limit: limit,
          activePage: page,
          filter: match,
        },
      });
    } catch (error) {
      console.log(error);
      res
        .status(STATUS.SERVER_ERROR)
        .json(new ErrorResponse(ERRORCODE.ERROR_SERVER, MESSAGE.ERROR_SERVER));
    }
  }
  async showUnfinishedManga(req, res, next) {
    try {
      const match = filterMangas(req);
      match.status = MANGA_STATUS.UNFINISHED;
      const totalMangas = await Manga.countDocuments(match);
      const page = parseInt(req.query.page);
      const limit = parseInt(req.query.limit);
      const startPage = (page - 1) * limit;
      const result = pagination(req, totalMangas);
      result.mangas = await Manga.find(match)
        .populate("contentId", {
          chapters: { $slice: -1 },
        })
        .limit(limit)
        .skip(startPage)
        .exec();

      res.render("showUnfinishedManga", {
        user: req.user,
        moment: moment,
        title: `<i class='bx bxs-leaf'></i> Truyện đang tiến hành`,
        mangas: result.mangas,
        categories: types,
        navigator: {
          previous: result.previous,
          next: result.next,
          totalPages: Math.ceil(totalMangas / limit),
          limit: limit,
          activePage: page,
          filter: match,
        },
      });
    } catch (error) {
      console.log(error);
      res
        .status(STATUS.SERVER_ERROR)
        .json(new ErrorResponse(ERRORCODE.ERROR_SERVER, MESSAGE.ERROR_SERVER));
    }
  }
  async showProlongationManga(req, res, next) {
    try {
      const match = filterMangas(req);
      const page = parseInt(req.query.page);
      const limit = parseInt(req.query.limit);
      const startPage = (page - 1) * limit;
      const mangas = await Manga.aggregate([
        { $match: match },
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
        {
          // $gt: ["$countChapter", 1];
          $match: {
            countChapter: {
              $gt: PROLONGATION,
            },
          },
        },
        {
          $addFields: {
            Chapters: {
              chapters: {
                $last: "$Chapters.chapters",
              },
            },
          },
        },
      ]);
      // .limit(limit)
      // .skip(startPage)
      // .exec();

      // return res.json(mangas);
      const result = pagination(req, mangas.length);
      result.mangas = lodash.drop(mangas, startPage).slice(0, limit);
      res.render("showProlongationManga", {
        user: req.user,
        moment: moment,
        title: `<i class="fas fa-mountain"></i> Truyện trường kỳ`,
        mangas: result.mangas,
        categories: types,
        navigator: {
          previous: result.previous,
          next: result.next,
          totalPages: Math.ceil(mangas.length / limit),
          limit: limit,
          activePage: page,
          filter: match,
        },
      });
    } catch (error) {
      console.log(error);
      res
        .status(STATUS.SERVER_ERROR)
        .json(new ErrorResponse(ERRORCODE.ERROR_SERVER, MESSAGE.ERROR_SERVER));
    }
  }
  async showFlopManga(req, res, next) {
    try {
      const match = filterMangas(req);
      const totalMangas = await Manga.find(match)
        .sort({ "statistical.views": 1 })
        .countDocuments();
      const page = parseInt(req.query.page);
      const limit = parseInt(req.query.limit);
      const startPage = (page - 1) * limit;
      const result = pagination(req, totalMangas);
      result.mangas = await Manga.find(match)
        .sort({ "statistical.views": 1 })
        .populate("contentId", {
          chapters: { $slice: -1 },
        })
        .limit(limit)
        .skip(startPage)
        .exec();

      res.render("showFlopManga", {
        user: req.user,
        moment: moment,
        title: `<i class='bx bx-trending-down'></i> Truyện ít đọc`,
        mangas: result.mangas,
        categories: types,
        navigator: {
          previous: result.previous,
          next: result.next,
          totalPages: Math.ceil(totalMangas / limit),
          limit: limit,
          activePage: page,
          filter: match,
        },
      });
    } catch (error) {
      console.log(error);
      res
        .status(STATUS.SERVER_ERROR)
        .json(new ErrorResponse(ERRORCODE.ERROR_SERVER, MESSAGE.ERROR_SERVER));
    }
  }
  async showAllAuthors(req, res, next) {
    try {
      const authorList = await Manga.aggregate([
        { $group: { _id: "$author" } },
        { $sort: { _id: 1 } },
      ]);

      res.render("showAuthorList", {
        user: req.user,
        moment: moment,
        title: `<i class='bx bx-palette'></i> Lọc truyện theo tác giả`,
        authorList,
      });
    } catch (error) {
      console.log(error);
      res
        .status(STATUS.SERVER_ERROR)
        .json(new ErrorResponse(ERRORCODE.ERROR_SERVER, MESSAGE.ERROR_SERVER));
    }
  }
  async showMangasOfAuthor(req, res, next) {
    const { slug } = req.params;
    try {
      const match = filterMangas(req);
      const totalMangas = await Manga.find({ author: slug })
        .find(match)
        .countDocuments();
      const page = parseInt(req.query.page);
      const limit = parseInt(req.query.limit);
      const startPage = (page - 1) * limit;
      const result = pagination(req, totalMangas);
      result.mangas = await Manga.find({ author: slug })
        .find(match)
        .populate("contentId", {
          chapters: { $slice: -1 },
        })
        .limit(limit)
        .skip(startPage)
        .exec();

      res.render("showMangasOfAuthor", {
        user: req.user,
        moment: moment,
        title: `<i class='bx bx-layer'></i> Tuyển tập các tác phẩm của ${slug}`,
        mangas: result.mangas,
        categories: types,
        navigator: {
          previous: result.previous,
          next: result.next,
          totalPages: Math.ceil(totalMangas / limit),
          limit: limit,
          activePage: page,
          filter: match,
        },
      });
    } catch (error) {
      console.log(error);
      res
        .status(STATUS.SERVER_ERROR)
        .json(new ErrorResponse(ERRORCODE.ERROR_SERVER, MESSAGE.ERROR_SERVER));
    }
  }
  async getRelatedMangas(req, res, next) {
    const { types } = req.body;
    try {
      const relatedMangas = await Manga.find({ types: { $in: types } })
        .sort({ "statistical.views": "desc" })
        .populate("contentId", {
          chapters: { $slice: -1 },
        })
        .limit(11);
      res
        .status(STATUS.SUCCESS)
        .json(new SuccessResponse(MESSAGE.SUCCESS, relatedMangas));
    } catch (error) {
      console.log(error);
      res
        .status(STATUS.SERVER_ERROR)
        .json(new ErrorResponse(ERRORCODE.ERROR_SERVER, MESSAGE.ERROR_SERVER));
    }
  }
  async showFavouriteManga(req, res, next) {
    try {
      const match = filterMangas(req);
      const totalMangas = await Manga.find(match)
        .sort({ "statistical.likes": -1 })
        .countDocuments();
      const page = parseInt(req.query.page);
      const limit = parseInt(req.query.limit);
      const startPage = (page - 1) * limit;
      const result = pagination(req, totalMangas);
      result.mangas = await Manga.find(match)
        .sort({ "statistical.likes": -1 })
        .populate("contentId", {
          chapters: { $slice: -1 },
        })
        .limit(limit)
        .skip(startPage)
        .exec();

      res.render("showFavoriteManga", {
        user: req.user,
        moment: moment,
        title: `<i class='bx bx-happy-heart-eyes'></i> Truyện được yêu thích nhiều nhất`,
        mangas: result.mangas,
        categories: types,
        navigator: {
          previous: result.previous,
          next: result.next,
          totalPages: Math.ceil(totalMangas / limit),
          limit: limit,
          activePage: page,
          filter: match,
        },
      });
    } catch (error) {
      console.log(error);
      res
        .status(STATUS.SERVER_ERROR)
        .json(new ErrorResponse(ERRORCODE.ERROR_SERVER, MESSAGE.ERROR_SERVER));
    }
  }
  async showHighestViewsManga(req, res, next) {
    try {
      const match = filterMangas(req);
      const totalMangas = await Manga.find(match)
        .sort({ "statistical.views": -1 })
        .countDocuments();
      const page = parseInt(req.query.page);
      const limit = parseInt(req.query.limit);
      const startPage = (page - 1) * limit;
      const result = pagination(req, totalMangas);
      result.mangas = await Manga.find(match)
        .sort({ "statistical.views": -1 })
        .populate("contentId", {
          chapters: { $slice: -1 },
        })
        .limit(limit)
        .skip(startPage)
        .exec();

      res.render("showFavoriteManga", {
        user: req.user,
        moment: moment,
        title: `<i class='bx bxs-plane-take-off'></i> Truyện có lượt views cao nhất`,
        mangas: result.mangas,
        categories: types,
        navigator: {
          previous: result.previous,
          next: result.next,
          totalPages: Math.ceil(totalMangas / limit),
          limit: limit,
          activePage: page,
          filter: match,
        },
      });
    } catch (error) {
      console.log(error);
      res
        .status(STATUS.SERVER_ERROR)
        .json(new ErrorResponse(ERRORCODE.ERROR_SERVER, MESSAGE.ERROR_SERVER));
    }
  }
}

module.exports = new FilterController();
