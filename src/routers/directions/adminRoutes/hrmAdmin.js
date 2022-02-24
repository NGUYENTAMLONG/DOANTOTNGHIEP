const cookieParser = require("cookie-parser");
const express = require("express");

const {
  register,
  removeAdmin,
  findAdminById,
  findAllAdmins,
  findAllUsers,
  updateAdmin,
  createUser,
  findUserById,
  updateUser,
  removeUser,
  showCreatePage,
  showEditPage,
  showDeletePage,
  storeImage,
  showAvatar,
  showDashboardUser,
  storeImageUser,
  showUserCreationPage,
  showUserAvatar,
  showUserDeletionPage,
} = require("../../../controllers/HumanController");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "images/admins");
  },
  filename: (req, file, cb) => {
    console.log(file);
    cb(null, Date.now() + path.extname(file.originalname));
  },
});
const storageUser = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "images/users");
  },
  filename: (req, file, cb) => {
    console.log(file);
    cb(null, Date.now() + path.extname(file.originalname));
  },
});
const upload = multer({ storage: storage }); //for admin
const uploadUser = multer({ storage: storageUser }); //for user

router.use(cookieParser());

router.get("/avatar/:name", showAvatar); //for admin
router.get("/avatar/user/:name", showUserAvatar);

// (req, res) => {
//   // res.send(req.params.name);
//   // C:/CODE/DO AN TOT NGHIEP/images
//   // ../../../../images/
//   // res.sendFile(path.join(__dirname, "../../../../images/" + req.params.name));
//   res.sendFile(
//     path.join("C:/CODE/DO AN TOT NGHIEP/", "images/" + req.params.name)
//   );
// };
// **************  User Management **************
//show userlist page,user creation page
router.get("/user", showDashboardUser);
router.get("/user/create", showUserCreationPage);
router.get("/user/delete", showUserDeletionPage);

//Method: GET - Find all User accounts
router.get("/user/all", findAllUsers);
//Method: GET - Find all User accounts
router.get("/user/:id", findUserById);
//Method: POST - Create User account
router.post("/user", createUser);
//Method: PUT - Update Admin account by ID, new data
router.put("/user/:id", updateUser);
//Method: DELETE - Delete Admin account by ID
router.delete("/user/:id", removeUser);
// **************  Admin Management **************
// Method: GET - Move to create page
router.get("/create_admin", showCreatePage);
router.get("/edit_admin", showEditPage);
router.get("/delete_admin", showDeletePage);

//Method: GET - Find all Admin accounts
router.get("/admin", findAllAdmins);
//Method: POST - Create Admin account
router.post("/", register);
//Method: DELETE - Delete Admin account
router.delete("/:id", removeAdmin);
//Method: GET - Find Admin account by ID
router.get("/:id", findAdminById);
//Method : PUT - Update Admin account by ID, new data
router.put("/:id", updateAdmin);

// ********* upload file Admin Avatar *********
router.post("/images", upload.single("avatar"), storeImage);
// ********* upload file User Avatar *********
router.post("/user/images", uploadUser.single("avatar"), storeImageUser);

module.exports = router;
