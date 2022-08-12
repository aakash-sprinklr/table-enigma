import Section from "./Section.js";

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
    blockedRows,
    blockedCols,
    remainingViewRows,
    remainingViewCols,
    remainingRows,
    reaminingCols,
  };
};

const getSpecifications = () => {
  const {
    blockedRows,
    blockedCols,
    remainingViewRows,
    remainingViewCols,
    remainingRows,
    reaminingCols,
  } = getDimension();

  const blockedSectionObject = new Section(
    blockedSection,
    blockedRows * blockedCols,
    1,
    1,
    blockedCols,
    blockedRows * TABLE_TOTAL_ITEM_HEIGHT
  );

  const fixedColumnSectionObject = new Section(
    fixedColumnSection,
    blockedRows * reaminingCols,
    1,
    blockedCols + 1,
    reaminingCols,
    blockedRows * TABLE_TOTAL_ITEM_HEIGHT,
    remainingViewCols * TABLE_ITEM_WIDTH
  );
  console.log(fixedColumnSectionObject);
  const fixedRowSectionObject = new Section(
    fixedRowSection,
    remainingRows * blockedCols,
    blockedRows + 1,
    1,
    blockedCols,
    remainingViewRows * TABLE_TOTAL_ITEM_HEIGHT
  );

  const scrollableSectionObject = new Section(
    scrollableSection,
    remainingRows * reaminingCols,
    blockedRows + 1,
    blockedCols + 1,
    reaminingCols,
    remainingViewRows * TABLE_TOTAL_ITEM_HEIGHT + SCROLL_HEIGHT,
    remainingViewCols * TABLE_ITEM_WIDTH + SCROLL_WIDTH
  );

  return [
    blockedSectionObject,
    fixedColumnSectionObject,
    fixedRowSectionObject,
    scrollableSectionObject,
  ];
};

const createCell = (totalCell, element, rowStart, colStart, totalColumn) => {
  for (let i = 1; i <= totalCell; i++) {
    const tableItem = document.createElement("div");
    tableItem.classList.add("table-item");
    const row = rowStart + Math.floor((i - 1) / totalColumn);
    const col = colStart + ((i - 1) % totalColumn);
    tableItem.innerHTML = `(${row},${col})`;
    element.append(tableItem);
  }
};

const createSection = ({
  element,
  totalCell,
  height,
  width,
  rowStart,
  colStart,
  totalColumn,
}) => {
  element.innerHTML = null;
  element.removeAttribute("style");
  element.style.gridTemplateColumns = `repeat(${totalColumn},${TABLE_ITEM_WIDTH}px)`;
  element.style.height = height;
  if (width !== null) {
    element.style.width = width;
  }
  createCell(totalCell, element, rowStart, colStart, totalColumn);
};

const createTable = () => {
  const sections = getSpecifications();
  sections.forEach((item) => {
    createSection(item);
  });
};

totalRowsInput.addEventListener("input", createTable);
totalColsInput.addEventListener("input", createTable);
viewRowsInput.addEventListener("input", createTable);
viewColsInput.addEventListener("input", createTable);
blockedColsInput.addEventListener("input", createTable);
blockedRowsInput.addEventListener("input", createTable);

createTable();
