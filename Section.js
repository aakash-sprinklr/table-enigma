export default class Section {
  constructor(
    element,
    totalCell,
    rowStart,
    colStart,
    totalColumn,
    height,
    width = null
  ) {
    this.element = element;
    this.totalCell = totalCell;
    this.rowStart = rowStart;
    this.colStart = colStart;
    this.totalColumn = totalColumn;
    this.height = height;
    this.width = width;
  }
}
