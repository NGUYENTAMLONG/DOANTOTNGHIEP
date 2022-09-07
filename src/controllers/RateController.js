const { STATUS, ERRORCODE, MESSAGE } = require("../config/httpResponse");
const { ErrorResponse, SuccessResponse } = require("../helper/response");
const { PASSPORT, types } = require("../config/default");
const Manga = require("../models/Manga");
const UserLocal = require("../models/UserLocal");
const UserGoogle = require("../models/UserGoogle");
const UserFacebook = require("../models/UserFacebook");
const lodash = require("lodash");

class RateController {
  async rateManga(req, res) {
    const { mangaId, counterStar } = req.body;
    if (!mangaId) {
      return res
        .status(STATUS.BAD_REQUEST)
        .json(
          new ErrorResponse(ERRORCODE.ERROR_BAD_REQUEST, MESSAGE.BAD_REQUEST)
        );
    }
    try {
      if (!req.user) {
        return res
        .status(STATUS.UNAUTHORIZED)
        .json(
          new ErrorResponse(ERRORCODE.ERROR_UNAUTHORIZED, MESSAGE.UNAUTHORIZED)
        );
      }
      const userId = req.user.id;
      if (req.user.provider === PASSPORT.LOCAL) {
        const checkRating = await UserLocal.findById(userId).select(
          "ratedList"
        );
        if (checkRating.ratedList.includes(mangaId)) {
          return res
            .status(STATUS.BAD_REQUEST)
            .json(
              new ErrorResponse(
                ERRORCODE.ERROR_BAD_REQUEST,
                MESSAGE.ALREADY_REATED
              )
            );
        }
        await UserLocal.findByIdAndUpdate(userId, {
          $push: { ratedList: mangaId },
        });
      } else if (req.user.provider === PASSPORT.GOOGLE) {
        const checkRating = await UserGoogle.findById(userId).select(
          "ratedList"
        );
        if (checkRating.ratedList.includes(mangaId)) {
          return res
            .status(STATUS.BAD_REQUEST)
            .json(
              new ErrorResponse(
                ERRORCODE.ERROR_BAD_REQUEST,
                MESSAGE.ALREADY_REATED
              )
            );
        }
        await UserGoogle.findByIdAndUpdate(userId, {
          $push: { ratedList: mangaId },
        });
      } else if (req.user.provider === PASSPORT.FACEBOOK) {
        const checkRating = await UserFacebook.findById(userId).select(
          "ratedList"
        );
        if (checkRating.ratedList.includes(mangaId)) {
          return res
            .status(STATUS.BAD_REQUEST)
            .json(
              new ErrorResponse(
                ERRORCODE.ERROR_BAD_REQUEST,
                MESSAGE.ALREADY_REATED
              )
            );
        }
        await UserFacebook.findByIdAndUpdate(userId, {
          $push: { ratedList: mangaId },
        });
      }
      // Find Manga => rating, counting
      // Tinh rating moi =>
      const foundManga = await Manga.findById(mangaId);
      const oldRating = foundManga.statistical.rating;
      const oldCounting = foundManga.statistical.counting;
      const newCounting = oldCounting + 1;
      const newRating = (oldRating * oldCounting + counterStar) / newCounting;

      await Manga.updateOne(
        { _id: mangaId },
        {
          "statistical.counting": newCounting,
          "statistical.rating": parseFloat(newRating.toFixed(1)),
        }
      );
      return res
        .status(STATUS.SUCCESS)
        .json(new SuccessResponse(MESSAGE.RATED), null);
    } catch (error) {
      console.log(error);
      res
        .status(STATUS.SERVER_ERROR)
        .json(new ErrorResponse(ERRORCODE.ERROR_SERVER, MESSAGE.ERROR_SERVER));
    }
  }
}

module.exports = new RateController();
