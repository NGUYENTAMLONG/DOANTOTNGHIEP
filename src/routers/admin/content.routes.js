const express = require("express");
const Chapter = require("../../models/Chapter");
const Manga = require("../../models/Manga");
const Slide = require("../../models/Slide");

const router = express.Router();

const mangaRouter = require("./manga/manga.routes");
const slideRouter = require("./manga/slide.routes");

//path: /management/content/...
router.use("/manga", mangaRouter);

router.use("/slide", slideRouter);

router.use("/", async (req, res) => {
  try {
    const mangas = await Manga.find();
    const slides = await Slide.find();
    const chapters = await Chapter.find();
    res.render("./admin/contentDashboard", {
      mangas: mangas,
      slides: slides,
    });
  } catch (error) {
    console.log(error);
    res.json(error);
  }
});
module.exports = router;
