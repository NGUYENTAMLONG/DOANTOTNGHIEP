const siteRouter = require("./directions/site.routes");
const categoryRouter = require("./directions/showCategory.routes");
const detailRouter = require("./directions/detail.routes.js");
const justUpdatedRouter = require("./directions/showJustUpdated.routes");
const popularRouter = require("./directions/showPopular.routes.js");
const loginRouter = require("./directions/login.routes.js");
const logoutRouter = require("./directions/logout.routes.js");
const registerRouter = require("./directions/register.routes.js");
const filterRouter = require("./directions/showFilterManga.routes.js");
const followMangaRouter = require("./directions/showFollowManga.routes.js");
const countryRouter = require("./directions/country.routes");
const managementRouter = require("./admin/index.routes");
const viewsRouter = require("./directions/views.api.routes");
const advancedSearchRouter = require("./directions/advancedSearch.routes");
const historyRouter = require("./directions/history.routes");
const AuthenUser = require("../middleware/authenUser");

function configRoute(app) {
  app.use("/follow", AuthenUser, followMangaRouter);
  app.use("/filter", AuthenUser, filterRouter);
  app.use("/category", AuthenUser, categoryRouter);
  app.use("/just-updated", AuthenUser, justUpdatedRouter);
  app.use("/popular", AuthenUser, popularRouter);
  app.use("/country", AuthenUser, countryRouter);
  app.use("/detail", AuthenUser, detailRouter);
  app.use("/login", loginRouter);
  app.use("/logout", logoutRouter);
  app.use("/register", registerRouter);
  app.use("/management", managementRouter); //For Admin
  app.use("/views", viewsRouter); //For Admin
  app.use("/advanced-search", AuthenUser, advancedSearchRouter); //For Admin
  app.use("/history", AuthenUser, historyRouter);
  app.use("/", AuthenUser, siteRouter);
}

module.exports = { configRoute };
