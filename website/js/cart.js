(function () {
  function paintCartCount() {
    var count = localStorage.getItem("pipoCartCount") || "0";
    var badges = document.querySelectorAll("[data-cart-count]");
    for (var i = 0; i < badges.length; i++) {
      badges[i].textContent = count;
    }
  }

  document.addEventListener("DOMContentLoaded", paintCartCount);
})();
