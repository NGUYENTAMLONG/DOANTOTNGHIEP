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
const mongoose = require("mongoose");
const Chapter = require("../models/Chapter");
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
      // Select Sort
      let conditionSort = null;
      if (condition.sort === "like-down") {
        conditionSort = {
          "statistical.likes": -1,
        };
      } else if (condition.sort === "like-up") {
        conditionSort = {
          "statistical.likes": 1,
        };
      } else if (condition.sort === "view-down") {
        conditionSort = {
          "statistical.views": -1,
        };
      } else if (condition.sort === "view-up") {
        conditionSort = {
          "statistical.views": 1,
        };
      } else if (condition.sort === "rate-down") {
        conditionSort = {
          "statistical.rating": -1,
        };
      } else if (condition.sort === "rate-up") {
        conditionSort = {
          "statistical.rating": 1,
        };
      } else if (condition.sort === "counter-rate-down") {
        conditionSort = {
          "statistical.counting": -1,
        };
      } else if (condition.sort === "counter-rate-up") {
        conditionSort = {
          "statistical.counting": 1,
        };
      } else if (condition.sort === "follow-down") {
        conditionSort = {
          "statistical.follows": -1,
        };
      } else if (condition.sort === "follow-up") {
        conditionSort = {
          "statistical.follows": -1,
        };
      }
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

      //Find Mangas using Find
      // return res.json(conditionSort);
      let foundMangas = await Manga.find(finalCondition)
        .populate("contentId", {
          chapters: { $slice: -1 },
        })
        .sort(conditionSort);

      // Check Sort by Recently Chapter
      let arrayRepoIds = null;
      if (condition.sort === "date-down") {
        arrayRepoIds = await sortByChapterDate(foundMangas, -1);
        // return res.json(arrayRepoIds);
        foundMangas = await Manga.find({
          contentId: {
            $in: arrayRepoIds,
          },
        }).populate("contentId", {
          chapters: { $slice: -1 },
        });
        const a = [];
        for (let i = 0; i < arrayRepoIds.length; i++) {
          a.push(orderMangaList(foundMangas, arrayRepoIds[i]));
        }
        foundMangas = a;
      } else if (condition.sort === "date-up") {
        arrayRepoIds = await sortByChapterDate(foundMangas, 1);
        // return res.json(arrayRepoIds);

        foundMangas = await Manga.find({
          contentId: {
            $in: arrayRepoIds,
          },
        }).populate("contentId", {
          chapters: { $slice: -1 },
        });
        const a = [];
        for (let i = 0; i < arrayRepoIds.length; i++) {
          a.push(orderMangaList(foundMangas, arrayRepoIds[i]));
        }
        foundMangas = a;
      }

      // Filter By Count Chapter
      if (condition.countChapter !== "null") {
        let repoChapterIds = foundMangas.map((manga) => manga.contentId);
        repoChapterIds = repoChapterIds.map(function (el) {
          return mongoose.Types.ObjectId(el);
        });
        const foundRepoChapter = await Chapter.aggregate([
          {
            $match: {
              _id: { $in: repoChapterIds },
            },
          },
          {
            $addFields: {
              chapters: {
                $size: "$chapters",
              },
            },
          },
          {
            $match: {
              chapters: {
                $lte: Number(condition.countChapter),
              },
            },
          },
          {
            $project: {
              _id: 1,
            },
          },
        ]);
        const contentIds = foundRepoChapter.map((repo) =>
          mongoose.Types.ObjectId(repo._id)
        );

        foundMangas = await Manga.find({
          contentId: {
            $in: contentIds,
          },
        }).populate("contentId", {
          chapters: { $slice: -1 },
        });
        const arr = [];
        for (let i = 0; i < repoChapterIds.length; i++) {
          arr.push(orderMangaList(foundMangas, repoChapterIds[i]));
        }
        foundMangas = arr.filter((element) => {
          return element != null;
        });
      }
      // ********************************************
      // return res.json(foundMangas.map((manga) => manga._id));

      // const countChapterCondition = condition.countChapter;
      //Find Mangas using Aggregate
      // const foundMangas = await Manga.aggregate([
      //   {
      //     $match: finalCondition,
      //   },
      // ]);
      // ********************************************

      // return res.json(foundMangas);

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
async function sortByChapterDate(foundMangas, sort) {
  const sortByDate = await Chapter.aggregate([
    {
      $match: {
        _id: {
          $in: foundMangas.map((manga) =>
            mongoose.Types.ObjectId(manga.contentId)
          ),
        },
      },
    },
    {
      $unwind: "$chapters",
    },
    {
      $addFields: {
        isDate: "$chapters.createdTime",
      },
    },
    {
      $addFields: {
        isDate: {
          $toDate: "$isDate",
        },
      },
    },
    {
      $sort: {
        isDate: sort,
      },
    },
    {
      $project: {
        _id: 1,
      },
    },
  ]);
  return (arrayRepoIds = Array.from(
    new Set(sortByDate.map((elm) => elm._id.toString()))
  ));
}
function orderMangaList(mangas, contentId) {
  return mangas.find(
    (elm, index) => elm.contentId._id.toString() === contentId.toString()
  );
}
module.exports = new AdvancedSearchController();
