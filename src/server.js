// Khai báo thư viện *******************************************
const express = require("express");
const path = require("path");
const passport = require("passport");
const ejs = require("ejs");
const morgan = require("morgan");
const database = require("./config/database");
const route = require("./routers/index.routes");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const cors = require("cors");
require("./middleware/passport");

// Khởi tạo server *******************************************
const app = express();

const cookieSession = require("cookie-session");
const session = require("express-session");

// app.use(
//   cookieSession({
//     maxAge: 30 * 24 * 60 * 60 * 1000,
//     keys: ["ABC"],
//   })
// );
app.use(session({ secret: "cats", resave: false, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());
app.get(
  "/auth/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
  })
);
app.get(
  "/auth/google/callback",
  passport.authenticate("google", {
    successRedirect: "/",
    failureRedirect: "/auth/failure",
  })
);
app.get("/auth/failure", (req, res) => {
  res.json("UNAUTHORIZED");
});

//********************* Khởi tạo cổng server
const PORT = process.env.PORT || 3416;
app.listen(PORT, () => {
  console.log(`🐲🐲🐲 Server is running on PORT: ${PORT} !!! 🍀🍀🍀`);
});

app.use(cors()); // Cho phép chia sẻ api với localhost khác
//********************* HTTP logger
//app.use(morgan("combined")); //thu vien morgan dung de log ra http request tu client -> server
//********************* HTTP logger
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
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

//********************* Config router app
route.configRoute(app);
