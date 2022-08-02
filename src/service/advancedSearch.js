const { SERVE, COUNTRY, MANGA_STATUS } = require("../config/default");

function filterMangas(req) {
  const match = {};
  if (req.query.type) {
    match.type = req.query.type;
  }
  if (req.query.status) {
    match.status =
      req.query.status === "true"
        ? MANGA_STATUS.FINISHED
        : MANGA_STATUS.UNFINISHED;
  }
  if (req.query.serve) {
    if (req.query.serve === SERVE.MALE) {
      match.serve = SERVE.MALE;
    } else if (req.query.serve === SERVE.FEMALE) {
      match.serve = SERVE.FEMALE;
    } else {
      match.serve = SERVE.ALL;
    }
  }
  if (req.query.hot) {
    match.hot = req.query.hot === "true" ? true : false;
  }
  if (req.query.country) {
    if (req.query.country === COUNTRY.JP) {
      match.country = COUNTRY.JP;
    } else if (req.query.country === COUNTRY.CN) {
      match.country = COUNTRY.CN;
    } else if (req.query.country === COUNTRY.US) {
      match.country = COUNTRY.US;
    } else {
      match.country = COUNTRY.KR;
    }
  }
  return match;
}
module.exports = filterMangas;
