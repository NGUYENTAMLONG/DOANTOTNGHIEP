const Manga = require("../models/Manga");
const moment = require("moment");
const User = require("../models/User");
const filterFollow = require("../helper/filterFollow");
const { STATUS, ERRORCODE, MESSAGE } = require("../config/httpResponse");
const { ErrorResponse, SuccessResponse } = require("../helper/response");
const { response } = require("express");
class FollowController {
  async showFollowManga(req, res) {
    try {
      if (req.AuthPayload !== undefined) {
        const foundUser = await User.findById(req.AuthPayload._id);
        const listFollowManga = foundUser.follows;
        const list = await Manga.find({
          _id: listFollowManga,
        });
        const listFollowMangaJustUpdated = filterFollow(list);
        return res.render("showFollow", {
          mangas: listFollowMangaJustUpdated,
          counter: listFollowMangaJustUpdated.length,
          user: req.AuthPayload,
        });
      }
      return res.json("NOT FOUND");
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
      if (req.AuthPayload !== undefined) {
        const foundUser = await User.findByIdAndUpdate(req.AuthPayload._id, {
          $addToSet: { follows: { $each: [mangaId] } },
        });
        return res.status(STATUS.SUCCESS).json(
          new SuccessResponse(MESSAGE.UPDATE_SUCCESS, {
            counter: foundUser.follows.length + 1,
          })
        );
      }
      return res.json("NOT ACCESS");
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
      if (req.AuthPayload !== undefined) {
        const foundUser = await User.findByIdAndUpdate(req.AuthPayload._id, {
          $pull: { follows: mangaId },
        });
        return res.status(STATUS.SUCCESS).json(
          new SuccessResponse(MESSAGE.DELETE_SUCCESS, {
            counter: foundUser.follows.length - 1,
          })
        );
      }
      return res.json("NOT ACCESS");
    } catch (error) {
      console.log(error);
      res
        .status(STATUS.SERVER_ERROR)
        .json(new ErrorResponse(ERRORCODE.ERROR_SERVER, MESSAGE.ERROR_SERVER));
    }
  }
}

module.exports = new FollowController();
