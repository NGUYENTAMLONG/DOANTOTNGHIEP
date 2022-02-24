const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();
async function connect() {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log("🌈🌈🌈 Connected to Mongoose !!!");
  } catch (error) {
    console.log(error);
  }
}
module.exports = { connect };
