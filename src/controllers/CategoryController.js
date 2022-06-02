const matchType = require("../helper/matchType");
const Manga = require("../models/Manga");
class MangaController {
  show(req, res, next) {
    // const type =
    //   req.params.type.charAt(0).toUpperCase() + req.params.type.slice(1);
    // res.send(type);
    const arrayType = matchType(req.params.type);
    // res.send(typeof arrayType);
    Manga.find({ type: { $in: arrayType } })
      .lean()
      .then((mangas) => {
        res.render("showCategory", { user: req.AuthPayload, mangas: mangas });
      })
      .catch((error) => console.log(error));
  }
}
module.exports = new MangaController();
