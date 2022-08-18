const express = require("express");
const {
  login,
  getLogin,
  adminLogout,
} = require("../../controllers/ManageController");

const router = express.Router();
const passport = require("passport");

const contentRouter = require("./content.routes");
const humanRouter = require("./human.routes");
const { VALUES } = require("../../config/default");
const Authentication = require("../../middleware/authentication");
const {
  AuthorizationHA,
  AuthorizationCA,
} = require("../../middleware/authorization");

//path: /management/:slug/...
router.use("/human", AuthorizationHA, humanRouter);

router.use("/content", AuthorizationCA, contentRouter);

//LOGIN
// Authentication ********************************************
require("../../middleware/passport");
router.post(
  "/login",
  passport.authenticate("admin-local", {
    failureRedirect: "/authen/admin/failure",
  }),
  Authentication
);

router.get("/logout", adminLogout);
router.get("/", getLogin);

module.exports = router;
