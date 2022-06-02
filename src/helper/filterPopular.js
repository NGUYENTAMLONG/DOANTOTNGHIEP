const moment = require("moment");
module.exports = function filterPopular(mangas) {
  const presentTime = new Date();
  const lastChapters = mangas
    .map((manga, index) => {
      if (manga.chapters.length !== 0) {
        return {
          manga,
          period: moment(
            new Date(manga.chapters[manga.chapters.length - 1].chapterUpdate)
          )
            .locale("vi")
            .fromNow(),
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
  return getJustUpdatedChapters;
};
