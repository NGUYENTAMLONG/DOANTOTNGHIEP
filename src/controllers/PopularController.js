const Manga = require("../models/Manga");

class PopularController {
  async showJustUpdated(req, res, next) {
    try {
      res.render("showPopular", {
        title: "Truyện mới cập nhật",
        mangas: req.listManga,
      });
    } catch (error) {
      console.log(error);
      res.status(500).json("ERROR:", error);
    }
  }
  async showAll(req, res, next) {
    try {
      res.render("showPopular", {
        title: "Truyện tổng hợp",
        mangas: req.listManga,
      });
    } catch (error) {
      console.log(error);
      res.status(500).json("ERROR:", error);
    }
  }
  async showMangaForMale(req, res, next) {
    try {
      res.render("showPopular", {
        title: "Truyện con trai",
        mangas: req.listManga,
      });
    } catch (error) {
      console.log(error);
      res.status(500).json("ERROR:", error);
    }
  }
  async showMangaForFemale(req, res, next) {
    try {
      const mangas = await Manga.find({ serve: "female" });
      res.render("showPopular", {
        title: "Truyện con gái",
        mangas: req.listManga,
      });
    } catch (error) {
      console.log(error);
      res.status(500).json("ERROR:", error);
    }
  }
}

module.exports = new PopularController();
