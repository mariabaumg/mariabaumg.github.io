// Resolve shared assets relative to this script, on Home and nested pages.
const portfolioScriptUrl = document.currentScript.src;

document.getElementById('year').textContent = new Date().getFullYear();

const spines = [...document.querySelectorAll('.spine')];
function showBook(spine) {
  spines.forEach(book => book.setAttribute('aria-pressed', String(book === spine)));
  document.getElementById('book-title').textContent = spine.textContent.trim();
  const note = document.getElementById("book-note");
  document.getElementById("book-note-text").textContent = spine.dataset.note || "";
  note.hidden = !(spine.dataset.note || spine.dataset.spoiler);
  const spoiler = document.getElementById("book-spoiler");
  const spoilerText = document.getElementById("book-spoiler-text");

  spoilerText.textContent = spine.dataset.spoiler || "";
  spoilerText.setAttribute("aria-hidden", "true");
  spoiler.setAttribute("aria-label", "Reveal spoiler");
  spoiler.classList.remove("revealed");
  spoiler.hidden = !spoilerText.textContent;
  document.getElementById('book-author').textContent = ' — ' + spine.dataset.author;
}
function clearBook() {
  spines.forEach((spine) => spine.setAttribute("aria-pressed", "false"));
  document.getElementById("book-title").textContent = "";
  document.getElementById("book-author").textContent = "";
  document.getElementById("book-note").hidden = true;
}

spines.forEach((spine) => {
  spine.title = spine.getAttribute("aria-label");

  spine.addEventListener("click", () => {
    if (spine.getAttribute("aria-pressed") === "true") {
      clearBook();
    } else {
      showBook(spine);
    }
  });
});

if (spines.length > 0) {
  clearBook();
}

function typeName() {
  const first = document.getElementById("first-name");
  const last = document.getElementById("last-name");

  if (!first || !last || matchMedia("(prefers-reduced-motion: reduce)").matches) {
    return;
  }

  const firstName = first.textContent;
  const lastName = last.textContent;
  let count = 0;

  first.textContent = "";
  last.textContent = "";

  const cursor = document.querySelector("#site-title .cursor");
  first.after(cursor);

  const timer = setInterval(() => {
    count += 1;

    first.textContent = firstName.slice(0, count);
    last.textContent = lastName.slice(0, Math.max(0, count - firstName.length));

    if (count === firstName.length + 1) {
      last.after(cursor);
    }

    if (count === firstName.length + lastName.length) {
      clearInterval(timer);
    }
  }, 160);
}

typeName();

document.getElementById("book-spoiler")?.addEventListener("click", (event) => {
  const button = event.currentTarget;
  const revealed = button.classList.toggle("revealed");
  const text = document.getElementById("book-spoiler-text");

  text.setAttribute("aria-hidden", String(!revealed));
  button.setAttribute(
    "aria-label",
    revealed ? `Hide spoiler: ${text.textContent}` : "Reveal spoiler"
  );
});


const themeToggle = document.getElementById("theme-toggle");
const systemTheme = matchMedia("(prefers-color-scheme: dark)");

function applyTheme(theme) {
  document.documentElement.dataset.theme = theme;
  const isDark = theme === "dark";

  themeToggle.textContent = isDark ? "☀︎" : "☾";
  themeToggle.setAttribute(
    "aria-label",
    isDark ? "Switch to light mode" : "Switch to dark mode"
  );
}

applyTheme(localStorage.getItem("portfolio-theme") ||
  (systemTheme.matches ? "dark" : "light"));

themeToggle.hidden = false;

themeToggle.addEventListener("click", () => {
  const nextTheme = document.documentElement.dataset.theme === "dark"
    ? "light"
    : "dark";

  applyTheme(nextTheme);
  localStorage.setItem("portfolio-theme", nextTheme);
});



const postcards = [
  ["bath.JPG", "Bath, England", ""],
  ["me_brighton.JPEG", "Brighton, England", "A day trip to Brighton while I was visiting a friend who was studying abroad in London."],
  ["budapest.jpeg", "Budapest, Hungary", "A memory from my summer in Budapest."],
  ["big_ben.jpg", "Big Ben, London", ""],
  ["brighton.JPEG", "Brighton, England", ""],
  ["hike.JPG", "Bear Mountain, NY", "From a hike my friends and I went on."],
  ["me_horse_england.JPEG", "The National Gallery, London", ""],
  ["praha_oldtown.jpeg", "Prague, Czech Republic", "A view of old town from the Astronomical Clock Tower."],
  ["kosice.jpeg", "Košice, Slovakia", "From a hike I went on."],
  ["praha.jpeg", "St. Vitus Cathedral, Prague", "From a weekend trip to Prague while I was studying in Budapest."],
  ["me_brighton_beach.JPEG", "Brighton Beach, England", ""],
  ["vienna.jpeg", "St. Stephens Cathedral, Vienna", "A day trip to Vienna while studying in Budapest. Loved the gothic architecture."]
];

const gallery = document.getElementById("postcard-gallery");

if (gallery) {
  postcards.forEach(([file, place, caption]) => {
    const card = document.createElement("button");
    card.type = "button";
    card.className = "postcard";

    const photo = document.createElement("img");
    photo.className = "postcard-front";
    photo.addEventListener("load", () => {
      card.classList.toggle(
        "is-landscape",
        photo.naturalWidth > photo.naturalHeight
      );
    });
    photo.src = new URL(`./pictures/${file}`, portfolioScriptUrl).href;
    photo.alt = `Travel photo from ${place}`;
    photo.loading = "lazy";

    const back = document.createElement("span");
    back.className = "postcard-back";
    back.setAttribute("aria-hidden", "true");

    const heading = document.createElement("strong");
    heading.textContent = place;

    const note = document.createElement("span");
    note.textContent = caption;

    back.append(heading, note);
    card.append(photo, back);
    card.setAttribute("aria-label", `Read postcard from ${place}`);

    card.addEventListener("click", () => {
      const flipped = card.classList.toggle("is-flipped");
      back.setAttribute("aria-hidden", String(!flipped));
      card.setAttribute(
        "aria-label",
        flipped ? `${place}. ${caption} Flip back to photo.` : `Read postcard from ${place}`
      );
    });

    gallery.append(card);
  });
}


document.querySelectorAll(".course-card").forEach((card) => {
  const tabs = [...card.querySelectorAll('[role="tab"]')];

  function selectTab(selectedTab) {
    tabs.forEach((tab) => {
      const isSelected = tab === selectedTab;
      const panel = document.getElementById(tab.getAttribute("aria-controls"));

      tab.setAttribute("aria-selected", String(isSelected));
      tab.tabIndex = isSelected ? 0 : -1;
      panel.hidden = !isSelected;
    });
  }

  tabs.forEach((tab, index) => {
    tab.addEventListener("click", () => selectTab(tab));

    tab.addEventListener("keydown", (event) => {
      let nextIndex;

      switch (event.key) {
        case "ArrowRight":
          nextIndex = (index + 1) % tabs.length;
          break;
        case "ArrowLeft":
          nextIndex = (index - 1 + tabs.length) % tabs.length;
          break;
        case "Home":
          nextIndex = 0;
          break;
        case "End":
          nextIndex = tabs.length - 1;
          break;
        default:
          return;
      }

      event.preventDefault();
      selectTab(tabs[nextIndex]);
      tabs[nextIndex].focus();
    });
  });
});