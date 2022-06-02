const express = require("express");
const siteRouter = require("./directions/site.routes");
const categoryRouter = require("./directions/showCategory.routes");
const manageRouter = require("./directions/manage.routes.js");
const detailRouter = require("./directions/detail.routes.js");
const popularRouter = require("./directions/showPopular.routes.js");
const loginRouter = require("./directions/login.routes.js");
const logoutRouter = require("./directions/logout.routes.js");
const registerRouter = require("./directions/register.routes.js");
const newMangaRouter = require("./directions/showNewManga.routes.js");
const commentRouter = require("./directions/comment.routes.js");
const AuthenUser = require("../middleware/authenUser");
function route(app) {
  app.use("/newmanga", newMangaRouter);
  app.use("/category", AuthenUser, categoryRouter);
  app.use("/popular", AuthenUser, popularRouter);
  app.use("/manage", manageRouter);
  app.use("/detail", AuthenUser, detailRouter);
  app.use("/comment", commentRouter);
  app.use("/login", loginRouter);
  app.use("/logout", logoutRouter);
  app.use("/register", registerRouter);
  app.use("/", AuthenUser, siteRouter); //siteRouter
}
module.exports = route;
