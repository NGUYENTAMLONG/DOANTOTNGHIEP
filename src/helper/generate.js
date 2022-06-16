const randomstring = require("randomstring");
const uniqid = require("uniqid");
module.exports.GenerateOTP = () => {
  return randomstring.generate(7);
};

module.exports.GenerateReplyId = () => {
  return uniqid("replyId-");
};
