async function Authentication(req, res, next) {
  if (req.user) {
    req.user = {
      id: req.user._id,
      avatar: req.user.avatar,
      username: req.user.username,
      email: req.user.email,
      provider: req.user.passport,
    };
    next();
    return;
  } else {
    next();
    return;
  }
}

module.exports = Authentication;

// if (req.user.passport === "LOCAL") {
//   req.user = {
//     id: req.user._id,
//     avatar: req.user.avatar,
//     username: req.user.username,
//     email: req.user.email,
//     provider: req.user.passport,
//   };
//   next();
//   return;
// } else {
//   console.log("HERE=>", req.user);
//   req.user = {
//     // avatar: req.user.photos[0].value,
//     // username: req.user.displayName,
//     // email: req.user.emails[0].value,
//     // provider: req.user.provider,
//     avatar: req.user.avatar,
//     username: req.user.username,
//     email: req.user.email,
//     provider: req.user.provider,
//   };
//   next();
//   return;
// }
