// copied from https://www.codehim.com/text-input/roman-numeral-converter-using-javascript/
function convertToRoman(num) {
  let decimalValue = [10, 9, 5, 4, 1];
  let romanNumeral = ["X", "IX", "V", "IV", "I"];

  let romanized = "";

  for (let index = 0; index < decimalValue.length; index++) {
    while (decimalValue[index] <= num) {
      romanized += romanNumeral[index];
      num -= decimalValue[index];
    }
  }

  if (typeof num === "number") {
    return romanized;
  }
}

function addAnchorLink(element, href) {
  const link = document.createElement("a");
  link.href = "#" + href;
  link.setAttribute("class", "anchor-link");
  icon = document.createElement("i");
  icon.setAttribute("class", "fa-solid fa-link");
  link.appendChild(icon);
  element.prepend(link);
  element.onmouseover = function () {
    link.style.visibility = "visible";
  };
  element.onmouseout = function () {
    link.style.visibility = "hidden";
  };
}

(() => {
  // add PDF link
  document.getElementById("pdf-link").href = window.location.pathname
    .replace(".html", ".pdf");
    document.getElementById("pdf-link2").href = window.location.pathname
    .replace(".html", ".pdf");

  // change TOC to improve navigation
  sidebarMenu = document.querySelector("#toc");

  // sidebars links
  if (sidebarMenu) {
    links = sidebarMenu.getElementsByTagName("a");
    for (let i = 0; i < links.length; i++) {
      links[i].setAttribute("class", "nav-link");
    }

    links = sidebarMenu.getElementsByTagName("ul");
    for (let i = 0; i < links.length; i++) {
      links[i].setAttribute("class", "nav");
    }
  }

  // PARTS
  var count = 0;
  for (const element of document.getElementsByClassName("part")) {
    count = count + 1;
    part_id = "part-" + count;
    part_title = element.innerText;
    element.setAttribute("id", part_id);
    // add roman number
    const num = document.createElement("span");
    roman_num = convertToRoman(count);
    num.innerHTML = roman_num;
    num.setAttribute("class", "roman-number");
    element.parentElement.prepend(num);
    addAnchorLink(element.parentElement, element.id);

    // insert part into TOC
    grandfather = element.parentElement.parentElement;
    const part_li = document.createElement("LI");
    part_li.id = "toc-" + part_id;
    part_li.setAttribute("class", "toc_part");
    const link = document.createElement("a");
    link.href = "#" + part_id;
    link.innerHTML = roman_num + ".  " + part_title;
    part_li.appendChild(link);

    if (grandfather.tagName == "DIV") {
      // first part
      header_id = element.parentElement.nextElementSibling.id;
    } else if (grandfather.tagName == "SECTION") {
      // others parts, that can be inside HeaderX
      el = grandfather;
      while (!el.classList.contains("level1")) {
        el = el.parentNode;
      }
      el = el.nextElementSibling;
      header_id = el.id;
    }
    a = document.getElementById("toc-" + header_id);
    a.parentNode.parentNode.insertBefore(part_li, a.parentNode);
  }

  // HEADERS NUMBERS RESET
  count = 0;
  new_num = 0;
  // we use the navbar UL's LIs, it's easier than the sections
  for (element of document.getElementById("toc").querySelectorAll("ul > li")) {
    if (element.classList.contains("toc_part")) {
      // the LI is a PART; we reset the count
      count = 0;
    } else {
      link = element.firstElementChild.id.replace(/^toc-/g, "");
      section = document.getElementById(link);
      if (section.classList.contains("level1")) {
        count = count + 1;
        new_num = count;
      } else {
        if (section.getAttribute("data-number")) {
          num = section.getAttribute("data-number");
          new_num = num.replace(/^[0-9]+\./, count + ".");
        }
      }
      // we update the LI and the headers in the "sections"
      if (element.firstElementChild.firstElementChild) {
        element.firstElementChild.firstElementChild.innerText = new_num;
        section.setAttribute("data-number", new_num);
        section.firstElementChild.setAttribute("data-number", new_num);
        section.firstElementChild.firstElementChild.innerHTML = new_num;
      }
    }
  }

  // ANCHOR LINKS in HEADINGS
  for (const element of document.getElementsByTagName("section")) {
    if (element.querySelector(".header-section-number")) {
      const header = element.querySelector(".header-section-number");
      addAnchorLink(header.parentElement, element.id);
    }
  }

  // TABLES
  for (const element of document.getElementsByTagName("table")) {
    element.setAttribute(
      "class",
      "table table-striped table-responsive table-hover table-bordered border-secondary-subtle",
    );
  }

  for (const element of document.getElementsByTagName("tbody")) {
    element.setAttribute("class", "table-group-divider");
  }

  // fontaewesome icons: file and directory
  for (const element of document.getElementsByClassName("configdir")) {
    dir = document.createElement("i");
    dir.classList.add("fa-regular", "fa-folder-open");
    element.insertBefore(dir, element.firstChild);
  }

  for (const element of document.getElementsByClassName("configfile")) {
    dir = document.createElement("i");
    dir.classList.add("fa-regular", "fa-file");
    element.insertBefore(dir, element.firstChild);
  }

  // custom boxes: infobox, warnbox, errorbox ...
  custom_boxes = [
    ["infobox", "Información", "Informazioa"],
    ["warnbox", "¡Atención!", "Adi!"],
    ["errorbox", "¡Cuidado!", "Kontuz!"],
    ["questionbox", "Pregunta", "Galdera"],
    ["exercisebox", "Ejercicio", "Ariketa"],
    ["gitbox", "GitHub", "GitHub"],
  ];
  for (const box of custom_boxes) {
    for (const element of document.getElementsByClassName(box[0])) {
      //save  the content of the box in a new div, but if it's exercisebox, we took the first child if it's the solution's links
      solution = null;
      if (box[0] == "exercisebox" && element.children.length > 1) {
        if (
          element.firstElementChild.firstElementChild.classList.contains(
            "solution",
          )
        ) {
          solution = element.firstElementChild.firstElementChild;
          element.removeChild(element.firstElementChild);
        }
      }

      content = document.createElement("div");
      content.setAttribute("class", "align-self-center content");
      while (element.firstChild) {
        content.appendChild(element.firstChild);
      }
      //  create a new div with flexbox to hold the icon and the content
      flex = document.createElement("div");
      flex.setAttribute("class", "d-flex flex-row");
      icon = document.createElement("p");
      icon.setAttribute("class", "align-self-center icon");
      flex.appendChild(icon);
      flex.appendChild(content);

      // create a new p element with the title of the box
      title = document.createElement("p");
      title.setAttribute("class", "title");
      title.innerHTML = box[1];
      const lang = document.documentElement.lang;
      if (lang == "basque") {
        // kontuz!
        title.innerHTML = box[2];
      }

      if (box[0] == "exercisebox" && solution) {
        //add the solution link to the title
        title.innerHTML = title.innerHTML + " " + solution.innerHTML;
      }

      // add title and flex to the element
      element.appendChild(title);
      element.appendChild(flex);
    }
  }

  const modal = new bootstrap.Modal(document.getElementById("imgModal"));
  for (const img of document.getElementsByTagName("img")) {
    img.onclick = function () {
      // alert(this.alt)
      var modalImg = document.getElementById("img01");
      var captionText = document.getElementById("modalCaption");
      modalImg.src = this.src;
      captionText.innerHTML = this.alt;
      modal.show();
    };
  }
})();



