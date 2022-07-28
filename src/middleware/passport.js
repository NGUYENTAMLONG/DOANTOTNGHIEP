const dotenv = require("dotenv");
const passport = require("passport");
const bcrypt = require("bcrypt");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const FacebookStrategy = require("passport-facebook").Strategy;
const LocalStrategy = require("passport-local").Strategy;
dotenv.config();

const { PASSPORT } = require("../config/default");
const UserLocal = require("../models/UserLocal");
const UserGoogle = require("../models/UserGoogle");
const UserFacebook = require("../models/UserFacebook");

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
      UserGoogle.findOrCreate(
        {
          googleId: profile.id,
          username: profile.displayName,
          email: profile.emails[0].value,
          avatar: profile.photos[0].value,
        },
        function (err, user) {
          if (err) {
            console.log("ERROR OAUTH:", err);
            return;
          }
          return cb(null, user);
        }
      );
    }
  )
);
passport.use(
  new FacebookStrategy(
    {
      clientID: process.env.FACEBOOK_CLIENT_ID,
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
      callbackURL: "/auth/facebook/callback",
      profileFields: ["id", "displayName", "photos", "email"],
    },
    async function (accessToken, refreshToken, profile, cb) {
      console.log({ accessToken, refreshToken, profile });
      try {
        const foundAccount = await UserFacebook.findOne({
          facebookId: profile.id,
        });
        if (foundAccount) {
          return cb(null, foundAccount);
        } else {
          const createdUser = await UserFacebook.create({
            facebookId: profile.id,
            username: profile.displayName,
            email: profile.emails[0].value,
            avatar: profile.photos[0].value,
          });
          return cb(null, createdUser);
        }
      } catch (error) {
        return cb(error);
      }
    }
  )
);
passport.use(
  new LocalStrategy(function (username, password, done) {
    UserLocal.findOne({ username: username }, async function (err, user) {
      if (err) {
        return done(err);
      }
      if (!user) {
        return done(null, false);
      }
      const matched = await bcrypt.compare(password, user.password);
      if (!matched) {
        return done(null, false);
      }
      console.log(user);
      return done(null, user);
    });
  })
);

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});
