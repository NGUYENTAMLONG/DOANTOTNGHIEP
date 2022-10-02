const express = require("express");
const {
  home,
  blogs,
  about,
  search,
  liveSearch,
} = require("../../controllers/SiteController");
const router = express.Router();
router.use("/about", about);
router.use("/liveSearch", liveSearch);
router.use("/search", search);
router.use("/", home);
module.exports = router;
