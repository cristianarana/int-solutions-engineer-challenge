(function () {
  var SITE_NAME = "pipo sandbox";

  function formatMoney(amount) {
    return "$" + Number(amount).toFixed(2);
  }

  function pushAddToCart(product) {
    var item = {
      item_id: product.id,
      item_name: product.name,
      item_brand: product.brand,
      price: product.price,
      item_category: product.category,
      item_variant: product.variant,
      quantity: 1
    };

    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
      event: "ga4.trackEvent",
      eventName: "add_to_cart",
      eventParams: {
        section: "shop",
        value: item.price * item.quantity,
        currency: "USD",
        items: [item],
        site: SITE_NAME
      }
    });
  }

  function rememberCartClick() {
    var count = Number(localStorage.getItem("pipoCartCount") || 0) + 1;
    localStorage.setItem("pipoCartCount", String(count));
    var badges = document.querySelectorAll("[data-cart-count]");
    for (var i = 0; i < badges.length; i++) {
      badges[i].textContent = String(count);
    }
  }

  function renderProducts() {
    var grid = document.querySelector("[data-product-grid]");
    if (!grid || !window.PRODUCTS) return;

    var html = "";
    for (var i = 0; i < window.PRODUCTS.length; i++) {
      var product = window.PRODUCTS[i];
      html +=
        '<article class="product-card">' +
          '<div class="product-swatch swatch-' + product.swatch + '"></div>' +
          '<p class="eyebrow">' + product.category + "</p>" +
          "<h2>" + product.name + "</h2>" +
          '<p class="blurb">' + product.blurb + "</p>" +
          '<div class="product-row">' +
            '<span class="price">' + formatMoney(product.price) + "</span>" +
            '<button type="button" class="add-button" data-id="' + product.id + '">Add to cart</button>' +
          "</div>" +
        "</article>";
    }
    grid.innerHTML = html;

    grid.addEventListener("click", function (event) {
      var button = event.target.closest(".add-button");
      if (!button) return;

      var productId = button.getAttribute("data-id");
      var selected = null;
      for (var n = 0; n < window.PRODUCTS.length; n++) {
        if (window.PRODUCTS[n].id === productId) {
          selected = window.PRODUCTS[n];
          break;
        }
      }
      if (!selected) return;

      pushAddToCart(selected);
      rememberCartClick();

      button.textContent = "Added";
      window.setTimeout(function () {
        button.textContent = "Add to cart";
      }, 800);
    });
  }

  window.renderShop = function () {
    var grid = document.querySelector("[data-product-grid]");
    if (!grid || grid.dataset.bound === "1") return;
    renderProducts();
    if (document.querySelector("[data-product-grid]")) {
      document.querySelector("[data-product-grid]").dataset.bound = "1";
    }
  };

  document.addEventListener("DOMContentLoaded", window.renderShop);
})();
