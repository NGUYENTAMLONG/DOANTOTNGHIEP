const express = require("express");
const {
  getBlogDashboard,
  getBlogCreate,
  writeBlog,
} = require("../../../controllers/BlogController");
const router = express.Router();

// route:-> /management/content/blog/...
router.get("/", getBlogDashboard);
router.get("/write-blog", getBlogCreate);

//route (API-JSON): -> /management/content/blog/api
// router.post("/api/send-mail", sendMail);
router.post("/api/write-blog", writeBlog);

module.exports = router;
