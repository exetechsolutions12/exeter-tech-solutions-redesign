/* Shared, date-sorted customer reviews for the homepage and full reviews page. */
(function () {
  "use strict";

  var containers = Array.prototype.slice.call(document.querySelectorAll("[data-review-list]"));
  if (!containers.length) return;

  function validDate(value) {
    if (typeof value !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return null;
    var timestamp = Date.parse(value + "T00:00:00Z");
    if (!Number.isFinite(timestamp)) return null;
    return new Date(timestamp).toISOString().slice(0, 10) === value ? timestamp : null;
  }

  function formatDate(value) {
    var timestamp = validDate(value);
    if (timestamp === null) return "";
    return new Intl.DateTimeFormat("en-GB", {
      day: "numeric", month: "long", year: "numeric", timeZone: "UTC"
    }).format(new Date(timestamp));
  }

  function element(tag, className, text) {
    var node = document.createElement(tag);
    if (className) node.className = className;
    if (text !== undefined && text !== null) node.textContent = String(text);
    return node;
  }

  function renderReview(review) {
    var card = element("article", "review-card");

    if (review.date && validDate(review.date) !== null) {
      var date = element("time", "review-date", formatDate(review.date));
      date.dateTime = review.date;
      card.appendChild(date);
    }

    var rating = Number(review.rating);
    if (Number.isInteger(rating) && rating >= 1 && rating <= 5) {
      var ratingNode = element("div", "review-rating");
      ratingNode.setAttribute("aria-label", "Rated " + rating + " out of 5");
      ratingNode.appendChild(element("span", "review-stars", "★".repeat(rating)));
      if (rating < 5) ratingNode.appendChild(element("span", "review-stars-empty", "★".repeat(5 - rating)));
      card.appendChild(ratingNode);
    }

    card.appendChild(element("blockquote", "review-quote", review.text || ""));
    if (typeof review.customer === "string" && review.customer.trim()) {
      var customer = element("p", "review-customer");
      customer.appendChild(element("strong", "", review.customer.trim()));
      card.appendChild(customer);
    }
    return card;
  }

  function showFailure(container) {
    container.replaceChildren(element("p", "review-load-message", "Customer reviews are temporarily unavailable."));
  }

  fetch("assets/data/customer-reviews.json", { credentials: "same-origin", cache: "no-cache" })
    .then(function (response) {
      if (!response.ok) throw new Error("Unable to load review data.");
      return response.json();
    })
    .then(function (data) {
      if (!data || !Array.isArray(data.reviews)) throw new Error("Review data has an invalid format.");

      var entries = data.reviews
        .map(function (review, index) {
          return { review: review, index: index, timestamp: review ? validDate(review.date) : null };
        })
        .filter(function (entry) {
          return entry.review && typeof entry.review.text === "string" && entry.review.text.trim();
        })
        .sort(function (a, b) {
          var at = a.timestamp === null ? 0 : a.timestamp;
          var bt = b.timestamp === null ? 0 : b.timestamp;
          return bt - at || a.index - b.index;
        });

      containers.forEach(function (container) {
        var value = container.getAttribute("data-review-limit");
        var limit = value ? Number.parseInt(value, 10) : entries.length;
        if (!Number.isInteger(limit) || limit < 1) limit = entries.length;
        var selected = entries.slice(0, limit);
        container.replaceChildren();
        selected.forEach(function (entry) {
          container.appendChild(renderReview(entry.review));
        });
        if (!selected.length) showFailure(container);
      });
    })
    .catch(function () {
      containers.forEach(showFailure);
    });
}());
