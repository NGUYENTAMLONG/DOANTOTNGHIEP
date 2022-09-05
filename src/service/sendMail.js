const nodemailer = require("nodemailer");
const path = require("path");
const appRoot = require("app-root-path");
const { ADMIN_EMAIL, JWT } = require("../config/default");
const { MESSAGE } = require("../config/httpResponse");
const jwt = require("jsonwebtoken");
async function sendRegisterMail(toEmail, otp) {
  const EMAIL = ADMIN_EMAIL.EMAIL;
  const EMAILPASSWORD = ADMIN_EMAIL.PASSWORD;
  const SERVICE = ADMIN_EMAIL.SERVICE;
  // console.log({ EMAIL, EMAILPASSWORD, SERVICE, toEmail });
  let transporter = nodemailer.createTransport({
    service: SERVICE,
    secure: false,
    auth: {
      user: EMAIL,
      pass: EMAILPASSWORD,
    },
    tls: {
      rejectUnauthorized: false,
    },
  });
  await transporter.sendMail(
    {
      from: '"Admin 👻"', // sender address
      to: toEmail, // list of receivers
      subject: "Notification ✔ ", // Subject line
      text: "You have successfully created an account and please verify your account in here: ", // plain text body
      html: `
      <h1>Vui lòng nhập mã OTP để xác thực tài khoản của bạn (Please enter the OTP to verify your account ): </h1>
       <div style="text-align:center;font-size:25px;width:15%;padding:20px; background: rgba(85, 85, 85, 0.651);"><b>${otp}</b></div>
   `, // html body
    },
    (err) => {
      if (err) {
        return console.log({ ERROR: err });
      }
      return console.log({ message: MESSAGE.SEND_MAIL_SUCCESS });
    }
  );
}

async function sendMailToFix(fromEmail, content) {
  const EMAIL = ADMIN_EMAIL.EMAIL;
  const EMAILPASSWORD = ADMIN_EMAIL.PASSWORD;
  const SERVICE = ADMIN_EMAIL.SERVICE;
  // console.log({ EMAIL, EMAILPASSWORD, SERVICE, toEmail });
  let transporter = nodemailer.createTransport({
    service: SERVICE,
    auth: {
      user: EMAIL,
      pass: EMAILPASSWORD,
    },
  });
  await transporter.sendMail(
    {
      from: {
        address: fromEmail,
        name: fromEmail,
      }, // sender address
      to: EMAIL, // list of receivers
      subject: "🚫🚫🚫 Error Notification 🚫🚫🚫", // Subject line
      text: "Bug reports from users: ", // plain text body
      html: `
      <span>🐞🐞🐞🐞🐞🐞</span>
      <b>${content}</b>
      <span>🐞🐞🐞🐞🐞🐞</span>
      
   `, // html body
    },
    (err) => {
      if (err) {
        return console.log({ ERROR: err });
      }
      return console.log({ message: MESSAGE.SEND_MAIL_SUCCESS });
    }
  );
}
async function sendMailToRetrievalPassword(toEmail) {
  const EMAIL = ADMIN_EMAIL.EMAIL;
  const EMAILPASSWORD = ADMIN_EMAIL.PASSWORD;
  const SERVICE = ADMIN_EMAIL.SERVICE;
  // console.log({ EMAIL, EMAILPASSWORD, SERVICE, toEmail });
  let transporter = nodemailer.createTransport({
    service: SERVICE,
    auth: {
      user: EMAIL,
      pass: EMAILPASSWORD,
    },
  });
  // const payload = { email: toEmail };

  await transporter.sendMail(
    {
      from: '"Admin 👻"', // sender address
      to: toEmail, // list of receivers
      subject: "Notification ✔ ", // Subject line
      attachments: [
        {
          filename: "logo.png",
          path: path.join(appRoot.path, `/src/public/images/logo.png`),
          cid: "unique@kreata.ee",
        },
      ],
      text: "Did you forget your password ? Please, Fill out the form below to retrieve your password: ", // plain text body
      html: `
      <div style="text-align: center;">
        <img src="cid:unique@kreata.ee" width="100px" style="text-align:center" alt="">
        <h2>Bạn đã quên mật khẩu 🤔 ? Vui lòng nhập lại mật khẩu mới : ✍️✍️✍️ </h2>
        <form action="http://localhost:3416/user/recover/password" method="POST">
        <input type="email" name="email" value="${toEmail}" hidden/>
           <button type="submit" style="padding:5px;">Click vào đây để đặt lại mật khẩu</button>
        </form>
       </div>
   `, // html body
    },
    (err) => {
      if (err) {
        return console.log({ ERROR: err });
      }
      return console.log({ message: MESSAGE.SEND_MAIL_SUCCESS });
    }
  );
}

async function sendMailToRetrievalAdminAccount(toEmail, username, originUrl) {
  const EMAIL = ADMIN_EMAIL.EMAIL;
  const EMAILPASSWORD = ADMIN_EMAIL.PASSWORD;
  const SERVICE = ADMIN_EMAIL.SERVICE;
  // console.log({ EMAIL, EMAILPASSWORD, SERVICE, toEmail });
  let transporter = nodemailer.createTransport({
    service: SERVICE,
    auth: {
      user: EMAIL,
      pass: EMAILPASSWORD,
    },
  });
  // const payload = { email: toEmail };
  const payload = {
    username,
  };
  const randomJwt = await jwt.sign(payload, JWT.SERCRET_JWT, {
    expiresIn: JWT.EXPIRE,
  });
  await transporter.sendMail(
    {
      from: '"Admin 👻"', // sender address
      to: toEmail, // list of receivers
      subject: "Notification ✔ ", // Subject line
      attachments: [
        {
          filename: "logo.png",
          path: path.join(appRoot.path, `/src/public/images/logo.png`),
          cid: "unique@kreata.ee",
        },
      ],

      text: "Did you forget your password ? Please, Fill out the form below to retrieve your password: ", // plain text body
      html: `
      <div style="text-align: center;">
        <img src="cid:unique@kreata.ee" width="100px" style="text-align:center" alt="">
        <h2>Bạn đã quên mật khẩu 🤔 đối với tài khoản (${username}) ? Vui lòng truy cập vào đường link dưới đây để lấy lại tài khoản : 🍀🍀🍀 </h2> <br>
        <a href="${originUrl}/management/recover/${randomJwt}">Link lấy lại mật khẩu</a>
        <p style="color:red">* Lưu ý đường link sẽ hết hiệu lực sau 5 phút !</p>
       </div>
   `, // html body
    },
    (err) => {
      if (err) {
        return console.log({ ERROR: err });
      }
      return console.log({ message: MESSAGE.SEND_MAIL_SUCCESS });
    }
  );
}
module.exports = {
  sendRegisterMail,
  sendMailToFix,
  sendMailToRetrievalPassword,
  sendMailToRetrievalAdminAccount,
};
