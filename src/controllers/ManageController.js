const Admin = require("../models/Admin");
const bcrypt = require("bcrypt");
const { STATUS, MESSAGE, ERRORCODE } = require("../config/httpResponse");
const { SuccessResponse } = require("../helper/response");
class ManageController {
  getLogin(req, res) {
    return res.status(STATUS.SUCCESS).render("./admin/login");
  }
  async login(req, res, next) {
    const { username, password } = req.body;
    try {
      res.json({ username, password });
    } catch (error) {
      return res
        .status(STATUS.SERVER_ERROR)
        .json(
          new SuccessResponse(ERRORCODE.ERROR_SERVER, MESSAGE.ERROR_SERVER)
        );
    }
  }
}

module.exports = new ManageController();
