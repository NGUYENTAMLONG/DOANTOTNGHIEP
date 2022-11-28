const Slide = require("../models/Slide");
const { STATUS, ERRORCODE, MESSAGE } = require("../config/httpResponse");
const { redirect } = require("../service/redirect");
const { SuccessResponse, ErrorResponse } = require("../helper/response");
const fs = require("fs");
const appRoot = require("app-root-path");
const Manga = require("../models/Manga");
const path = require("path");

class SlideController {
  //Go to slide dashboard
  async getSlideDashboard(req, res) {
    try {
      const slides = await Slide.find().populate({
        path: "manga",
        populate: { path: "contentId", select: { chapters: { $slice: -1 } } },
      });
      res.render("admin/slide/slideDashboard", { admin: req.user, slides });
    } catch (error) {
      console.log(error);
      redirect(req, res, STATUS.SERVER_ERROR);
    }
  }
  //Go to slide trash
  async getSlideTrash(req, res) {
    try {
      const foundSlides = await Slide.findDeleted({}).populate({
        path: "manga",
        populate: { path: "contentId", select: { chapters: { $slice: -1 } } },
      });
      res.render("admin/slide/slideTrash", {
        admin: req.user,
        slides: foundSlides,
      });
    } catch (error) {
      console.log(error);
      redirect(req, res, STATUS.SERVER_ERROR);
    }
  }
  //Go to creating slide page
  async getCreateSlidePage(req, res) {
    try {
      const allMangas = await Manga.find().select("name");
      res.render("admin/slide/createSlide", {
        admin: req.user,
        mangas: allMangas,
      });
    } catch (error) {
      console.log(error);
      redirect(req, res, STATUS.SERVER_ERROR);
    }
  }
  //Go to updating slide page
  async getUpdateSlidePage(req, res) {
    const slideId = req.params.id;
    try {
      const foundSlide = await Slide.findById(slideId).populate("manga");
      res.render("admin/slide/updateSlide", {
        admin: req.user,
        slide: foundSlide,
      });
    } catch (error) {
      console.log(error);
      redirect(req, res, STATUS.SERVER_ERROR);
    }
  }
  //Get All Slides
  async findAllSlides(req, res, next) {
    try {
      const listSlide = await Slide.find().populate("manga");
      if (!listSlide) {
        return res
          .status(STATUS.NOT_FOUND)
          .json(
            new ErrorResponse(ERRORCODE.ERROR_NOT_FOUND, MESSAGE.NOT_FOUND)
          );
      }
      res
        .status(STATUS.SUCCESS)
        .json(new SuccessResponse(MESSAGE.SUCCESS, listSlide));
    } catch (error) {
      console.log(error);
      res
        .status(STATUS.SERVER_ERROR)
        .json(new ErrorResponse(ERRORCODE.ERROR_SERVER, MESSAGE.ERROR_SERVER));
    }
  }
  //Get Slide By Id
  async findSlideById(req, res, next) {
    const idSlide = req.params.id;
    try {
      const slide = await Slide.findById(idSlide).populate("manga");
      if (!slide) {
        return res
          .status(STATUS.NOT_FOUND)
          .json(
            new ErrorResponse(ERRORCODE.ERROR_NOT_FOUND, MESSAGE.NOT_FOUND)
          );
      }
      res
        .status(STATUS.SUCCESS)
        .json(new SuccessResponse(MESSAGE.SUCCESS, slide));
    } catch (error) {
      console.log(error);
      res
        .status(STATUS.SERVER_ERROR)
        .json(new ErrorResponse(ERRORCODE.ERROR_SERVER, MESSAGE.ERROR_SERVER));
    }
  }
  //Get Slide List
  async getSlideList(req, res, next) {
    const { search, sort, order, offset, limit } = req.query;

    try {
      const slides = await Slide.find({})
        .populate({
          path: "manga",
          populate: { path: "contentId", select: { chapters: { $slice: -1 } } },
        })
        .skip(Number(offset))
        .limit(Number(limit));
      res.status(STATUS.SUCCESS).json({
        rows: slides,
      });
    } catch (error) {
      console.log(error);
      res
        .status(STATUS.SERVER_ERROR)
        .json(new ErrorResponse(ERRORCODE.ERROR_SERVER, MESSAGE.ERROR_SERVER));
    }
  }

