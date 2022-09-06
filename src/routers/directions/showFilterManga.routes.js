const express = require("express");
const {
  showRandomManga,
  showNewManga,
  showCompleteManga,
  showUnfinishedManga,
  showProlongationManga,
  showFlopManga,
  showAllAuthors,
  showAllTranslators,
  showMangasOfAuthor,
  getRelatedMangas,
  showFavouriteManga,
  showHighestViewsManga,
  showMangasOfTranslator,
  showMangaRank,
  showMangaRateCounting,
} = require("../../controllers/FilterController");
const router = express.Router();

router.get("/random", showRandomManga);
router.get("/new", showNewManga);
router.get("/complete", showCompleteManga);
router.get("/unfinished", showUnfinishedManga);
router.get("/prolongation", showProlongationManga);
router.get("/flop", showFlopManga);
router.get("/author/:slug", showMangasOfAuthor);
router.get("/author", showAllAuthors);
router.get("/translation/:slug", showMangasOfTranslator);
router.get("/translation", showAllTranslators);
router.get("/rank", showMangaRank);
router.get("/rate-counting", showMangaRateCounting);
router.get("/favourite", showFavouriteManga);
router.get("/highest-views", showHighestViewsManga);
router.post("/related", getRelatedMangas);

module.exports = router;
