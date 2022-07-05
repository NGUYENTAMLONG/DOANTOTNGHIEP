const Manga = require("../models/Manga");
const { orderManga } = require("./order");
module.exports = async function getRecentlyChapters() {
  try {
    const mangas = await Manga.find({}).populate("contentId", {
      chapters: { $slice: -1 },
    });
    const recentlyReleasedManga = orderManga(mangas).map((item, index) => {
      return {
        name: item.name,
        slug: item.slug,
        lastChapter: item.contentId.chapters[0],
        hot: item.hot,
      };
    });
    return recentlyReleasedManga;
  } catch (error) {
    console.log(error);
  }
};
