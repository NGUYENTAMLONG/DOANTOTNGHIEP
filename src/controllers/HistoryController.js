const Manga = require("../models/Manga");
const moment = require("moment");
const { redirect } = require("../service/redirect");
const { STATUS } = require("../config/httpResponse");
const { getHistory, clearHistory } = require("../service/storeHistory");
const filterMangas = require("../service/filterMangas");
const pagination = require("../service/pagination");
const { types } = require("../config/default");
class historyController {
  async showHistory(req, res) {
    try {
      const match = filterMangas(req);
      match.slug = { $in: getHistory() };
      const totalMangas = await Manga.countDocuments(match);
      const page = parseInt(req.query.page);
      const limit = parseInt(req.query.limit);
      const startPage = (page - 1) * limit;
      const result = pagination(req, totalMangas);
      result.mangas = await Manga.find(match)
        .populate({
          path: "contentId",
          options: {
            chapters: { $slice: -1 },
          },
        })
        .limit(limit)
        .skip(startPage)
        .exec();
      // return res.json(result.mangas);
      res.render("showHistory", {
        user: req.AuthPayload,
        moment,
        categories: types,
        mangas: result.mangas,
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
      redirect(req, res, STATUS.SERVER_ERROR);
    }
  }
  async storeHistoryData(req, res) {
    try {
      var LocalStorage = require("node-localstorage").LocalStorage;
      const localStorage = new LocalStorage("./scratch");
      console.log(localStorage);
    } catch (error) {
      console.log(error);
    }
  }
  clearHistory(req, res) {
    clearHistory();
    res.redirect("back");
  }
}

module.exports = new historyController();
