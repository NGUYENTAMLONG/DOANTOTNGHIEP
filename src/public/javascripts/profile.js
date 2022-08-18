//Toggle show/hide password
let signal_1 = true;
let signal_2 = true;

function toggleShowHide_1(it) {
  const dataId = it.getAttribute("data-id");
  console.log(dataId);
  if (signal_1) {
    it.classList.add("fa-eye-slash");
    it.classList.remove("fa-eye");
    document.getElementById(dataId).setAttribute("type", "text");
    signal_1 = false;
  } else {
    it.classList.remove("fa-eye-slash");
    it.classList.add("fa-eye");
    document.getElementById(dataId).setAttribute("type", "password");
    signal_1 = true;
  }
}

function toggleShowHide_2(it) {
  const dataId = it.getAttribute("data-id");
  console.log(dataId);
  if (signal_2) {
    it.classList.add("fa-eye-slash");
    it.classList.remove("fa-eye");
    document.getElementById(dataId).setAttribute("type", "text");
    signal_2 = false;
  } else {
    it.classList.remove("fa-eye-slash");
    it.classList.add("fa-eye");
    document.getElementById(dataId).setAttribute("type", "password");
    signal_2 = true;
  }
}

// Update Username
function updateUsername(idTag) {
  const payload = {
    username: document.getElementById(idTag).value,
  };
  const headers = {
    "content-Type": "application/json",
  };
  fetch("/user/update-username", {
    method: "PATCH",
    body: JSON.stringify(payload),
    headers,
  })
    .then((response) => response.json())
    .then((result) => {
      if (result.isSuccess === true) {
        swal({
          title: "Thành công",
          text: "Username của bạn đã được thay đổi",
          icon: "success",
          button: "OK!",
        }).then(() => {
          location.reload();
        });
      } else {
        if (result.errorCode === "ALREADY_EXISTS") {
          swal({
            title: "Thông báo !",
            text: "Username đã tồn tại",
            icon: "error",
            button: "OK!",
          });
        } else if (result.errorCode === "BAD_REQUEST") {
          swal({
            title: "Thông báo !",
            text: "Username không được chứa khoảng trắng hai đầu",
            icon: "error",
            button: "OK!",
          });
        }
      }
    })
    .catch((error) => console.log(error));
}

//Update Date Of Birth
function updateDob(idTag) {
  const payload = {
    dob: document.getElementById(idTag).value,
  };
  // console.log(payload);
  const headers = {
    "content-Type": "application/json",
  };
  fetch("/user/update-dob", {
    method: "PATCH",
    body: JSON.stringify(payload),
    headers,
  })
    .then((response) => response.json())
    .then((result) => {
      if (result.isSuccess === true) {
        console.log(result);
        swal({
          title: "Thành công",
          text: "Ngày sinh của bạn đã được thay đổi",
          icon: "success",
          button: "OK!",
        }).then(() => {
          location.reload();
        });
      } else {
        console.log(result);
        if (result.errorCode === "ALREADY_EXISTS") {
          swal({
            title: "Thông báo !",
            text: "Username đã tồn tại",
            icon: "error",
            button: "OK!",
          });
        } else if (result.errorCode === "BAD_REQUEST") {
          swal({
            title: "Thông báo !",
            text: "Username không được chứa khoảng trắng hai đầu",
            icon: "error",
            button: "OK!",
          });
        }
      }
    })
    .catch((error) => console.log(error));
}