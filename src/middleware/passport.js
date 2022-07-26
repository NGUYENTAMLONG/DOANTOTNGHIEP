const dotenv = require("dotenv");
const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;

dotenv.config();

const { PASSPORT } = require("../config/default");
const User = require("../models/User");

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "/auth/google/callback",
    },
    (accessToken, refreshToken, profile, cb) => {
      // Check if google profile exist.

      console.log({ accessToken, refreshToken, profile });
      return cb(null, profile);
      //   if (profile.id) {
      //     User.findOne({
      //       username: `${profile.displayName} - ${profile.id}`,
      //     }).then((existingUser) => {
      //       if (existingUser) {
      //         done(null, existingUser);
      //       } else {
      //         new User({
      //           username: `${profile.displayName} - ${profile.id}`,
      //           passport: PASSPORT.GOOGLE,
      //           email: profile.emails[0].value,
      //           name: profile.name.familyName + " " + profile.name.givenName,
      //           avatar: profile.photos[0].value,
      //         })
      //           .save()
      //           .then((user) => done(null, user));
      //       }
      //     });
      //   }
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});
