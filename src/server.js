// Khai báo thư viện *******************************************

const express = require("express");
const path = require("path");
const ejs = require("ejs");
const reload = require("reload");
const morgan = require("morgan");
const database = require("./config/database");
const route = require("./routers");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const cors = require("cors");
// Khởi tạo server *******************************************
const app = express();

//********************* Khởi tạo cổng server
const PORT = 3416 || process.env.PORT;
app.listen(PORT, () => {
  console.log(`🐲🐲🐲 Server is running on PORT: ${PORT} !!! 🍀🍀🍀`);
});

reload(app);
app.use(cors()); // Cho phép chia sẻ api với localhost khác
//********************* HTTP logger
app.use(morgan("combined")); //thu vien morgan dung de log ra http request tu client -> server
//********************* HTTP logger
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());

//********************* config imagesPath (public path)
app.use("/image", express.static(path.join(__dirname, "public/images")));
app.use("/css", express.static(path.join(__dirname, "public/styles")));
app.use(express.static("public"));
//********************* Config template ejs
app.set("views", path.join(__dirname, "/resources/views"));
app.set("view engine", "ejs");
//********************* Connect to Database (MongoDB) - Kết nối tới cơ sở dữ liệu MONGODB
database.connect();
//********************* Config router app
route(app);
// ******************** Cofig CookieParser
app.use(cookieParser());

const MangaModel = require("./models/Manga");
// MangaModel.deleteOne({ name: "Clover" })
//   .then(() => {
//     console.log("deleted");
//   })
//   .catch((error) => console.log(error));
// MangaModel.create({
//   name: "Phong Vân",
//   anotherName: "Phong Vân truyền kỳ, Fung Wan",
//   image: "/image/phongvan.jpg", // updating...(ex: require)
//   author: "Mã Vĩnh Thành, Đan Thanh",
//   type: ["Action", "Phưu lưu", "Võ thuật", "Kỳ ảo", "16+"],
//   serve: "all",
//   description:
//     "Câu chuyện lấy bối cảnh ở jianghu (cộng đồng võ sĩ) của Trung Quốc vào thời nhà Minh . Hai nhân vật chính - Nie Feng (Wind) - Phong và Bu Jingyun (Cloud) Vân - học võ thuật trong những năm đầu của họ và lớn lên trở thành những nhân vật huyền thoại trong giang hồ . Khi câu chuyện tiến triển, nhiều nhân vật hơn được giới thiệu trong các mạch câu chuyện mới...",
//   status: "Đã hoàn thành",
//   hot: true,
//   statistical: { likes: 2449, hearts: 100, comments: 328, views: 5124 }, // updating...(ex: require)
//   chapters: [
//     1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21,
//   ], // updating... (ex: require)
//   fanmade: false,
// })
//   .then((data) => console.log(data))
//   .catch((error) => console.log(error));
