function submitEmailReader(input) {
  const email = document.getElementById(input).value;
  const payload = {
    email: email,
  };
  fetch("/mail/api/submit-mail", {
    method: "POST", // or 'PUT'
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  })
    .then((response) => response.json())
    .then((result) => {
      if (result.isSuccess) {
        swal({
          title: "Đã gửi mail ^^",
          text: "Nhớ check mail để nhận thông tin mới nhất từ chúng tôi !",
          icon: "success",
          button: "OK!",
        }).then(() => {
          location.reload();
        });
      } else if (!result.isSuccess && result.errorCode === "BAD_REQUEST") {
        swal({
          title: "Thông báo",
          text: "Email của bạn sai định dạng =( !",
          icon: "error",
          button: "OK!",
        });
      }
    })
    .catch((error) => {
      console.error("Error:", error);
    });
}
