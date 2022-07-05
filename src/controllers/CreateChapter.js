const Chapter = require("../models/Chapter");
const Manga = require("../models/Manga");
const moment = require("moment");
class ChapterController {
  async createChapter(req, res, next) {
    try {
      const createChapter = await Chapter.create({});
      res.json(createChapter);
    } catch (error) {
      console.log(error);
    }
  }
  async publishChapter(req, res, next) {
    const chapterId = req.params.id;
    const data = req.body;
    data.createdTime = moment().format();
    data.updatedTime = moment().format();
    console.log(data);
    try {
      const updatedChapter = await Chapter.findByIdAndUpdate(chapterId, {
        $push: { chapters: data },
      });
      res.json(updatedChapter);
    } catch (error) {
      console.log(error);
    }
  }
  async testPopulate(req, res, next) {
    const mangaId = req.params.mangaId;
    try {
      const result = await Manga.find()
        .populate("contentId", {
          chapters: { $slice: -1 },
        })
        .sort({ "contentId.chapters": "asc" });

      res.json(result);
    } catch (error) {
      console.log(error);
    }
  }
}
module.exports = new ChapterController();
