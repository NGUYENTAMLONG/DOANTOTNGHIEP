const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();
async function connect() {
  try {
    // mongodb+srv://tamlongnguyen:tamlong164@cluster0.ku9cd.mongodb.net/MangaDB?retryWrites=true&w=majority
    // await mongoose.connect(process.env.MONGO_URL);
    await mongoose.connect(
      "mongodb+srv://tamlongnguyen:tamlong164@cluster0.ku9cd.mongodb.net/MangaDB?retryWrites=true&w=majority"
    );

    console.log("🌈🌈🌈 Connected to Mongoose !!!");
  } catch (error) {
    console.log(error);
  }
}
module.exports = { connect };
