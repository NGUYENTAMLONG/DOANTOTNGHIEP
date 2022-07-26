const Admin = require("../models/Admin");
const bcrypt = require("bcrypt");
class ManageController {
  login(req, res, next) {
    res.render("admin/login");
  }
}

module.exports = new ManageController();
