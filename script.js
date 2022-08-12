import "./create-section.js";

const fixedColumnSection = document.querySelector(".fixed-col-section");
const fixedRowSection = document.querySelector(".fixed-row-section");
const scrollableSection = document.querySelector(".scrollable-section");

let isFixedColumnSectionScrolling = false;
let isFixedRowSectionScrolling = false;
let isScrollableSectionScrolling = false;

fixedColumnSection.addEventListener("scroll", () => {
  if (!isScrollableSectionScrolling) {
    isFixedColumnSectionScrolling = true;
    scrollableSection.scrollLeft = fixedColumnSection.scrollLeft;
  }
  isScrollableSectionScrolling = false;
});

fixedRowSection.addEventListener("scroll", () => {
  if (!isScrollableSectionScrolling) {
    isFixedRowSectionScrolling = true;
    scrollableSection.scrollTop = fixedRowSection.scrollTop;
  }
  isScrollableSectionScrolling = false;
});

scrollableSection.addEventListener("scroll", () => {
  if (!isScrollableSectionScrolling) {
    isFixedColumnSectionScrolling = true;
    scrollableSection.scrollLeft = fixedColumnSection.scrollLeft;
  }

  if (!isFixedColumnSectionScrolling) {
    isScrollableSectionScrolling = true;
    fixedColumnSection.scrollLeft = scrollableSection.scrollLeft;
  }

  if (!isFixedRowSectionScrolling) {
    isScrollableSectionScrolling = true;
    fixedRowSection.scrollTop = scrollableSection.scrollTop;
  }

  isFixedColumnSectionScrolling = false;
  isFixedRowSectionScrolling = false;
});
