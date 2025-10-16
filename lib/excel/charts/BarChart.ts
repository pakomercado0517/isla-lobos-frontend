/**
 * Generador de gráficos de barras nativos para Excel
 * Optimizado para demos e impresionar clientes
 */

import { Worksheet } from "exceljs";
import { getChartColor } from "../styles/theme";

export interface BarChartData {
  labels: string[];
  values: number[];
  title: string;
  subtitle?: string;
}

export interface BarChartOptions {
  position?: {
    row: number;
    col: number;
  };
  size?: {
    width: number;
    height: number;
  };
  colors?: string[];
  showDataLabels?: boolean;
}

/**
 * Crea un gráfico de barras usando celdas con formato visual
 * (Alternativa visual hasta que ExcelJS soporte charts nativos)
 */
export function createVisualBarChart(
  worksheet: Worksheet,
  data: BarChartData,
  options: BarChartOptions = {}
): { startRow: number; endRow: number } {
  const {
    position = { row: 1, col: 1 },
    // size = { width: 12, height: 15 },
    colors = [],
    showDataLabels = true,
  } = options;

  let currentRow = position.row;
  const startCol = position.col;

  // Título del gráfico
  const titleCell = worksheet.getCell(currentRow, startCol);
  titleCell.value = data.title;
  titleCell.style = {
    font: {
      name: "Calibri",
      size: 14,
      bold: true,
      color: { argb: "FF0066CC" },
    },
    alignment: { horizontal: "center", vertical: "middle" },
  };
  worksheet.mergeCells(currentRow, startCol, currentRow, startCol + 6);
  currentRow += 1;

  // Subtítulo si existe
  if (data.subtitle) {
    const subtitleCell = worksheet.getCell(currentRow, startCol);
    subtitleCell.value = data.subtitle;
    subtitleCell.style = {
      font: {
        name: "Calibri",
        size: 11,
        italic: true,
        color: { argb: "FF666666" },
      },
      alignment: { horizontal: "center", vertical: "middle" },
    };
    worksheet.mergeCells(currentRow, startCol, currentRow, startCol + 6);
    currentRow += 1;
  }

  currentRow += 1; // Espacio

  // Encontrar valor máximo para escalar las barras
  const maxValue = Math.max(...data.values);
  const maxBarWidth = 8; // Máximo ancho de barra en celdas

  // Crear cada barra del gráfico
  data.labels.forEach((label, index) => {
    const value = data.values[index];
    const barWidth = Math.max(1, Math.round((value / maxValue) * maxBarWidth));
    const color = colors[index] || getChartColor(index);

    // Label de la barra
    const labelCell = worksheet.getCell(currentRow, startCol);
    labelCell.value = label;
    labelCell.style = {
      font: { name: "Calibri", size: 10, bold: true },
      alignment: { horizontal: "right", vertical: "middle" },
      border: {
        right: { style: "thin", color: { argb: "FFE0E0E0" } },
      },
    };

    // Crear la barra visual usando celdas coloreadas
    for (let i = 1; i <= maxBarWidth; i++) {
      const barCell = worksheet.getCell(currentRow, startCol + i);

      if (i <= barWidth) {
        // Parte de la barra con color
        barCell.value = "█";
        barCell.style = {
          font: { color: { argb: `FF${color}` } },
          alignment: { horizontal: "center", vertical: "middle" },
          fill: {
            type: "pattern",
            pattern: "solid",
            fgColor: { argb: `FF${color}` },
          },
        };
      } else {
        // Parte vacía de la barra
        barCell.value = "";
        barCell.style = {
          fill: {
            type: "pattern",
            pattern: "solid",
            fgColor: { argb: "FFF5F5F5" },
          },
          border: {
            top: { style: "thin", color: { argb: "FFE0E0E0" } },
            bottom: { style: "thin", color: { argb: "FFE0E0E0" } },
          },
        };
      }
    }

    // Valor de la barra si está habilitado
    if (showDataLabels) {
      const valueCell = worksheet.getCell(
        currentRow,
        startCol + maxBarWidth + 1
      );
      valueCell.value = value.toLocaleString("es-MX");
      valueCell.style = {
        font: {
          name: "Calibri",
          size: 10,
          bold: true,
          color: { argb: "FF333333" },
        },
        alignment: { horizontal: "left", vertical: "middle" },
      };
    }

    currentRow += 1;
  });

  return { startRow: position.row, endRow: currentRow };
}

/**
 * Crea un gráfico de barras horizontales comparativo
 */
