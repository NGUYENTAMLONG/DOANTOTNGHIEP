const randomstring = require("randomstring");
// const uniqid = require("uniqid");
module.exports.GenerateOTP = () => {
  return randomstring.generate(7);
};
