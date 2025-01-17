import { Resolution } from "../interfaces/ascii-table";

export const generateTable = (resolution: Resolution): HTMLTableElement => {
  const tableElement = document.createElement("table");
  tableElement.innerHTML = "";
  for (let i = 0; i < resolution.height; i++) {
    const tr = document.createElement("tr");
    for (let j = 0; j < resolution.width; j++) {
      const td = document.createElement("td");
      tr.appendChild(td);
    }
    tableElement.appendChild(tr);
  }
  return tableElement;
};

export const drawTable = (
  blacknessMatrix: string[][],
  tableElement: HTMLTableElement
) => {
  if (!tableElement) return;
  const rows = tableElement.querySelectorAll("tr");
  rows.forEach((row, y) => {
    const cells = row.querySelectorAll("td");
    cells.forEach((cell, x) => {
      cell.innerText = blacknessMatrix[y][x];
    });
  });
};

export const emptyTable = (tableElement: HTMLTableElement) => {
  const rows = tableElement.querySelectorAll("tr");
  rows.forEach((row) => {
    const cells = row.querySelectorAll("td");
    cells.forEach((cell) => {
      cell.innerText = "";
    });
  });
};
