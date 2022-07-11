const express = require("express");
const {
  Register,
  AuthenAccount,
} = require("../../controllers/AccountController");
const router = express.Router();

router.post("/authentication", AuthenAccount);
router.post("/", Register);

module.exports = router;
