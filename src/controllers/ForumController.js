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
    const urlRecommendations = `https://api.jikan.moe/v4/manga/${req.params.mangaId}/recommendations`;
    const urlCharacters = `https://api.jikan.moe/v4/manga/${req.params.mangaId}/characters`;

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
      let responseRecommendations = await fetch(urlRecommendations, options);
      responseRecommendations = await responseRecommendations.json();
      let responseCharacters = await fetch(urlCharacters, options);
      responseCharacters = await responseCharacters.json();

      return res.status(STATUS.SUCCESS).render("forum/detail", {
        user: req.user,
        manga: response.data,
        recommendations: responseRecommendations.data,
        characters: responseCharacters.data,
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
      return res.status(STATUS.SUCCESS).render("forum/searchAuthor", {
        user: req.user,
        result: response.data,
        q: req.query.question,
      });
    } catch (err) {
      console.log(err);
      redirect(req, res, STATUS.SERVER_ERROR);
    }
  }
  async showResultCharacterSeaching(req, res) {
    let page = req.query.page || 1;
    let limit = req.query.limit || 25;
    if (!req.query.question) {
      redirect(req, res, STATUS.BAD_REQUEST);
    }
    const url = `https://api.jikan.moe/v4/characters?q=${req.query.question}`;
    const options = {
      method: "GET",
    };
    try {
      let response = await fetch(url, options);
      response = await response.json();
      return res.status(STATUS.SUCCESS).render("forum/searchCharacter", {
        user: req.user,
        result: response.data,
        q: req.query.question,
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
  async showRecommendations(req, res) {
    const url = `https://api.jikan.moe/v4/manga/${req.params.mangaId}/recommendations`;
    const options = {
      method: "GET",
    };
    try {
      let response = await fetch(url, options);
      response = await response.json();
      return res.json(response);
      return res
        .status(STATUS.SUCCESS)
        .json(new SuccessResponse(MESSAGE.SUCCESS, response.data));
    } catch (err) {
      console.log(err);
      redirect(req, res, STATUS.SERVER_ERROR);
    }
  }
  async showReviews(req, res) {
    const urlReview = `https://api.jikan.moe/v4/manga/${req.params.mangaId}/reviews`;
    const urlManga = `https://api.jikan.moe/v4/manga/${req.params.mangaId}`;

    const options = {
      method: "GET",
    };
    try {
      let responseReviews = await fetch(urlReview, options);
      responseReviews = await responseReviews.json();
      let responseManga = await fetch(urlManga, options);
      responseManga = await responseManga.json();
      return res.status(STATUS.SUCCESS).render("forum/reviews", {
        user: req.user,
        reviews: responseReviews.data,
        manga: responseManga.data,
        pagination: responseReviews.pagination,
        moment,
      });
    } catch (err) {
      console.log(err);
      redirect(req, res, STATUS.SERVER_ERROR);
    }
  }
  async showNews(req, res) {
    let page = req.query.page || 1;
    const urlNews = `https://api.jikan.moe/v4/manga/${req.params.mangaId}/news?page=${page}`;
    const urlManga = `https://api.jikan.moe/v4/manga/${req.params.mangaId}`;
    const options = {
      method: "GET",
    };
    try {
      let responseNews = await fetch(urlNews, options);
      responseNews = await responseNews.json();
      let responseManga = await fetch(urlManga, options);
      responseManga = await responseManga.json();
      return res.status(STATUS.SUCCESS).render("forum/news", {
        user: req.user,
        news: responseNews.data,
        manga: responseManga.data,
        pagination: responseNews.pagination,
        moment,
        page,
      });
    } catch (err) {
      console.log(err);
      redirect(req, res, STATUS.SERVER_ERROR);
    }
  }
  async showCharacter(req, res) {
    if (!req.params.characterId) {
      redirect(req, res, STATUS.BAD_REQUEST);
    }
    const url = `https://api.jikan.moe/v4/characters/${req.params.characterId}/full`;
    const urlPics = `https://api.jikan.moe/v4/characters/${req.params.characterId}/pictures`;
    const options = {
      method: "GET",
    };
    try {
      let response = await fetch(url, options);
      response = await response.json();
      let pictures = await fetch(urlPics, options);
      pictures = await pictures.json();
      return res.status(STATUS.SUCCESS).render("forum/character", {
        user: req.user,
        character: response.data,
        pictures: pictures.data,
        moment,
      });
    } catch (err) {
      console.log(err);
      redirect(req, res, STATUS.SERVER_ERROR);
    }
  }
}

module.exports = new ForumController();
