const Admin = require("../models/Admin");
const bcrypt = require("bcrypt");
const { STATUS, MESSAGE, ERRORCODE } = require("../config/httpResponse");
const { SuccessResponse } = require("../helper/response");
class ManageController {
  getLogin(req, res) {
    return res.status(STATUS.SUCCESS).render("./admin/login");
  }
  async adminLogout(req, res) {
    req.session.destroy();
    res.status(STATUS.SUCCESS).redirect("/management");
  }
}

module.exports = new ManageController();
