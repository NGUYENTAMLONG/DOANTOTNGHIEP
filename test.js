// const fs = require("fs");
// const path = "./images/users/1645066653894.gif";

const Slide = require("./src/models/Slide");

// try {
//   fs.unlinkSync(path);
//   //file removed
// } catch (err) {
//   console.error(err);
// }
async function getSlides() {
  try {
    const slides = await Slide.find({});
    if (!slides) {
      console.log("Something went wrong !!!");
    }
    console.log(slides);
  } catch (err) {
    console.error(err);
  }
}
getSlides();
