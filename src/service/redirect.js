module.exports.redirect = (req, res, status) => {
  return res.status(status).render("error", {
    status: status,
  });
};
