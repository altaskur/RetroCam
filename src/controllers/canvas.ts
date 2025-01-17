import { drawTable } from "./ascii-table";
import { Resolution } from "@interfaces/ascii-table";

export const createCanvasElement = (
  resolution: Resolution,
  videoElement: HTMLVideoElement,
  canvas: HTMLCanvasElement
) => {
  const ctx = canvas.getContext("2d");

  canvas.width = resolution.width;
  canvas.height = resolution.height;

  ctx?.clearRect(0, 0, canvas.width, canvas.height);
  ctx?.drawImage(videoElement, 0, 0, canvas.width, canvas.height);

  const imageData = ctx?.getImageData(0, 0, canvas.width, canvas.height);
  const data = imageData?.data;
  if (!data) return canvas;

  const blacknessMatrix: string[][] = [];

  for (let y = 0; y < canvas.height; y++) {
    const row: string[] = [];
    for (let x = 0; x < canvas.width; x++) {
      const i = (y * canvas.width + x) * 4;
      const avg = (data[i] + data[i + 1] + data[i + 2]) / 3;
      data[i] = avg; // Red
      data[i + 1] = avg; // Green
      data[i + 2] = avg; // Blue

      const blackness = 255 - avg;
      const char = convertBlacknessToChar(blackness);
      row.push(char);
    }
    blacknessMatrix.push(row);
  }

  ctx?.putImageData(imageData, 0, 0);

  requestAnimationFrame(() => {
    ctx?.clearRect(0, 0, canvas.width, canvas.height);
    ctx?.drawImage(videoElement, 0, 0, canvas.width, canvas.height);
  });

  return canvas;
};

const convertBlacknessToChar = (blackness: number): string => {
  return blackness > 230
    ? "@"
    : blackness > 200
    ? "#"
    : blackness > 180
    ? "%"
    : blackness > 160
    ? "*"
    : blackness > 130
    ? "ª"
    : blackness > 100
    ? "º"
    : blackness > 70
    ? "="
    : blackness > 40
    ? "-"
    : blackness > 10
    ? "."
    : " ";
};

export const drawCanvas = (
  canvasElement: HTMLCanvasElement,
  tableElement: HTMLTableElement | null
) => {
  const videoElement = document.querySelector("video") as HTMLVideoElement;
  const ctx = canvasElement.getContext("2d");
  const blacknessMatrix: string[][] = [];
  const draw = () => {
    ctx?.clearRect(0, 0, canvasElement.width, canvasElement.height);
    ctx?.drawImage(
      videoElement,
      0,
      0,
      canvasElement.width,
      canvasElement.height
    );

    const imageData = ctx?.getImageData(
      0,
      0,
      canvasElement.width,
      canvasElement.height
    );
    const data = imageData?.data;
    if (data) {
      for (let i = 0; i < data.length; i += 4) {
        const avg = (data[i] + data[i + 1] + data[i + 2]) / 3;
        data[i] = avg; // Red
        data[i + 1] = avg; // Green
        data[i + 2] = avg; // Blue

        const char = convertBlacknessToChar(255 - avg);
        const x = (i / 4) % canvasElement.width;
        const y = Math.floor(i / 4 / canvasElement.width);
        blacknessMatrix[y] = blacknessMatrix[y] || [];
        blacknessMatrix[y][x] = char;
      }
      ctx?.putImageData(imageData, 0, 0);
    }

    if (tableElement) drawTable(blacknessMatrix, tableElement);
    requestAnimationFrame(draw);
  };

  draw();
};

export const clearCanvas = (canvas: HTMLCanvasElement): void => {
  const ctx = canvas.getContext("2d");
  ctx?.clearRect(0, 0, canvas.width, canvas.height);
};
