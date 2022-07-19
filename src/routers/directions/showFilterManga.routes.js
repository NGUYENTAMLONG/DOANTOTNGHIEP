const express = require("express");
const {
  showRandomManga,
  showNewManga,
  showCompleteManga,
  showUnfinishedManga,
} = require("../../controllers/FilterController");
const router = express.Router();

router.get("/random", showRandomManga);
router.get("/new", showNewManga);
router.get("/complete", showCompleteManga);
router.get("/unfinished", showUnfinishedManga);

module.exports = router;
