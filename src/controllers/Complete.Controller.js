const { VALUES } = require("../config/default");
const { STATUS, ERRORCODE, MESSAGE } = require("../config/httpResponse");
const filterPopular = require("../helper/filterPopular");
const { ErrorResponse } = require("../helper/response");
const Manga = require("../models/Manga");
class CompleteController {
  async show(req, res, next) {
    try {
      const mangas = await Manga.find({
        status: { $regex: VALUES.COMPLETE_STATUS, $options: "i" },
      });
      res.render("showComplete", {
        user: req.AuthPayload,
        mangas: filterPopular(mangas),
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
