/**
 * Generador de gráficos circulares/pie para Excel
 * Crea visualizaciones impactantes para demos
 */

import { Worksheet } from "exceljs";
import { getChartColor } from "../styles/theme";

export interface PieChartData {
  labels: string[];
  values: number[];
  title: string;
  subtitle?: string;
}

export interface PieChartOptions {
  position?: {
    row: number;
    col: number;
  };
  showPercentages?: boolean;
  showLegend?: boolean;
  colors?: string[];
}

/**
 * Crea un gráfico circular usando caracteres Unicode y colores
 */
export function createVisualPieChart(
  worksheet: Worksheet,
  data: PieChartData,
  options: PieChartOptions = {}
): { startRow: number; endRow: number } {
  const {
    position = { row: 1, col: 1 },
    showPercentages = true,
    showLegend = true,
    colors = [],
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
  worksheet.mergeCells(currentRow, startCol, currentRow, startCol + 8);
  currentRow += 1;

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
    worksheet.mergeCells(currentRow, startCol, currentRow, startCol + 8);
    currentRow += 1;
  }

  currentRow += 1; // Espacio

  // Calcular totales y porcentajes
  const total = data.values.reduce((sum, value) => sum + value, 0);
  const percentages = data.values.map((value) => (value / total) * 100);

  // Crear representación visual del pie usando caracteres
  const pieSize = 8; // Tamaño del "pie" en celdas
  // const centerRow = currentRow + Math.floor(pieSize / 2);
  // const centerCol = startCol + Math.floor(pieSize / 2);

  // Crear el círculo visual
  for (let row = 0; row < pieSize; row++) {
    for (let col = 0; col < pieSize; col++) {
      const cellRow = currentRow + row;
      const cellCol = startCol + col;

      // Calcular si esta celda está dentro del círculo
      const dx = col - pieSize / 2;
      const dy = row - pieSize / 2;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance <= pieSize / 2) {
        // Calcular el ángulo para determinar qué segmento
        let angle = Math.atan2(dy, dx) * (180 / Math.PI);
        if (angle < 0) angle += 360;

        // Determinar qué segmento del pie corresponde a este ángulo
        let currentAngle = 0;
        let segmentIndex = 0;

        for (let i = 0; i < percentages.length; i++) {
          const segmentAngle = (percentages[i] / 100) * 360;
          if (angle >= currentAngle && angle < currentAngle + segmentAngle) {
            segmentIndex = i;
            break;
          }
          currentAngle += segmentAngle;
        }

        const color = colors[segmentIndex] || getChartColor(segmentIndex);
        const cell = worksheet.getCell(cellRow, cellCol);

        // Usar diferentes caracteres para crear textura
        const chars = ["●", "◉", "⬢", "◈", "▣", "◐"];
        cell.value = chars[segmentIndex % chars.length];
        cell.style = {
          font: {
            color: { argb: `FF${color}` },
            size: 14,
            bold: true,
          },
          fill: {
            type: "pattern",
            pattern: "solid",
            fgColor: { argb: `FF${color}` },
          },
          alignment: { horizontal: "center", vertical: "middle" },
        };
      }
    }
  }

  currentRow += pieSize + 2;

  // Leyenda y estadísticas
  if (showLegend) {
    const legendTitle = worksheet.getCell(currentRow, startCol);
    legendTitle.value = "📊 DISTRIBUCIÓN DETALLADA";
    legendTitle.style = {
      font: {
        name: "Calibri",
        size: 12,
        bold: true,
        color: { argb: "FF333333" },
      },
    };
    currentRow += 2;

    // Headers de la leyenda
    const headerRow = currentRow;
    worksheet.getCell(headerRow, startCol).value = "Categoría";
    worksheet.getCell(headerRow, startCol + 1).value = "Valor";
    if (showPercentages) {
      worksheet.getCell(headerRow, startCol + 2).value = "Porcentaje";
    }
    worksheet.getCell(headerRow, startCol + 3).value = "Visual";

    // Estilo de headers
    for (let i = 0; i < 4; i++) {
      const headerCell = worksheet.getCell(headerRow, startCol + i);
      headerCell.style = {
        font: {
          name: "Calibri",
          size: 10,
          bold: true,
          color: { argb: "FFFFFFFF" },
        },
        fill: {
          type: "pattern",
          pattern: "solid",
          fgColor: { argb: "FF0066CC" },
        },
        alignment: { horizontal: "center", vertical: "middle" },
        border: {
          top: { style: "thin", color: { argb: "FF000000" } },
          left: { style: "thin", color: { argb: "FF000000" } },
          bottom: { style: "thin", color: { argb: "FF000000" } },
          right: { style: "thin", color: { argb: "FF000000" } },
        },
      };
    }

    currentRow++;

    // Datos de la leyenda
    data.labels.forEach((label, index) => {
      const value = data.values[index];
      const percentage = percentages[index];
      const color = colors[index] || getChartColor(index);

      // Categoría
      const labelCell = worksheet.getCell(currentRow, startCol);
      labelCell.value = label;
      labelCell.style = {
        font: { name: "Calibri", size: 10, bold: true },
        alignment: { horizontal: "left", vertical: "middle" },
        border: {
          top: { style: "thin", color: { argb: "FFE0E0E0" } },
          left: { style: "thin", color: { argb: "FFE0E0E0" } },
          bottom: { style: "thin", color: { argb: "FFE0E0E0" } },
          right: { style: "thin", color: { argb: "FFE0E0E0" } },
        },
      };

      // Valor
      const valueCell = worksheet.getCell(currentRow, startCol + 1);
      valueCell.value = value.toLocaleString("es-MX");
      valueCell.style = {
        font: {
          name: "Calibri",
          size: 10,
          bold: true,
          color: { argb: "FF333333" },
        },
        alignment: { horizontal: "right", vertical: "middle" },
        border: {
          top: { style: "thin", color: { argb: "FFE0E0E0" } },
          left: { style: "thin", color: { argb: "FFE0E0E0" } },
          bottom: { style: "thin", color: { argb: "FFE0E0E0" } },
          right: { style: "thin", color: { argb: "FFE0E0E0" } },
        },
      };

      // Porcentaje
      if (showPercentages) {
        const percentCell = worksheet.getCell(currentRow, startCol + 2);
        percentCell.value = `${percentage.toFixed(1)}%`;
        percentCell.style = {
          font: {
            name: "Calibri",
            size: 10,
            bold: true,
            color: { argb: `FF${color}` },
          },
          alignment: { horizontal: "center", vertical: "middle" },
          border: {
            top: { style: "thin", color: { argb: "FFE0E0E0" } },
            left: { style: "thin", color: { argb: "FFE0E0E0" } },
            bottom: { style: "thin", color: { argb: "FFE0E0E0" } },
            right: { style: "thin", color: { argb: "FFE0E0E0" } },
          },
        };
      }

      // Barra visual
      const visualCell = worksheet.getCell(currentRow, startCol + 3);
      const barLength = Math.max(1, Math.round(percentage / 10)); // Escala de 1-10
      visualCell.value = "█".repeat(barLength);
      visualCell.style = {
        font: { color: { argb: `FF${color}` }, size: 10 },
        alignment: { horizontal: "left", vertical: "middle" },
        border: {
          top: { style: "thin", color: { argb: "FFE0E0E0" } },
          left: { style: "thin", color: { argb: "FFE0E0E0" } },
          bottom: { style: "thin", color: { argb: "FFE0E0E0" } },
          right: { style: "thin", color: { argb: "FFE0E0E0" } },
        },
      };

      currentRow++;
    });

    // Fila de totales
    const totalLabelCell = worksheet.getCell(currentRow, startCol);
    totalLabelCell.value = "TOTAL";
    totalLabelCell.style = {
      font: {
        name: "Calibri",
        size: 10,
        bold: true,
        color: { argb: "FFFFFFFF" },
      },
      fill: {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "FF009900" },
      },
      alignment: { horizontal: "center", vertical: "middle" },
    };

    const totalValueCell = worksheet.getCell(currentRow, startCol + 1);
    totalValueCell.value = total.toLocaleString("es-MX");
    totalValueCell.style = {
      font: {
        name: "Calibri",
        size: 10,
        bold: true,
        color: { argb: "FFFFFFFF" },
      },
      fill: {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "FF009900" },
      },
      alignment: { horizontal: "right", vertical: "middle" },
    };

    if (showPercentages) {
      const totalPercentCell = worksheet.getCell(currentRow, startCol + 2);
      totalPercentCell.value = "100.0%";
      totalPercentCell.style = {
        font: {
          name: "Calibri",
          size: 10,
          bold: true,
          color: { argb: "FFFFFFFF" },
        },
        fill: {
          type: "pattern",
          pattern: "solid",
          fgColor: { argb: "FF009900" },
        },
        alignment: { horizontal: "center", vertical: "middle" },
      };
    }

    currentRow++;
  }

  return { startRow: position.row, endRow: currentRow };
}

