const siteRouter = require("./directions/site.routes");
const categoryRouter = require("./directions/showCategory.routes");
const detailRouter = require("./directions/detail.routes.js");
const popularRouter = require("./directions/showPopular.routes.js");
const loginRouter = require("./directions/login.routes.js");
const logoutRouter = require("./directions/logout.routes.js");
const registerRouter = require("./directions/register.routes.js");
const newMangaRouter = require("./directions/showNewManga.routes.js");
const followMangaRouter = require("./directions/showFollowManga.routes.js");
const completeRouter = require("./directions/complete.routes");
const AuthenUser = require("../middleware/authenUser");
const {
  createChapter,
  publishChapter,
  testPopulate,
} = require("../controllers/CreateChapter");

function userRoute(app) {
  app.use("/newmanga", AuthenUser, newMangaRouter);
  app.use("/follow", AuthenUser, followMangaRouter);
  app.use("/category", AuthenUser, categoryRouter);
  app.use("/popular", AuthenUser, popularRouter);
  app.use("/complete", AuthenUser, completeRouter);
  app.use("/detail", AuthenUser, detailRouter);
  app.use("/login", loginRouter);
  app.use("/logout", logoutRouter);
  app.use("/register", registerRouter);
  app.use("/", AuthenUser, siteRouter); //siteRouter
}

const adminContentRouter = require("./admin/content.routes");
const adminHumanRouter = require("./admin/human.routes");

function adminRoute(app) {
  app.use(
    "/management/content",
    (req, res, next) => {
      // res.json("ADMIN PAGE");
      next();
    },
    adminContentRouter
  );
  app.use(
    "/management/human",
    (req, res, next) => {
      // res.json("ADMIN PAGE");
      next();
    },
    adminHumanRouter
  );
  app.post("/createChapter/:mangaId", createChapter);
  app.post("/publishChapter/:id", publishChapter);
  app.get("/testPopulate/:mangaId", testPopulate);
}

module.exports = { adminRoute, userRoute };
