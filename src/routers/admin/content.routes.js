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
const Blog = require("../../models/Blog");
const { STATUS, ERRORCODE, MESSAGE } = require("../../config/httpResponse");
const { ErrorResponse } = require("../../helper/response");
const Email = require("../../models/Email");
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
  Promise.all([Manga.find(), Slide.find(), Blog.find(), Email.find()])
    .then(([mangas, slides, blogs, emails]) => {
      res.render("./admin/contentDashboard", {
        admin: req.user,
        slides: slides,
        mangas: mangas,
        blogs: blogs,
        emails: emails,
      });
    })
    .catch((error) => {
      console.log(error);
      res
        .status(STATUS.SERVER_ERROR)
        .json(new ErrorResponse(ERRORCODE.ERROR_SERVER, MESSAGE.ERROR_SERVER));
    });
});
module.exports = router;
