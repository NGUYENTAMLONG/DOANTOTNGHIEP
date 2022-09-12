const express = require("express");
const {
  getBlogDashboard,
  getBlogCreate,
  getBlogList,
  writeBlog,
  getWritor,
} = require("../../../controllers/BlogController");
const path = require("path");
const multer = require("multer");
const appRoot = require("app-root-path");
const router = express.Router();

const storageCover = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(appRoot.path, "/src/public/blog/covers"));
  },
  filename: (req, file, cb) => {
    console.log(file);
    req.file = file;
    cb(null, Date.now() + path.extname(file.originalname));
  },
});
const uploadBlog = multer({ storage: storageCover });

// route:-> /management/content/blog/...
router.get("/", getBlogDashboard);
router.get("/write-blog", getBlogCreate);

//route (API-JSON): -> /management/content/blog/api
// router.post("/api/send-mail", sendMail);
router.get("/api/getList", getBlogList);
router.get("/api/get-writor/:role/:writerId", getWritor);
router.post("/api/write-blog", writeBlog);
router.post(
  "/api/upload/cover",
  uploadBlog.single("cover"),
  async (req, res) => {
    console.log(req.file);
    res.json(req.file);
  }
);

module.exports = router;
