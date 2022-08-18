const express = require("express");
const {
  Login,
  Register,
  Resend,
  VerifyEmail,
  Failure,
} = require("../../controllers/AccountController");
const router = express.Router();
require("../../middleware/passport");

const passport = require("passport");
router.post(
  "/login",
  passport.authenticate("user-local", {
    failureRedirect: "/authen/failure",
  }),
  Login
);

router.post("/verify-email", VerifyEmail);

router.post("/resend-otp", Resend);

router.post("/register", Register);

router.get("/failure", Failure);

module.exports = router;
