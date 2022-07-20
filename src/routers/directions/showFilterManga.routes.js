const express = require("express");
const {
  showRandomManga,
  showNewManga,
  showCompleteManga,
  showUnfinishedManga,
  showProlongationManga,
  showFlopManga,
} = require("../../controllers/FilterController");
const router = express.Router();

router.get("/random", showRandomManga);
router.get("/new", showNewManga);
router.get("/complete", showCompleteManga);
router.get("/unfinished", showUnfinishedManga);
router.get("/prolongation", showProlongationManga);
router.get("/flop", showFlopManga);

module.exports = router;
