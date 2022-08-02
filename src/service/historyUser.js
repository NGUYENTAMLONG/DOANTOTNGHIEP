const { redirect } = require("express/lib/response");
const { STATUS } = require("../config/httpResponse");
const History = require("../models/History");
const UserFacebook = require("../models/UserFacebook");
const UserGoogle = require("../models/UserGoogle");
const UserLocal = require("../models/UserLocal");

async function setHistory(req, res, mangaId) {
  try {
    if (!req.user) {
      return;
    }
    let foundUser;
    if (req.user.provider === "LOCAL") {
      foundUser = await UserLocal.findById(req.user.id);
    } else if (req.user.provider === "GOOGLE") {
      foundUser = await UserGoogle.findById(req.user.id);
    } else if (req.user.provider === "FACEBOOK") {
      foundUser = await UserFacebook.findById(req.user.id);
    }
    const newVisited = { mangaId: mangaId, visitedAt: new Date() };
    await History.updateOne(
      {
        _id: foundUser.history,
        "mangaList.mangaId": { $ne: newVisited.mangaId },
      },
      {
        $addToSet: { mangaList: newVisited },
      }
    );
  } catch (error) {
    console.log(error);
    redirect(req, res, STATUS.SERVER_ERROR);
  }
}

module.exports = { setHistory };
