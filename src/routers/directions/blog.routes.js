const express = require("express");
const { getBlogPage } = require("../../controllers/BlogController");
const router = express.Router();

router.get("/", getBlogPage);
// router.get("/", getBlogPage);

module.exports = router;
