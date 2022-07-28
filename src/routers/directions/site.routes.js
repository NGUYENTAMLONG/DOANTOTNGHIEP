const express = require("express");
const {
  home,
  blogs,
  search,
  liveSearch,
} = require("../../controllers/SiteController");
const router = express.Router();
router.use("/blogs", blogs);
router.use("/liveSearch", liveSearch);
router.use("/search", search);
router.use("/", home);
module.exports = router;
