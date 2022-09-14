const express = require("express");
const {
  getBlogPage,
  getMoreBlog,
  readBlog,
} = require("../../controllers/BlogController");
const router = express.Router();

router.get("/", getBlogPage);
router.get("/read/:slug", readBlog);
router.post("/get-more", getMoreBlog);

module.exports = router;
