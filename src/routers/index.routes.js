const siteRouter = require("./directions/site.routes");
const categoryRouter = require("./directions/showCategory.routes");
const detailRouter = require("./directions/detail.routes.js");
const justUpdatedRouter = require("./directions/showJustUpdated.routes");
const popularRouter = require("./directions/showPopular.routes.js");
const authenRouter = require("./directions/authen.routes.js");
const filterRouter = require("./directions/showFilterManga.routes.js");
const followMangaRouter = require("./directions/showFollowManga.routes.js");
const countryRouter = require("./directions/country.routes");
const managementRouter = require("./admin/index.routes");
const viewsRouter = require("./directions/views.api.routes");
const advancedSearchRouter = require("./directions/advancedSearch.routes");
const historyRouter = require("./directions/history.routes");
const chartRouter = require("./directions/chart.routes");
const AuthenUser = require("../middleware/authenUser");
const Authentication = require("../middleware/authentication");

function configRoute(app) {
  app.use("/follow", Authentication, followMangaRouter);
  app.use("/filter", Authentication, filterRouter);
  app.use("/category", Authentication, categoryRouter);
  app.use("/just-updated", Authentication, justUpdatedRouter);
  app.use("/popular", Authentication, popularRouter);
  app.use("/country", Authentication, countryRouter);
  app.use("/detail", Authentication, detailRouter);
  app.use("/authen", authenRouter);
  app.use("/management", managementRouter); //For Admin
  app.use("/views", viewsRouter); //For Admin
  app.use("/advanced-search", Authentication, advancedSearchRouter); //For Admin
  app.use("/history", Authentication, historyRouter);
  app.use("/chart", Authentication, chartRouter);
  app.use("/", Authentication, siteRouter);
}

module.exports = { configRoute };
