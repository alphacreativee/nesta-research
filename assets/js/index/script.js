import { preloadImages } from "../../libs/utils.js";
("use strict");
$ = jQuery;

const lenis = new Lenis();
lenis.on("scroll", ScrollTrigger.update);
gsap.ticker.add((time) => {
  lenis.raf(time * 1000);
});

gsap.ticker.lagSmoothing(0);

function sectionSolutions() {
  if ($(".section-solutions").length < 1) return;

  const itemCards = $(".section-solutions .solutions-list .item");
  const itemBg = $(".section-solutions .solutions-bg .bg-item");
  itemCards.on("mouseenter", function () {
    let thisCardIndex = $(this).data("tab");

    itemCards.removeClass("active");
    $(
      `.section-solutions .solutions-list .item[data-tab='${thisCardIndex}']`
    ).addClass("active");

    itemBg.removeClass("active");
    $(
      `.section-solutions .solutions-bg .bg-item[data-tab='${thisCardIndex}']`
    ).addClass("active");
  });
}

const customEaseIn = CustomEase.create(
  "custom-ease-in",
  "0.47, 0.00, 0.49, 1.00"
);
const customEaseIn2 = CustomEase.create(
  "custom-ease-in-2",
  "0.17, 0.17, 0.34, 1.00"
);

const columnWidth = 30;

/* Tạo các column che ảnh */
function createColumns(el) {
  const columns = Math.ceil(el.offsetWidth / columnWidth);

  for (let i = 0; i < columns; i++) {
    const col = document.createElement("div");
    const colBg = document.createElement("div");

    col.className = "col";
    colBg.className = "col__bg";

    col.appendChild(colBg);
    el.appendChild(col);

    gsap.set(col, {
      width: columnWidth,
      left: i * columnWidth
    });
  }
}

/* Animation cho 1 photo-block */
function photoBlockAnimation(el, index = 0) {
  createColumns(el);

  const photo = el.querySelector(".photo");
  const cols = el.querySelectorAll(".col__bg");

  gsap.set(photo, { autoAlpha: 1 });

  const tl = gsap.timeline({ paused: true });

  tl.to(cols, {
    width: 0,
    duration: 1,
    ease: customEaseIn,
    stagger: 0
  }).to(
    photo,
    {
      top: "-20%",
      duration: 1.333,
      ease: customEaseIn2
    },
    0
  );

  ScrollTrigger.create({
    trigger: el,
    start: "top bottom-=10%",
    end: "bottom top-=10%",
    scrub: true,
    onEnter: () => tl.play(),
    onEnterBack: () => tl.play()
  });
}

gsap.registerPlugin(CustomEase, Flip);
CustomEase.create("osmo-ease", "0.625, 0.05, 0, 1");

gsap.defaults({
  ease: "osmo-ease",
  duration: 0.725
});

