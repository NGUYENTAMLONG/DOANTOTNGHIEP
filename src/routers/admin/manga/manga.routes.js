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
const FroalaEditor = require(path.join(
  appRoot.path,
  "/node_modules/wysiwyg-editor-node-sdk/lib/froalaEditor.js"
));

const router = express.Router();

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

// router.use(bodyParser.json());
// ****************** MANGA MANAGEMENT *************************
//1. Get Page (MANGA MANAGEMENT)
// ex: /management/content/manga - Method: GET
router.get("/", async (req, res) => {
  try {
    const allMangas = await Manga.find({});
    res.render("admin/manga/mangaDashboard", {
      allMangas,
    });
  } catch (error) {
    console.log(error);
    res
      .status(STATUS.SERVER_ERROR)
      .json(new ErrorResponse(ERRORCODE.ERROR_SERVER, MESSAGE.ERROR_SERVER));
  }
});
//paging api
router.get("/api/getList", async (req, res) => {
  const { search, sort, order, offset, limit } = req.query;
  try {
    const mangas = await Manga.find({})
      .populate("contentId", {
        chapters: { $slice: -1 },
      })
      .skip(Number(offset))
      .limit(Number(limit));
    res.status(STATUS.SUCCESS).json({
      rows: mangas,
    });
  } catch (error) {
    console.log(error);
    res
      .status(STATUS.SERVER_ERROR)
      .json(new ErrorResponse(ERRORCODE.ERROR_SERVER, MESSAGE.ERROR_SERVER));
  }
});
//paging deleted api
router.get("/api/getDeletedList", async (req, res) => {
  const { search, sort, order, offset, limit } = req.query;
  try {
    const mangas = await Manga.findDeleted({})
      .populate("contentId", {
        chapters: { $slice: -1 },
      })
      .skip(Number(offset))
      .limit(Number(limit));
    res.status(STATUS.SUCCESS).json({
      rows: mangas,
    });
  } catch (error) {
    console.log(error);
    res
      .status(STATUS.SERVER_ERROR)
      .json(new ErrorResponse(ERRORCODE.ERROR_SERVER, MESSAGE.ERROR_SERVER));
  }
});
//2.Get Page (PUBLISH MANGA)
// ex: /management/content/manga/publish - Method: GET
router.get("/publish", async (req, res) => {
  try {
    res.render("admin/manga/publishManga", {
      moment: moment,
      types: types,
    });
  } catch (error) {
    console.log(error);
    res
      .status(STATUS.SERVER_ERROR)
      .json(new ErrorResponse(ERRORCODE.ERROR_SERVER, MESSAGE.ERROR_SERVER));
  }
});
//3
//MANGA COVER
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

router.post("/publish/cover", uploadManga.single("cover"), async (req, res) => {
  console.log(req.file);
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
  if (
    !name ||
    !anotherName ||
    !author ||
    type.length === 0 ||
    !serve ||
    !status ||
    !description ||
    !image
  ) {
    return res
      .status(STATUS.BAD_REQUEST)
      .json(
        new ErrorResponse(ERRORCODE.ERROR_BAD_REQUEST, MESSAGE.BAD_REQUEST)
      );
  }
  try {
    const initializedChapter = await Chapter.create({});
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
      contentId: initializedChapter._id,
    });
    const createdManga = await newManga.save();
    if (!createdManga) {
      res
        .status(STATUS.SERVER_ERROR)
        .json(new ErrorResponse(ERRORCODE.ERROR_SERVER, MESSAGE.ERROR_SERVER));
    }
    res
      .status(STATUS.CREATED)
      .json(new SuccessResponse(MESSAGE.CREATE_SUCCESS, createdManga));
  } catch (error) {
    console.log(error);
    res
      .status(STATUS.SERVER_ERROR)
      .json(new ErrorResponse(ERRORCODE.ERROR_SERVER, MESSAGE.ERROR_SERVER));
  }
});

