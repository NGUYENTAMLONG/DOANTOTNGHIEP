const moment = require("moment");
const Manga = require("../models/Manga");
const { orderManga } = require("../helper/order");
const { STATUS, ERRORCODE, MESSAGE } = require("../config/httpResponse");
const { ErrorResponse } = require("../helper/response");
const { redirect } = require("../service/redirect");
const { types } = require("../config/default");
const filterMangas = require("../service/filterMangas");
const pagination = require("../service/pagination");
const lodash = require("lodash");
class AdvancedSearchController {
  async show(req, res, next) {
    try {
      res.render("showAdvancedSearch", {
        user: req.user,
        moment: moment,
        // lodash: lodash,
        categories: types,
      });
    } catch (error) {
      console.log(error);
      res
        .status(STATUS.SERVER_ERROR)
        .json(new ErrorResponse(ERRORCODE.ERROR_SERVER, MESSAGE.ERROR_SERVER));
    }
  }
  async showResult(req, res, next) {
    const { includeArr, exceptArr, defaultArr } = req.body;
    try {
      const foundMangas = await Manga.find({
        $and: [
          { type: { $all: includeArr } },
          { type: { $nin: exceptArr } },
          { type: { $in: defaultArr } },
        ],
      });
      //   return res.json(foundMangas);
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
