/* Homepage recent-news preview.
   Reads the two newest dated news entries from news.html, so the homepage
   updates when a new .news-feature or .news-card is added to the News page. */
(function () {
  "use strict";

  function slugify(title) {
    var slug = (title || "update")
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
    return "news-" + (slug || "update");
  }

  function getEntries(root) {
    var usedIds = new Set();
    return Array.from(root.querySelectorAll(".news-feature, .news-card")).map(function (element) {
      var heading = element.querySelector("h1, h2, h3");
      var title = heading ? heading.textContent.trim().replace(/\s+/g, " ") : "Exeter Tech Solutions update";
      var id = element.id || slugify(title);
      var baseId = id;
      var suffix = 2;
      while (usedIds.has(id)) {
        id = baseId + "-" + suffix++;
      }
      usedIds.add(id);

      var time = element.querySelector("time[datetime]");
      var paragraphs = Array.from(element.querySelectorAll("p"));
      var excerpt = paragraphs.length ? paragraphs[0].textContent.trim().replace(/\s+/g, " ") : "";
      var image = element.querySelector("img");
      return {
        element: element,
        id: id,
        title: title,
        dateTime: time ? (time.getAttribute("datetime") || "") : "",
        dateLabel: time ? time.textContent.trim().replace(/\s+/g, " ") : "",
        excerpt: excerpt,
        imageSrc: image ? (image.getAttribute("src") || "") : "",
        imageAlt: image ? (image.getAttribute("alt") || title) : title
      };
    });
  }

  function shorten(text, maxLength) {
    if (!text || text.length <= maxLength) return text || "";
    return text.slice(0, maxLength - 1).replace(/\s+\S*$/, "") + "…";
  }

  function addText(parent, tag, className, value) {
    var element = document.createElement(tag);
    if (className) element.className = className;
    element.textContent = value;
    parent.appendChild(element);
    return element;
  }

  function renderCard(entry) {
    var article = document.createElement("article");
    article.className = "home-news-card";

    var link = document.createElement("a");
    link.className = "home-news-link";
    link.href = "news.html#" + entry.id;
    link.setAttribute("aria-label", "Read: " + entry.title);

    var thumb = document.createElement("span");
    thumb.className = "home-news-thumb";
    

    if (entry.imageSrc) {
      var image = document.createElement("img");
      image.src = entry.imageSrc;
      image.alt = "";
      image.loading = "lazy";
      image.decoding = "async";
      thumb.appendChild(image);
    } else {
      var placeholder = document.createElement("span");
      placeholder.className = "home-news-thumb-placeholder";
      placeholder.textContent = "ETS";
      thumb.appendChild(placeholder);
    }

    var copy = document.createElement("span");
    copy.className = "home-news-copy";

    if (entry.dateLabel) {
      var time = document.createElement("time");
      time.dateTime = entry.dateTime;
      time.textContent = entry.dateLabel;
      copy.appendChild(time);
    }
    addText(copy, "strong", "", entry.title);
    if (entry.excerpt) addText(copy, "p", "", shorten(entry.excerpt, 112));
    addText(copy, "span", "home-news-read", "Read update");

    link.appendChild(thumb);
    link.appendChild(copy);
    article.appendChild(link);
    return article;
  }

  // Add stable fragment IDs to News-page articles so home cards open the
  // corresponding entry; the same rules are used when parsing news.html.
  var pageEntries = getEntries(document);
  pageEntries.forEach(function (entry) {
    if (entry.element && !entry.element.id) entry.element.id = entry.id;
  });

  var list = document.getElementById("home-recent-news-list");
  if (!list) return;

  fetch("news.html", { credentials: "same-origin" })
    .then(function (response) {
      if (!response.ok) throw new Error("Could not load the News page.");
      return response.text();
    })
    .then(function (html) {
      var parsed = new DOMParser().parseFromString(html, "text/html");
      var entries = getEntries(parsed);
      entries.sort(function (a, b) {
        return (Date.parse(b.dateTime) || 0) - (Date.parse(a.dateTime) || 0);
      });

      list.replaceChildren();
      entries.slice(0, 2).forEach(function (entry) {
        list.appendChild(renderCard(entry));
      });

      if (!entries.length) {
        var fallback = document.createElement("p");
        fallback.className = "home-news-fallback";
        fallback.textContent = "See the latest updates on the News page.";
        list.appendChild(fallback);
      }
    })
    .catch(function () {
      list.replaceChildren();
      var fallback = document.createElement("p");
      fallback.className = "home-news-fallback";
      fallback.textContent = "See the latest updates on the News page.";
      list.appendChild(fallback);
    });
}());
