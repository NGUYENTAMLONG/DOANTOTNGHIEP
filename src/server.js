// Khai báo thư viện *******************************************
const express = require("express");
const path = require("path");
const ejs = require("ejs");
const morgan = require("morgan");
const database = require("./config/database");
const route = require("./routers/index.routes");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const cors = require("cors");
// Khởi tạo server *******************************************
const app = express();
// const process = require("process");
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
// //******************** Auth0 ******************* */
// const { auth } = require("express-openid-connect");
// const config = {
//   // authRequired: false,
//   // auth0Logout: true,
//   // secret: process.env.SECRET,
//   // baseURL: process.env.BASEURL,
//   // clientID: process.env.BASEURL,
//   // issuerBaseURL: process.env.ISSUER,

//   authRequired: false,
//   auth0Logout: true,
//   secret:
//     "oiumtsxnjpdbhkkwjueehzxebvtjjlgzierahwwjqrnuqyqyrsuzpuwffgizpegawtdzdbvkynrpbjipzxfcnnbyrdkdxzir",
//   baseURL: "http://localhost:3416",
//   clientID: "Dd0kzG9dTjvL52nTAwKgv7d7QDJJO8l6",
//   issuerBaseURL: "https://dev-m7l5oz18.us.auth0.com",
// };

// // auth router attaches /login, /logout, and /callback routes to the baseURL
// app.use(auth(config));

// // req.isAuthenticated is provided from the auth router

// app.get("/testAuth", (req, res) => {
//   res.send(req.oidc.isAuthenticated() ? "Logged in" : "Logged out");
// });
// const { requiresAuth } = require("express-openid-connect");

// app.get("/profile", requiresAuth(), (req, res) => {
//   res.send(JSON.stringify(req.oidc.user));
// });

//***************************************** */

//********************* Connect to Database (MongoDB) - Kết nối tới cơ sở dữ liệu MONGODB

database.connect();

// ******************** Cofig CookieParser
app.use(cookieParser());

//********************* Config router app
route.configRoute(app);

// const View = require("./models/View");
// const Manga = require("./models/Manga");

// async function initViewRepository() {
//   try {
//     const mangas = await Manga.find();
//     for (let i = 0; i < mangas.length; i++) {
//       const createdViewRepo = await View.create({
//         type: "MANGA",
//         check: mangas[i].slug,
//       });
//     }
//     console.log("DONE !");
//   } catch (error) {
//     console.log(error);
//   }
// }
// initViewRepository();
// const MangaModel = require("./models/Manga");
// const Manga = require("./models/Manga");
// const Chapter = require("./models/Chapter");
// const Slide = require("./models/Slide");
// MangaModel.deleteOne({ name: "Clover" })
//   .then(() => {
//     console.log("deleted");
//   })
//   .catch((error) => console.log(error));

// MangaModel.create({
//   name: "Dragon Ball",
//   anotherName: "Bảy viên ngọc rồng",
//   image: "https://cdn-amz.fadoglobal.io/images/I/81S8xoiksVL.jpg", // updating...(ex: require)
//   author: "Toriyama Akira",
//   type: ["Action", "Phưu lưu", "Chiến dịch", "Kỳ ảo", "16+"],
//   serve: "all",
//   description:
//     "Một cậu bé có đuôi khỉ được tìm thấy bởi một ông lão sống một mình trong rừng, ông đặt tên là Son Goku và xem đứa bé như là cháu của mình. Một ngày nọ Goku tình cờ gặp một cô gái tên là Bulma trên đường đi bắt cá về, Goku và Bulma đã cùng nhau truy tìm bảy viên ngọc rồng. Các viên ngọc rồng này chứa đựng một bí mật có thể triệu hồi một con rồng và ban điều ước cho ai sở hữu chúng. Trên cuộc hành trình dài đi tìm những viên ngọc rồng, họ gặp những người bạn (Yamcha, Krillin,Yajirobe, Thiên, Giáo tử, Oolong,...) và những đấu sĩ huyền thoại cũng như nhiều ác quỷ. Họ trải qua những khó khăn và học hỏi các chiêu thức võ thuật đặc biệt để tham gia thi đấu trong đại hội võ thuật thế giới được tổ chức hằng năm. Ngoài các sự kiện đại hội võ thuật, Goku và các bạn còn phải đối phó với các thế lực độc ác như Đại vương Pilaf, Quân đoàn khăn đỏ của Độc nhãn tướng quân, Đại ma vương Picollo và những đứa con của hắn. Chiến binh người Saiya: Radiz, Hoàng tử Saiya Vegeta cùng tên cận vệ Nappa. Rồi họ đi đến Namek, gặp rồng thần của Namek; chạm trán Frieza, khi trở về Trái Đất đụng độ Nhóm android sát thủ (các Android 16, 17, 18,19, 20) và sau đó là quái vật từ tương lai Cell, Kẻ thù từ vũ trụ Majin Buu, thần hủy diệt Beerus, các đối thủ từ các vũ trụ song song, Đối thủ mạnh nhất với Goku là Jiren (đến từ vũ trụ 11)",
//   status: "Đang tiến hành",
//   hot: true,
//   statistical: { likes: 2200, hearts: 5411, comments: 1210, views: 1230000 }, // updating...(ex: require)
//   contentId: "62b94f45e599a225e0a674a0", // updating... (ex: require)
//   fanmade: false,
// })
//   .then((data) => console.log(data))
//   .catch((error) => console.log(error));
