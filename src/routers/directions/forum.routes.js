const express = require("express");
const {
  showForum,
  showDetail,
  showGenres,
  showAuthor,
  showResultSeaching,
  showRecommendations,
  showResultAuthorSeaching,
  showReviews,
  showNews,
} = require("../../controllers/ForumController");
const router = express.Router();

router.get("/", showForum);
router.get("/detail/:mangaId", showDetail);
router.get("/recommendations/:mangaId", showRecommendations);
router.get("/genres", showGenres);
router.get("/search", showResultSeaching);
router.get("/search-author", showResultAuthorSeaching);
router.get("/author/:authorId", showAuthor);
router.get("/reviews/:mangaId", showReviews);
router.get("/news/:mangaId", showNews);

module.exports = router;
