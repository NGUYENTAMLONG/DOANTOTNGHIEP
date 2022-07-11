// const express = require("express");
// const router = express.Router();

// const mangaRouter = require("./manga/manga.routes");

// // const Slide = require("../../../models/Slide");
// // *************** Slide Controller ***********
// const slideRouter = require("./manga/slide.routes");
// router.use("/slide", slideRouter);
// // show dashboard page
// router.get("/slideDashboard", async (req, res) => {
//   res.json("Dashboard");
// });
// // *************** Manga Controller ***********
// // *******************************
// router.use("/manga", mangaRouter);

// module.exports = router;

const express = require("express");

const router = express.Router();

const mangaRouter = require("./manga/manga.routes");
const slideRouter = require("./manga/slide.routes");

//path: /management/content/...
router.use("/manga", mangaRouter);

router.use("/slide", slideRouter);

router.use("/", (req, res) => {
  res.json("CONTENT MANAGEMENT DASHBOARD");
});
module.exports = router;
