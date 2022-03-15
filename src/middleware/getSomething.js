const Manga = require("../models/Manga");
const moment = require("moment");
class getSomething {
  async getNewChapter(req, res, next) {
    const serve = req.params.slug;
    if (req.params.slug !== "just-updated") {
      classifyManga(req, res, next, serve);
    } else {
      classifyManga(req, res, next);
    }
  }
}
async function classifyManga(req, res, next, serve) {
  const presentTime = new Date();
  try {
    let mangas = [];
    if (typeof serve === "undefined") {
      mangas = await Manga.find();
    } else {
      mangas = await Manga.find({ serve: serve });
    }
    const lastChapters = mangas
      .map((manga, index) => {
        if (manga.chapters.length !== 0) {
          return {
            manga,
            period: moment(
              new Date(manga.chapters[manga.chapters.length - 1].chapterUpdate)
            ).fromNow(),
            order:
              Math.abs(
                presentTime -
                  new Date(
                    manga.chapters[manga.chapters.length - 1].chapterUpdate
                  )
              ) / 86400000,
          };
        }
      })
      .filter((item) => item != null);

    const getJustUpdatedChapters = lastChapters.sort(
      (firstItem, secondItem) => firstItem.order - secondItem.order
    );
    // res.json(getJustUpdatedChapters);
    req.listManga = getJustUpdatedChapters;
    next();
  } catch (error) {
    console.log(error);
  }
}
module.exports = new getSomething();
