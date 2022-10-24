const express = require("express");
const moment = require("moment");
const path = require("path");
const fs = require("fs");
const appRoot = require("app-root-path");
const Manga = require("../../../models/Manga");
const Chapter = require("../../../models/Chapter");
const { STATUS, ERRORCODE, MESSAGE } = require("../../../config/httpResponse");
const { ErrorResponse, SuccessResponse } = require("../../../helper/response");
const multer = require("multer");
const { types, PAGING } = require("../../../config/default");
const { redirect } = require("../../../service/redirect");
const {
  getMangaDashboard,
  getMangaList,
  getDeletedMangaList,
  getPublishPage,
  publishManga,
  getUpdatePage,
  updateManga,
  softDeleteManga,
  getTrashPage,
  getAllChaptersOfDeletedManga,
  restoreManga,
  destroyManga,
  getAllChaptersOfManga,
  getPublishChapterPage,
  initChapterRepo,
  streamImagesOfChapter,
  submitChapterContent,
  streamDeleteImageOfChapter,
  deleteChapter,
  updateChapter,
  fixChapterNumber,
  fixChapterContent,
  deleteChecked,
  restoreChecked,
  getMangaAnalysis,
  fixChapterName,
  getSwapChapterPage,
  updateSwapChapter,
} = require("../../../controllers/MangaController");
const FroalaEditor = require(path.join(
  appRoot.path,
  "/node_modules/wysiwyg-editor-node-sdk/lib/froalaEditor.js"
));

const router = express.Router();

const storageCover = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(appRoot.path, "/src/public/images"));
  },
  filename: (req, file, cb) => {
    console.log(file);
    req.file = file;
    cb(null, Date.now() + path.extname(file.originalname));
  },
});
const uploadManga = multer({ storage: storageCover });

router.get("/api/mangas/:id", async (req, res) => {
  const mangaId = req.params.id;
  try {
    const foundManga = await Manga.findById(mangaId);
    res
      .status(STATUS.SUCCESS)
      .json(new SuccessResponse(MESSAGE.SUCCESS, foundManga));
  } catch (error) {
    console.log(error);
    res
      .status(STATUS.SERVER_ERROR)
      .json(new ErrorResponse(ERRORCODE.ERROR_SERVER, MESSAGE.ERROR_SERVER));
  }
});

//2. Get All Types
router.get("/api/get-types", (req, res) => {
  // try {
  //   const foundTypes = await Manga.fin
  // } catch (error) {
  //   console.log(error)
  // }
  res.status(200).json(types);
});
// router.use(bodyParser.json());
// ****************** MANGA MANAGEMENT *************************
//1. Get Page (MANGA MANAGEMENT)
// ex: /management/content/manga - Method: GET
router.get("/", getMangaDashboard);
//paging api
router.get("/api/getList", getMangaList);
//paging deleted api
router.get("/api/getDeletedList", getDeletedMangaList);
//2. Publish Manga
//2.1 Get Publish Page (PUBLISH MANGA)
// ex: /management/content/manga/publish - Method: GET
router.get("/publish", getPublishPage);
//2.2 Publish Cover Manga - Middleware upload Image (cover)
// ex: /management/content/manga/publish/cover - Method: POST
router.post("/publish/cover", uploadManga.single("cover"), async (req, res) => {
  console.log(req.file);
  res.json(req.file);
});
//2.3 Publish Manga
// ex: /management/content/manga/publish - Method: POST
router.post("/publish", publishManga);

//3.UPDATE MANGA
// 3.1 Get PAGE (UPDATE MANGA)
// ex: /management/content/manga/updateManga/:slug - Method: GET
router.get("/updateManga/:slug", getUpdatePage);
//3.2 Middleware Update Upload Cover
// ex: /management/content/manga/updateManga/cover - Method: POST
router.post(
  "/updateManga/cover",
  uploadManga.single("cover"),
  async (req, res) => {
    console.log(req.file);
    res.json(req.file);
  }
);
//3.3 Update Manga
// ex: /management/content/manga/updateManga/:slug - Method: POST
router.patch("/updateManga/:slug", updateManga);

