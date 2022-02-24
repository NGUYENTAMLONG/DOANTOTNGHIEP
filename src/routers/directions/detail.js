const express = require("express");
const { showDetailManga } = require("../../controllers/DetailController");
const Manga = require("../../models/Manga");
const router = express.Router();

router.get("/:slug/read/:chapter", async (req, res) => {
  try {
    const manga = await Manga.findOne({ slug: req.params.slug });
    const chapterNumber = req.params.chapter.split("-")[1];
    res.render("read", {
      manga,
      chapter: manga.chapters.filter(
        (chapter) => chapter.chapterNumber == chapterNumber
      )[0],
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ status: "error", error: error });
  }
});
router.get("/:slug", showDetailManga);

module.exports = router;
