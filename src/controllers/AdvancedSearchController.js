const moment = require("moment");
const Manga = require("../models/Manga");
const { orderManga } = require("../helper/order");
const { STATUS, ERRORCODE, MESSAGE } = require("../config/httpResponse");
const { ErrorResponse } = require("../helper/response");
const { redirect } = require("../service/redirect");
const { types, COUNTRY, SERVE } = require("../config/default");
const filterMangas = require("../service/filterMangas");
const pagination = require("../service/pagination");
const lodash = require("lodash");
class AdvancedSearchController {
  async show(req, res, next) {
    try {
      const authorList = await Manga.aggregate([
        { $group: { _id: "$author" } },
        { $sort: { _id: 1 } },
      ]);
      res.render("showAdvancedSearch", {
        user: req.user,
        moment: moment,
        // lodash: lodash,
        categories: types,
        countries: COUNTRY,
        serves: SERVE,
        authors: authorList,
      });
    } catch (error) {
      console.log(error);
      res
        .status(STATUS.SERVER_ERROR)
        .json(new ErrorResponse(ERRORCODE.ERROR_SERVER, MESSAGE.ERROR_SERVER));
    }
  }
  async showResult(req, res, next) {
    // const { includeArr, exceptArr, defaultArr } = req.body;
    const { filter } = req.body;

    try {
      const condition = JSON.parse(filter);
      // const match = filterMangas(req);
      // const totalMangas = await Manga.countDocuments(match);
      // const page = parseInt(req.query.page);
      // const limit = parseInt(req.query.limit);
      // const startPage = (page - 1) * limit;
      // const result = pagination(req, totalMangas);
      const foundMangas = await Manga.find({
        $and: [
          { type: { $all: condition.includeArr } },
          { type: { $nin: condition.exceptArr } },
          { type: { $in: condition.defaultArr } },
        ],
      }).populate("contentId", {
        chapters: { $slice: -1 },
      });
      // .limit(limit)
      // .skip(startPage)
      // .exec();
      // return res.json(JSON.parse(filter));
      res.render("showResultAdvancedSearch", {
        user: req.user,
        moment: moment,
        mangas: foundMangas,
      });
    } catch (error) {
      console.log(error);
      res
        .status(STATUS.SERVER_ERROR)
        .json(new ErrorResponse(ERRORCODE.ERROR_SERVER, MESSAGE.ERROR_SERVER));
    }
  }
}
module.exports = new AdvancedSearchController();
