const express = require("express");
const { STATUS } = require("../../../config/httpResponse");
const {
  createSlide,
  updateSlide,
  switchSlide,
  deleteSlide,
  findSlideById,
  findAllSlides,
} = require("../../../controllers/MangaController");
const Chapter = require("../../../models/Chapter");
const Slide = require("../../../models/Slide");
const { redirect } = require("../../../service/redirect");
const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const slides = await Slide.find().populate({
      path: "manga",
      populate: { path: "contentId", select: { chapters: { $slice: -1 } } },
    });
    res.render("admin/slide/slideDashboard", { slides });
  } catch (error) {
    console.log(error);
    redirect(req, res, STATUS.SERVER_ERROR);
  }
});

// route:-> /manage/admin_manga/slide/...
router.post("/", createSlide);
router.put("/:id", updateSlide);
router.put("/switch/:id", switchSlide);
router.delete("/:id", deleteSlide);
router.get("/:id", findSlideById);
router.get("/", findAllSlides);

module.exports = router;
