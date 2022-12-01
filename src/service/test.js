const Manga = require("../models/Manga");
const UserFacebook = require("../models/UserFacebook");
const UserGoogle = require("../models/UserGoogle");
const UserLocal = require("../models/UserLocal");
var mongoose = require("mongoose");
async function test(chapterId) {
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
    // await storePublicNotification(res, {
    //   name: NOTIFICATION.PUBLIC.SPACE.PUBLISH,
    //   image: createdManga.image,
    //   content: `Bộ truyện ${createdManga.name} chính thức đổ bộ để phục vụ các bạn đọc ^^`,
    //   fromUser: req.user,
    //   url: `/detail/${createdManga.slug}`,
    // });

    // handleSocket(req.io, NOTIFICATION.PUBLIC.SPACE.PUBLISH, {
    //   name: NOTIFICATION.PUBLIC.SPACE.PUBLISH,
    //   image: createdManga.image,
    //   content: `Bộ truyện ${createdManga.name} chính thức đổ bộ để phục vụ các bạn đọc ^^`,
    //   url: `/detail/${createdManga.slug}`,
    // });
  } catch (error) {
    console.log(error);
  }
}
module.exports = { test };
// test("62d2d886c7c92f9103eb804a");

// 62d2d886c7c92f9103eb8048
