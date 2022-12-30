const { STATUS, ERRORCODE, MESSAGE } = require("../config/httpResponse");
const { ErrorResponse, SuccessResponse } = require("../helper/response");
const moment = require("moment");

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
  async showAuthor(req, res) {
    if (!req.params.authorId) {
      redirect(req, res, STATUS.BAD_REQUEST);
    }
    const url = `https://api.jikan.moe/v4/people/${req.params.authorId}/full`;
    const urlPics = `https://api.jikan.moe/v4/people/${req.params.authorId}/pictures`;
    const options = {
      method: "GET",
    };
    try {
      let response = await fetch(url, options);
      response = await response.json();
      let pictures = await fetch(urlPics, options);
      pictures = await pictures.json();
      return res.status(STATUS.SUCCESS).render("forum/author", {
        user: req.user,
        author: response.data,
        pictures: pictures.data,
        moment,
      });
    } catch (err) {
      console.log(err);
      redirect(req, res, STATUS.SERVER_ERROR);
    }
  }
  async showResultSeaching(req, res) {
    let page = req.query.page || 1;
    let limit = req.query.limit || 25;
    if (!req.query.q) {
      redirect(req, res, STATUS.BAD_REQUEST);
    }
    const url = `https://api.jikan.moe/v4/manga?q=${req.query.q}&page=${page}&limit=${limit}`;
    const options = {
      method: "GET",
    };
    try {
      let response = await fetch(url, options);
      response = await response.json();
      return res.status(STATUS.SUCCESS).render("forum/search", {
        user: req.user,
        result: response,
        q: req.query.q,
      });
    } catch (err) {
      console.log(err);
      redirect(req, res, STATUS.SERVER_ERROR);
    }
  }
  async showResultAuthorSeaching(req, res) {
    let page = req.query.page || 1;
    let limit = req.query.limit || 25;
    if (!req.query.question) {
      redirect(req, res, STATUS.BAD_REQUEST);
    }
    const url = `https://api.jikan.moe/v4/people?q=${req.query.question}&page=${page}&limit=${limit}`;
    const options = {
      method: "GET",
    };
    try {
      let response = await fetch(url, options);
      response = await response.json();
      return res.status(STATUS.SUCCESS).render("forum/search", {
        user: req.user,
        result: response,
        q: req.query.q,
      });
    } catch (err) {
      console.log(err);
      redirect(req, res, STATUS.SERVER_ERROR);
    }
  }
  async showGenres(req, res) {
    const url = `https://api.jikan.moe/v4/genres/manga`;
    const options = {
      method: "GET",
    };
    try {
      let response = await fetch(url, options);
      response = await response.json();
      return res
        .status(STATUS.SUCCESS)
        .json(new SuccessResponse(MESSAGE.SUCCESS, response.data));
    } catch (err) {
      console.log(err);
      redirect(req, res, STATUS.SERVER_ERROR);
    }
  }
}

module.exports = new ForumController();
