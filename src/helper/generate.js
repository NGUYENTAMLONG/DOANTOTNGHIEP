var randomstring = require("randomstring");

module.exports.GenerateOTP = () => {
  return randomstring.generate(7);
};
