const LocalStorage = require("node-localstorage").LocalStorage;
const localStorage = new LocalStorage("./scratch");
function saveHistory(slug) {
  if (localStorage.getItem("visits")) {
    const visits = JSON.parse(localStorage.getItem("visits"));
    if (visits.includes(slug)) {
      return;
    } else {
      const myMangas = [slug, ...visits];
      localStorage.setItem("visits", JSON.stringify(myMangas));
    }
  } else {
    const myMangas = [slug];
    localStorage.setItem("visits", JSON.stringify(myMangas));
  }
}

function getHistory() {
  return JSON.parse(localStorage.getItem("visits"));
}
function clearHistory() {
  localStorage.removeItem("visits");
}
module.exports = { saveHistory, getHistory, clearHistory };
