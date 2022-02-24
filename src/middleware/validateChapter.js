const Manga = require("../models/Manga");

class ValidateChapter {
  async checkChapterNumber(req, res, next) {
    try {
      const manga = await Manga.findOne({ slug: req.params.slug });
      const flag = manga.chapters.some(
        (chapter) => chapter.chapterNumber.toString() === req.body.chapterNumber
      );
      if (flag === true) {
        res.json(false);
      } else {
        next();
      }
    } catch (error) {
      console.log(error);
    }
  }
}
module.exports = new ValidateChapter();
