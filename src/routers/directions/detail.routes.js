const express = require("express");
const {
  showDetailManga,
  readDetailManga,
  navigator,
} = require("../../controllers/DetailController");
const router = express.Router();

router.get("/:slug/read/:chapter", readDetailManga);
router.get("/:slug/navigator", navigator);
router.get("/:slug", showDetailManga);

module.exports = router;
