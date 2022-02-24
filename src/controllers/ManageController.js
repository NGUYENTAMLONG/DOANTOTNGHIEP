const Admin = require("../models/Admin");
const bcrypt = require("bcrypt");
class manageController {
  login(req, res, next) {
    res.render("admin/login");
  }
}

module.exports = new manageController();
