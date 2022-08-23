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
const { Mongoose } = require("mongoose");
class AdvancedSearchController {
  async show(req, res, next) {
    try {
      const authorList = await Manga.aggregate([
        { $group: { _id: "$author" } },
        { $sort: { _id: 1 } },
      ]);
      const translationList = await Manga.aggregate([
        { $group: { _id: "$translation" } },
        { $sort: { _id: 1 } },
      ]);
      // const tralation = await Manga.a
      res.render("showAdvancedSearch", {
        user: req.user,
        moment: moment,
        // lodash: lodash,
        categories: types,
        countries: COUNTRY,
        serves: SERVE,
        authors: authorList,
        translation: translationList,
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
      let subCondition = {};
      if (condition.hot !== "null") {
        subCondition.hot = condition.hot;
      }
      if (condition.country !== "null") {
        subCondition.country = condition.country;
      }
      if (condition.author !== "null") {
        subCondition.author = condition.author;
      }
      if (condition.translation !== "null") {
        subCondition.translation = condition.translation;
      }
      if (condition.status !== "null") {
        subCondition.status = condition.status;
      }
      if (condition.serve !== "null") {
        subCondition.serve = condition.serve;
      }
      // if (condition.countChapter !== "null") {
      //   subCondition.countChapter = condition.serve;
      // }

      let finalCondition = {};
      if (
        condition.exceptArr.length !== 0 ||
        condition.includeArr.length !== 0
      ) {
        finalCondition = {
          $and: [
            { type: { $nin: condition.exceptArr } },
            { type: { $all: condition.includeArr } },
            subCondition,
          ],
        };
      } else {
        finalCondition = subCondition;
      }
      // const foundMangas = await Manga.find(finalCondition).populate(
      //   "contentId",
      //   {
      //     // chapters: { $slice: -1 },
      //     // "contentId.chapters": {
      //     //   $size: 2,
      //     // },
      //   }
      // );
      const foundMangas = await Manga.aggregate([
        {
          $match: finalCondition,
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
          $addFields: {
            count: "$Chapters",
          },
        },
        {
          $addFields: {
            count: {
              $size: {
                $arrayElemAt: ["$Chapters.chapters", 0],
              },
            },
          },
        },
        {
          $match: {
            $expr: {
              $lte: ["$count", Number(condition.countChapter)],
            },
          },
        },
      ]);
      // .find({
      //   "contentId._id[0]":
      // });
      return res.json(foundMangas);
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
