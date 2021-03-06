const res = require("express/lib/response");
const { MESSAGE, STATUS } = require("../config/httpResponse");
const lodash = require("lodash");
const Manga = require("../models/Manga");
const { orderManga } = require("../helper/order");

module.exports = {
  async getNewMangas(req, res) {
    try {
      const page = parseInt(req.query.page);
      const limit = parseInt(req.query.limit);
      const startPage = (page - 1) * limit;
      const endPage = page * limit;
      const result = {};
      if (startPage > 0) {
        result.previous = {
          previousPage: page - 1,
          limit: limit,
        };
      }
      if (endPage < (await Manga.countDocuments().exec())) {
        result.next = {
          nextPage: page + 1,
          limit: limit,
        };
      }
      // const match = { status: "Đang tiến hành" };
      const status =
        req.query.status === "true" ? "Hoàn thành" : "Đang tiến hành";
      let serve = "";
      if (req.query.serve === "male") {
        serve = "male";
      } else if (req.query.serve === "female") {
        serve = "female";
      } else {
        serve = "all";
      }
      const match = {
        status,
        serve,
      };
      result.mangas = await Manga.find(match)
        .limit(limit)
        .skip(startPage)
        .exec();

      return res.json(result);
      res.render("showNewManga", {
        mangas: result.mangas,
        user: req.AuthPayload,
      });
      // res.status(STATUS.SUCCESS).json({ newMangas: mangas });
    } catch (error) {
      console.log(error);
      res.status(STATUS.SERVER_ERROR).json({ message: MESSAGE.ERROR_SERVER });
    }
  },
  async getList(req, res) {
    try {
      const page = parseInt(req.query.page);
      const limit = parseInt(req.query.limit);
      const startPage = (page - 1) * limit;
      const endPage = page * limit;
      const result = {};
      if (startPage > 0) {
        result.previous = {
          previousPage: page - 1,
          limit: limit,
        };
      }
      if (endPage < (await Manga.countDocuments().exec())) {
        result.next = {
          nextPage: page + 1,
          limit: limit,
        };
      }
      result.mangas = await Manga.find({})
        .populate("contentId", {
          chapters: { $slice: -1 },
        })
        .sort({ createdAt: -1 })
        .limit(limit)
        .skip(startPage)
        .exec();
      const newMangas = orderManga(result.mangas);
      res.status(STATUS.SUCCESS).json({ newMangas });
    } catch (error) {
      console.log(error);
      res.status(STATUS.SERVER_ERROR).json({ message: MESSAGE.ERROR_SERVER });
    }
  },
};
