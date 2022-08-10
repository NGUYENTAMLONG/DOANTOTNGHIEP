const { STATUS, ERRORCODE, MESSAGE } = require("../config/httpResponse");
const { ErrorResponse, SuccessResponse } = require("../helper/response");
const lodash = require("lodash");
const Chapter = require("../models/Chapter");

class TopController {
  async showTodayTop(req, res, next) {
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
        { $unwind: "$Mangas" },
        {
          $unset: [
            "Mangas.anotherName",
            "Mangas.serve",
            "Mangas.status",
            "Mangas.hot",
            "Mangas.country",
            "Mangas.contentId",
            "Mangas.image",
            "Mangas.type",
            "Mangas.statistical",
            "Mangas.description",
            "Mangas.fanmade",
            "Mangas.deleted",
            "Mangas.createdAt",
            "Mangas.updatedAt",
            "Mangas.deletedAt",
            "Mangas.translation",
          ],
        },
      ]);
      const result = lodash
        .uniqBy(statistical, function (e) {
          return e._id;
        })
        .slice(0, 10);
      res.render("showTop", {
        title: "Top 20 manga trong ngày",
        user: req.user,
        result,
      });
    } catch (error) {
      console.log(error);
      res
        .status(STATUS.SERVER_ERROR)
        .json(new ErrorResponse(ERRORCODE.ERROR_SERVER, MESSAGE.ERROR_SERVER));
    }
  }
  async showWeekTop(req, res, next) {
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
        { $unwind: "$Mangas" },
        {
          $unset: [
            "Mangas.anotherName",
            "Mangas.serve",
            "Mangas.status",
            "Mangas.hot",
            "Mangas.country",
            "Mangas.contentId",
            "Mangas.image",
            "Mangas.type",
            "Mangas.statistical",
            "Mangas.description",
            "Mangas.fanmade",
            "Mangas.deleted",
            "Mangas.createdAt",
            "Mangas.updatedAt",
            "Mangas.deletedAt",
            "Mangas.translation",
          ],
        },
      ]);
      const result = lodash
        .uniqBy(statistical, function (e) {
          return e._id;
        })
        .slice(0, 10);
      res.render("showTop", {
        title: "Top 20 manga trong tuần",
        user: req.user,
        result,
      });
    } catch (error) {
      console.log(error);
      res
        .status(STATUS.SERVER_ERROR)
        .json(new ErrorResponse(ERRORCODE.ERROR_SERVER, MESSAGE.ERROR_SERVER));
    }
  }
}
module.exports = new TopController();
