const express = require("express");
const multer = require("multer");
const path = require("path");
const appRoot = require("app-root-path");
const {
  getSlideDashboard,
  createSlide,
  getUpdateSlidePage,
  switchSlide,
  deleteSlide,
  findSlideById,
  findAllSlides,
  destroySlide,
  restoreSlide,
  getSlideTrash,
  getCreateSlidePage,
  updateSlide,
} = require("../../../controllers/SlideController");
const router = express.Router();

// route:-> /management/content/slide/...
router.get("/update/:id", getUpdateSlidePage);
router.get("/create", getCreateSlidePage);
router.get("/trash", getSlideTrash);
router.get("/", getSlideDashboard);

//route (API-JSON): -> /management/content/slide/api
const storageSlide = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(appRoot.path, "/src/public/images"));
  },
  filename: (req, file, cb) => {
    req.file = file;
    cb(null, Date.now() + path.extname(file.originalname));
  },
});
const uploadSlide = multer({ storage: storageSlide });

router.post(
  "/api/upload/slideImg",
  uploadSlide.single("slide"),
  async (req, res) => {
    console.log(req.file);
    res.json(req.file);
  }
);

router.post("/api/create", createSlide);
router.get("/api/slides", findAllSlides);
router.get("/api/slides/:id", findSlideById);
router.delete("/api/delete/:id", deleteSlide);
router.delete("/api/destroy/:id", destroySlide);
router.patch("/api/restore/:id", restoreSlide);
router.put("/api/switch/:id", switchSlide);
router.post("/api/update/:id", updateSlide);

module.exports = router;
