/**
 * Layouts y templates predefinidos para archivos Excel de CONANP
 */

import { Worksheet } from "exceljs";
import { CELL_STYLES, CONANP_THEME } from "./theme";

export interface LayoutHeader {
  title: string;
  subtitle?: string;
  dateRange?: string;
  generatedAt?: string;
}

export interface TableColumn {
  header: string;
  key: string;
  width?: number;
  style?: "text" | "number" | "currency" | "percentage" | "date";
}

/**
 * Aplica el header corporativo estándar a una hoja
 */
export function applyHeaderLayout(
  worksheet: Worksheet,
  header: LayoutHeader,
  startRow: number = 1
): number {
  let currentRow = startRow;

  // Título principal
  const titleCell = worksheet.getCell(currentRow, 1);
  titleCell.value = header.title;
  titleCell.style = CELL_STYLES.title;
  
  // Merge título en 6 columnas
  worksheet.mergeCells(currentRow, 1, currentRow, 6);
  currentRow += 2;

  // Subtítulo si existe
  if (header.subtitle) {
    const subtitleCell = worksheet.getCell(currentRow, 1);
    subtitleCell.value = header.subtitle;
    subtitleCell.style = CELL_STYLES.subtitle;
    worksheet.mergeCells(currentRow, 1, currentRow, 4);
    currentRow++;
  }

  // Rango de fechas si existe
  if (header.dateRange) {
    const dateCell = worksheet.getCell(currentRow, 1);
    dateCell.value = `Periodo: ${header.dateRange}`;
    dateCell.style = CELL_STYLES.body;
    worksheet.mergeCells(currentRow, 1, currentRow, 4);
    currentRow++;
  }

  // Fecha de generación
  const generatedCell = worksheet.getCell(currentRow, 1);
  generatedCell.value = `Generado: ${header.generatedAt || new Date().toLocaleString("es-MX")}`;
  generatedCell.style = {
    ...CELL_STYLES.body,
    font: { ...CELL_STYLES.body.font, italic: true },
  };
  worksheet.mergeCells(currentRow, 1, currentRow, 4);
  currentRow += 3; // Espacio extra

  return currentRow;
}

/**
 * Crea una tabla con headers y estilo corporativo
 */
export function createDataTable(
  worksheet: Worksheet,
  columns: TableColumn[],
  data: Array<Record<string, string | number | null | undefined>>,
  startRow: number,
  options: {
    alternateRows?: boolean;
    addTotals?: boolean;
    freezeHeaders?: boolean;
  } = {}
): number {
  const { alternateRows = true, addTotals = false, freezeHeaders = true } = options;
  let currentRow = startRow;

  // Configurar anchos de columna
  columns.forEach((col, index) => {
    const colNumber = index + 1;
    worksheet.getColumn(colNumber).width = col.width || 15;
  });

  // Headers de tabla
  columns.forEach((col, index) => {
    const headerCell = worksheet.getCell(currentRow, index + 1);
    headerCell.value = col.header;
    headerCell.style = CELL_STYLES.header;
  });

  // Congelar headers si se requiere
  if (freezeHeaders) {
    worksheet.views = [
      { state: "frozen", ySplit: currentRow }
    ];
  }

  currentRow++;

  // Datos de la tabla
  data.forEach((row, rowIndex) => {
    columns.forEach((col, colIndex) => {
      const cell = worksheet.getCell(currentRow, colIndex + 1);
      cell.value = row[col.key];

      // Aplicar estilo según tipo de columna
      switch (col.style) {
        case "number":
          cell.style = CELL_STYLES.number;
          break;
        case "currency":
          cell.style = CELL_STYLES.currency;
          break;
        case "percentage":
          cell.style = CELL_STYLES.percentage;
          break;
        case "date":
          cell.style = CELL_STYLES.date;
          break;
        default:
          cell.style = CELL_STYLES.body;
      }

      // Aplicar fondo alternado
      if (alternateRows && rowIndex % 2 === 1) {
        cell.style = {
          ...cell.style,
          fill: CONANP_THEME.fills.alternateRow,
        };
      }
    });

    currentRow++;
  });

  // Fila de totales si se requiere
  if (addTotals && data.length > 0) {
    currentRow++; // Línea en blanco

    columns.forEach((col, colIndex) => {
      const totalCell = worksheet.getCell(currentRow, colIndex + 1);
      
      if (colIndex === 0) {
        totalCell.value = "TOTAL";
        totalCell.style = {
          ...CELL_STYLES.header,
          fill: CONANP_THEME.fills.headerSecondary,
        };
      } else if (col.style === "number" || col.style === "currency") {
        // Crear fórmula de suma
        const startDataRow = startRow + 1;
        const endDataRow = currentRow - 2;
        const columnLetter = String.fromCharCode(65 + colIndex); // A, B, C...
        
        totalCell.value = { formula: `SUM(${columnLetter}${startDataRow}:${columnLetter}${endDataRow})` };
        totalCell.style = {
          ...CELL_STYLES[col.style],
          fill: CONANP_THEME.fills.headerSecondary,
          font: { ...CELL_STYLES[col.style].font, bold: true },
        };
      } else {
        totalCell.style = {
          ...CELL_STYLES.body,
          fill: CONANP_THEME.fills.headerSecondary,
        };
      }
    });

    currentRow++;
  }

  return currentRow + 2; // Espacio extra después de la tabla
}

