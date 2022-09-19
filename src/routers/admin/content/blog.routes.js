const express = require("express");
const {
  getBlogDashboard,
  getInfoBlogCreate,
  getContentBlogCreate,
  getBlogList,
  getWritor,
  submitInfoBlog,
  streamBlogImage,
  deleteBlogImage,
  submitContentBlog,
  softDeleteBlog,
  getDeletedBlog,
  restoreBlog,
  getBlogTrash,
  restoreBlogChecked,
  deleteBlogChecked,
  getInfoBlogUpdate,
  updateInfoBlog,
  getContentBlogUpdate,
  updateContentBlog,
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
router.get("/trash", getBlogTrash);
router.get("/write-blog/submit-info", getInfoBlogCreate);
router.get("/write-blog/submit-content/:type/:slug", getContentBlogCreate);
router.get("/update-blog/submit-info/:id", getInfoBlogUpdate);
router.get("/update-blog/submit-content/:id", getContentBlogUpdate);

//route (API-JSON): -> /management/content/blog/api

//CREATE BLOG
//1. Initialize Blog
router.post("/api/write-blog/submit-info", submitInfoBlog);
//2. Submit Content
router.post("/api/write-blog/submit-content", submitContentBlog);
//3. Stream Image of Blog
router.post("/api/stream-image/:type/:slug", streamBlogImage);
//4. Delete Image of Blog
router.delete("/api/stream-image/delete/:type/:slug", deleteBlogImage);
//5. Upload Blog Cover
router.post(
  "/api/upload/cover",
  uploadBlog.single("cover"),
  async (req, res) => {
    console.log(req.file);
    res.json(req.file);
  }
);
//6. Get Blog List
router.get("/api/getList", getBlogList);
//7. Get Info of Writor
router.get("/api/get-writor/:role/:writerId/:passport", getWritor);
//8. Softdelete blog
router.delete("/api/delete/:id", softDeleteBlog);
//9. Restore blog
router.patch("/api/restore/:id", restoreBlog);
//10. Get Deleted Blog List
router.get("/api/getDeletedList", getDeletedBlog);
//11. Restore Checked blog
router.patch("/api/restoreChecked", restoreBlogChecked);
//12. Delete checked blog
router.delete("/api/deleteChecked", deleteBlogChecked);
//13. Update blog cover
router.patch(
  "/api/update-blog/update-cover",
  uploadBlog.single("cover"),
  async (req, res) => {
    console.log(req.file);
    res.json(req.file);
  }
);
//14. Update blog infomation
router.patch("/api/update-blog/update-info/:id", updateInfoBlog);
//15. Update blog content
router.patch("/api/update-blog/update-content", updateContentBlog);
module.exports = router;
