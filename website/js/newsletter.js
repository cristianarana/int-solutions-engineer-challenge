(function () {
  var validEmail = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

  window.bindNewsletter = function () {
    var form = document.querySelector("[data-newsletter]");
    if (!form || form.dataset.bound === "1") return;
    form.dataset.bound = "1";

    var input = form.querySelector("[data-newsletter-email]");
    var success = form.querySelector("[data-message='success']");
    var warning = form.querySelector("[data-message='warning']");

    form.addEventListener("submit", function (event) {
      event.preventDefault();
      success.hidden = true;
      warning.hidden = true;

      var email = input.value;
      window.dataLayer = window.dataLayer || [];

      if (email == null || email === "") {
        window.dataLayer.push({
          event: "formSubmission",
          formName: "Newsletter",
          formStatus: "Error",
          formError: "Empty email"
        });
        warning.textContent = "Enter an email address to subscribe.";
        warning.hidden = false;
        return;
      }

      if (!validEmail.test(email)) {
        window.dataLayer.push({
          event: "formSubmission",
          formName: "Newsletter",
          formStatus: "Error",
          formError: "Wrong format"
        });
        warning.textContent = "That email doesn't look valid.";
        warning.hidden = false;
        return;
      }

      window.dataLayer.push({
        event: "formSubmission",
        formName: "Newsletter",
        formStatus: "Ok"
      });
      success.hidden = false;
      input.value = "";
    });
  };

  document.addEventListener("DOMContentLoaded", window.bindNewsletter);
})();
