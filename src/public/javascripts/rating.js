function rate(value) {
  clearRates();
  addRates(value);
}

//- Remove Active
function clearRates() {
  for (var i = 1; i <= 5; i++) {
    document.getElementById("star" + i).classList.remove("active");
  }
}

//- Add Active
function addRates(value) {
  for (var i = 1; i <= value; i++) {
    document.getElementById("star" + i).classList.add("active");
  }
}
// CLEAR STARS
window.addEventListener("click", function (click) {
  if (!document.getElementById("rate").contains(click.target)) {
    clearRates();
  }
});

// *******************************************

function rating(mangaId) {
  const counterStar = document.querySelectorAll(".stars .active").length;
  console.log(mangaId, counterStar);
  const data = {
    mangaId: mangaId,
    counterStar,
  };

  fetch("/user/rate", {
    method: "POST", // or 'PUT'
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })
    .then((response) => response.json())
    .then((result) => {
      alert("RATED");
    })
    .catch((error) => {
      console.error("Error:", error);
    });
}
