const express = require("express");
const siteRouter = require("../routers/directions/site");
const categoryRouter = require("../routers/directions/showCategory");
const manageRouter = require("../routers/directions/manage");
const detailRouter = require("../routers/directions/detail");
const popularRouter = require("../routers/directions/showPopular");
const loginRouter = require("../routers/directions/loginUser");

function route(app) {
  app.use("/category", categoryRouter);
  app.use("/popular", popularRouter);
  app.use("/manage", manageRouter);
  app.use("/detail", detailRouter);
  app.use("/loginUser", loginRouter);
  app.use("/", siteRouter); //siteRouter
}
module.exports = route;
