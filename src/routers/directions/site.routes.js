const express = require("express");
const {
  home,
  blogs,
  search,
  getAvatar,
} = require("../../controllers/SiteController");
const { PagingSearched } = require("../../middleware/paging");
const router = express.Router();
router.use("/blogs", blogs);
router.use("/search", search);
router.use("/getAvatar/:avatar", getAvatar);
router.use("/", home);
module.exports = router;
