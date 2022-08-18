const dotenv = require("dotenv");
const passport = require("passport");
const bcrypt = require("bcrypt");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const FacebookStrategy = require("passport-facebook").Strategy;
const LocalStrategy = require("passport-local").Strategy;
dotenv.config();

const UserLocal = require("../models/UserLocal");
const UserGoogle = require("../models/UserGoogle");
const UserFacebook = require("../models/UserFacebook");
const History = require("../models/History");
const Admin = require("../models/Admin");

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "/auth/google/callback",
    },
    async function (accessToken, refreshToken, profile, cb) {
      // Check if google profile exist.
      console.log({ accessToken, refreshToken, profile });
      try {
        const foundAccount = await UserGoogle.findOne({
          googleId: profile.id,
        });
        if (foundAccount) {
          return cb(null, foundAccount);
        } else {
          const createdHistory = await History.create({});
          console.log(createdHistory);
          const createdUser = await UserGoogle.create({
            googleId: profile.id,
            username: profile.displayName,
            email: profile.emails[0].value,
            avatar: profile.photos[0].value,
            history: createdHistory._id,
          });
          return cb(null, createdUser);
        }
      } catch (error) {
        return cb(error, null);
      }
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
          const createdHistory = await History.create({});
          const createdUser = await UserFacebook.create({
            facebookId: profile.id,
            username: profile.displayName,
            email: profile.emails[0].value,
            avatar: profile.photos[0].value,
            history: createdHistory._id,
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
  "user-local",
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
      return done(null, user);
    });
  })
);

passport.use(
  "admin-local",
  new LocalStrategy(function (username, password, done) {
    Admin.findOne({ username: username }, async function (err, admin) {
      if (err) {
        return done(err);
      }
      if (!admin) {
        return done(null, false);
      }
      const matched = await bcrypt.compare(password, admin.password);
      if (!matched) {
        return done(null, false);
      }
      console.log("admin-local", admin);
      return done(null, admin);
    });
  })
);

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});
