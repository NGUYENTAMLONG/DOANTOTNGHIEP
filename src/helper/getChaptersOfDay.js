const getTime = require("./getTime");
const Manga = require("../models/Manga");
const { orderManga } = require("./order");
module.exports = async function getChaptersOfDay() {
  const d = new Date(getTime());
  const getDate = d.getDate();
  const getMonth = d.getMonth();
  const getYear = d.getFullYear();
  try {
    const mangas = await Manga.find({}).populate("contentId");
    const lastChapters = orderManga(mangas)
      .map((manga, index) => {
        if (manga.contentId.chapters.length !== 0) {
          return {
            name: manga.name,
            slug: manga.slug,
            chapters: manga.contentId.chapters.filter((chapter, index) => {
              return (
                getDate === new Date(chapter.createdTime).getDate() &&
                getMonth === new Date(chapter.createdTime).getMonth() &&
                getYear === new Date(chapter.createdTime).getFullYear()
              );
            }),
          };
        }
      })
      .filter((item) => item != undefined);

    return lastChapters;
  } catch (error) {
    console.log(error);
  }
};