document.addEventListener("DOMContentLoaded", () => {
  const listItems = document.querySelectorAll(".main-title__item");
  const imageItems = document.querySelectorAll(".main-img__item");
  const overlayItems = document.querySelectorAll(".overlay-item");
  const overlayNav = document.querySelector(".overlay-nav");
  const navItems = document.querySelectorAll("[data-overlay='nav-item']");
  const closeButton = document.querySelector("[data-overlay='close']");
  const headings = document.querySelectorAll(".main-title");

  let activeListItem = null;

  function openOverlay(index) {
    // Set active class to the clicked list item
    listItems.forEach((item) => item.classList.remove("active"));
    activeListItem = listItems[index];
    activeListItem.classList.add("active");

    // Record the state of the title
    const title = activeListItem.querySelector(".main-title");
    const titleState = Flip.getState(title, { props: "fontSize" });

    // Record the state of the image
    const image = imageItems[index].querySelector(".image");
    const imageState = Flip.getState(image);

    // Show the overlay and get elements for animation
    const overlayItem = overlayItems[index];
    const content = overlayItem.querySelector(".overlay-row");

    gsap.set(overlayItem, { display: "block", autoAlpha: 110 });
    gsap.fromTo(content, { autoAlpha: 0 }, { autoAlpha: 1, delay: 0.5 });

    const textTarget = overlayItem.querySelector(
      "[data-overlay='text-target']"
    );
    const imgTarget = overlayItem.querySelector("[data-overlay='img-target']");

    // Append the elements to overlay targets
    textTarget.appendChild(title);
    imgTarget.appendChild(image);

    // Animate with GSAP Flip
    Flip.from(titleState);
    Flip.from(imageState);

    gsap.set(overlayNav, { display: "flex" });
    gsap.fromTo(
      navItems,
      {
        yPercent: 110
      },
      {
        yPercent: 0,
        stagger: 0.1
      }
    );

    gsap.set(imageItems, { autoAlpha: 0 });

    listItems.forEach((listItem, i) => {
      if (i !== index) {
        const otherTitle = listItem.querySelector(".main-title");
        gsap.to(otherTitle, {
          yPercent: 100,
          autoAlpha: 0,
          duration: 0.45,
          delay: 0.2 - i * 0.05
        });
      }
    });
  }

  // Function to close overlay
  function closeOverlay() {
    if (!activeListItem) return;

    // Find active overlay
    const index = Array.from(listItems).indexOf(activeListItem);
    const overlayItem = overlayItems[index];
    const title = overlayItem.querySelector(
      "[data-overlay='text-target'] .main-title"
    );
    const image = overlayItem.querySelector(
      "[data-overlay='img-target'] .image"
    );
    const overlayContent = overlayItem.querySelector(".overlay-row");

    // Record the state of title and image in overlay
    const titleState = Flip.getState(title, { props: "fontSize" });
    const imageState = Flip.getState(image);

    // Reset overlay display and move elements back to their original containers
    gsap.to(navItems, {
      yPercent: 110,
      onComplete: () => {
        overlayNav.style.display = "none";
      }
    });
    gsap.to(overlayContent, {
      autoAlpha: 0,
      onComplete: () => {
        overlayItem.style.display = "none";
      }
    });

    activeListItem.querySelector(".button").appendChild(title);
    imageItems[index].appendChild(image);
    gsap.set(imageItems[index], { autoAlpha: 1 });

    // Animate elements back with GSAP Flip
    Flip.from(titleState);
    Flip.from(imageState);

    // Remove active class
    activeListItem.classList.remove("active");
    activeListItem = null;

    gsap.to(headings, { yPercent: 0, autoAlpha: 1, delay: 0.3, stagger: 0.05 });
  }

  // Add click event listeners to list items
  listItems.forEach((listItem, index) => {
    listItem.addEventListener("click", () => openOverlay(index));
  });

  // Close overlay on ESC key
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeOverlay();
  });

  // Close overlay on close button click
  closeButton.addEventListener("click", closeOverlay);

  // Show corresponding image on hover of a list item, based on index
  listItems.forEach((listItem, i) => {
    listItem.addEventListener("mouseenter", () => {
      gsap.set(imageItems, { autoAlpha: 0 }); // hide all
      gsap.set(imageItems[i], { autoAlpha: 1 }); // show image with matching index
    });
  });
});

const init = () => {
  gsap.registerPlugin(ScrollTrigger, CustomEase, Flip);
  sectionSolutions();
  document.querySelectorAll(".photo-block").forEach((el, i) => {
    photoBlockAnimation(el, i);
  });

  document.querySelectorAll(".photo-block").forEach((block) => {
    const photo = block.querySelector(".photo");

    gsap.fromTo(
      photo,
      { y: "-10%" },
      {
        y: "10%",
        ease: "none",
        scrollTrigger: {
          trigger: block,
          start: "top bottom",
          end: "bottom top",
          scrub: true
        }
      }
    );
  });
};
preloadImages("img").then(() => {
  init();
});

let isLinkClicked = false;
$("a").on("click", function (e) {
  if (this.href && !this.href.match(/^#/) && !this.href.match(/^javascript:/)) {
    isLinkClicked = true;
  }
});

$(window).on("beforeunload", function () {
  if (!isLinkClicked) {
    $(window).scrollTop(0);
  }
  isLinkClicked = false;
});
