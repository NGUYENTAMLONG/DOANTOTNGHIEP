const express = require("express");
const {
  getBlogPage,
  getMoreBlog,
  readBlog,
  getBlogWithKeyword,
  getMoreBlogWithKeyword,
  getNewsBlogPage,
  getSpreadsBlogPage,
  getMoreOfType,
  getSearchBlogPage,
  getMoreResultSeaching,
} = require("../../controllers/BlogController");
const router = express.Router();

router.get("/", getBlogPage);
router.get("/read/:slug", readBlog);
router.get("/news", getNewsBlogPage);
router.get("/spreads", getSpreadsBlogPage);
router.get("/blog-with-keyword/:keyword", getBlogWithKeyword);
router.post("/get-more", getMoreBlog);
router.post("/blog-with-keyword/get-more", getMoreBlogWithKeyword);
router.post("/type/get-more", getMoreOfType);
router.get("/search", getSearchBlogPage);
router.post("/get-more-searching", getMoreResultSeaching);

module.exports = router;
