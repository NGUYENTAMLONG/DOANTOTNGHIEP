const Manga = require("../models/Manga");
const Slide = require("../models/Slide");
const moment = require("moment");
const filterPopular = require("../helper/filterPopular");

class PopularController {
  async showJustUpdated(req, res, next) {
    try {
      const mangas = await Manga.find();
      const slides = await Slide.find({ active: true }).populate("manga");
      res.render("showPopular", {
        user: req.AuthPayload,
        title: `<i class="fab fa-hotjar"></i> Truyện mới cập nhật`,
        slides,
        mangas: filterPopular(mangas),
      });
    } catch (error) {
      console.log(error);
      res.status(500).json("ERROR:", error);
    }
  }
  async showAll(req, res, next) {
    try {
      const mangas = await Manga.find({ serve: "all" });
      const slides = await Slide.find({ active: true }).populate("manga");
      res.render("showPopular", {
        user: req.AuthPayload,
        title: `<i class="fas fa-flag-checkered"></i> Truyện tổng hợp`,
        slides,
        mangas: filterPopular(mangas),
      });
    } catch (error) {
      console.log(error);
      res.status(500).json("ERROR:", error);
    }
  }
  async showMangaForMale(req, res, next) {
    try {
      const mangas = await Manga.find({ serve: "male" });
      const slides = await Slide.find({ active: true }).populate("manga");
      res.render("showPopular", {
        user: req.AuthPayload,
        title: `<i class="fas fa-mars"></i> Truyện con trai`,
        slides,
        mangas: filterPopular(mangas),
      });
    } catch (error) {
      console.log(error);
      res.status(500).json("ERROR:", error);
    }
  }
  async showMangaForFemale(req, res, next) {
    try {
      const mangas = await Manga.find({ serve: "female" });
      const slides = await Slide.find({ active: true }).populate("manga");
      res.render("showPopular", {
        user: req.AuthPayload,
        title: `<i class="fas fa-venus"></i> Truyện con gái`,
        slides,
        mangas: filterPopular(mangas),
      });
    } catch (error) {
      console.log(error);
      res.status(500).json("ERROR:", error);
    }
  }
}

module.exports = new PopularController();
