const Manga = require("../models/Manga");
const moment = require("moment");
const { STATUS, ERRORCODE, MESSAGE } = require("../config/httpResponse");
const { ErrorResponse } = require("../helper/response");
const { orderManga } = require("../helper/order");
const filterMangas = require("../service/filterMangas");
const pagination = require("../service/pagination");
const { types, SERVE } = require("../config/default");

class PopularController {
  async showAll(req, res, next) {
    try {
      await handleResponse(req, res, SERVE.ALL);
    } catch (error) {
      console.log(error);
      res.status(500).json("ERROR:", error);
    }
  }
  async showMangaForMale(req, res, next) {
    try {
      await handleResponse(req, res, SERVE.MALE);
    } catch (error) {
      console.log(error);
      res.status(500).json("ERROR:", error);
    }
  }
  async showMangaForFemale(req, res, next) {
    try {
      await handleResponse(req, res, SERVE.FEMALE);
    } catch (error) {
      console.log(error);
      res.status(500).json("ERROR:", error);
    }
  }
}
async function handleResponse(req, res, serve) {
  const match = filterMangas(req);
  match.serve = serve;
  const totalMangas = await Manga.countDocuments(match);
  const page = parseInt(req.query.page);
  const limit = parseInt(req.query.limit);
  const startPage = (page - 1) * limit;
  const result = pagination(req, totalMangas);
  result.mangas = await Manga.find(match)
    .populate("contentId", {
      chapters: { $slice: -1 },
    })
    .limit(limit)
    .skip(startPage)
    .exec();
  let title = "";
  if (serve === SERVE.MALE) {
    title = `<i class="fas fa-mars"></i> Truyện con trai`;
  } else if (serve === SERVE.FEMALE) {
    title = `<i class="fas fa-venus"></i> Truyện con gái`;
  } else {
    title = `<i class="fas fa-flag-checkered"></i> Truyện tổng hợp`;
  }
  res.render("showPopular", {
    user: req.AuthPayload,
    moment: moment,
    title: `<i class="fas fa-venus"></i> Truyện con gái`,
    mangas: orderManga(result.mangas),
    categories: types,
    navigator: {
      previous: result.previous,
      next: result.next,
      totalPages: Math.ceil(totalMangas / limit),
      limit: limit,
      activePage: page,
      filter: match,
    },
  });
}
module.exports = new PopularController();
