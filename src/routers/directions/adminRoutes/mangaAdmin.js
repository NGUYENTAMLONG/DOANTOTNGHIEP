const express = require("express");
const {
  createSlide,
  updateSlide,
  findAllSlides,
  deleteSlide,
  findSlideById,
} = require("../../../controllers/MangaController");
const { findByIdAndUpdate, findById } = require("../../../models/Manga");
const Manga = require("../../../models/Manga");
const bodyParser = require("body-parser");
const multer = require("multer");
const path = require("path");

const router = express.Router();
router.use(bodyParser.json());
//upload file
const appRoot = require("app-root-path");
// console.log(appRoot + "/images/users/1645111053284.jpg");
const imgbbUploader = require("imgbb-uploader");
const { checkChapterNumber } = require("../../../middleware/validateChapter");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "images/chapters");
  },
  filename: (req, file, cb) => {
    const newName =
      req.params.slug + Date.now() + path.extname(file.originalname);
    cb(null, newName);
    console.log(req.params.slug);
    // imgbbUploader(
    //   "fdda0f569f21b3ba10f0049d856be914",
    //   appRoot + "/images/chapters/" + newName
    // )
    //   .then((response) => console.log(response.display_url))
    //   .catch((error) => console.error(error));
    // console.log(appRoot);
  },
});
const upload = multer({ storage: storage }).array("chapterImg", 15); //for admin

// *************** Slide Controller ***********
// route: /manage/admin_manga/slide/
// GET - Find all slides
router.get("/slide", findAllSlides);
router.get("/slide/:id", findSlideById);
router.post("/slide", createSlide);
router.put("/slide/:id", updateSlide);
router.delete("/slide/:id", deleteSlide);
// *************** Manga Controller ***********
// route: /manage/admin_manga/

router.get("/:id", async (req, res) => {
  // let chapter = {
  //   chapterName: "Gomu Gomu noooo",
  //   chapterNumber: 3,
  //   chapterImages: ["https://i.ibb.co/6gjLz34/image.jpg"],
  // };
  // try {
  //   const manga = await Manga.findByIdAndUpdate(
  //     { _id: req.params.id },
  //     { $push: { chapters: chapter } }
  //   );
  //   res.json(manga);
  // } catch (error) {
  //   console.log(error);
  //   res.status(500).json({ status: "error", error: error });
  // }

  try {
    const manga = await Manga.findById({ _id: req.params.id });
    res.json(manga);
  } catch (error) {
    console.log(error);
    res.status(500).json({ status: "error", error: error });
  }
});
router.get("/:slug/add_chapter", async (req, res) => {
  try {
    const manga = await Manga.findOne({ slug: req.params.slug });
    // res.json(mangas);
    res.render("admin/manga/add", { manga });
  } catch (error) {
    console.log(error);
    res.status(500).json({ status: "error", error: error });
  }
});
router.post("/:slug/add_chapter", async (req, res) => {
  upload(req, res, function (err) {
    if (err) {
      return res.end("Error uploading file.");
    }
    res.end("File is uploaded");
  });
});
router.post(
  "/:slug/add_chapter/:chapter",
  checkChapterNumber,
  async (req, res) => {
    var chapter = {
      chapterName: req.body.chapterName,
      chapterNumber: Number(req.body.chapterNumber),
      chapterImages: [],
      // chapterImages: [
      //   "https://i.ibb.co/pd9sxRD/8d0d17555798.jpg",
      //   "https://i.ibb.co/fM17cFz/6fb60bb9d971.jpg",
      //   "https://i.ibb.co/CMdPQd8/2904e064b3c7.jpg",
      //   "https://i.ibb.co/n1tVFFL/28c0fb58f8d6.jpg",
      // ],
    };
    Manga.findOneAndUpdate(
      { slug: req.params.slug },
      { $push: { chapters: chapter } }
    )
      .then((data) => res.json({ result: "Success" }))
      .catch((error) => console.log(error));
  }
);
router.get("/", async (req, res) => {
  try {
    const mangas = await Manga.find();
    // res.json(mangas);
    res.render("admin/manage_manga", { mangas });
  } catch (error) {
    console.log(error);
    res.status(500).json({ status: "error", error: error });
  }
});

module.exports = router;
