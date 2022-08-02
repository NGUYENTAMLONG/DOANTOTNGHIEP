const Chapter = require("../models/Chapter");
module.exports = async function getRecentlyChapters() {
  try {
    const result = await Chapter.aggregate([
      {
        $unwind: "$chapters",
      },
      {
        $addFields: {
          isDate: "$chapters.createdTime",
        },
      },
      {
        $addFields: {
          isDate: {
            $toDate: "$isDate",
          },
        },
      },
      {
        $sort: {
          isDate: -1,
        },
      },
      {
        $addFields: {
          _id: { $toString: "$_id" },
        },
      },
      {
        $lookup: {
          from: "Mangas",
          localField: "_id",
          foreignField: "contentId",
          as: "Mangas",
        },
      },
      { $unwind: "$Mangas" },
      {
        $unset: [
          "Mangas.anotherName",
          "Mangas.serve",
          "Mangas.status",
          "Mangas.hot",
          "Mangas.country",
          "Mangas.contentId",
          "Mangas.image",
          "Mangas.type",
          "Mangas.statistical",
          "Mangas.description",
          "Mangas.author",
          "Mangas.fanmade",
          "Mangas.deleted",
          "Mangas.createdAt",
          "Mangas.updatedAt",
          "Mangas.deletedAt",
          "Mangas.translation",
        ],
      },
    ]);

    return result;
  } catch (error) {
    console.log(error);
    res
      .status(STATUS.SERVER_ERROR)
      .json(new ErrorResponse(ERRORCODE.ERROR_SERVER, MESSAGE.ERROR_SERVER));
  }
};