const root = document.documentElement,
  body = document.body,
  ghost = document.getElementById("ghost"),
  showBtn = document.getElementById("show"),
  themeToggle = document.getElementById("theme-toggle"),
  themeMenu = document.getElementById("theme-menu"),
  mobileThemeButton = document.getElementById("mobile-theme-button"),
  themePanel = document.getElementById("theme-panel"),
  closeThemePanel = document.getElementById("close-theme-panel"),
  themeSelectMobile = document.getElementById("theme-select-mobile"),
  themeIcon = document.getElementById("theme-icon"),
  divider = document.getElementById("divider");
const mobileQuery = window.matchMedia("(max-width: 768px)");
const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
let w = +localStorage.getItem("sidebar-width") || 280;
let hidden = localStorage.getItem("sidebar-hidden") === "true";
root.style.setProperty("--sidebar", w + "px");
if (hidden) body.classList.add("hidden");

function isMobile() {
  return mobileQuery.matches;
}

function resolveTheme(mode) {
  if (mode === "auto") {
    return mediaQuery.matches ? "dark" : "light";
  }
  return mode;
}

function applyTheme(mode) {
  const resolved = resolveTheme(mode);
  document.documentElement.setAttribute("data-bs-theme", resolved);
  document.documentElement.style.colorScheme = resolved;
  localStorage.setItem("theme-mode", mode);

  const iconMap = {
    light: "fa-solid fa-sun",
    dark: "fa-solid fa-moon",
    auto: "fa-solid fa-circle-half-stroke",
  };

  themeIcon.className = iconMap[mode] || "fa-solid fa-circle-half-stroke";

  document.querySelectorAll("[data-theme-mode]").forEach((button) => {
    button.classList.toggle("active", button.dataset.themeMode === mode);
  });

  if (themeSelectMobile) {
    themeSelectMobile.value = mode;
  }

  source_theme = 'dark'
  if (mode == 'light' || mode == 'auto'){
    source_theme = 'highlight'
  }
  //change code theme
  for (const element of document.querySelectorAll('[class=sourceCode]')) {
    element.firstElementChild.className = ''
    element.firstElementChild.setAttribute('class',source_theme)
  }
}

