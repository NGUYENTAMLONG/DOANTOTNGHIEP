const Admin = require("../models/Admin");
// const User = require("../models/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const dotenv = require("dotenv");
const fs = require("fs");
const path = require("path");
const { VALUES } = require("../config/default");
const { STATUS } = require("../config/httpResponse");
dotenv.config();
class humanController {
  async showDeletePage(req, res) {
    const token = req.cookies.token;
    try {
      // const tokenVerify = jwt.verify(token, process.env.TOKEN_SECRET);
      const tokenVerify = jwt.verify(token, VALUES.TOKEN_SECRET);

      const admin = await Admin.findOne({ account: tokenVerify.account });
      const adminList = await Admin.find();
      res.render("admin/delete", { admin, adminList });
    } catch (error) {
      console.log(error);
      res.status(400).json({ error: error });
    }
  }
  async showCreatePage(req, res) {
    const token = req.cookies.token;
    try {
      // const tokenVerify = jwt.verify(token, process.env.TOKEN_SECRET);
      const tokenVerify = jwt.verify(token, VALUES.TOKEN_SECRET);

      const admin = await Admin.findOne({ account: tokenVerify.account });
      const adminList = await Admin.find();
      res.render("admin/create", { admin, adminList });
    } catch (error) {
      console.log(error);
      res.status(400).json({ error: error });
    }
  }
  async showEditPage(req, res) {
    const token = req.cookies.token;
    try {
      // const tokenVerify = jwt.verify(token, process.env.TOKEN_SECRET);
      const tokenVerify = jwt.verify(token, VALUES.TOKEN_SECRET);

      const admin = await Admin.findOne({ account: tokenVerify.account });
      const adminList = await Admin.find();
      res.render("admin/edit", { admin, adminList });
    } catch (error) {
      console.log(error);
      res.status(400).json({ error: error });
    }
  }
  async showAdminDashboard(req, res) {
    try {
      // const admin = await Admin.findOne({ account: tokenVerify.account });
      res.json("HEERER");
    } catch (error) {
      console.log(error);
      res.status(400).json({ error: error, message: "No Authentication" });
    }
  }
  async showHumanAnalysis(req, res) {
    try {
      // const admin = await Admin.findOne({ account: tokenVerify.account });
      res.status(STATUS.SUCCESS).render("admin/human/analysis/analysis");
    } catch (error) {
      console.log(error);
      res.status(400).json({ error: error, message: "No Authentication" });
    }
  }
  //************* Admin Controller ******************
  //create Admin account
  async storeImage(req, res) {
    // console.log("Success Upload Image!!!");
    console.log(req.file);
    res.json(req.file);
  }
  async register(req, res, next) {
    const {
      account,
      password: plainTextPassword,
      email,
      role,
      avatar,
    } = req.body;
    if (!account || typeof account !== "string") {
      res.json({ status: "error", error: "Invalid account !!!" });
    }
    if (!plainTextPassword || typeof plainTextPassword !== "string") {
      res.json({ status: "error", error: "Invalid password!!!" });
    }
    if (plainTextPassword.length < 6) {
      return res.json({
        status: "error",
        error: "Password too small. Should be at least 6 characters !!!",
      });
    }
    try {
      const salt = await bcrypt.genSalt(10);
      const password = await bcrypt.hash(plainTextPassword, salt);
      const response = await Admin.create({
        account,
        password,
        email,
        role,
        avatar,
      });
      console.log("Admin created successfully: ", response);
      res.status(200).json({ admin: response });
    } catch (error) {
      if (error.code === 11000) {
        // duplicate key
        return res.json({
          status: "error",
          error: error.keyValue,
        });
      }
      console.log("Error:", error);
    }
  }
  // delete Admin account
  async removeAdmin(req, res, next) {
    const idAdmin = req.params.id;
    try {
      const admin = await Admin.findById(idAdmin);
      fs.unlinkSync(`./images/admins/${admin.avatar}`);
      //file removed
    } catch (error) {
      console.log(error);
      res.status(500).json(error);
    }
    try {
      const deletedAdmin = await Admin.findByIdAndDelete(idAdmin);
      if (!deletedAdmin) {
        res
          .status(401)
          .json({ status: "error", error: "Something went wrong !!!" });
      }
      res
        .status(200)
        .json({ status: "ok", message: "Successfully deleted !!!" });
    } catch (error) {
      console.log(error);
      res.status(500).json(error);
    }
  }
  // find Admin account (by ID)
  async findAdminById(req, res, next) {
    const idAdmin = req.params.id;
    try {
      const admin = await Admin.findById(idAdmin);
      if (!admin) {
        res.status(403).json({ status: "error", message: "Not Found !!!" });
      }
      res.status(200).json({ status: "ok", admin: admin });
    } catch (error) {
      console.log(error);
      res.status(500).json(error);
    }
  }
  // find All Admin accounts
  async findAllAdmins(req, res, next) {
    try {
      const admins = await Admin.find({});
      if (!admins) {
        res
          .status(403)
          .json({ status: "error", message: "Admin list is empty !!!" });
      }
      res.status(200).json({ status: "ok", admins: admins });
    } catch (error) {
      console.log(error);
      res.status(500).json(error);
    }
  }
  // update Admin account
  async updateAdmin(req, res, next) {
    const idAmin = req.params.id;
    const {
      account,
      password: plainTextPassword,
      email,
      role,
      avatar,
    } = req.body;
    if (!account || typeof account !== "string") {
      res.json({ status: "error", error: "Invalid account !!!" });
    }
    if (!plainTextPassword || typeof plainTextPassword !== "string") {
      res.json({ status: "error", error: "Invalid password!!!" });
    }
    if (plainTextPassword.length < 6) {
      return res.json({
        status: "error",
        error: "Password too small. Should be at least 6 characters !!!",
      });
    }
    try {
      const salt = await bcrypt.genSalt(10);
      const password = await bcrypt.hash(plainTextPassword, salt);
      const updatedAdmin = await Admin.findByIdAndUpdate(idAmin, {
        account,
        password,
        email,
        role,
        avatar,
      });
      if (!updatedAdmin) {
        res.status(401).json({
          status: "error",
          message: "Something went wrong while updating !!!",
          error: error,
        });
      }
      res.status(200).json({
        status: "ok",
        message: "Successfully updated !!!",
        updatedAdmin: updatedAdmin,
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({ status: "error", error: error });
    }
  }
  //************* User Controller ******************
  // upload user avatar
  async storeImageUser(req, res, next) {
    console.log(req.file);
    res.json(req.file);
  }
  //show dashboard User
  async showDashboardUser(req, res, next) {
    const token = req.cookies.token;
    try {
      // const tokenVerify = jwt.verify(token, process.env.TOKEN_SECRET);
      const tokenVerify = jwt.verify(token, VALUES.TOKEN_SECRET);

      const admin = await Admin.findOne({ account: tokenVerify.account });
      const users = await User.find();
      if (!users) {
        res
          .status(403)
          .json({ status: "error", message: "Users list is empty !!!" });
      }
      res.render("admin/userList.ejs", { userList: users, admin });
    } catch (error) {
      console.log(error);
      res.status(500).json(error);
    }
  }
  //show user creation page
  async showUserCreationPage(req, res, next) {
    const token = req.cookies.token;
    try {
      // const tokenVerify = jwt.verify(token, process.env.TOKEN_SECRET);
      const tokenVerify = jwt.verify(token, VALUES.TOKEN_SECRET);

      const admin = await Admin.findOne({ account: tokenVerify.account });
      res.render("admin/createUser", { admin });
    } catch (error) {
      console.log(error);
      res.status(400).json({ error: error });
    }
  }
  // show user deletion page
  async showUserDeletionPage(req, res, next) {
    const token = req.cookies.token;
    try {
      // const tokenVerify = jwt.verify(token, process.env.TOKEN_SECRET);
      const tokenVerify = jwt.verify(token, VALUES.TOKEN_SECRET);

      const admin = await Admin.findOne({ account: tokenVerify.account });
      const userList = await User.find();
      res.render("admin/deleteUser", { admin, userList });
    } catch (error) {
      console.log(error);
      res.status(400).json({ error: error });
    }
  }
  // find All User accounts
  async findAllUsers(req, res, next) {
    try {
      const users = await User.find();
      if (!users) {
        res
          .status(403)
          .json({ status: "error", message: "Users list is empty !!!" });
      }
      res.status(200).json({ status: "ok", users: users });
    } catch (error) {
      console.log(error);
      res.status(500).json(error);
    }
  }
  // find User account (by ID)
  async findUserById(req, res, next) {
    const idUser = req.params.id;
    try {
      const user = await User.findById(idUser);
      if (!user) {
        res.status(403).json({ status: "error", message: "Not Found !!!" });
      }
      res.status(200).json({ status: "ok", user: user });
    } catch (error) {
      console.log(error);
      res.status(500).json(error);
    }
  }
  // create User account
  async createUser(req, res, next) {
    const { username, password: plainTextPassword, email, avatar } = req.body;
    if (!username || typeof username !== "string") {
      res.json({ status: "error", error: "Invalid username !!!" });
    }
    if (!plainTextPassword || typeof plainTextPassword !== "string") {
      res.json({ status: "error", error: "Invalid password!!!" });
    }
    if (plainTextPassword.length < 6) {
      return res.json({
        status: "error",
        error: "Password too small. Should be at least 6 characters !!!",
      });
    }
    try {
      const salt = await bcrypt.genSalt(10);
      const password = await bcrypt.hash(plainTextPassword, salt);
      const response = await User.create({
        username,
        password,
        email,
        avatar,
      });
      console.log("User created successfully: ", response);
      res.status(200).json({ user: response });
    } catch (error) {
      if (error.code === 11000) {
        // duplicate key
        return res.json({
          status: "error",
          error: error,
        });
      }
      throw error;
      console.log("Error:", error);
      res.status(401).json("Something went wrong while create admin account !");
    }
  }
  // update User account
  async updateUser(req, res, next) {
    const idUser = req.params.id;
    const bodyUpdate = req.body;
    try {
      const updatedUser = await User.findByIdAndUpdate(idUser, bodyUpdate);
      if (!updatedUser) {
        res.status(401).json({
          status: "error",
          message: "Something went wrong while updating !!!",
          error: error,
        });
      }
      res.status(200).json({
        status: "ok",
        message: "Successfully updated !!!",
        updatedUser: updatedUser,
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({ status: "error", error: error });
    }
  }
  // delete User account
  async removeUser(req, res, next) {
    const idUser = req.params.id;
    // Promise.all([User.findById(idUser), User.findByIdAndDelete(idUser)])
    //   .then(([user, deletedUser]) => {
    //     fs.unlinkSync(`./images/users/${user.avatar}`);
    //     if (!deletedUser) {
    //       res
    //         .status(401)
    //         .json({ status: "error", error: "Something went wrong !!!" });
    //     }
    //     res
    //       .status(200)
    //       .json({ status: "ok", message: "Successfully deleted !!!" });
    //   })
    //   .catch((error) => {
    //     console.log(error);
    //     res.status(500).json(error);
    //   });

    try {
      const user = await User.findById(idUser);
      fs.unlinkSync(`./images/users/${user.avatar}`);
      //file removed
    } catch (error) {
      console.log(error);
      res.status(500).json(error);
    }
    try {
      const deletedUser = await User.findByIdAndDelete(idUser);

      // file removed
      if (!deletedUser) {
        res
          .status(401)
          .json({ status: "error", error: "Something went wrong !!!" });
      }

      res
        .status(200)
        .json({ status: "ok", message: "Successfully deleted !!!" });
    } catch (error) {
      console.log(error);
      res.status(500).json(error);
    }
  }
}

module.exports = new humanController();
