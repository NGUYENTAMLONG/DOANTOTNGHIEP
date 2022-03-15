const express = require("express");
// const { findByIdAndUpdate, findById } = require("../../../models/Manga");
const router = express.Router();
// router.use(bodyParser.json());
const mangaRouter = require("./manga/mangaRoute");

const Slide = require("../../../models/Slide");
// *************** Slide Controller ***********
const slideRouter = require("./manga/slideRoute");
router.use("/slide", slideRouter);
// show dashboard page
router.get("/slideDashboard", async (req, res) => {
  try {
    const slides = await Slide.find().populate("manga");
    res.render("admin/slide/slideDashboard", { slides });
  } catch (error) {
    console.log(error);
  }
});
// *************** Manga Controller ***********
// *******************************
router.use("/manga", mangaRouter);

module.exports = router;
