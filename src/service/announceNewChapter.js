const Manga = require("../models/Manga");
const UserFacebook = require("../models/UserFacebook");
const UserGoogle = require("../models/UserGoogle");
const UserLocal = require("../models/UserLocal");
var mongoose = require("mongoose");
const { NOTIFICATION } = require("../config/default");
const { handleSocket } = require("./socketIO");
const { storePrivateNotification } = require("./storeNotification");
const { STATUS, ERRORCODE, MESSAGE } = require("../config/httpResponse");
const { ErrorResponse } = require("../helper/response");
async function announceNewChapter(req, res, chapterId) {
  try {
    const foundManga = await Manga.findOne({
      contentId: mongoose.Types.ObjectId(chapterId),
    });
    const getFollowUserLocals = await UserLocal.find({
      followedList: { $in: [foundManga._id.toString()] },
    }).select(["_id", "passport"]);
    const getFollowUserFacebooks = await UserFacebook.find({
      followedList: { $in: [foundManga._id.toString()] },
    }).select(["_id", "passport"]);
    const getFollowUserGoogles = await UserGoogle.find({
      followedList: { $in: [foundManga._id.toString()] },
    }).select(["_id", "passport"]);
    console.log({
      getFollowUserLocals,
      getFollowUserFacebooks,
      getFollowUserGoogles,
    });
    // console.log(foundManga);
    console.log(req.user);
    await storePrivateNotification(res, {
      name: NOTIFICATION.PRIVATE.NAME.FOLLOW_PUBLISH,
      image: `${foundManga.image}`,
      content: `Bộ truyện ${foundManga.name} vừa ra mắt chương mới ! Đọc ngay nào ^^`,
      fromUser: req.user._id,
      toUser: [
        ...getFollowUserLocals.concat(
          getFollowUserFacebooks,
          getFollowUserGoogles
        ),
      ],
      url: `/detail/${foundManga.slug}`,
    });

    handleSocket(req.io, req.user && req.user.id, {
      name: NOTIFICATION.PRIVATE.NAME.FOLLOW_PUBLISH,
      image: `${foundManga.image}`,
      content: `Bộ truyện ${foundManga.name} vừa ra mắt chương mới ! Đọc ngay nào ^^`,
      url: `/detail/${foundManga.slug}`,
    });
  } catch (error) {
    console.log(error);
    return res
      .status(STATUS.SERVER_ERROR)
      .json(new ErrorResponse(ERRORCODE.ERROR_SERVER, MESSAGE.BAD_REQUEST));
  }
}
module.exports = { announceNewChapter };
// test("62d2d886c7c92f9103eb804a");

// 62d2d886c7c92f9103eb8048
