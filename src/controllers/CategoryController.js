const matchType = require("../helper/matchType");
const Manga = require("../models/Manga");
class mangaController {
  show(req, res, next) {
    // const type =
    //   req.params.type.charAt(0).toUpperCase() + req.params.type.slice(1);
    // res.send(type);
    const arrayType = matchType(req.params.type);
    // res.send(typeof arrayType);
    Manga.find({ type: { $in: arrayType } })
      .lean()
      .then((mangas) => {
        res.render("showCategory", { mangas: mangas });
      })
      .catch((error) => console.log(error));
  }
}
module.exports = new mangaController();
