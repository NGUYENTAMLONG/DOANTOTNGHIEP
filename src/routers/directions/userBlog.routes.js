const express = require("express");
const {
  getUserBlogPage,
  likeBlog,
  unlikeBlog,
} = require("../../controllers/UserBlogController");
const router = express.Router();

router.get("/", getUserBlogPage);

router.patch("/api/like", likeBlog);
// router.patch("/api/un-like", unlikeBlog);

module.exports = router;
