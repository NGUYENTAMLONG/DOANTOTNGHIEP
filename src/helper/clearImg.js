const appRoot = require("app-root-path");
const fs = require("fs");
module.exports = function clearImg(name) {
  const path = appRoot + "/images/chapters/" + name;
  try {
    fs.unlinkSync(path);
    //file removed
  } catch (err) {
    console.error(err);
  }
};
