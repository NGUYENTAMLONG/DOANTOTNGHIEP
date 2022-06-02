const express = require("express");
const { getNewMangas, getList } = require("../../service/getNewMangas");
const router = express.Router();

router.get("/", getNewMangas);
router.get("/list", getList);

module.exports = router;