//4.UPDATE MANGA
// 4.1 Get PAGE (UPDATE MANGA)
router.get("/updateManga/:slug", async (req, res) => {
  const { slug } = req.params;

  try {
    const foundManga = await Manga.findOne({ slug: slug }).populate(
      "contentId"
    );
    if (!foundManga) {
      redirect(req, res, STATUS.NOT_FOUND);
    }
    res.render("admin/manga/updateManga", {
      moment: moment,
      manga: foundManga,
      types: types,
    });
    console.log(foundManga);
  } catch (error) {
    console.log(error);
    res
      .status(STATUS.SERVER_ERROR)
      .json(new ErrorResponse(ERRORCODE.ERROR_SERVER, MESSAGE.ERROR_SERVER));
  }
});
//4.2
router.post(
  "/updateManga/cover",
  uploadManga.single("cover"),
  async (req, res) => {
    console.log(req.file);
    res.json(req.file);
    //remove old cover of manga
    // fs.unlink(
    //   path.join(appRoot.path, "/src/public/images/" + req.file.filename),
    //   (err) => {
    //     if (err) {
    //       console.error(err);
    //       return;
    //     }
    //     console.log("file removed");
    //   }
    // );
  }
);
router.post("/updateManga/:slug", async (req, res) => {
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
    oldImage,
  } = req.body;
  const slug = req.params.slug;
  if (
    !slug ||
    !name ||
    !anotherName ||
    !author ||
    type.length === 0 ||
    !serve ||
    !status ||
    !description ||
    !oldImage
  ) {
    return res
      .status(STATUS.BAD_REQUEST)
      .json(
        new ErrorResponse(ERRORCODE.ERROR_BAD_REQUEST, MESSAGE.BAD_REQUEST)
      );
  }
  try {
    const payload = {
      name,
      anotherName,
      author,
      type,
      serve,
      status,
      hot,
      description,
    };

    if (image) {
      payload.image = image;
      fs.unlinkSync(
        path.join(appRoot.path, `/src/public/images/${oldImage.split("/")[2]}`)
      );
    }

    await Manga.findOneAndUpdate({ slug: slug }, payload);

    res
      .status(STATUS.CREATED)
      .json(new SuccessResponse(MESSAGE.CREATE_SUCCESS, null));
  } catch (error) {
    console.log(error);
    res
      .status(STATUS.SERVER_ERROR)
      .json(new ErrorResponse(ERRORCODE.ERROR_SERVER, MESSAGE.ERROR_SERVER));
  }
});

// 5. Soft Delete (Manga)
router.delete("/deleteManga/:slug", async (req, res) => {
  const slug = req.params.slug;
  if (!slug) {
    return res
      .status(STATUS.BAD_REQUEST)
      .json(
        new ErrorResponse(ERRORCODE.ERROR_BAD_REQUEST, MESSAGE.BAD_REQUEST)
      );
  }
  try {
    //note : no unlink image cover

    await Manga.delete({ slug: slug });

    res
      .status(STATUS.CREATED)
      .json(new SuccessResponse(MESSAGE.DELETE_SUCCESS, null));
  } catch (error) {
    console.log(error);
    res
      .status(STATUS.SERVER_ERROR)
      .json(new ErrorResponse(ERRORCODE.ERROR_SERVER, MESSAGE.ERROR_SERVER));
  }
});

//6 Trash dashboard
router.get("/trash", async (req, res) => {
  try {
    const foundMangas = await Manga.findDeleted({}).populate("contentId");
    res.render("admin/manga/mangaTrash", {
      mangas: foundMangas,
    });
  } catch (error) {
    console.log(error);
    res
      .status(STATUS.SERVER_ERROR)
      .json(new ErrorResponse(ERRORCODE.ERROR_SERVER, MESSAGE.ERROR_SERVER));
  }
});
//7. Get All chapters of deleted Manga - Method: GET

router.get("/deletedManga/allChapters/:id", async (req, res) => {
  const id = req.params.id;
  if (!id) {
    return res
      .status(STATUS.BAD_REQUEST)
      .json(
        new ErrorResponse(ERRORCODE.ERROR_BAD_REQUEST, MESSAGE.BAD_REQUEST)
      );
  }
  try {
    const chapters = await Chapter.findById(id);
    res
      .status(STATUS.SUCCESS)
      .json(new SuccessResponse(MESSAGE.SUCCESS, chapters));
  } catch (error) {
    console.log(error);
    res
      .status(STATUS.SERVER_ERROR)
      .json(new ErrorResponse(ERRORCODE.ERROR_SERVER, MESSAGE.ERROR_SERVER));
  }
});

