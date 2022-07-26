const express = require("express");
const { login } = require("../../controllers/ManageController");
const router = express.Router();

const contentRouter = require("./content.routes");
const humanRouter = require("./human.routes");

//path: /management/content/...
router.use("/human", humanRouter);

router.use("/content", contentRouter);

router.get("/", login);

module.exports = router;
