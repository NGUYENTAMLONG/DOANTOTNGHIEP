const Manga = require("../models/Manga");

class detailController {
  async showDetailManga(req, res) {
    const slug = req.params.slug;
    try {
      const manga = await Manga.findOne({ slug: slug });
      res.render("detail", { slug, manga });
    } catch (error) {
      console.log(error);
    }
  }
}

module.exports = new detailController();
