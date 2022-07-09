const Slide = require("../models/Slide");
const jwt = require("jsonwebtoken");
const { VALUES } = require("../config/default");

class mangaController {
  async findAllSlides(req, res, next) {
    try {
      const listSlide = await Slide.find().populate("manga");
      if (!listSlide) {
        res
          .status(403)
          .json({ status: "error", message: "Slide list is empty !!!" });
      }
      res.status(200).json({ status: "ok", listSlide: listSlide });
    } catch (error) {
      console.log(error);
      res.status(500).json({ status: "error", error: error });
    }
  }
  async createSlide(req, res, next) {
    const { image, manga } = req.body;
    // res.json(req.body);
    const slide = new Slide({
      image: image,
      manga: manga,
    });
    try {
      const createdSlide = await slide.save();
      if (!createdSlide) {
        res.json(error);
      }
      res.status(200).json({ status: "ok", createdSlide: createdSlide });
    } catch (error) {
      console.log(error);
      res.status(500).json({ status: "error", error: error });
    }
  }
  async updateSlide(req, res, next) {
    const { name, author, image, chapter, desc, type } = req.body;
    const idSlide = req.params.id;

    try {
      const response = await Slide.findByIdAndUpdate(idSlide, {
        name,
        author,
        image,
        chapter,
        desc,
        type,
      });
      if (!response) {
        res.status(403).json({
          status: "error",
          message: "Something went wrong while updating !!!",
        });
      }
      res
        .status(200)
        .json({ status: "ok", message: "Successfully updated !!!" });
    } catch (error) {
      console.log(error);
      res.status(500).json({ status: "error", error: error });
    }
  }
  async switchSlide(req, res, next) {
    try {
      const slide = await Slide.findById(req.params.id);
      if (!slide) {
        res.json({
          result: "ERROR",
          message: "Something went wrong while updating !!!",
        });
      }
      let toggle = slide.active;
      const slideUpdated = await Slide.findByIdAndUpdate(
        { _id: req.params.id },
        { $set: { active: !toggle } }
      );
      res.json(slide);
    } catch (error) {
      console.log(error);
    }
  }
  async deleteSlide(req, res, next) {
    const idSlide = req.params.id;
    try {
      const deletedSlide = await Slide.findByIdAndDelete(idSlide);
      if (!deletedSlide) {
        res.status(403).json({
          status: "error",
          message: "Something went wrong while deleting !!!",
        });
      }
      res
        .status(200)
        .json({ status: "ok", message: "Successfully deleted !!!" });
    } catch (error) {
      console.log(error);
      res.status(500).json({ status: "error", error: error });
    }
  }
  async findSlideById(req, res, next) {
    const idSlide = req.params.id;
    try {
      const slide = await Slide.findById(idSlide).populate("manga");
      if (!slide) {
        res.status(403).json({
          status: "error",
          message: "Not Found !!!",
        });
      }
      res.status(200).json({ status: "ok", slide: slide });
    } catch (error) {
      console.log(error);
      res.status(500).json({ status: "error", error: error });
    }
  }
}

module.exports = new mangaController();
