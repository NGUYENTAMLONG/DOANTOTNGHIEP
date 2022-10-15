window.onsubmit = function (event) {
  event.preventDefault();
};

const logoutBtn = document.querySelector(".logoutBtn");
const loginBtn = document.querySelector(".loginBtn");
const submitBtn = document.querySelector(".submitBtn");
const registerBtn = document.querySelector(".registerBtn");
const btnShowRegister = document.querySelector(".btnShowRegister");
const btnShowLogin = document.querySelector(".btnShowLogin");

// REGISTER
let payload = null;

function verification() {
  const registerModal = document.getElementById("registerModal");
  const usernameRegister = registerModal.querySelector("#usernameRegister");
  const passwordRegister = registerModal.querySelector("#passwordRegister");
  const emailRegister = registerModal.querySelector("#emailRegister");
  const dobRegister = registerModal.querySelector("#dobRegister");

  payload = {
    username: usernameRegister.value,
    password: passwordRegister.value,
    email: emailRegister.value,
    dob: dobRegister.value,
  };
  const headers = {
    "content-Type": "application/json",
  };

  fetch("/authen/verify-email", {
    method: "POST",
    body: JSON.stringify(payload),
    headers,
  })
    .then((response) => response.json())
    .then((result) => {
      console.log(result);
      if (result.isSuccess === true) {
        swal({
          title: "Thông báo",
          text: "Xác thực qua email của bạn ngay nhé!",
          icon: "success",
          button: "OK!",
        }).then(() => {
          const otpInput = document.querySelector(".otp_field");
          registerBtn.removeAttribute("disabled");
          submitBtn.setAttribute("disabled", "");
          usernameRegister.setAttribute("disabled", "");
          passwordRegister.setAttribute("disabled", "");
          emailRegister.setAttribute("disabled", "");
          dobRegister.setAttribute("disabled", "");
          otpInput.removeAttribute("hidden");
        });
      } else {
        swal({
          title: "Đăng ký không thành công!",
          text: result.message,
          icon: "error",
          button: "OK!",
        });
      }
    })
    .catch((error) => console.log(error));
}

function register() {
  const otpValue = document.getElementById("otp").value;
  const headers = {
    "content-Type": "application/json",
  };
  payload.otp = otpValue;
  fetch("/authen/register", {
    method: "POST",
    body: JSON.stringify(payload),
    headers,
  })
    .then((response) => response.json())
    .then((result) => {
      console.log(result);
      if (result.isSuccess === true) {
        swal({
          title: "Đăng ký thành công!",
          text: "Vui lòng đăng nhập để trải nghiệm",
          icon: "success",
          button: "OK!",
        }).then(location.reload());
      } else {
        swal({
          title: "Đăng ký không thành công!",
          text: result.message,
          icon: "error",
          button: "OK!",
        });
      }
    })
    .catch((error) => console.log(error));
}

function resendOTP() {
  const payloadResend = {
    email: payload.email,
  };
  const headers = {
    "content-Type": "application/json",
  };
  fetch("/authen/resend-otp", {
    method: "POST",
    body: JSON.stringify(payloadResend),
    headers,
  })
    .then((response) => response.json())
    .then((result) => {
      if (result.isSuccess === true) {
        swal({
          title: "Thông báo",
          text: "Xác thực qua email của bạn ngay nhé!",
          icon: "success",
          button: "OK!",
        });
      } else {
        swal({
          title: "Gửi lại mã không thành công!",
          text: result.message,
          icon: "error",
          button: "OK!",
        });
      }
    })
    .catch((error) => console.log(error));
}

function setCookie(cname, cvalue, exdays) {
  const d = new Date();
  d.setTime(d.getTime() + exdays * 24 * 60 * 60 * 1000);
  let expires = "expires=" + d.toUTCString();
  document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}
// ***************************************************************************
// LOGOUT
function logout(event) {
  event.preventDefault();
  const headers = {
    "content-Type": "application/json",
  };
  fetch("/logout", {
    method: "POST",
    headers,
  })
    .then((response) => response.json())
    .then((result) => {
      if (result.isSuccess) {
        location.reload();
      }
    })
    .catch((error) => console.log(error));
}
// ***************************************************************************
// LOGIN
function login() {
  const loginModal = document.getElementById("loginModal");
  const usernameLogin = loginModal.querySelector("#usernameLogin");
  const passwordLogin = loginModal.querySelector("#passwordLogin");
  const payloadLogin = {
    username: usernameLogin.value.trim(),
    password: passwordLogin.value,
  };

  const headers = {
    "content-Type": "application/json",
  };
  fetch("/authen/login", {
    method: "POST",
    body: JSON.stringify(payloadLogin),
    headers,
  })
    .then((response) => response.json())
    .then((result) => {
      if (result.isSuccess === true) {
        location.reload();
      } else {
        swal({
          title: "Đăng nhập không thành công!",
          text: result.message,
          icon: "error",
          button: "OK!",
        });
      }
    })
    .catch((error) => console.log(error));
}

function getCookie(cname) {
  let name = cname + "=";
  let decodedCookie = decodeURIComponent(document.cookie);
  let ca = decodedCookie.split(";");
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) == " ") {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
}

//Toggle show/hide password
let flag = true;
function toggleShowHide(it) {
  console.log(it);
  if (flag) {
    it.classList.add("fa-eye-slash");
    it.classList.remove("fa-eye");
    document.getElementById("passwordRegister").setAttribute("type", "text");
    flag = false;
  } else {
    it.classList.remove("fa-eye-slash");
    it.classList.add("fa-eye");
    document
      .getElementById("passwordRegister")
      .setAttribute("type", "password");
    flag = true;
  }
}

function closeLoginModal(){
  document.querySelector(".closeLoginModalBtn").click()
  document.querySelector(".btnShowRegister").click()
}