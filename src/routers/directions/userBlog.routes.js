const express = require("express");
const {
  getUserCreateBlog,
  getUserUpdateBlog,
  getUserBlogPage,
  likeBlog,
  checkLiked,
  unlikeBlog,
  rateBlog,
  createUserBlog,
  updateUserBlog,
  deleteUserBlog,
  getTrashPage,
  recoverUserBlog,
  liveSearchUserBlog,
  liveSearchUserBlogTrash,
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
router.get("/update-blog/:id", getUserUpdateBlog);
router.get("/trash", getTrashPage);
router.get("/", getUserBlogPage);

router.get("/api/check-liked/:id", checkLiked);

router.patch("/api/like", likeBlog);
router.patch("/api/unlike", unlikeBlog);
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
router.patch("/api/update-blog/:id", updateUserBlog);
router.delete("/api/delete-blog/:id", deleteUserBlog);
router.patch("/api/recover-blog/:id", recoverUserBlog);
router.post("/api/live-search", liveSearchUserBlog);
router.post("/api/live-search-trash", liveSearchUserBlogTrash);

module.exports = router;
