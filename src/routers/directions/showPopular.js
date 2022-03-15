const express = require("express");
const {
  showJustUpdated,
  showAll,
  showMangaForMale,
  showMangaForFemale,
} = require("../../controllers/PopularController");
const { getNewChapter } = require("../../middleware/getSomething");
const router = express.Router();
router.get("/:slug", getNewChapter, showJustUpdated);
router.get("/:slug", getNewChapter, showAll);
router.get("/:slug", getNewChapter, showMangaForMale);
router.get("/:slug", getNewChapter, showMangaForFemale);

module.exports = router;
