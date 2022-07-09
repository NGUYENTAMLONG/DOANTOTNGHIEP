const express = require("express");
const {
  findAllSlides,
  findSlideById,
  createSlide,
  updateSlide,
  switchSlide,
  deleteSlide,
} = require("../../../../controllers/MangaController");
const router = express.Router();
// route:-> /manage/admin_manga/slide/...
router.post("/", createSlide);
router.put("/:id", updateSlide);
router.put("/switch/:id", switchSlide);
router.delete("/delete/:id", deleteSlide);
router.get("/:id", findSlideById);
router.get("/", findAllSlides);
module.exports = router;