/**
 * Crea un gráfico de rosquilla (donut chart)
 */
export function createDonutChart(
  worksheet: Worksheet,
  data: PieChartData & { centerText?: string },
  options: PieChartOptions = {}
): { startRow: number; endRow: number } {
  const {
    position = { row: 1, col: 1 },
    // showPercentages = true,
    colors = [],
  } = options;

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
  worksheet.mergeCells(currentRow, startCol, currentRow, startCol + 6);
  currentRow += 2;

  // Crear rosquilla visual usando caracteres
  const donutSize = 6;
  const centerRow = currentRow + Math.floor(donutSize / 2);
  const centerCol = startCol + Math.floor(donutSize / 2);

  const total = data.values.reduce((sum, value) => sum + value, 0);
  const percentages = data.values.map((value) => (value / total) * 100);

  // Crear el anillo
  for (let row = 0; row < donutSize; row++) {
    for (let col = 0; col < donutSize; col++) {
      const cellRow = currentRow + row;
      const cellCol = startCol + col;

      const dx = col - donutSize / 2;
      const dy = row - donutSize / 2;
      const distance = Math.sqrt(dx * dx + dy * dy);

      // Solo dibujar en el anillo (no en el centro)
      if (distance <= donutSize / 2 && distance >= donutSize / 4) {
        let angle = Math.atan2(dy, dx) * (180 / Math.PI);
        if (angle < 0) angle += 360;

        let currentAngle = 0;
        let segmentIndex = 0;

        for (let i = 0; i < percentages.length; i++) {
          const segmentAngle = (percentages[i] / 100) * 360;
          if (angle >= currentAngle && angle < currentAngle + segmentAngle) {
            segmentIndex = i;
            break;
          }
          currentAngle += segmentAngle;
        }

        const color = colors[segmentIndex] || getChartColor(segmentIndex);
        const cell = worksheet.getCell(cellRow, cellCol);

        cell.value = "◉";
        cell.style = {
          font: {
            color: { argb: `FF${color}` },
            size: 12,
            bold: true,
          },
          fill: {
            type: "pattern",
            pattern: "solid",
            fgColor: { argb: `FF${color}` },
          },
          alignment: { horizontal: "center", vertical: "middle" },
        };
      }
    }
  }

  // Texto en el centro
  if (data.centerText) {
    const centerTextCell = worksheet.getCell(centerRow, centerCol);
    centerTextCell.value = data.centerText;
    centerTextCell.style = {
      font: {
        name: "Calibri",
        size: 10,
        bold: true,
        color: { argb: "FF333333" },
      },
      alignment: { horizontal: "center", vertical: "middle" },
    };
  }

  currentRow += donutSize + 2;

  // Mini leyenda horizontal
  let legendCol = startCol;
  data.labels.forEach((label, index) => {
    if (index > 0 && index % 3 === 0) {
      currentRow++;
      legendCol = startCol;
    }

    const color = colors[index] || getChartColor(index);
    const percentage = percentages[index];

    const legendCell = worksheet.getCell(currentRow, legendCol);
    legendCell.value = `◉ ${label} (${percentage.toFixed(1)}%)`;
    legendCell.style = {
      font: {
        name: "Calibri",
        size: 9,
        color: { argb: `FF${color}` },
        bold: true,
      },
      alignment: { horizontal: "left", vertical: "middle" },
    };

    legendCol += 2;
  });

  return { startRow: position.row, endRow: currentRow + 1 };
}
