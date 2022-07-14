function unFollow(mangaId) {
  const payload = {
    mangaId: mangaId,
  };
  const headers = {
    "content-Type": "application/json",
  };
  fetch("/follow", {
    method: "DELETE",
    body: JSON.stringify(payload),
    headers,
  })
    .then((response) => response.json())
    .then((result) => {
      if (result.isSuccess === true) {
        location.reload();
      } else {
        swal({
          title: "Có lỗi rồi !",
          text: result.message,
          icon: "error",
          button: "OK!",
        });
      }
    })
    .catch((error) => console.log(error));
}
