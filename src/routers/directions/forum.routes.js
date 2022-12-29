const express = require("express");
const {
  showForum,
  showDetail,
  showGenres,
  showAuthor,
} = require("../../controllers/ForumController");
const router = express.Router();

router.get("/", showForum);
router.get("/detail/:mangaId", showDetail);
router.get("/genres", showGenres);
router.get("/author/:authorId", showAuthor);

module.exports = router;
