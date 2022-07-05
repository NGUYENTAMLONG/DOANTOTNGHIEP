const { VALUES } = require("../config/default");
const { STATUS, ERRORCODE, MESSAGE } = require("../config/httpResponse");
const { ErrorResponse } = require("../helper/response");
const moment = require("moment");
const Manga = require("../models/Manga");
const { orderManga } = require("../helper/order");
class CompleteController {
  async show(req, res, next) {
    try {
      const mangas = await Manga.find({
        status: { $regex: VALUES.COMPLETE_STATUS, $options: "i" },
      }).populate("contentId", {
        chapters: { $slice: -1 },
      });
      res.render("showComplete", {
        user: req.AuthPayload,
        moment: moment,
        mangas: orderManga(mangas),
      });
    } catch (error) {
      console.log(error);
      res
        .status(STATUS.SERVER_ERROR)
        .json(new ErrorResponse(ERRORCODE.ERROR_SERVER, MESSAGE.ERROR_SERVER));
    }
  }
}
module.exports = new CompleteController();