export function createComparativeBarChart(
  worksheet: Worksheet,
  data: {
    title: string;
    categories: string[];
    series: Array<{
      name: string;
      values: number[];
      color?: string;
    }>;
  },
  options: BarChartOptions = {}
): { startRow: number; endRow: number } {
  const { position = { row: 1, col: 1 } } = options;
  let currentRow = position.row;
  const startCol = position.col;

  // Título del gráfico
  const titleCell = worksheet.getCell(currentRow, startCol);
  titleCell.value = data.title;
  titleCell.style = {
    font: {
      name: "Calibri",
      size: 14,
      bold: true,
      color: { argb: "FF0066CC" },
    },
    alignment: { horizontal: "center", vertical: "middle" },
  };
  worksheet.mergeCells(currentRow, startCol, currentRow, startCol + 10);
  currentRow += 2;

  // Leyenda
  let legendCol = startCol + 2;
  data.series.forEach((serie, index) => {
    const legendCell = worksheet.getCell(currentRow, legendCol);
    legendCell.value = `■ ${serie.name}`;
    legendCell.style = {
      font: {
        name: "Calibri",
        size: 9,
        color: { argb: `FF${serie.color || getChartColor(index)}` },
        bold: true,
      },
      alignment: { horizontal: "center", vertical: "middle" },
    };
    legendCol += 3;
  });
  currentRow += 2;

  // Encontrar valores máximos para escalar
  const maxValue = Math.max(...data.series.flatMap((serie) => serie.values));

  // Crear barras por categoría
  data.categories.forEach((category, categoryIndex) => {
    // Nombre de la categoría
    const categoryCell = worksheet.getCell(currentRow, startCol);
    categoryCell.value = category;
    categoryCell.style = {
      font: { name: "Calibri", size: 10, bold: true },
      alignment: { horizontal: "right", vertical: "middle" },
    };

    // Barras para cada serie
    const barRow = currentRow;
    data.series.forEach((serie, serieIndex) => {
      const value = serie.values[categoryIndex];
      const barWidth = Math.max(1, Math.round((value / maxValue) * 6));
      const color = serie.color || getChartColor(serieIndex);

      // Crear mini-barra
      for (let i = 1; i <= 6; i++) {
        const barCell = worksheet.getCell(
          barRow,
          startCol + 1 + i + serieIndex * 7
        );

        if (i <= barWidth) {
          barCell.value = "▓";
          barCell.style = {
            font: { color: { argb: `FF${color}` } },
            fill: {
              type: "pattern",
              pattern: "solid",
              fgColor: { argb: `FF${color}` },
            },
          };
        } else {
          barCell.style = {
            fill: {
              type: "pattern",
              pattern: "solid",
              fgColor: { argb: "FFF8F8F8" },
            },
          };
        }
      }

      // Valor
      const valueCell = worksheet.getCell(
        barRow,
        startCol + 8 + serieIndex * 7
      );
      valueCell.value = value;
      valueCell.style = {
        font: { name: "Calibri", size: 9 },
        alignment: { horizontal: "left", vertical: "middle" },
      };
    });

    currentRow += Math.max(2, data.series.length + 1);
  });

  return { startRow: position.row, endRow: currentRow };
}

/**
 * Crea un gráfico de barras apiladas
 */
export function createStackedBarChart(
  worksheet: Worksheet,
  data: {
    title: string;
    labels: string[];
    series: Array<{
      name: string;
      values: number[];
      color?: string;
    }>;
  },
  options: BarChartOptions = {}
): { startRow: number; endRow: number } {
  const { position = { row: 1, col: 1 } } = options;
  let currentRow = position.row;
  const startCol = position.col;

  // Título
  const titleCell = worksheet.getCell(currentRow, startCol);
  titleCell.value = data.title;
  titleCell.style = {
    font: {
      name: "Calibri",
      size: 14,
      bold: true,
      color: { argb: "FF0066CC" },
    },
    alignment: { horizontal: "center", vertical: "middle" },
  };
  worksheet.mergeCells(currentRow, startCol, currentRow, startCol + 8);
  currentRow += 2;

  // Leyenda horizontal
  let legendCol = startCol;
  data.series.forEach((serie, index) => {
    const legendCell = worksheet.getCell(currentRow, legendCol);
    legendCell.value = `■ ${serie.name}`;
    legendCell.style = {
      font: {
        name: "Calibri",
        size: 9,
        color: { argb: `FF${serie.color || getChartColor(index)}` },
        bold: true,
      },
    };
    legendCol += 2;
  });
  currentRow += 2;

  // Crear barras apiladas
  data.labels.forEach((label, labelIndex) => {
    // Label
    const labelCell = worksheet.getCell(currentRow, startCol);
    labelCell.value = label;
    labelCell.style = {
      font: { name: "Calibri", size: 10, bold: true },
      alignment: { horizontal: "right", vertical: "middle" },
    };

    // Calcular total para la barra
    const total = data.series.reduce(
      (sum, serie) => sum + serie.values[labelIndex],
      0
    );

    let stackPosition = 1;
    data.series.forEach((serie, serieIndex) => {
      const value = serie.values[labelIndex];
      const stackWidth = total > 0 ? Math.round((value / total) * 8) : 0;
      const color = serie.color || getChartColor(serieIndex);

      // Crear segmento de la barra apilada
      for (let i = 0; i < stackWidth; i++) {
        const stackCell = worksheet.getCell(
          currentRow,
          startCol + stackPosition + i
        );
        stackCell.value = "▓";
        stackCell.style = {
          font: { color: { argb: `FF${color}` } },
          fill: {
            type: "pattern",
            pattern: "solid",
            fgColor: { argb: `FF${color}` },
          },
        };
      }

      stackPosition += stackWidth;
    });

    // Total al final
    const totalCell = worksheet.getCell(currentRow, startCol + 10);
    totalCell.value = total.toLocaleString("es-MX");
    totalCell.style = {
      font: { name: "Calibri", size: 10, bold: true },
      alignment: { horizontal: "left", vertical: "middle" },
    };

    currentRow += 1;
  });

  return { startRow: position.row, endRow: currentRow };
}
