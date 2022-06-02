const express = require("express");
const { Login } = require("../../controllers/AccountController");
const router = express.Router();

router.post("/", Login);

module.exports = router;
