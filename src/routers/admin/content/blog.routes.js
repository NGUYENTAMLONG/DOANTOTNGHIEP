const express = require("express");
const {
  getBlogDashboard,
  writeBlog,
} = require("../../../controllers/BlogController");
const router = express.Router();

// route:-> /management/content/blog/...
router.get("/", getBlogDashboard);

//route (API-JSON): -> /management/content/blog/api
// router.post("/api/send-mail", sendMail);
router.post("/api/write-blog", writeBlog);

module.exports = router;
