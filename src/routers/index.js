const express = require("express");
const siteRouter = require("../routers/directions/site");
const categoryRouter = require("../routers/directions/showCategory");
const manageRouter = require("../routers/directions/manage");
const detailRouter = require("../routers/directions/detail");

function route(app) {
  app.use("/category", categoryRouter);
  app.use("/manage", manageRouter);
  app.use("/detail", detailRouter);
  app.use("/", siteRouter); //siteRouter
}
module.exports = route;
