const express = require("express");
const multer = require("multer");
const path = require("path");
const appRoot = require("app-root-path");
const bodyParser = require("body-parser");
const imgbbUploader = require("imgbb-uploader");
const Manga = require("../../../../models/Manga");
const getTime = require("../../../../helper/getTime");
const clearImg = require("../../../../helper/clearImg");
const { PagingModel } = require("../../../../middleware/paging");
const {
  checkChapterNumber,
} = require("../../../../middleware/validateChapter");
const router = express.Router();

// **************** Chapter Routes/Controller ****************

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "images/chapters");
  },
  filename: (req, file, cb) => {
    const newName =
      req.params.slug +
      `-${req.params.chapter}-` +
      Date.now() +
      path.extname(file.originalname);
    cb(null, newName);

    const options = {
      apiKey: "fdda0f569f21b3ba10f0049d856be914",
      imagePath: appRoot + "/images/chapters/" + newName,
      name: newName,
    };
    imgbbUploader(options)
      .then((response) => {
        // console.log(response.display_url);
        const dateTime = getTime();
        async function myUpdate() {
          try {
            const updateImg = await Manga.findOneAndUpdate(
              {
                slug: req.params.slug,
                "chapters.chapterNumber": Number(req.params.chapter),
              },
              { $push: { "chapters.$.chapterImages": response.display_url } }
            );
            const updateTime = await Manga.findOneAndUpdate(
              {
                slug: req.params.slug,
                "chapters.chapterNumber": Number(req.params.chapter),
              },
              { $set: { "chapters.$.chapterUpdate": dateTime } }
            );
            clearImg(newName);
          } catch (error) {
            console.error(error);
          }
        }
        myUpdate();
      })
      .catch((error) => console.error(error));
  },
});
const upload = multer({ storage: storage }); //for manga

// GET -> LAST Chapter of manga by slug
// ex: /manage/admin_manga/manga/one-piece/chapterImg
router.get("/:slug/chapterImg", async (req, res) => {
  try {
    const manga = await Manga.findOne({ slug: req.params.slug });
    const images = manga.chapters[manga.chapters.length - 1].chapterImages;
    res.json({ images: images });
  } catch (error) {
    console.log(error);
  }
});

// GET Add Chapter Page
router.get("/:slug/add_chapter", async (req, res) => {
  try {
    const manga = await Manga.findOne({ slug: req.params.slug });
    res.render("admin/manga/addChapter", { manga });
  } catch (error) {
    console.log(error);
    res.status(500).json({ status: "error", error: error });
  }
});
// ********** Publish Manga Chapter ***************
router.post(
  "/:slug/add_chapterImg/:chapter",
  upload.single("chapterImg"),
  async (req, res) => {
    try {
      const manga = await Manga.findOne({ slug: req.params.slug });
      const images = manga.chapters[req.params.chapter - 1].chapterImages;
      res.json({ images: images });
    } catch (error) {
      console.log(error);
    }
  }
);
router.post(
  "/:slug/add_chapter/:chapter",
  checkChapterNumber,
  async (req, res) => {
    var chapter = {
      chapterName: req.body.chapterName,
      chapterNumber: Number(req.body.chapterNumber),
      chapterImages: [],
      chapterUpdate: "",
    };
    Manga.findOneAndUpdate(
      { slug: req.params.slug },
      { $push: { chapters: chapter } }
    )
      .then((data) => res.json({ result: "Success" }))
      .catch((error) => console.log(error));
  }
);

// ***************** DELETE CHAPTER ************************
router.delete("/:slug/deleteChapter/:chapter", async (req, res) => {
  try {
    const deleteChapter = await Manga.findOneAndUpdate(
      { slug: req.params.slug },
      {
        $pull: {
          chapters: { chapterNumber: Number(req.params.chapter) },
        },
      }
    );
    if (!deleteChapter) {
      res.json({
        flag: false,
        result: "Something went wrong while Deleting !!!",
      });
    }
    res.json({ flag: true, result: "Deleted Successful !!!" });
  } catch (error) {
    console.log(error);
  }
});

// ****************** POST MANGA - PUBLISH MANGA *************************
//1. Get Page (PUBLISH MANGA)
// ex: manage/admin_manga/manga/publish
router.get("/publish", async (req, res) => {
  try {
    res.render("admin/manga/publishManga");
  } catch (error) {
    console.log(error);
  }
});
//MANGA COVER
const storageCover = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "src/public/images");
  },
  filename: (req, file, cb) => {
    console.log(file);
    cb(null, Date.now() + path.extname(file.originalname));
  },
});
const uploadManga = multer({ storage: storageCover });
//2. POST MANGA
//ex: manage/admin_manga/manga/publish
router.post("/publish/cover", uploadManga.single("cover"), async (req, res) => {
  res.json(req.file);
});
router.post("/publish", async (req, res) => {
  const {
    name,
    anotherName,
    author,
    type,
    serve,
    status,
    hot,
    description,
    image,
  } = req.body;
  const newManga = new Manga({
    name,
    anotherName,
    author,
    type,
    serve,
    status,
    hot,
    description,
    image,
  });
  try {
    const createdManga = await newManga.save();
    if (!createdManga) {
      res.status(500).json("SOMETHING WENT WRONG WHILE CREATING MANGA");
    }
    res.status(200).json({ flag: true, result: createdManga });
  } catch (error) {
    console.log(error);
    res.status(500).json("ERROR");
  }
});
// ****************** UPDATE MANGA *************************
//1. Get Page (UPDATE MANGA)
router.get("/:slug/update_manga", async (req, res) => {
  try {
    const manga = await Manga.findOne({ slug: req.params.slug });
    res.render("admin/manga/updateManga", { manga });
  } catch (error) {
    console.log(error);
  }
});
// ****************** DELETE MANGA *************************
//1. DELETE Manga by Id
// ex: /manage/admin_manga/manga/6223063c8a33d9fb7f629515 (method: DELETE)
router.delete("/:id", async (req, res) => {
  try {
    const deletedManga = await Manga.findByIdAndDelete(req.params.id);
    if (!deletedManga) {
      res.json({
        flag: false,
        result: "Something went wrong while Manga Deleting  !!!",
      });
    }
    res.json({ flag: true, result: "Deleted Successful !!!" });
  } catch (error) {
    console.log(error);
  }
});
// ****************** GET MANGA *************************
//1. Get Manga by Id
// ex: /manage/admin_manga/manga/6223063c8a33d9fb7f629515
router.get("/:id", async (req, res) => {
  try {
    const manga = await Manga.findOne({
      _id: req.params.id,
    });
    res.json(manga);
  } catch (error) {
    console.log(error);
    res.status(500).json({ status: "error", error: error });
  }
});
// ****************** DASHBOARD MANGA *************************
//1. Get Dashboard MangaPage (DASHBOARD MANGA)
//ex: /manage/admin_manga/manga
router.get("/", PagingModel(Manga), async (req, res) => {
  try {
    const mangas = req.handlePaging;
    // const mangas = await Manga.find();
    res.render("admin/manage_manga", { mangas: mangas.resultPage });
  } catch (error) {
    console.log(error);
    res.status(500).json({ status: "error", error: error });
  }
});
module.exports = router;
