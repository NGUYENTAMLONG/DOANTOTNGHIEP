module.exports.redirect = (req, res, status) => {
  return res.status(status).render("error.ejs", {
    status: status,
  });
};
