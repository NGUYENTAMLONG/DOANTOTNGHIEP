const express = require("express");
const { Logout } = require("../../controllers/AccountController");
const router = express.Router();

router.post("/", Logout);

module.exports = router;
