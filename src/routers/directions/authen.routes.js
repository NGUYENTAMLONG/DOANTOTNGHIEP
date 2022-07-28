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
// const dotenv = require("dotenv");
// const GoogleStrategy = require("passport-google-oauth20").Strategy;
// dotenv.config();

// passport.use(
//   new GoogleStrategy(
//     {
//       clientID: process.env.GOOGLE_CLIENT_ID,
//       clientSecret: process.env.GOOGLE_CLIENT_SECRET,
//       callbackURL: "/auth/google/callback",
//     },
//     (accessToken) => {
//       console.log(accessToken);
//     }
//   )
// );
// router.get(
//   "/google",
//   passport.authenticate("google", {
//     scope: ["profile", "email"],
//   })
// );
// router.get("/google/callback", passport.authenticate("google"));

// router.post("/login", Login);
router.post(
  "/login",
  passport.authenticate("local", {
    failureRedirect: "/authen/failure",
  }),
  Login
);

router.post("/verify-email", VerifyEmail);

router.post("/resend-otp", Resend);

router.post("/register", Register);

router.get("/failure", Failure);

module.exports = router;
