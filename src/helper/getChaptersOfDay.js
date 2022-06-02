const res = require("express/lib/response");
const moment = require("moment");
const getTime = require("./getTime");
const lodash = require("lodash");
const { isEmpty } = require("lodash");
module.exports = function getChaptersOfDay(mangas) {
  const presentTime = new Date();
  const d = new Date(getTime());
  const getDate = d.getDate();
  const getMonth = d.getMonth();
  const getYear = d.getFullYear();

  const lastChapters = mangas
    .map((manga, index) => {
      if (manga.chapters.length !== 0) {
        return {
          name: manga.name,
          slug: manga.slug,
          chapters: manga._doc.chapters.filter((chapter, index) => {
            return (
              getDate === new Date(chapter.chapterUpdate).getDate() &&
              getMonth === new Date(chapter.chapterUpdate).getMonth() &&
              getYear === new Date(chapter.chapterUpdate).getFullYear()
            );
          }),
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
  const chaptersArray = lodash.remove(lastChapters, function (item) {
    return isEmpty(item.chapters) === false;
  });
  const getJustUpdatedChapters = chaptersArray.sort(
    (firstItem, secondItem) => firstItem.order - secondItem.order
  );
  return getJustUpdatedChapters;
};
