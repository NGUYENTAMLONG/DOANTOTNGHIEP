const express = require("express");
const {
  showForum,
  showDetail,
  showGenres,
  showAuthor,
  showResultSeaching,
} = require("../../controllers/ForumController");
const router = express.Router();

router.get("/", showForum);
router.get("/detail/:mangaId", showDetail);
router.get("/genres", showGenres);
router.get("/search", showResultSeaching);
router.get("/author/:authorId", showAuthor);

module.exports = router;
