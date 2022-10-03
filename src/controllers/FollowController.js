const Manga = require("../models/Manga");
const moment = require("moment");
const UserLocal = require("../models/UserLocal");
const { STATUS, ERRORCODE, MESSAGE } = require("../config/httpResponse");
const { ErrorResponse, SuccessResponse } = require("../helper/response");
const { PASSPORT, types } = require("../config/default");
const UserGoogle = require("../models/UserGoogle");
const UserFacebook = require("../models/UserFacebook");
const filterMangas = require("../service/filterMangas");
const pagination = require("../service/pagination");
class FollowController {
  async showFollowManga(req, res) {
    try {
      let userInfo;
      if (req.user) {
        if (req.user.provider === PASSPORT.LOCAL) {
          userInfo = await UserLocal.findById(req.user.id);
        }
        if (req.user.provider === PASSPORT.GOOGLE) {
          userInfo = await UserGoogle.findById(req.user.id);
        }
        if (req.user.provider === PASSPORT.FACEBOOK) {
          userInfo = await UserFacebook.findById(req.user.id);
        }
      }
      const followedMangas = userInfo.followedList;
      const match = filterMangas(req);
      match._id = { $in: followedMangas };
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
      res.render("showFollow", {
        user: req.user,
        moment,
        flag: null,
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
      res
        .status(STATUS.SERVER_ERROR)
        .json(new ErrorResponse(ERRORCODE.ERROR_SERVER, MESSAGE.ERROR_SERVER));
    }
  }
  async addFollowManga(req, res) {
    const { mangaId } = req.body;
    if (!mangaId) {
      return res
        .status(STATUS.BAD_REQUEST)
        .json(
          new ErrorResponse(ERRORCODE.ERROR_BAD_REQUEST, MESSAGE.BAD_REQUEST)
        );
    }
    try {
      if (req.user) {
        if (req.user.provider === PASSPORT.LOCAL) {
          await UserLocal.findByIdAndUpdate(req.user.id, {
            $push: { followedList: mangaId },
          });
        }
        if (req.user.provider === PASSPORT.GOOGLE) {
          await UserGoogle.findByIdAndUpdate(req.user.id, {
            $push: { followedList: mangaId },
          });
        }
        if (req.user.provider === PASSPORT.FACEBOOK) {
          await UserFacebook.findByIdAndUpdate(req.user.id, {
            $push: { followedList: mangaId },
          });
        }
      }
      await Manga.updateOne(
        { _id: mangaId },
        { $inc: { "statistical.follows": 1 } }
      );
      return res
        .status(STATUS.SUCCESS)
        .json(new SuccessResponse(MESSAGE.FOLLOWED, req.user.id));
    } catch (error) {
      console.log(error);
      res
        .status(STATUS.SERVER_ERROR)
        .json(new ErrorResponse(ERRORCODE.ERROR_SERVER, MESSAGE.ERROR_SERVER));
    }
  }
  async unFollowManga(req, res) {
    const { mangaId } = req.body;
    if (!mangaId) {
      return res
        .status(STATUS.BAD_REQUEST)
        .json(
          new ErrorResponse(ERRORCODE.ERROR_BAD_REQUEST, MESSAGE.BAD_REQUEST)
        );
    }
    try {
      if (req.user) {
        if (req.user.provider === PASSPORT.LOCAL) {
          await UserLocal.updateOne(
            { _id: req.user.id },
            {
              $pull: { followedList: mangaId },
            }
          );
        }
        if (req.user.provider === PASSPORT.GOOGLE) {
          await UserGoogle.updateOne(
            { _id: req.user.id },
            {
              $pull: { followedList: mangaId },
            }
          );
        }
        if (req.user.provider === PASSPORT.FACEBOOK) {
          await UserFacebook.updateOne(
            { _id: req.user.id },
            {
              $pull: { followedList: mangaId },
            }
          );
        }
      }
      await Manga.updateOne(
        { _id: mangaId },
        { $inc: { "statistical.follows": -1 } }
      );
      return res
        .status(STATUS.SUCCESS)
        .json(new SuccessResponse(MESSAGE.UNFOLLOWED, req.user.id));
    } catch (error) {
      console.log(error);
      res
        .status(STATUS.SERVER_ERROR)
        .json(new ErrorResponse(ERRORCODE.ERROR_SERVER, MESSAGE.ERROR_SERVER));
    }
  }
}

module.exports = new FollowController();