//8. Restore Manga - Method: PATCH
router.patch("/restoreManga/:slug", async (req, res) => {
  const slug = req.params.slug;
  if (!slug) {
    return res
      .status(STATUS.BAD_REQUEST)
      .json(
        new ErrorResponse(ERRORCODE.ERROR_BAD_REQUEST, MESSAGE.BAD_REQUEST)
      );
  }
  try {
    await Manga.restore({ slug: slug });
    res
      .status(STATUS.SUCCESS)
      .json(new SuccessResponse(MESSAGE.RESTORE_SUCCESS, null));
  } catch (error) {
    console.log(error);
    res
      .status(STATUS.SERVER_ERROR)
      .json(new ErrorResponse(ERRORCODE.ERROR_SERVER, MESSAGE.ERROR_SERVER));
  }
});
//9. Destroy Manga - Method: DELETE
router.delete("/destroyManga/:slug", async (req, res) => {
  const slug = req.params.slug;
  const { contentId, imgName } = req.body;
  if (!slug) {
    return res
      .status(STATUS.BAD_REQUEST)
      .json(
        new ErrorResponse(ERRORCODE.ERROR_BAD_REQUEST, MESSAGE.BAD_REQUEST)
      );
  }
  try {
    await Manga.findOneAndDelete({ slug: slug });
    await Chapter.findByIdAndDelete(contentId);
    // remove old cover of manga
    fs.unlinkSync(path.join(appRoot.path, `/src/public/images/${imgName}`));

    fs.rmSync(path.join(appRoot.path, `/src/public/mangas/${slug}/`), {
      recursive: true,
    });
    //Note : SLIDE !!!!!!
    res
      .status(STATUS.CREATED)
      .json(new SuccessResponse(MESSAGE.DELETE_SUCCESS, null));
  } catch (error) {
    console.log(error);
    redirect(req, res, STATUS.SERVER_ERROR);
  }
});
// ****************** UPDATE MANGA *************************
//1. Get Page (UPDATE MANGA)

// ****************** DELETE MANGA *************************

// ****************** DASHBOARD MANGA *************************
//1. Get Dashboard MangaPage (DASHBOARD MANGA)
//ex: /manage/admin_manga/manga
// router.get("/", PagingModel(Manga), async (req, res) => {
//   try {
//     const mangas = req.handlePaging;
//     // const mangas = await Manga.find();
//     res.render("admin/manage_manga", {
//       mangas: mangas.resultPage,
//       another: mangas,
//     });
//   } catch (error) {
//     console.log(error);
//     res.status(500).json({ status: "error", error: error });
//   }
// });

// ****************** CHAPTER MANAGEMENT *************************
//1.Get chapters by chapterId

//2. Get all chapters of manga
//ex: /management/content/manga/allchapters/:id
router.get("/allchapters/:id", async (req, res) => {
  const id = req.params.id;
  try {
    const chapters = await Chapter.findById(id);
    res
      .status(STATUS.SUCCESS)
      .json(new SuccessResponse(MESSAGE.SUCCESS, chapters));
  } catch (error) {
    console.log(error);
    res
      .status(STATUS.SERVER_ERROR)
      .json(new ErrorResponse(ERRORCODE.ERROR_SERVER, MESSAGE.ERROR_SERVER));
  }
});

//3. GET Publish (chapters) Page
//ex: /management/content/manga/post/:slug - Method: GET
router.get("/post/:slug", async (req, res) => {
  const slug = req.params.slug;
  try {
    const manga = await Manga.findOne({ slug: slug }).populate("contentId");
    res
      .status(STATUS.SUCCESS)
      .render("admin/manga/post", { manga: manga, moment: moment });
  } catch (error) {
    console.log(error);
    res
      .status(STATUS.SERVER_ERROR)
      .json(new ErrorResponse(ERRORCODE.ERROR_SERVER, MESSAGE.ERROR_SERVER));
  }
});
//4. Initialize chapter repo
//ex: /mangament/content/manga/post/:slug/init - Method:POST
router.post("/post/:slug/init", async (req, res) => {
  const { chapterId, chapterNumber, chapterName } = req.body;
  try {
    const chapterRepository = await Chapter.findById(chapterId);
    const checkChapter = chapterRepository.chapters.find(
      (chapter) => chapter.chapterNumber === parseFloat(chapterNumber)
    );
    if (checkChapter) {
      return res
        .status(STATUS.BAD_REQUEST)
        .json(
          new ErrorResponse(ERRORCODE.ERROR_BAD_REQUEST, MESSAGE.CREATE_FAIL)
        );
    }
    const initData = {
      chapterNumber: parseFloat(chapterNumber),
      chapterName: chapterName,
      chapterContent: "",
      createdTime: moment().format(),
      updatedTime: moment().format(),
    };

    await Chapter.findByIdAndUpdate(chapterId, {
      $push: { chapters: initData },
    });

    res
      .status(STATUS.SUCCESS)
      .json(new SuccessResponse(MESSAGE.SUCCESS, chapterRepository));
  } catch (error) {
    console.log(error);
    res
      .status(STATUS.SERVER_ERROR)
      .json(new ErrorResponse(ERRORCODE.ERROR_SERVER, MESSAGE.ERROR_SERVER));
  }
});
//5. Publish chapter
//ex: /management/content/manga/post/:slug/add/:chapterNumber- Method: POST
router.post("/post/:slug/add/:chapterNumber", async (req, res) => {
  // const slug = req.params.slug;
  // const chapterNumber = req.params.chapterNumber;

  // try {
  // const manga = await Manga.findOne({ slug: slug }).populate("contentId");
  // const manga = await Manga.findOne({ slug: slug }).populate("contentId");

  //   res
  //     .status(STATUS.SUCCESS)
  //     .render("admin/manga/post", { manga: manga, moment: moment });
  // } catch (error) {
  //   console.log(error);
  //   res
  //     .status(STATUS.SERVER_ERROR)
  //     .json(new ErrorResponse(ERRORCODE.ERROR_SERVER, MESSAGE.ERROR_SERVER));
  // }

  // Store image.
  const { slug, chapterNumber } = req.params;

  fs.mkdir(
    path.join(
      appRoot.path,
      `/src/public/mangas/${slug}/chapter-${chapterNumber}/`
    ),
    { recursive: true },
    (err) => {
      if (err) {
        return console.error(err);
      }
      FroalaEditor.Image.upload(
        req,
        `/public/mangas/${slug}/chapter-${chapterNumber}/`,
        function (err, data) {
          if (err) {
            console.log(err);
            return res.send(JSON.stringify(err));
          }
          res.send(data);
        }
      );
    }
  );
});
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

