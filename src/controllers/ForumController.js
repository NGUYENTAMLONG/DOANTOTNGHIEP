const { STATUS, ERRORCODE, MESSAGE } = require("../config/httpResponse");
const { ErrorResponse, SuccessResponse } = require("../helper/response");

const fetch = (...args) =>
  import("node-fetch").then(({ default: fetch }) => fetch(...args));

const { redirect } = require("../service/redirect");
class ForumController {
  async showForum(req, res) {
    let page = req.query.page || 1;
    let limit = req.query.limit || 25;
    const url = `https://api.jikan.moe/v4/manga?page=${page}&limit=${limit}`;
    const options = {
      method: "GET",
      // headers: {
      //   "X-RapidAPI-Host": "famous-quotes4.p.rapidapi.com",
      //   "X-RapidAPI-Key": "your-rapidapi-key",
      // },
    };
    try {
      let response = await fetch(url, options);
      response = await response.json();
      //   return res.json({ response, page, limit });
      return res.status(STATUS.SUCCESS).render("forum/forum", {
        user: req.user,
        data: response,
      });
    } catch (err) {
      console.log(err);
      redirect(req, res, STATUS.SERVER_ERROR);
    }
  }
  async showDetail(req, res) {
    if (!req.params.mangaId) {
      redirect(req, res, STATUS.BAD_REQUEST);
    }
    const url = `https://api.jikan.moe/v4/manga/${req.params.mangaId}`;
    const options = {
      method: "GET",
      // headers: {
      //   "X-RapidAPI-Host": "famous-quotes4.p.rapidapi.com",
      //   "X-RapidAPI-Key": "your-rapidapi-key",
      // },
    };
    try {
      let response = await fetch(url, options);
      response = await response.json();
      return res.status(STATUS.SUCCESS).render("forum/detail", {
        user: req.user,
        manga: response.data,
      });
    } catch (err) {
      console.log(err);
      redirect(req, res, STATUS.SERVER_ERROR);
    }
  }
}

module.exports = new ForumController();
