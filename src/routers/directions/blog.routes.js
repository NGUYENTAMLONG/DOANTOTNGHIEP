const express = require("express");
const { getBlogPage } = require("../../controllers/BlogController");
const router = express.Router();

router.get("/blog", getBlogPage);

module.exports = router;
