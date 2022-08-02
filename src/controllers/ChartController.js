const moment = require("moment");
const Manga = require("../models/Manga");
const lodash = require("lodash");
const { STATUS, ERRORCODE, MESSAGE } = require("../config/httpResponse");
const { ErrorResponse, SuccessResponse } = require("../helper/response");
const Chapter = require("../models/Chapter");

class ChartController {
  async showDailyChart(req, res, next) {
    try {
      const date = new Date();
      const yesterday = new Date(date.setDate(date.getDate() - 1));
      const tomorrow = new Date(date.setDate(date.getDate() + 1));

      const statistical = await Chapter.aggregate([
        {
          $unwind: "$chapters",
        },
        {
          $addFields: {
            isDate: { $split: ["$chapters.createdTime", "T"] },
          },
        },
        {
          $addFields: {
            isDate: { $arrayElemAt: ["$isDate", 0] },
          },
        },
        {
          $addFields: {
            isDate: {
              $dateFromString: {
                dateString: "$isDate",
              },
            },
          },
        },
        {
          $match: {
            isDate: { $gt: yesterday, $lt: tomorrow },
          },
        },
        {
          $addFields: {
            viewsOfChapter: "$chapters.statistical.views",
          },
        },
        {
          $sort: {
            viewsOfChapter: -1,
          },
        },
        {
          $addFields: {
            _id: { $toString: "$_id" },
          },
        },
        {
          $lookup: {
            from: "Mangas",
            localField: "_id",
            foreignField: "contentId",
            as: "Mangas",
          },
        },
      ]);
      const result = lodash
        .uniqBy(statistical, function (e) {
          return e._id;
        })
        .slice(0, 10);
      res
        .status(STATUS.SUCCESS)
        .json(new SuccessResponse(MESSAGE.SUCCESS, result));
    } catch (error) {
      console.log(error);
      res
        .status(STATUS.SERVER_ERROR)
        .json(new ErrorResponse(ERRORCODE.ERROR_SERVER, MESSAGE.ERROR_SERVER));
    }
  }

  async showWeeklyChart(req, res, next) {
    const date = new Date();
    try {
      const statistical = await Chapter.aggregate([
        {
          $unwind: "$chapters",
        },
        {
          $addFields: {
            isWeek: { $split: ["$chapters.createdTime", "T"] },
          },
        },
        {
          $addFields: {
            isWeek: { $arrayElemAt: ["$isWeek", 0] },
          },
        },
        {
          $addFields: {
            isWeek: {
              $dateFromString: {
                dateString: "$isWeek",
              },
            },
          },
        },
        {
          $addFields: {
            isWeek: {
              $eq: [{ $week: "$isWeek" }, { $week: date }],
            },
          },
        },
        {
          $addFields: {
            viewsOfChapter: "$chapters.statistical.views",
          },
        },
        {
          $match: {
            isWeek: true,
          },
        },
        {
          $sort: {
            viewsOfChapter: -1,
          },
        },

        {
          $addFields: {
            _id: { $toString: "$_id" },
          },
        },
        {
          $lookup: {
            from: "Mangas",
            localField: "_id",
            foreignField: "contentId",
            as: "Mangas",
          },
        },
      ]);
      const result = lodash
        .uniqBy(statistical, function (e) {
          return e._id;
        })
        .slice(0, 10);
      res
        .status(STATUS.SUCCESS)
        .json(new SuccessResponse(MESSAGE.SUCCESS, result));
    } catch (error) {
      console.log(error);
      res
        .status(STATUS.SERVER_ERROR)
        .json(new ErrorResponse(ERRORCODE.ERROR_SERVER, MESSAGE.ERROR_SERVER));
    }
  }

  async showMonthlyChart(req, res, next) {
    const month = moment().month() + 1;
    const year = moment().year();
    // return res.json({ month, year });
    try {
      const statistical = await Chapter.aggregate([
        {
          $unwind: "$chapters",
        },
        {
          $addFields: {
            isMonth: { $split: ["$chapters.createdTime", "T"] },
          },
        },
        {
          $addFields: {
            isMonth: { $arrayElemAt: ["$isMonth", 0] },
          },
        },
        {
          $addFields: {
            isMonth: {
              $dateFromString: {
                dateString: "$isMonth",
              },
            },
          },
        },
        {
          $addFields: {
            isMonth: { $month: { date: "$isMonth" } },
            isYear: { $year: { date: "$isMonth" } },
          },
        },
        {
          $match: {
            isMonth: { $eq: month },
            isYear: { $eq: year },
          },
        },
        {
          $addFields: {
            viewsOfChapter: "$chapters.statistical.views",
          },
        },
        {
          $sort: {
            viewsOfChapter: -1,
          },
        },
        {
          $addFields: {
            _id: { $toString: "$_id" },
          },
        },
        {
          $lookup: {
            from: "Mangas",
            localField: "_id",
            foreignField: "contentId",
            as: "Mangas",
          },
        },
      ]);
      const result = lodash
        .uniqBy(statistical, function (e) {
          return e._id;
        })
        .slice(0, 10);
      res
        .status(STATUS.SUCCESS)
        .json(new SuccessResponse(MESSAGE.SUCCESS, result));
    } catch (error) {
      console.log(error);
      res
        .status(STATUS.SERVER_ERROR)
        .json(new ErrorResponse(ERRORCODE.ERROR_SERVER, MESSAGE.ERROR_SERVER));
    }
  }
}
module.exports = new ChartController();
