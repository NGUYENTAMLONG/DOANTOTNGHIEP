const nodemailer = require("nodemailer");

const { ADMIN_EMAIL } = require("../config/default");
const { MESSAGE } = require("../config/httpResponse");

async function SendRegisterMail(toEmail, otp) {
  const EMAIL = ADMIN_EMAIL.EMAIL;
  const EMAILPASSWORD = ADMIN_EMAIL.PASSWORD;
  const SERVICE = ADMIN_EMAIL.SERVICE;
  console.log({ EMAIL, EMAILPASSWORD, SERVICE, toEmail });
  let transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: EMAIL,
      pass: EMAILPASSWORD,
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

// async function SendMailToRecoverPassword(toEmail) {
//   const EMAIL = process.env.EMAIL;
//   const EMAILPASSWORD = process.env.EMAILPASSWORD;
//   const SERVICE = process.env.SERVICE;
//   let transporter = nodemailer.createTransport({
//     service: SERVICE,
//     auth: {
//       user: EMAIL,
//       pass: EMAILPASSWORD,
//     },
//   });

//   const payload = { email: toEmail };
//   const expire = {
//     expiresIn: VALUES.EXPIRE_VERIFY_H,
//   };
//   const token = jwt.sign(payload, process.env.SECRET_KEY, expire);

//   await transporter.sendMail(
//     {
//       from: '"Admin 👻"', // sender address
//       to: toEmail, // list of receivers
//       subject: "Notification ✔ ", // Subject line
//       text: "Did you forget your password ? Please, Fill out the form below to retrieve your password: ", // plain text body
//       html: `
//       <h2>Did you forget your password 🤔 ? Please, Fill out the form below to retrieve your password : ✍️✍️✍️ </h2>
//        <form action="http://localhost:3333/password/forgot/recover/${token}" method="post" style="font-family: tahoma;">
//                  <label for="password"><b> Password: </b></label>
//                  <input type="text" name="password" id="password">
//                  <input type="submit" value="Submit">
//        </form>
//    `, // html body
//     },
//     (err) => {
//       if (err) {
//         return console.log({ ERROR: err });
//       }
//       return console.log({ message: MESSAGE.SEND_MAIL_SUCCESS });
//     }
//   );
// }
module.exports = {
  SendRegisterMail,
  //   SendMailToRecoverPassword,
};
