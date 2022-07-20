const Slide = require("../models/Slide");
const jwt = require("jsonwebtoken");
const { VALUES, types } = require("../config/default");
const moment = require("moment");
const Manga = require("../models/Manga");
const Chapter = require("../models/Chapter");
const { STATUS, ERRORCODE, MESSAGE } = require("../config/httpResponse");
const { ErrorResponse, SuccessResponse } = require("../helper/response");
const { redirect } = require("../service/redirect");
const path = require("path");
const fs = require("fs");
const appRoot = require("app-root-path");
const FroalaEditor = require(path.join(
  appRoot.path,
  "/node_modules/wysiwyg-editor-node-sdk/lib/froalaEditor.js"
));

class MangaController {
  //RENDER
  //1. Get Page (MANGA MANAGEMENT)
  // route: /management/content/manga - Method: GET
  async getMangaDashboard(req, res) {
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
  }
  //2. Get Publish Page
  //route: /management/content/manga/publish
  async getPublishPage(req, res) {
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
  }
  //3.Get Update Page
  //route: /management/content/manga/updateManga/:slug
  async getUpdatePage(req, res) {
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
    } catch (error) {
      console.log(error);
      res
        .status(STATUS.SERVER_ERROR)
        .json(new ErrorResponse(ERRORCODE.ERROR_SERVER, MESSAGE.ERROR_SERVER));
    }
  }
  //4. Get Trash Page
  async getTrashPage(req, res) {
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
  }
  //5. Get Publish Chapter Manga Page
  async getPublishChapterPage(req, res) {
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
  }
  //API
  //1. Get Manga List with paging
  // route: /management/content/manga/api/getList - Method: GET
  async getMangaList(req, res) {
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
  }
  //2. Get Deleted Manga List with paging
  // route: /management/content/manga/api/getDeletedList - Method: GET
  async getDeletedMangaList(req, res) {
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
  }
  //3.Publish Manga
  async publishManga(req, res) {
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
      country,
    } = req.body;
    if (
      !name ||
      !anotherName ||
      !author ||
      type.length === 0 ||
      !serve ||
      !status ||
      !description ||
      !image ||
      !country
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
        country,
        contentId: initializedChapter._id,
      });
      const createdManga = await newManga.save();
      if (!createdManga) {
        res
          .status(STATUS.SERVER_ERROR)
          .json(
            new ErrorResponse(ERRORCODE.ERROR_SERVER, MESSAGE.ERROR_SERVER)
          );
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
  }
  //4.Get Update Manga Page
  async updateManga(req, res) {
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
      country,
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
      !oldImage ||
      !country
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
        country,
      };

      if (image) {
        payload.image = image;
        fs.unlinkSync(
          path.join(
            appRoot.path,
            `/src/public/images/${oldImage.split("/")[2]}`
          )
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
  }
  //5.Soft Delete Manga
  async softDeleteManga(req, res) {
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
  }
  //6.Get All Chapters of Deleted Manga
  async getAllChaptersOfDeletedManga(req, res) {
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
  }
  //7. Restore Manga
  async restoreManga(req, res) {
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
  }
  //8 Destroy Manga
  async destroyManga(req, res) {
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
  }
  //9 Get Chapter List of Manga
  async getAllChaptersOfManga(req, res) {
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
  }
  //10 Initialize Chapter Repository
  async initChapterRepo(req, res) {
    const { chapterId, chapterNumber, chapterName } = req.body;
    try {
      const chapterRepository = await Chapter.findById(chapterId);
      const checkChapter = chapterRepository.chapters.find(
        (chapter) => chapter.chapterNumber === chapterNumber
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
  }
  //11 Stream Images Of Chapter
  async streamImagesOfChapter(req, res) {
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
  }
  //12 Submit Chapter Content
  async submitChapterContent(req, res) {
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
  }
  //13 Stream Delete Image of Chapter
  async streamDeleteImageOfChapter(req, res) {
    fs.unlink(
      path.join(appRoot.path + "/src/", req.body.path),
      function (error) {
        if (error) {
          console.log(error);
          return res
            .status(STATUS.SERVER_ERROR)
            .json(
              new ErrorResponse(ERRORCODE.ERROR_SERVER, MESSAGE.ERROR_SERVER)
            );
        }
        // if no error, file has been deleted successfully
        return res
          .status(STATUS.SUCCESS)
          .json(new SuccessResponse(MESSAGE.DELETE_SUCCESS, null));
      }
    );
  }
  //14. Delete Chapter
  async deleteChapter(req, res) {
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
  }
  //15. Update Chapter
  async updateChapter(req, res) {
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
  }
  //16. Fix Title
  async fixTitle(req, res) {
    const { chapterId, chapterNumber, chapterName, oldChapterNumber, manga } =
      req.body;
    try {
      // const chapterRepository = await Chapter.findById(chapterId);
      // const checkChapter = chapterRepository.chapters.find(
      //   (chapter) => chapter.chapterNumber === chapterNumber
      // );
      // if (checkChapter) {
      //   return res
      //     .status(STATUS.BAD_REQUEST)
      //     .json(
      //       new ErrorResponse(ERRORCODE.ERROR_BAD_REQUEST, MESSAGE.CREATE_FAIL)
      //     );
      // }
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
        function (error) {
          if (error) {
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
  }
  //17.Submit update chapter
  async submitUpdateChapter(req, res) {
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
  }
}

module.exports = new MangaController();
