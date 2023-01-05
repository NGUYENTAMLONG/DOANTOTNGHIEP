const express = require("express");
const {
  showForum,
  showDetail,
  showGenres,
  showAuthor,
  showResultSeaching,
  showRecommendations,
  showResultAuthorSeaching,
  showResultCharacterSeaching,
  showReviews,
  showCharacter,
  showNews,
} = require("../../controllers/ForumController");
const router = express.Router();

router.get("/", showForum);
router.get("/detail/:mangaId", showDetail);
router.get("/recommendations/:mangaId", showRecommendations);
router.get("/genres", showGenres);
router.get("/character/:characterId", showCharacter);
router.get("/search", showResultSeaching);
router.get("/search-author", showResultAuthorSeaching);
router.get("/search-character", showResultCharacterSeaching);
router.get("/author/:authorId", showAuthor);
router.get("/reviews/:mangaId", showReviews);
router.get("/news/:mangaId", showNews);

module.exports = router;
