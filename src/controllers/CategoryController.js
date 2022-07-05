const matchType = require("../helper/matchType");
const moment = require("moment");
const Manga = require("../models/Manga");
const { orderManga } = require("../helper/order");
const { STATUS, ERRORCODE, MESSAGE } = require("../config/httpResponse");
const { ErrorResponse } = require("../helper/response");
const { redirect } = require("../service/redirect");
class MangaController {
  show(req, res, next) {
    const arrayType = matchType(req.params.type);
    Manga.find({ type: { $in: arrayType } })
      .populate("contentId", {
        chapters: { $slice: -1 },
      })
      .lean()
      .then((mangas) => {
        if (mangas.length === 0) {
          redirect(req, res, STATUS.NOT_FOUND);
        }
        res.render("showCategory", {
          user: req.AuthPayload,
          moment: moment,
          mangas: orderManga(mangas),
        });
      })
      .catch((error) => {
        console.log(error);
        res
          .status(STATUS.SERVER_ERROR)
          .json(
            new ErrorResponse(ERRORCODE.ERROR_SERVER, MESSAGE.ERROR_SERVER)
          );
      });
  }
}
module.exports = new MangaController();
