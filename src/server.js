// Khai báo thư viện *******************************************
const express = require("express");
const path = require("path");
const passport = require("passport");
// const ejs = require("ejs");
const morgan = require("morgan");
const database = require("./config/database");
const route = require("./routers/index.routes");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const { VALUES } = require("./config/default");

// Khởi tạo server *******************************************
const app = express();

//********************* Khởi tạo cổng server

const PORT = process.env.PORT || 3416;
const server = app.listen(PORT, () => {
  console.log(`🐲🐲🐲 Server is running on PORT: ${PORT} !!! 🍀🍀🍀`);
});

// Authentication ********************************************
require("./middleware/passport");

const session = require("express-session");

app.use(
  session({
    secret: VALUES.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
      maxAge: 30 * 24 * 60 * 60 * 1000,
    },
  })
);

app.use(passport.initialize());
app.use(passport.session());
//OAUTH GOOGLE
app.get(
  "/auth/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
  })
);
app.get(
  "/auth/google/callback",
  passport.authenticate("google", {
    successRedirect: "back",
    failureRedirect: "/authen/failure",
    failureFlash: "Invalid Google credentials.",
  })
);
//OAUTH FACEBOOK
app.get(
  "/auth/facebook",
  passport.authenticate("facebook", {
    scope: ["email"],
  })
);
app.get(
  "/auth/facebook/callback",
  passport.authenticate("facebook", {
    successRedirect: "back",
    failureRedirect: "/authen/failure",
  })
);

app.get("/logout", (req, res) => {
  req.session.destroy();
  return res.status(STATUS.SUCCESS).redirect("/");
});

app.use(cors()); // Cho phép chia sẻ api với localhost khác
//********************* HTTP logger
//app.use(morgan("combined")); //thu vien morgan dung de log ra http request tu client -> server
//********************* HTTP logger
app.use(express.json());
app.use(express.urlencoded({ limit: "50mb", extended: true }));
app.use(bodyParser.json());
//************************ Config Froala
const appRootPath = require("app-root-path");

app.use(
  "/froalacss",
  express.static(
    path.join(
      appRootPath.path,
      "/node_modules/froala-editor/css/froala_editor.pkgd.min.css"
    )
  )
);

app.use(
  "/froalajs",
  express.static(
    path.join(
      appRootPath.path,
      "/node_modules/froala-editor/js/froala_editor.pkgd.min.js"
    )
  )
);
app.use(
  "/deleteImage",
  express.static(
    path.join(
      appRootPath.path,
      "/node_modules/froala-editor/js/plugins/image.min.js"
    )
  )
);
//********************* config imagesPath (public path)
app.use("/public", express.static(__dirname + "/public"));
app.use("/image", express.static(path.join(__dirname, "public/images")));
app.use("/css", express.static(path.join(__dirname, "public/styles")));
app.use("/js", express.static(path.join(__dirname, "public/javascripts")));

app.use(express.static("public"));

//********************* Config template ejs
app.set("views", path.join(__dirname, "/resources/views"));
app.set("view engine", "ejs");
//********************* Connect to Database (MongoDB) - Kết nối tới cơ sở dữ liệu MONGODB

database.connect();
// ******************** Cofig CookieParser
app.use(cookieParser());

//******************** Config socket io */
const socketIo = require("socket.io");

const {
  initHRAdminAcount,
  initContentAdminAcount,
} = require("./service/initialization");
const { STATUS } = require("./config/httpResponse");
const io = socketIo(server, { cors: { origin: "*", path: "/" } });
require("events").EventEmitter.defaultMaxListeners = 0;
// const { test } = require("./service/test");
// (async () => {
//   test("62d5710c85e73ad364ab0f0f");
// })();

app.use((req, res, next) => {
  req.io = io;
  io.on("connection", function (socket) {
    console.log("Connected Socket!", socket.id);
    // console.log({ USER: req.user, socketID: socket.id });
    // io.emit(req.user && req.user.id, "ABC");
    // setTimeout(() => {
    //   test(req, "62d5710c85e73ad364ab0f0f");
    // }, 15000);
  });

  return next();
});
//********************* Config router app
route.configRoute(app);
//********************* Config admin account
(async () => {
  await initHRAdminAcount();
  await initContentAdminAcount();
})();

//******************** Config socket io */
// const io = require("socket.io")(server);
// const handleSocket = require("./service/socketIO");
// io.on("connection", function (socket) {
//   console.log("Connected Socket!", socket.id);
//   handleSocket(socket);
// });

// const socketIo = require("socket.io");
// const io = socketIo(server, { cors: { origin: "*" } });
// app.use((req, res, next) => {
//   req.io = io;
//   return next();
// });

module.exports = server;
