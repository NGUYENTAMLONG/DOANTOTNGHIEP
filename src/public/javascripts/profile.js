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