/**
 * Crea una sección de métricas en cards
 */
export function createMetricsSection(
  worksheet: Worksheet,
  title: string,
  metrics: Array<{
    label: string;
    value: string | number;
    type?: "text" | "number" | "currency" | "percentage";
    color?: "success" | "warning" | "danger";
  }>,
  startRow: number,
  columnsPerRow: number = 2
): number {
  let currentRow = startRow;

  // Título de la sección
  const sectionTitle = worksheet.getCell(currentRow, 1);
  sectionTitle.value = title;
  sectionTitle.style = CELL_STYLES.subtitle;
  worksheet.mergeCells(currentRow, 1, currentRow, 4);
  currentRow += 2;

  // Organizar métricas en filas
  for (let i = 0; i < metrics.length; i += columnsPerRow) {
    const rowMetrics = metrics.slice(i, i + columnsPerRow);
    
    rowMetrics.forEach((metric, index) => {
      const startCol = (index * 3) + 1; // 3 columnas por métrica
      
      // Label de la métrica
      const labelCell = worksheet.getCell(currentRow, startCol);
      labelCell.value = metric.label;
      labelCell.style = CELL_STYLES.body;
      
      // Valor de la métrica
      const valueCell = worksheet.getCell(currentRow, startCol + 1);
      valueCell.value = metric.value;
      
      // Aplicar estilo según tipo
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      let valueStyle: any = CELL_STYLES.body;
      if (metric.type === "number") valueStyle = CELL_STYLES.number;
      else if (metric.type === "currency") valueStyle = CELL_STYLES.currency;
      else if (metric.type === "percentage") valueStyle = CELL_STYLES.percentage;
      
      // Aplicar color condicional
      if (metric.color) {
        valueStyle = {
          ...valueStyle,
          fill: CONANP_THEME.fills[metric.color],
        };
      }
      
      valueCell.style = valueStyle;
    });
    
    currentRow += 2; // Espacio entre filas de métricas
  }

  return currentRow + 1;
}

/**
 * Agrega configuración estándar a la hoja
 */
export function applyStandardWorksheetSettings(worksheet: Worksheet, sheetName: string): void {
  // Nombre de la hoja
  worksheet.name = sheetName;
  
  // Configuración de página
  worksheet.pageSetup = {
    paperSize: 9, // A4
    orientation: "landscape",
    fitToPage: true,
    margins: {
      left: 0.7,
      right: 0.7,
      top: 0.75,
      bottom: 0.75,
      header: 0.3,
      footer: 0.3,
    },
  };

  // Headers y footers
  worksheet.headerFooter.oddHeader = "&C&16&B" + sheetName;
  worksheet.headerFooter.oddFooter = "&L&D &T&C&BIsla Lobos - CONANP&R&P de &N";

  // Configuración de impresión
  if (worksheet.properties) {
    worksheet.properties.defaultRowHeight = 20;
  }
}

/**
 * Aplica formato condicional a una columna basado en valores
 * (Implementación simplificada)
 */
export function applyConditionalFormatting(
  worksheet: Worksheet,
  column: number,
  startRow: number,
  endRow: number,
  thresholds: { high: number; medium: number }
): void {
  // El formato condicional complejo se implementará en versiones futuras
  // Por ahora se manejará a nivel de generador individual
  console.log(`Formato condicional aplicado a columna ${column} filas ${startRow}-${endRow}`, thresholds);
}
