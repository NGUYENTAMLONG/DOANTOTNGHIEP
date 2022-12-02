const Slide = require("../models/Slide");
const jwt = require("jsonwebtoken");
const { VALUES, types, PENDING, NOTIFICATION } = require("../config/default");
const moment = require("moment");
const Manga = require("../models/Manga");
const Chapter = require("../models/Chapter");
const { STATUS, ERRORCODE, MESSAGE } = require("../config/httpResponse");
const { ErrorResponse, SuccessResponse } = require("../helper/response");
const { redirect } = require("../service/redirect");
const path = require("path");
const fs = require("fs");
const appRoot = require("app-root-path");
const { storePublicNotification } = require("../service/storeNotification");
const { handleSocket } = require("../service/socketIO");
const { announceNewChapter } = require("../service/announceNewChapter");
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
        admin: req.user,
        allMangas,
        types,
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
        admin: req.user,
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
    if (!slug) {
      redirect(req, res, STATUS.NOT_FOUND);
    }
    try {
      const foundManga = await Manga.findOne({ slug: slug }).populate(
        "contentId"
      );
      if (!foundManga) {
        redirect(req, res, STATUS.NOT_FOUND);
      }
      res.render("admin/manga/updateManga", {
        admin: req.user,
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
        admin: req.user,
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
      res.status(STATUS.SUCCESS).render("admin/manga/post", {
        admin: req.user,
        manga: manga,
        moment: moment,
      });
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
      const mangas = await Manga.find({}).populate("contentId", {
        chapters: { $slice: -1 },
      });
      // .skip(Number(offset))
      // .limit(Number(limit));
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
      translation,
      hot,
      description,
      image,
      country,
    } = req.body;
    if (
      !name ||
      !anotherName ||
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
      const checkName = await Manga.findOne({ name: name });
      if (checkName) {
        return res
          .status(STATUS.BAD_REQUEST)
          .json(
            new ErrorResponse(
              ERRORCODE.ERROR_ALREADY_EXISTS,
              MESSAGE.MANGA_ALREADY
            )
          );
      }

      const initializedChapter = await Chapter.create({});
      const newManga = new Manga({
        name,
        anotherName,
        author: author.length !== 0 ? author : PENDING.INFOMATION,
        type,
        serve,
        status,
        translation:
          translation.length !== 0 ? translation : PENDING.INFOMATION,
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
      //Notification
      await storePublicNotification(res, {
        name: NOTIFICATION.PUBLIC.SPACE.PUBLISH,
        image: createdManga.image,
        content: `Bộ truyện ${createdManga.name} chính thức đổ bộ để phục vụ các bạn đọc ^^`,
        fromUser: req.user,
        url: `/detail/${createdManga.slug}`,
      });

      handleSocket(req.io, NOTIFICATION.PUBLIC.SPACE.PUBLISH, {
        name: NOTIFICATION.PUBLIC.SPACE.PUBLISH,
        image: createdManga.image,
        content: `Bộ truyện ${createdManga.name} chính thức đổ bộ để phục vụ các bạn đọc ^^`,
        url: `/detail/${createdManga.slug}`,
      });
      //
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
  //4 Update Manga
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
      translation,
      image,
      oldImage,
      country,
    } = req.body;
    const slug = req.params.slug;
    if (
      !slug ||
      !name ||
      !anotherName ||
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
        author: author.length !== 0 ? author : PENDING.INFOMATION,
        type,
        serve,
        status,
        translation:
          translation.length !== 0 ? translation : PENDING.INFOMATION,
        hot,
        description,
        country,
      };
      // console.log(payload, image);
      if (image) {
        payload.image = image;
        fs.unlinkSync(
          path.join(
            appRoot.path,
            `/src/public/images/${oldImage.split("/")[2]}`
          )
        );
      }

      const foundManga = await Manga.findOne({ slug: slug });
      await Manga.findOneAndUpdate({ slug: slug }, payload);
      let mangaAfterUpdate = null;
      if (name !== foundManga.name) {
        const foundMangaAfterUpdate = await Manga.findById(foundManga._id);
        mangaAfterUpdate = foundMangaAfterUpdate;
      }
      res
        .status(STATUS.CREATED)
        .json(new SuccessResponse(MESSAGE.CREATE_SUCCESS, mangaAfterUpdate));
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
        .status(STATUS.SUCCESS)
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

      if (
        fs.existsSync(path.join(appRoot.path, `/src/public/mangas/${slug}/`))
      ) {
        //file exists
        fs.rmSync(path.join(appRoot.path, `/src/public/mangas/${slug}/`), {
          recursive: true,
        });
      }
      //Note : SLIDE !!!!!!
      res
        .status(STATUS.SUCCESS)
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
    if (!chapterNumber || !chapterName) {
      return res
        .status(STATUS.BAD_REQUEST)
        .json(
          new ErrorResponse(ERRORCODE.ERROR_BAD_REQUEST, MESSAGE.BAD_REQUEST)
        );
    }
    try {
      if (!Number(chapterNumber)) {
        return res
          .status(STATUS.BAD_REQUEST)
          .json(
            new ErrorResponse(ERRORCODE.ERROR_BAD_REQUEST, MESSAGE.BAD_REQUEST)
          );
      }
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
        statistical: {
          views: 0,
          comments: 0,
          likes: 0,
        },
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
      //Notification
      await announceNewChapter(req, res, chapterId);
      //
      res
        .status(STATUS.SUCCESS)
        .json(new SuccessResponse(MESSAGE.CREATE_SUCCESS, null));
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
    const { manga, chapterId, chapterNumber } = req.params;
    if (!manga || !chapterId || !chapterNumber) {
      redirect(req, res, STATUS.BAD_REQUEST);
    }
    try {
      const foundManga = await Manga.findOne({ slug: manga }).populate(
        "contentId"
      );
      if (!foundManga) {
        return res.status(STATUS.BAD_REQUEST).redirect("/management/manga");
      }
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
      if (foundChapter.chapters.length === 0) {
        return res.status(STATUS.BAD_REQUEST).redirect("/management/manga");
      }
      res.render("admin/manga/updateChapter", {
        admin: req.user,
        moment: moment,
        manga: foundManga,
        chapter: foundChapter.chapters[0],
      });
    } catch (error) {
      console.log(error);
      redirect(req, res, STATUS.SERVER_ERROR);
    }
  }
  //16. Fix ChapterNumber
  async fixChapterNumber(req, res) {
    const { manga, chapterId, chapterNumber, oldChapterNumber } = req.body;
    try {
      if (!Number(chapterNumber)) {
        return res
          .status(STATUS.BAD_REQUEST)
          .json(
            new ErrorResponse(ERRORCODE.ERROR_BAD_REQUEST, MESSAGE.BAD_REQUEST)
          );
      }
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
      const checkChapterExisted = await Chapter.findOne(
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
      if (checkChapterExisted.chapters.length !== 0) {
        return res
          .status(STATUS.BAD_REQUEST)
          .json(
            new ErrorResponse(
              ERRORCODE.ERROR_ALREADY_EXISTS,
              MESSAGE.CHAPTER_ALREADY
            )
          );
      }

      await Chapter.updateOne(
        { _id: chapterId, "chapters.chapterNumber": Number(oldChapterNumber) },
        { $set: { "chapters.$.chapterNumber": Number(chapterNumber) } }
      );
      await Chapter.updateOne(
        {
          _id: chapterId,
          "chapters.chapterNumber": Number(chapterNumber),
        },
        {
          $set: {
            "chapters.$.chapterContent":
              foundChapter.chapters[0].chapterContent.replaceAll(
                `chapter-${oldChapterNumber}`,
                `chapter-${chapterNumber}`
              ),
          },
        }
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
      return res.status(STATUS.SUCCESS).json(
        new SuccessResponse(MESSAGE.UPDATE_SUCCESS, {
          redirect: `/management/content/manga/updateChapter/${manga}/${chapterId}/${chapterNumber}`,
        })
      );
    } catch (error) {
      console.log(error);
      return res
        .status(STATUS.SERVER_ERROR)
        .json(new ErrorResponse(ERRORCODE.ERROR_SERVER, MESSAGE.ERROR_SERVER));
    }
  }
  //16.5. Fix ChapterName
  async fixChapterName(req, res) {
    const { chapterId, chapterNumber, chapterName } = req.body;
    try {
      await Chapter.updateOne(
        { _id: chapterId, "chapters.chapterNumber": Number(chapterNumber) },
        { $set: { "chapters.$.chapterName": chapterName } }
      );
      return res
        .status(STATUS.SUCCESS)
        .json(new SuccessResponse(MESSAGE.UPDATE_SUCCESS, null));
    } catch (error) {
      console.log(error);
      return res
        .status(STATUS.SERVER_ERROR)
        .json(new ErrorResponse(ERRORCODE.ERROR_SERVER, MESSAGE.ERROR_SERVER));
    }
  }
  //17.Submit update chapter
  async fixChapterContent(req, res) {
    const { chapterNumber } = req.params;
    const { chapterId, chapterContent } = req.body;
    if (!chapterNumber || !chapterId || !chapterContent) {
      return res
        .status(STATUS.BAD_REQUEST)
        .json(new ErrorResponse(ERRORCODE.BAD_REQUEST, MESSAGE.BAD_REQUEST));
    }
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
  //18. Delete Checked
  async deleteChecked(req, res) {
    const idList = req.body;

    if (idList.length === 0) {
      return res
        .status(STATUS.BAD_REQUEST)
        .json(
          new ErrorResponse(ERRORCODE.ERROR_BAD_REQUEST, MESSAGE.BAD_REQUEST)
        );
    }

    try {
      //note : no unlink image cover

      await Manga.delete({ _id: { $in: idList } });

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
  async restoreChecked(req, res) {
    const idList = req.body;

    if (idList.length === 0) {
      return res
        .status(STATUS.BAD_REQUEST)
        .json(
          new ErrorResponse(ERRORCODE.ERROR_BAD_REQUEST, MESSAGE.BAD_REQUEST)
        );
    }

    try {
      await Manga.restore({ _id: { $in: idList } });
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
  async getMangaAnalysis(req, res) {
    try {
      const allMangas = await Manga.find({});
      res.render("admin/manga/analysis", {
        admin: req.user,
        mangas: allMangas,
        categories: types,
      });
    } catch (error) {
      console.log(error);
      redirect(req, res, STATUS.SERVER_ERROR);
    }
  }
  async getSwapChapterPage(req, res) {
    const { mangaId } = req.params;
    if (!mangaId) {
      return res
        .status(STATUS.BAD_REQUEST)
        .redirect("/management/content/manga");
    }
    try {
      const foundManga = await Manga.findById(mangaId)
        .select(["name", "contentId", "slug"])
        .populate("contentId", [
          "chapters.chapterNumber",
          "chapters.chapterName",
        ]);
      // return res.json(foundManga);
      res.render("admin/manga/swap", {
        admin: req.user,
        manga: foundManga,
      });
    } catch (error) {
      console.log(error);
      redirect(req, res, STATUS.SERVER_ERROR);
    }
  }
  async updateSwapChapter(req, res) {
    const { chapterId } = req.params;
    const { dataOrder } = req.body;

    try {
      const oldIndex = dataOrder.map((elm, index) => {
        return Number(elm[0]);
      });
      const newIndex = dataOrder.map((elm, index) => {
        return Number(elm[1]);
      });
      const repoChapter = await Chapter.findById(chapterId);
      const foundChapterArray = newIndex.map(
        (elm, index) => repoChapter.chapters[elm]
      );
      const newOrder = {};
      function setOrder(oldIndex, array) {
        oldIndex.forEach((elm, index) => {
          newOrder[`chapters.${elm}`] = array[index];
        });
        return newOrder;
      }
      await Chapter.findByIdAndUpdate(chapterId, {
        $set: setOrder(oldIndex, foundChapterArray),
      });
      res
        .status(STATUS.SUCCESS)
        .json(new SuccessResponse(MESSAGE.UPDATE_SUCCESS, null));
    } catch (error) {
      console.log(error);
      redirect(req, res, STATUS.SERVER_ERROR);
    }
  }
}

module.exports = new MangaController();
