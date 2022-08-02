const { STATUS, ERRORCODE, MESSAGE } = require("../config/httpResponse");
const { ErrorResponse, SuccessResponse } = require("../helper/response");
const { PASSPORT, types } = require("../config/default");
const Manga = require("../models/Manga");
const UserLocal = require("../models/UserLocal");
const UserGoogle = require("../models/UserGoogle");
const UserFacebook = require("../models/UserFacebook");

class LikeController {
  async likeManga(req, res) {
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
            $push: { likedList: mangaId },
          });
        }
        if (req.user.provider === PASSPORT.GOOGLE) {
          await UserGoogle.findByIdAndUpdate(req.user.id, {
            $push: { likedList: mangaId },
          });
        }
        if (req.user.provider === PASSPORT.FACEBOOK) {
          await UserFacebook.findByIdAndUpdate(req.user.id, {
            $push: { likedList: mangaId },
          });
        }
      }
      await Manga.updateOne(
        { _id: mangaId },
        { $inc: { "statistical.likes": 1 } }
      );
      return res
        .status(STATUS.SUCCESS)
        .json(new SuccessResponse(MESSAGE.LIKED, req.user.id));
    } catch (error) {
      console.log(error);
      res
        .status(STATUS.SERVER_ERROR)
        .json(new ErrorResponse(ERRORCODE.ERROR_SERVER, MESSAGE.ERROR_SERVER));
    }
  }
  async unlikeManga(req, res) {
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
              $pull: { likedList: mangaId },
            }
          );
        }
        if (req.user.provider === PASSPORT.GOOGLE) {
          await UserGoogle.updateOne(
            { _id: req.user.id },
            {
              $pull: { likedList: mangaId },
            }
          );
        }
        if (req.user.provider === PASSPORT.FACEBOOK) {
          await UserFacebook.updateOne(
            { _id: req.user.id },
            {
              $pull: { likedList: mangaId },
            }
          );
        }
      }
      await Manga.updateOne(
        { _id: mangaId },
        { $inc: { "statistical.likes": -1 } }
      );
      return res
        .status(STATUS.SUCCESS)
        .json(new SuccessResponse(MESSAGE.UNLIKED, req.user.id));
    } catch (error) {
      console.log(error);
      res
        .status(STATUS.SERVER_ERROR)
        .json(new ErrorResponse(ERRORCODE.ERROR_SERVER, MESSAGE.ERROR_SERVER));
    }
  }
}

module.exports = new LikeController();
