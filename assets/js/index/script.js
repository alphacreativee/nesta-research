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

const init = () => {
  gsap.registerPlugin(ScrollTrigger);
  sectionSolutions();
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
