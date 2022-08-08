const totalRowsInput = document.querySelector("#total-rows");
const totalColsInput = document.querySelector("#total-cols");
const viewRowsInput = document.querySelector("#view-rows");
const viewColsInput = document.querySelector("#view-cols");
const blockedRowsInput = document.querySelector("#blocked-rows");
const blockedColsInput = document.querySelector("#blocked-cols");

const blockedSection = document.querySelector(".blocked-section");
const fixedColumnSection = document.querySelector(".fixed-col-section");
const fixedRowSection = document.querySelector(".fixed-row-section");
const scrollableSection = document.querySelector(".scrollable-section");

let isFixedColumnSectionScrolling = false;
let isFixedRowSectionScrolling = false;
let isScrollableSectionScrolling = false;

const TABLE_ITEM_WIDTH = 128;
const TABLE_ITEM_BORDER = 0.5 * 2; // border of 0.5px applied on all side
const TABLE_ITEM_HEIGHT = 25;
const TABLE_TOTAL_ITEM_HEIGHT = TABLE_ITEM_BORDER + TABLE_ITEM_HEIGHT;
const SCROLL_WIDTH = 8;
const SCROLL_HEIGHT = 8;

const getDimension = () => {
  const totalRows = parseInt(totalRowsInput.value) || 0;
  const totalCols = parseInt(totalColsInput.value) || 0;
  const viewRows = parseInt(viewRowsInput.value) || 0;
  const viewCols = parseInt(viewColsInput.value) || 0;
  const blockedRows = Math.min(totalRows, blockedRowsInput.value);
  const blockedCols = Math.min(totalCols, blockedColsInput.value);

  const minTotalViewRows = Math.min(viewRows, totalRows);
  const minTotalViewCols = Math.min(viewCols, totalCols);
  const remainingViewRows =
    totalRows > blockedRows && blockedRows >= minTotalViewRows
      ? 1
      : minTotalViewRows - blockedRows;

  const remainingViewCols =
    totalCols > blockedCols && blockedCols >= minTotalViewCols
      ? 1
      : minTotalViewCols - blockedCols;

  const remainingRows = Math.max(0, totalRows - blockedRows);
  const reaminingCols = Math.max(0, totalCols - blockedCols);

  return {
    totalRows,
    totalCols,
    viewRows,
    viewCols,
    blockedRows,
    blockedCols,
    remainingViewRows,
    remainingViewCols,
    remainingRows,
    reaminingCols,
  };
};

const createCell = (
  totalCell,
  element,
  rowStart = 0,
  colStart = 0,
  totalColumn = 0
) => {
  for (let i = 1; i <= totalCell; i++) {
    const tableItem = document.createElement("div");
    tableItem.classList.add("table-item");
    const row = rowStart + Math.floor((i - 1) / totalColumn);
    const col = colStart + ((i - 1) % totalColumn);
    tableItem.innerHTML = `(${row},${col})`;
    element.append(tableItem);
  }
};

const createBlockedSection = () => {
  const { blockedRows, blockedCols } = getDimension();

  blockedSection.innerHTML = null;
  blockedSection.removeAttribute("style");

  blockedSection.style.gridTemplateColumns = `repeat(${blockedCols},${TABLE_ITEM_WIDTH}px)`;
  blockedSection.style.height = blockedRows * TABLE_TOTAL_ITEM_HEIGHT;
  createCell(blockedRows * blockedCols, blockedSection, 1, 1, blockedCols);
};

const createFixedColumnSection = () => {
  const { blockedRows, remainingViewCols, reaminingCols, blockedCols } =
    getDimension();
  fixedColumnSection.innerHTML = null;
  fixedColumnSection.removeAttribute("style");

  fixedColumnSection.style.gridTemplateColumns = `repeat(${reaminingCols},${TABLE_ITEM_WIDTH}px)`;
  fixedColumnSection.style.width = remainingViewCols * TABLE_ITEM_WIDTH;
  fixedColumnSection.style.height = blockedRows * TABLE_TOTAL_ITEM_HEIGHT;

  createCell(
    blockedRows * reaminingCols,
    fixedColumnSection,
    1,
    blockedCols + 1,
    reaminingCols
  );
};

const createFixedRowSection = () => {
  const { remainingRows, remainingViewRows, blockedCols, blockedRows } =
    getDimension();
  fixedRowSection.innerHTML = null;
  fixedRowSection.removeAttribute("style");

  fixedRowSection.style.gridTemplateColumns = `repeat(${blockedCols},${TABLE_ITEM_WIDTH}px)`;
  fixedRowSection.style.height = remainingViewRows * TABLE_TOTAL_ITEM_HEIGHT;
  createCell(
    blockedCols * remainingRows,
    fixedRowSection,
    blockedRows + 1,
    1,
    blockedCols
  );
};

const createScrollableSection = () => {
  const {
    remainingRows,
    remainingViewRows,
    reaminingCols,
    remainingViewCols,
    blockedCols,
    blockedRows,
  } = getDimension();
  scrollableSection.innerHTML = null;
  scrollableSection.removeAttribute("style");

  scrollableSection.style.gridTemplateColumns = `repeat(${reaminingCols},${TABLE_ITEM_WIDTH}px)`;
  scrollableSection.style.width =
    remainingViewCols * TABLE_ITEM_WIDTH + SCROLL_WIDTH;
  scrollableSection.style.height =
    remainingViewRows * TABLE_TOTAL_ITEM_HEIGHT + SCROLL_HEIGHT;
  createCell(
    remainingRows * reaminingCols,
    scrollableSection,
    blockedRows + 1,
    blockedCols + 1,
    reaminingCols
  );
};

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

const createTable = () => {
  createBlockedSection();
  createFixedColumnSection();
  createFixedRowSection();
  createScrollableSection();
};

totalRowsInput.addEventListener("input", createTable);
totalColsInput.addEventListener("input", createTable);
viewRowsInput.addEventListener("input", createTable);
viewColsInput.addEventListener("input", createTable);
blockedColsInput.addEventListener("input", createTable);
blockedRowsInput.addEventListener("input", createTable);

createTable();
