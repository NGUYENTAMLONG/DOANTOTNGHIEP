const express = require("express");
const {
  home,
  blogs,
  search,
  getAvatar,
  liveSearch,
} = require("../../controllers/SiteController");
const router = express.Router();
router.use("/blogs", blogs);
router.use("/liveSearch", liveSearch);
router.use("/search", search);
router.use("/getAvatar/:avatar", getAvatar);
router.use("/", home);
module.exports = router;
