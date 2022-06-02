const express = require("express");
const {
  showDetailManga,
  readDetailManga,
} = require("../../controllers/DetailController");
const router = express.Router();

router.get("/:slug/read/:chapter", readDetailManga);
router.get("/:slug", showDetailManga);

module.exports = router;
