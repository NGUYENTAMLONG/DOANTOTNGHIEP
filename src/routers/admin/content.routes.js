const express = require("express");
const { showInfomationAdmin } = require("../../controllers/AdminController");
const {
  changePasswordInfoAdmin,
  changeEmailInfoAdmin,
} = require("../../controllers/InfomationController");
const Chapter = require("../../models/Chapter");
const Manga = require("../../models/Manga");
const Slide = require("../../models/Slide");
const router = express.Router();

const mangaRouter = require("./content/manga.routes");
const slideRouter = require("./content/slide.routes");
const mailRouter = require("./content/mail.routes");
const blogRouter = require("./content/blog.routes");
//path: /management/content/...
router.use("/manga", mangaRouter);

router.use("/slide", slideRouter);

router.use("/mail", mailRouter);

router.use("/blog", blogRouter);

//path: /management/content/infomation
router.get("/infomation", showInfomationAdmin);
router.patch("/api/change/password", changePasswordInfoAdmin);
router.patch("/api/change/email", changeEmailInfoAdmin);

router.use("/", async (req, res) => {
  try {
    const mangas = await Manga.find();
    const slides = await Slide.find();
    const chapters = await Chapter.find();
    res.render("./admin/contentDashboard", {
      admin: req.user,
      mangas: mangas,
      slides: slides,
    });
  } catch (error) {
    console.log(error);
    res.json(error);
  }
});
module.exports = router;
