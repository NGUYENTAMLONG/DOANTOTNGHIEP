const moment = require("moment");
const { redirect } = require("../service/redirect");
const { STATUS, ERRORCODE, MESSAGE } = require("../config/httpResponse");
const { ErrorResponse, SuccessResponse } = require("../helper/response");

class dataController {
  async showDataDashboard(req, res) {
    try {
      res.render("admin/data/dashboard", {
        admin: req.user,
        moment,
      });
    } catch (error) {
      console.log(error);
      redirect(req, res, STATUS.SERVER_ERROR);
    }
  }
}

module.exports = new dataController();
