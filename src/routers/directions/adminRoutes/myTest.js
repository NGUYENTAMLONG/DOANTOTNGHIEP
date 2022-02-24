const Manga = require("../../../models/Manga");

// var chapter = {
//   chapterName: "Khoi dau",
//   chapterNumber: 1,
//   chapterImages: [
//     "https://i.ibb.co/pd9sxRD/8d0d17555798.jpg",
//     "https://i.ibb.co/fM17cFz/6fb60bb9d971.jpg",
//     "https://i.ibb.co/CMdPQd8/2904e064b3c7.jpg",
//     "https://i.ibb.co/n1tVFFL/28c0fb58f8d6.jpg",
//   ],
// };
// Manga.findOneAndUpdate({ name: "One Piece" }, { $push: { chapters: chapter } })
//   .then((data) => console.log({ "Success: ": data }))
//   .catch((error) => console.log(error));

const appRoot = require("app-root-path");
// console.log(appRoot + "/images/users/1645111053284.jpg");
const imgbbUploader = require("imgbb-uploader");
imgbbUploader(
  "fdda0f569f21b3ba10f0049d856be914",
  appRoot + "/src/public/images/08.jpg"
)
  .then((response) => console.log(response.display_url))
  .catch((error) => console.error(error));
console.log(appRoot);
// var chapter = { firstName: req.body.fName, lastName: req.body.lName };
// Manga.findOneAndUpdate({ name: req.user.name }, { $push: { friends: friend } });
