(function () {
  // DON'T EDIT BELOW THIS LINE
  var d = document,
    s = d.createElement("script");
  s.src = "https://my-site-zlkjtgow8a.disqus.com/embed.js";
  s.setAttribute("data-timestamp", +new Date());
  (d.head || d.body).appendChild(s);
})();

if (localStorage.getItem("light") !== "on") {
  document.querySelector("#checkboxLight").checked = false;
  document.querySelector(".lightbulb-status").innerHTML = `Bật đèn`;
} else {
  toggleClass();
  document.querySelector("#checkboxLight").checked = true;
  document.querySelector(".lightbulb-status").innerHTML = `Tắt đèn`;
}

function toggleDarkmode(it) {
  if (localStorage.getItem("light") !== "on") {
    localStorage.setItem("light", "on");
    console.log(localStorage.getItem("light"));
    document.querySelector(".lightbulb-status").innerHTML = `Tắt đèn`;
    toggleClass();
  } else {
    localStorage.setItem("light", "off");
    console.log(localStorage.getItem("light"));
    document.querySelector(".lightbulb-status").innerHTML = `Bật đèn`;
    toggleClass();
  }
}

function toggleClass() {
  document.querySelector("body").classList.toggle("toggle__light-background");
  document
    .querySelectorAll(".darkmode")[0]
    .classList.toggle("toggle__light-text");
  document
    .querySelectorAll(".darkmode")[1]
    .classList.toggle("toggle__light-text");
}

function toTop() {
  window.scrollTo(0, 0);
}
