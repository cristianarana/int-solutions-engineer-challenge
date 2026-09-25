(function () {
  var home = document.querySelector("[data-view='home']");
  var outlet = document.querySelector("[data-outlet]");

  function showHome() {
    if (outlet) {
      outlet.hidden = true;
      outlet.innerHTML = "";
    }
    if (home) home.hidden = false;
    document.title = "Pipo Toys";
  }

  function showPage(file, title, start) {
    fetch(file)
      .then(function (response) { return response.text(); })
      .then(function (html) {
        var parsed = new DOMParser().parseFromString(html, "text/html");
        var main = parsed.querySelector("main");
        var footer = parsed.querySelector(".site-footer");
        if (!outlet || !main) return;

        outlet.innerHTML = "";
        outlet.appendChild(document.importNode(main, true));
        if (footer) outlet.appendChild(document.importNode(footer, true));
        outlet.hidden = false;
        if (home) home.hidden = true;
        document.title = title;
        if (start) start();
      });
  }

  function route() {
    var page = (location.hash || "#home").replace("#", "");
    if (page === "shop") {
      showPage("shop.html", "Shop · Pipo Toys", window.renderShop);
      return;
    }
    if (page === "workshop") {
      showPage("landing.html", "The workshop · Pipo Toys", window.bindNewsletter);
      return;
    }
    showHome();
  }

  window.addEventListener("hashchange", route);
  document.addEventListener("DOMContentLoaded", route);
})();
