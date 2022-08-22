const express = require("express");
const multer = require("multer");
const path = require("path");
const appRoot = require("app-root-path");
const {
  showAdminDashboard,
  showAdminCreate,
  showAdminTrash,
  softDeleteAdmin,
  softDeleteCheckedAdmin,
  restoreAdmin,
  restoreCheckedAdmin,
  showAnalysis,
  showUserDashboard,
  getAdminList,
  createAdmin,
  createAvatarAdmin,
  getDeletedAdmins,
} = require("../../../controllers/AdminController");

const router = express.Router();

const storageAdmin = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "src/public/avatars/admin");
  },
  filename: (req, file, cb) => {
    console.log(file);
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const uploadAdmin = multer({ storage: storageAdmin }); //for admin

// Get Admin Creating Page
// route:-> /management/human/admin/create...
router.get("/create", showAdminCreate);
// Get Admin Trash Table
// route:-> /management/human/admin/trash...
router.get("/trash", showAdminTrash);
// Get Admin Table
// route:-> /management/human/admin/...
router.get("/", showAdminDashboard);

// Soft Delete Admin
// route:-> /management/human/admin/softDelete/:id...
router.delete("/softDelete/:id", softDeleteAdmin);

// Soft Delete Checked Admin
// route:-> /management/human/admin/softDeleteChecked
router.delete("/softDeleteChecked", softDeleteCheckedAdmin);

// Restore Admin
// route:-> /management/human/admin/restore/:id...
router.patch("/restore/:id", restoreAdmin);

// Restore Checked Admin
// route:-> /management/human/admin/restore/:id...
router.patch("/restoreChecked", restoreCheckedAdmin);

//route (API-JSON): -> /management/human/admin/...
router.get("/api/getList", getAdminList);
router.get("/api/getDeletedAdmins", getDeletedAdmins);
router.post("/api/create", createAdmin);
router.post(
  "/api/create/avatar",
  uploadAdmin.single("avatar"),
  createAvatarAdmin
);

module.exports = router;
