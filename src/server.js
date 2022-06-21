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

//********************* config imagesPath (public path)
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
route(app);
const MangaModel = require("./models/Manga");
const Slide = require("./models/Slide");
// MangaModel.deleteOne({ name: "Clover" })
//   .then(() => {
//     console.log("deleted");
//   })
//   .catch((error) => console.log(error));

// MangaModel.create({
//   name: "Vùng đất linh hồn",
//   anotherName:
//     "Trở về vùng đất linh hồn, Spirited away, Sen to Chihiro no Kamikakushi",
//   image: "/image/vdlh.jpg", // updating...(ex: require)
//   author: "Miyazaki Hayao, Suzuki Toshio",
//   type: ["Action", "Drama", "Kỳ ảo", "Tâm lí", "16+"],
//   serve: "all",
//   description:
//     "Chihiro Ogino là một cô bé 10 tuổi, đang cùng gia đình chuyển đến nhà mới thì cha cô rẽ nhầm một con đường lạ. Họ vô tình bước vào một thế giới ma thuật mà cha của Chihiro kiên quyết khám phá. Khi cha mẹ của Chihiro ăn tại một nhà hàng không người, cô tìm thấy một nhà tắm công cộng tráng lệ. Cô gặp một chàng trai trẻ, Haku, người khuyên cô mau trở lại con sông trước khi trời tối. Dù vậy, Chihiro phát hiện ra đã quá trễ, cha mẹ cô đã bị biến thành heo và cô không thể vượt qua con sông khi thủy triều đang dâng cao, khiến cô bị mắc kẹt trong thế giới linh hồn.Sau khi gặp lại Chihiro, Haku tìm cho cô một công việc từ Kamaji, một người đàn ông làm việc tại nhà tắm công cộng. Kamaji và một nhân viên tên Rin dắt Chihiro đến phù thủy Yubaba, người cai quản nhà tắm. Yubaba cho cô một công việc và đặt cho cô một cái tên mới: Sen (千?). Lúc đến thăm cha mẹ mình tại chuồng heo, Sen tìm lại một tấm thiệp chia tay gửi đến Chihiro và nhận ra cô đã quên mất tên thật của mình. Haku cho cô bé biết rằng Yubaba điều khiển người giúp việc bằng cách lấy đi tên thật của họ và cô sẽ bị mắc kẹt lại thế giới linh hồn nếu không nhớ được tên của mình. Trong lúc làm việc, Sen mời một sinh vật luôn im lặng đeo mặt nạ có tên là Vô Diện vào trong nhà tắm công cộng, tin rằng đó là một khách hàng. Một 'linh hồn hôi thối' bất ngờ đến và là khách hàng đầu tiên của Sen. Cô bé nhận ra đây là vị thần của một con sông bị ô nhiễm. Để nhớ ơn người làm ông ta sạch sẽ, vị thần tặng cho cô một chiếc bánh bao thảo mộc thần kỳ. Trong lúc đó, Vô Diện dụ dỗ một nhân viên bằng vàng và nuốt chửng anh ta. Vô Diện đòi phục vụ thức ăn và trả tiền rất hậu hĩnh. Khi mọi người kéo đến mong chờ trả tiền, Vô Diện nuốt thêm hai nhân viên tham lam nữa.…",
//   status: "Đã hoàn thành",
//   hot: false,
//   statistical: { likes: 2449, hearts: 100, comments: 328, views: 5224 }, // updating...(ex: require)
//   chapters: [], // updating... (ex: require)
//   fanmade: false,
// })
//   .then((data) => console.log(data))
//   .catch((error) => console.log(error));

/****** populate */
// async function getSlides() {
//   console.log("fuck");
//   try {
//     const slides = await Slide.find({
//       _id: "6205eb72be1da090e957979f",
//     }).populate("manga");
//     if (!slides) {
//       console.log("Something went wrong !!!");
//     }
//     console.log(slides);
//   } catch (err) {
//     console.error(err);
//   }
// }
// getSlides();
// const Manga = require("./models/Manga");
// Manga.remove()
//   .then(() => console.log("success remove"))
//   .catch((error) => console.log(error));

// async function createSlide() {
//   const slide = new Slide({
//     image: "/image/s2.jpg",
//     manga: "6222dbd6ed536dbd287df495",
//   });
//   try {
//     const createdSlide = await slide.save();
//     if (!createdSlide) {
//       res.json(error);
//     }
//     console.log({ status: "ok", createdSlide: createdSlide });
//   } catch (error) {
//     console.log(error);
//   }
// }
// // createSlide();
