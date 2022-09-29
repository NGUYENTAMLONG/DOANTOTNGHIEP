const express = require("express");
const {
  getUserCreateBlog,
  getUserBlogPage,
  likeBlog,
  checkLiked,
  unlikeBlog,
  rateBlog,
  createUserBlog,
  deleteUserBlog,
  getTrashPage,
} = require("../../controllers/UserBlogController");
const router = express.Router();
const path = require("path");
const multer = require("multer");
const appRoot = require("app-root-path");

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

router.get("/create-blog", getUserCreateBlog);
router.get("/trash", getTrashPage);
router.get("/", getUserBlogPage);

router.get("/api/check-liked/:id", checkLiked);

router.post("/api/like", likeBlog);
router.delete("/api/unlike", unlikeBlog);
router.post("/api/rate", rateBlog);

router.post(
  "/api/upload/cover",
  uploadBlog.single("cover"),
  async (req, res) => {
    console.log(req.file);
    res.json(req.file);
  }
);

router.post("/api/create-blog", createUserBlog);
router.delete("/api/delete-blog/:id", deleteUserBlog);

module.exports = router;