const savedTheme = localStorage.getItem("theme-mode") || "auto";
applyTheme(savedTheme);

themeToggle.addEventListener("click", () => {
  themeMenu.classList.toggle("show");
});

document.addEventListener("click", (e) => {
  if (!themeMenu.contains(e.target) && !themeToggle.contains(e.target)) {
    themeMenu.classList.remove("show");
  }

  if (
    body.classList.contains("theme-open") &&
    !themePanel.contains(e.target) &&
    !mobileThemeButton.contains(e.target)
  ) {
    body.classList.remove("theme-open");
  }

  if (!isMobile()) return;
  if (
    body.classList.contains("mobile-open") &&
    !sidebar.contains(e.target) &&
    !showBtn.contains(e.target)
  ) {
    body.classList.remove("mobile-open");
  }
});

document.querySelectorAll("[data-theme-mode]").forEach((button) => {
  button.addEventListener("click", () => {
    applyTheme(button.dataset.themeMode);
    body.classList.remove("theme-open");
    themeMenu.classList.remove("show");
  });
});

if (themeSelectMobile) {
  themeSelectMobile.addEventListener("change", (e) => {
    applyTheme(e.target.value);
    body.classList.remove("theme-open");
  });
}

mediaQuery.addEventListener("change", () => {
  if ((localStorage.getItem("theme-mode") || "auto") === "auto") {
    applyTheme("auto");
  }
});

mobileThemeButton.addEventListener("click", () => {
  body.classList.toggle("theme-open");
});

closeThemePanel.addEventListener("click", () => {
  body.classList.remove("theme-open");
});

function sync() {
  showBtn.classList.toggle(
    "d-none",
    !isMobile() && !body.classList.contains("hidden"),
  );
  localStorage.setItem("sidebar-hidden", body.classList.contains("hidden"));
}
sync();
hide.onclick = () => {
  body.classList.add("hidden");
  body.classList.remove("mobile-open");
  sync();
};
show.onclick = () => {
  body.classList.remove("hidden");
  if (isMobile()) {
    body.classList.add("mobile-open");
  }
  sync();
};
peek.onmouseenter = () => {
  if (body.classList.contains("hidden")) body.classList.remove("hidden");
};
sidebar.onmouseleave = () => {
  if (localStorage.getItem("sidebar-hidden") === "true") {
    body.classList.add("hidden");
  }
};
sidebar.onmouseenter = () => {};
sidebar.onclick = () => {
  if (isMobile()) {
    body.classList.remove("mobile-open");
  }
  localStorage.setItem("sidebar-hidden", "false");
  sync();
};
window.addEventListener("resize", sync);
let drag = false,
  x = 0;

function beginDrag(e) {
  drag = true;
  body.classList.add("resizing");
  ghost.style.display = "block";
  ghost.style.left = e.clientX + "px";
  e.preventDefault();
}

function moveDrag(e) {
  if (!drag) return;
  x = Math.max(180, Math.min(520, e.clientX));
  requestAnimationFrame(() => (ghost.style.left = x + "px"));
}

function endDrag() {
  if (!drag) return;
  drag = false;
  body.classList.remove("resizing");
  ghost.style.display = "none";
  w = x;
  root.style.setProperty("--sidebar", w + "px");
  localStorage.setItem("sidebar-width", w);
}

divider.addEventListener("pointerdown", beginDrag);
//   sidebar.addEventListener("pointerdown", (e) => {
//     if (e.pointerType === "touch" || e.pointerType === "pen") {
//       beginDrag(e);
//     }
//   });
document.addEventListener("pointermove", moveDrag);
document.addEventListener("pointerup", endDrag);
document.addEventListener("pointercancel", endDrag);
document.addEventListener("keydown", (e) => {
  if (e.ctrlKey && e.key.toLowerCase() == "b") {
    e.preventDefault();
    body.classList.toggle("hidden");
    sync();
  }
});
new ResizeObserver(() => {}).observe(document.body);