// 4. Soft Delete Manga
// ex: /management/content/manga/deleteManga/:slug - Method: DELETE
router.delete("/deleteManga/:slug", softDeleteManga);

//6 Trash dashboard
// ex: /management/content/manga/trash - Method: GET
router.get("/trash", getTrashPage);
//7. Get All chapters of deleted Manga
// ex: /management/content/manga/deletedManga/allChapters/:id - Method: GET
router.get("/deletedManga/allChapters/:id", getAllChaptersOfDeletedManga);

//8. Restore Manga
// ex: /management/content/manga/restoreManga/:slug - Method: PATCH
router.patch("/restoreManga/:slug", restoreManga);
//9. Destroy Manga - Method: DELETE
// ex: /management/content/manga/destroyManga/:slug - Method: DELETE
router.delete("/destroyManga/:slug", destroyManga);
//10. Get All Chapter of Manga
// ex: /management/content/manga/allchapters/:id - Method: GET
router.get("/allchapters/:id", getAllChaptersOfManga);

//11. Get Publish (chapters) Page
//ex: /management/content/manga/post/:slug - Method: GET
router.get("/post/:slug", getPublishChapterPage);
//4. Initialize chapter repo
//ex: /mangament/content/manga/post/:slug/init - Method:POST
router.post("/post/:slug/init", initChapterRepo);
//5. Publish chapter
//5.1 Stream Images of Chapter
//ex: /management/content/manga/post/:slug/add/:chapterNumber- Method: POST
router.post("/post/:slug/add/:chapterNumber", streamImagesOfChapter);
// router.post("/post/:slug/addFile/:chapterNumber", async (req, res) => {
//   const { slug, chapterNumber } = req.params;

//   fs.mkdir(
//     path.join(
//       appRoot.path,
//       `/src/public/mangas/${slug}/chapter-${chapterNumber}/`
//     ),
//     { recursive: true },
//     (err) => {
//       if (err) {
//         return console.error(err);
//       }
//       FroalaEditor.File.upload(
//         req,
//         `/public/mangas/${slug}/chapter-${chapterNumber}/`,
//         function (err, data) {
//           if (err) {
//             console.log(err);
//             return res.send(JSON.stringify(err));
//           }
//           res.send(data);
//         }
//       );
//     }
//   );
// });

//5.2 Submit chapter content
//ex:/management/content/manga/post/:slug/submit/:chapterNumber- Method: POST
router.post("/submit/:chapterNumber", submitChapterContent);
//7. Remove image chapter
//ex: /management/content/manga/post/:slug/remove/:chapterNumber - Method:DELETE
router.delete("/post/:slug/remove/:chapterNumber", streamDeleteImageOfChapter);
//8. Delete chapter
//ex: /management/content/manga/deleteChapter - Method:DELETE
router.delete("/deleteChapter", deleteChapter);
//9. Move to Update chapter page
//ex: /management/content/manga/updateChapter - Method:POST
router.post("/updateChapter", updateChapter);
router.get("/updateChapter/:manga/:chapterId/:chapterNumber", updateChapter);

//10. Update title
//ex: /management/content/manga/updateChapter/fixTitle - Method:POST
router.patch("/updateChapter/fixChapterNumber", fixChapterNumber);
router.patch("/updateChapter/fixChapterName", fixChapterName);

//11. Submit Update chapter content
//ex:/management/content/manga/post/:slug/submit/update/:chapterNumber- Method: POST
router.patch("/submit/update/:chapterNumber", fixChapterContent);

router.delete("/deleteChecked", deleteChecked);
router.patch("/restoreChecked", restoreChecked);
//12. Get swap chapter page
router.get("/swap/:mangaId", getSwapChapterPage);
//13. Update swap
router.patch("/swap/:chapterId", updateSwapChapter);

//1. Get Page (MANGA ANALYSIS)
// ex: /management/content/manga/analysis - Method: GET
router.get("/analysis", getMangaAnalysis);

module.exports = router;
