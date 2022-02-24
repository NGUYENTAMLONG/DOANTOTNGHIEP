const Manga = require("../models/Manga");
const Slide = require("../models/Slide");
class siteController {
  home(req, res, next) {
    Promise.all([
      Slide.find({}), //Lấy ra các slide
      Manga.find({}), // Lấy ra tất cả các manga
      Manga.find({ serve: "male" }), //Lấy ra các manga dành cho nam
      Manga.find({ serve: "female" }), //Lấy ra các manga dành cho nữ
    ])
      .then(([slides, mangas, mangaForMale, mangaForFemale]) => {
        res.render("home", {
          slides: slides,
          mangas: mangas,
          mangaForMale,
          mangaForFemale,
        });
      })
      .catch(next);
  }
  blogs(req, res, next) {
    res.render("blogs");
  }
}
// function home(req, res, next) {
//   res.send("YOU ARE THE BEST :v");
// }
module.exports = new siteController();
