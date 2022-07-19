const express = require("express");
const {
  showAll,
  showMangaForMale,
  showMangaForFemale,
} = require("../../controllers/PopularController");
const router = express.Router();
router.get("/all", showAll);
router.get("/male", showMangaForMale);
router.get("/female", showMangaForFemale);

module.exports = router;
