const express = require("express");
const {
  Login,
  Logout,
  Register,
  Resend,
  VerifyEmail,
} = require("../../controllers/AccountController");
const router = express.Router();
// const dotenv = require("dotenv");
// const passport = require("passport");
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

router.post("/login", Login);

router.delete("/logout", Logout);

router.post("/verify-email", VerifyEmail);

router.post("/resend-otp", Resend);

router.post("/register", Register);

module.exports = router;