//6. Submit chapter content
//ex:/management/content/manga/post/:slug/submit/:chapterNumber- Method: POST
router.post("/submit/:chapterNumber", async (req, res) => {
  const { chapterNumber } = req.params;
  const { chapterId, chapterContent } = req.body;
  try {
    await Chapter.findOneAndUpdate(
      { _id: chapterId, "chapters.chapterNumber": Number(chapterNumber) },
      {
        $set: {
          "chapters.$.chapterContent": chapterContent,
          "chapters.$.createdTime": moment().format(),
          "chapters.$.updatedTime": moment().format(),
        },
      }
    );
    await Chapter.findOneAndUpdate(
      { _id: chapterId },
      { $push: { chapters: { $each: [], $sort: 1 } } }
    );
    res
      .status(STATUS.SUCCESS)
      .json(new SuccessResponse(MESSAGE.UPDATE_SUCCESS, null));
  } catch (error) {
    console.log(error);
    res
      .status(STATUS.SERVER_ERROR)
      .json(new ErrorResponse(ERRORCODE.ERROR_SERVER, MESSAGE.ERROR_SERVER));
  }
});
//7. Remove image chapter
//ex: /management/content/manga/post/:slug/remove/:chapterNumber - Method:DELETE
router.delete("/post/:slug/remove/:chapterNumber", async (req, res) => {
  fs.unlink(path.join(appRoot.path + "/src/", req.body.path), function (error) {
    if (error) {
      console.log(error);
      return res
        .status(STATUS.SERVER_ERROR)
        .json(new ErrorResponse(ERRORCODE.ERROR_SERVER, MESSAGE.ERROR_SERVER));
    }
    // if no error, file has been deleted successfully
    return res
      .status(STATUS.SUCCESS)
      .json(new SuccessResponse(MESSAGE.DELETE_SUCCESS, null));
  });
});
//8. Delete chapter
//ex: /management/content/manga/deleteChapter - Method:DELETE
router.delete("/deleteChapter", async (req, res) => {
  const { manga, chapterId, chapterNumber } = req.body;
  try {
    await Chapter.findOneAndUpdate(
      { _id: chapterId },
      { $pull: { chapters: { chapterNumber: Number(chapterNumber) } } }
    );
    fs.rm(
      path.join(
        appRoot.path,
        `/src/public/mangas/${manga}/chapter-${chapterNumber}/`
      ),
      {
        recursive: true,
      },
      function (error) {
        if (error) {
          console.log(error);
        }
        // if no error, file has been deleted successfully
        return res
          .status(STATUS.SUCCESS)
          .json(new SuccessResponse(MESSAGE.DELETE_SUCCESS, null));
      }
    );
  } catch (error) {
    console.log(error);
    return res
      .status(STATUS.SERVER_ERROR)
      .json(new ErrorResponse(ERRORCODE.ERROR_SERVER, MESSAGE.ERROR_SERVER));
  }
});
//9. Move to Update chapter page
//ex: /management/content/manga/updateChapter - Method:POST
router.post("/updateChapter", async (req, res) => {
  const { manga, chapterId, chapterNumber } = req.body;
  try {
    const foundManga = await Manga.findOne({ slug: manga }).populate(
      "contentId"
    );
    const foundChapter = await Chapter.findOne(
      {
        _id: chapterId,
      },
      {
        chapters: {
          $elemMatch: {
            chapterNumber: Number(chapterNumber),
          },
        },
      }
    );
    res.render("admin/manga/updateChapter", {
      moment: moment,
      manga: foundManga,
      chapter: foundChapter.chapters[0],
    });
  } catch (error) {
    console.log(error);
    return res
      .status(STATUS.SERVER_ERROR)
      .json(new ErrorResponse(ERRORCODE.ERROR_SERVER, MESSAGE.ERROR_SERVER));
  }
});

