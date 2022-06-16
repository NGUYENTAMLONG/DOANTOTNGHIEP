const filterPopular = require("../helper/filterPopular");
const matchType = require("../helper/matchType");
const Manga = require("../models/Manga");
class MangaController {
  show(req, res, next) {
    const arrayType = matchType(req.params.type);
    Manga.find({ type: { $in: arrayType } })
      .lean()
      .then((mangas) => {
        res.render("showCategory", {
          user: req.AuthPayload,
          mangas: filterPopular(mangas),
        });
      })
      .catch((error) => console.log(error));
  }
}
module.exports = new MangaController();