  //Get Slide List
  async getDeletedList(req, res, next) {
    const { search, sort, order, offset, limit } = req.query;

    try {
      const slides = await Slide.findDeleted({})
        .populate({
          path: "manga",
          populate: { path: "contentId", select: { chapters: { $slice: -1 } } },
        })
        .skip(Number(offset))
        .limit(Number(limit));
      res.status(STATUS.SUCCESS).json({
        rows: slides,
      });
    } catch (error) {
      console.log(error);
      res
        .status(STATUS.SERVER_ERROR)
        .json(new ErrorResponse(ERRORCODE.ERROR_SERVER, MESSAGE.ERROR_SERVER));
    }
  }
  //Create Slide
  async createSlide(req, res, next) {
    const { image, manga, content } = req.body;
    if (!image || !manga) {
      return res
        .status(STATUS.BAD_REQUEST)
        .json(
          new ErrorResponse(ERRORCODE.ERROR_BAD_REQUEST, MESSAGE.BAD_REQUEST)
        );
    }
    try {
      const slide = new Slide({
        image,
        manga,
        content,
      });
      const createdSlide = await slide.save();
      if (!createdSlide) {
        res.json(error);
      }
      res
        .status(STATUS.CREATED)
        .json(new SuccessResponse(MESSAGE.CREATE_SUCCESS, createdSlide));
    } catch (error) {
      console.log(error);
      res
        .status(STATUS.SERVER_ERROR)
        .json(new ErrorResponse(ERRORCODE.ERROR_SERVER, MESSAGE.ERROR_SERVER));
    }
  }
  //Update Slide
  async updateSlide(req, res, next) {
    const idSlide = req.params.id;
    const { image, content, oldImgSlide } = req.body;
    try {
      const payload = {
        content,
      };
      if (image) {
        payload.image = image;
        fs.unlinkSync(
          path.join(appRoot.path, `/src/public/images/${oldImgSlide}`)
        );
      }

      await Slide.findByIdAndUpdate(idSlide, payload);

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
  //Set Active or Inactive Slide
  async switchSlide(req, res, next) {
    const idSlide = req.params.id;
    try {
      const slide = await Slide.findById(idSlide);
      if (!slide) {
        return res
          .status(STATUS.NOT_FOUND)
          .json(
            new ErrorResponse(ERRORCODE.ERROR_NOT_FOUND, MESSAGE.NOT_FOUND)
          );
      }
      let toggle = slide.active;
      await Slide.findByIdAndUpdate(
        { _id: req.params.id },
        { $set: { active: !toggle } }
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
  //Soft Delete
  async deleteSlide(req, res, next) {
    const idSlide = req.params.id;
    try {
      await Slide.delete({ _id: idSlide });
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
  //Hard Delete
  async destroySlide(req, res, next) {
    const idSlide = req.params.id;
    const { image } = req.body;
    try {
      await Slide.findByIdAndDelete(idSlide);
      fs.unlinkSync(path.join(appRoot.path, `/src/public/images/${image}`));
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
  //Restore
  async restoreSlide(req, res, next) {
    const idSlide = req.params.id;
    try {
      await Slide.restore({ _id: idSlide });
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
  //Soft Delete Checked
  async deleteChecked(req, res, next) {
    const idList = req.body;
    if (!idList || idList.length === 0) {
      return res
        .status(STATUS.BAD_REQUEST)
        .json(
          new ErrorResponse(ERRORCODE.ERROR_BAD_REQUEST, MESSAGE.BAD_REQUEST)
        );
    }
    try {
      await Slide.delete({ _id: { $in: idList } });
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
  //Restore Checked
  async restoreChecked(req, res, next) {
    const idList = req.body;
    if (!idList || idList.length === 0) {
      return res
        .status(STATUS.BAD_REQUEST)
        .json(
          new ErrorResponse(ERRORCODE.ERROR_BAD_REQUEST, MESSAGE.BAD_REQUEST)
        );
    }
    try {
      await Slide.restore({ _id: { $in: idList } });
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
}

module.exports = new SlideController();
