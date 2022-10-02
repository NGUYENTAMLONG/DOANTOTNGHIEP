const express = require("express");
const {
  home,
  about,
  search,
  liveSearch,
  getMoreSearching,
} = require("../../controllers/SiteController");
const router = express.Router();
router.use("/about", about);
router.use("/liveSearch", liveSearch);
router.post("/search/get-more", getMoreSearching);
router.use("/search", search);
router.use("/", home);
module.exports = router;
