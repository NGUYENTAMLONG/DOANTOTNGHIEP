const fs = require("fs");
const path = require("path");
const appRoot = require("app-root-path");

class HandleBase64 {
  decodeBase64(req, res, next) {
    const base64Data = req.body.avatar;
    // Remove header
    let base64Image = base64Data.split(";base64,").pop();
    const dateString = Date.now();
    const urlAvatar = `/public/avatars/user/${dateString}.jpg`;
    const pathAvatar = path.join(
      appRoot.path,
      `/src/public/avatars/user/${dateString}.jpg`
    );
    fs.writeFile(pathAvatar, base64Image, "base64", async function (err) {
      if (err) {
        if (err) {
          res
            .status(STATUS.SERVER_ERROR)
            .json(
              new ErrorResponse(ERRORCODE.ERROR_SERVER, MESSAGE.ERROR_SERVER)
            );
        }
      }
      req.avatar = urlAvatar;
      next();
    });
  }
}

module.exports = new HandleBase64();
