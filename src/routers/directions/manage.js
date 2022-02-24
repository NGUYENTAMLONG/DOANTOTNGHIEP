const cookieParser = require("cookie-parser");
const express = require("express");
const { showDashboardHrm } = require("../../controllers/HumanController");
const { showDashboardManga } = require("../../controllers/MangaController");

const { login } = require("../../controllers/ManageController");
const Authentication = require("../../middleware/authentication");
const Authorization = require("../../middleware/authorization");
const adminHrmRouter = require("./adminRoutes/hrmAdmin");
const adminMangaRouter = require("./adminRoutes/mangaAdmin");

const router = express.Router();

router.use(cookieParser());
//login admin to manage
//Method: GET - DESC: move to login page
router.get("/admin_hrm", Authorization.authorH, showDashboardHrm);
// router.get("/admin_manga", Authorization.authorM, showDashboardManga);

router.get("/", login);
//Method: POST - Authentication Admin account
router.post("/", Authentication); //set cookie token
// , Authorization.authorH
router.use("/admin_hrm", Authorization.authorH, adminHrmRouter);
// , Authorization.authorM
router.use("/admin_manga", adminMangaRouter);

module.exports = router;
