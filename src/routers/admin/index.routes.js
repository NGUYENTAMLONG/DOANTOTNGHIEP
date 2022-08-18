const express = require("express");
const { login, getLogin } = require("../../controllers/ManageController");

const router = express.Router();
const passport = require("passport");

const contentRouter = require("./content.routes");
const humanRouter = require("./human.routes");
const { VALUES } = require("../../config/default");
const Authentication = require("../../middleware/authentication");

//path: /management/:slug/...
router.use("/human", humanRouter);

router.use("/content", contentRouter);

//LOGIN
// Authentication ********************************************
require("../../middleware/passport");

router.get("/info", Authentication, (req, res) => {
  res.json({ FLAG: req.originalUrl });
});
router.get("/", getLogin);
router.post(
  "/login",
  passport.authenticate("admin-local", {
    failureRedirect: "/authen/failure",
  }),
  login
);
module.exports = router;
