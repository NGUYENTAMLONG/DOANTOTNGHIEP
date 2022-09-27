const express = require("express");
const {
  getUserCreateBlog,
  getUserBlogPage,
  likeBlog,
  checkLiked,
  unlikeBlog,
  rateBlog,
} = require("../../controllers/UserBlogController");
const router = express.Router();

router.get("/create-blog", getUserCreateBlog);
router.get("/", getUserBlogPage);

router.get("/api/check-liked/:id", checkLiked);

router.post("/api/like", likeBlog);
router.delete("/api/unlike", unlikeBlog);
router.post("/api/rate", rateBlog);

module.exports = router;