//10. Update title
//ex: /management/content/manga/updateChapter/fixTitle - Method:POST
router.post("/updateChapter/fixTitle", async (req, res) => {
  const { chapterId, chapterNumber, chapterName, oldChapterNumber, manga } =
    req.body;
  try {
    const foundChapter = await Chapter.findOne(
      {
        _id: chapterId,
      },
      {
        chapters: {
          $elemMatch: {
            chapterNumber: Number(oldChapterNumber),
          },
        },
      }
    );
    const replaceContent = foundChapter.chapters[0].chapterContent.replaceAll(
      `chapter-${oldChapterNumber}`,
      `chapter-${chapterNumber}`
    );
    const initData = {
      chapterNumber: parseFloat(chapterNumber),
      chapterName: chapterName,
      chapterContent: replaceContent,
      createdTime: foundChapter.chapters[0].createdTime,
      updatedTime: moment().format(),
    };

    await Chapter.findByIdAndUpdate(chapterId, {
      $push: { chapters: initData },
    });

    await Chapter.findOneAndUpdate(
      { _id: chapterId },
      {
        $pull: {
          chapters: { chapterNumber: foundChapter.chapters[0].chapterNumber },
        },
      }
    );
    await Chapter.findOneAndUpdate(
      { _id: chapterId },
      { $push: { chapters: { $each: [], $sort: 1 } } }
    );

    fs.rename(
      path.join(
        appRoot.path,
        `/src/public/mangas/${manga}/chapter-${oldChapterNumber}/`
      ),
      path.join(
        appRoot.path,
        `/src/public/mangas/${manga}/chapter-${chapterNumber}/`
      ),
      function (err) {
        if (err) {
          console.log(error);
          return res
            .status(STATUS.ERROR_SERVER)
            .json(
              new ErrorResponse(ERRORCODE.ERROR_SERVER, MESSAGE.ERROR_SERVER)
            );
        } else {
          console.log("Successfully renamed the folder.");
        }
      }
    );

    res
      .status(STATUS.SUCCESS)
      .json(new SuccessResponse(MESSAGE.UPDATE_SUCCESS, replaceContent));
  } catch (error) {
    console.log(error);
    return res
      .status(STATUS.SERVER_ERROR)
      .json(new ErrorResponse(ERRORCODE.ERROR_SERVER, MESSAGE.ERROR_SERVER));
  }
});

//11. Submit Update chapter content
//ex:/management/content/manga/post/:slug/submit/update/:chapterNumber- Method: POST
router.post("/submit/update/:chapterNumber", async (req, res) => {
  const { chapterNumber } = req.params;
  const { chapterId, chapterContent } = req.body;
  try {
    await Chapter.findOneAndUpdate(
      { _id: chapterId, "chapters.chapterNumber": Number(chapterNumber) },
      {
        $set: {
          "chapters.$.chapterContent": chapterContent,
          "chapters.$.updatedTime": moment().format(),
        },
      }
    );
    await Chapter.findOneAndUpdate(
      { _id: chapterId },
      { $push: { chapters: { $each: [], $sort: 1 } } }
    );
    res
      .status(STATUS.SUCCESS)
      .json(new SuccessResponse(MESSAGE.UPDATE_SUCCESS, null));
  } catch (error) {
    console.log(error);
    res
      .status(STATUS.SERVER_ERROR)
      .json(new ErrorResponse(ERRORCODE.ERROR_SERVER, MESSAGE.ERROR_SERVER));
  }
});
// **************** Chapter Routes/Controller ****************
// ********** Publish Manga Chapter ***************

// ***************** DELETE CHAPTER ************************

module.exports = router;
