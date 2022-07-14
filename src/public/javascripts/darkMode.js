//Toggle Darkmode
function toggle_light_mode() {
  // const tableHeader = document.querySelector(".fixed-table-header");
  const tableHeader = document.querySelector(".table");
  const tableBody = document.getElementById("table");
  const span = document
    .querySelector(".light-mode-button")
    .querySelectorAll("span")[1];
  if (localStorage.lightMode == "dark") {
    localStorage.lightMode = "light";
    tableHeader.classList.remove("table-dark");
    tableBody.classList.remove("table-dark");
    span.style.left = "5px";
    span.style.backgroundColor = "white";
  } else {
    localStorage.lightMode = "dark";
    tableHeader.classList.add("table-dark");
    tableBody.classList.add("table-dark");
    span.style.left = "45px";
    span.style.backgroundColor = "#343a40";
  }
}

window.onload = () => {
  // const tableHeader = document.querySelector(".fixed-table-header");
  const tableHeader = document.querySelector(".table");
  const tableBody = document.getElementById("table");
  const span = document
    .querySelector(".light-mode-button")
    .querySelectorAll("span")[1];
  if (localStorage.getItem("lightMode") === "dark") {
    tableHeader.classList.add("table-dark");
    tableBody.classList.add("table-dark");
    span.style.left = "45px";
    span.style.backgroundColor = "#343a40";
  } else {
    tableHeader.classList.remove("table-dark");
    tableBody.classList.remove("table-dark");
    span.style.left = "5px";
    span.style.backgroundColor = "white";
  }
};
// //Toggle Darkmode
// function toggle_light_mode() {
//   if (localStorage.lightMode == "dark") {
//     localStorage.lightMode = "light";
//     changeToLight();
//   } else {
//     localStorage.lightMode = "dark";
//     changeToDark();
//   }
// }

// window.onload = () => {
//   if (localStorage.getItem("lightMode") === "dark") {
//     changeToDark();
//   } else {
//     changeToLight();
//   }
// };
// function changeToDark() {
//   const tableHeader = document.querySelector(".table");
//   const tableBody = document.getElementById("table");
//   const span = document
//     .querySelector(".light-mode-button")
//     .querySelectorAll("span")[1];
//   tableHeader.classList.remove("table-dark");
//   tableBody.classList.remove("table-dark");
//   span.style.left = "5px";
//   span.style.backgroundColor = "#ced4e2";
// }
// function changeToLight() {
//   const tableHeader = document.querySelector(".table");
//   const tableBody = document.getElementById("table");
//   const span = document
//     .querySelector(".light-mode-button")
//     .querySelectorAll("span")[1];
//   tableHeader.classList.remove("table-dark");
//   tableBody.classList.remove("table-dark");
//   span.style.left = "5px";
//   span.style.backgroundColor = "#ced4e2";
// }
