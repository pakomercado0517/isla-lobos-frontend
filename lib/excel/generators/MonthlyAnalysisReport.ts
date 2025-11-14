/**
 * Generador de Reporte Mensual - Estilo Plantilla Profesional
 * Análisis de datos de operación con tabla mensual y gráfico combinado
 */

import { Workbook, Worksheet } from "exceljs";
import { FiltrosReporte, OcupacionPorDia } from "@/actions/reportes";
import { agruparDatosPorMes, DatosMensuales } from "../utils/monthly-aggregator";
import { normalizarFechaDelBackend, formatearFechaRegional } from "@/lib/utils";

export interface MonthlyAnalysisReportOptions {
  includeCharts?: boolean;
}

// Colores teal operativos (similar a la plantilla)
const TEAL_COLORS = {
  header: "008080", // Teal oscuro para header
  headerText: "FFFFFF", // Blanco para texto del header
  objetivo: "4FD0D0", // Teal claro para barras de objetivo
  realizado: "008080", // Teal oscuro para barras de realizado
  tasaLine: "FFD700", // Amarillo/verde lima para línea de tasa
  background: "FFFFFF", // Blanco
  border: "E0E0E0", // Gris claro para bordes
  text: "333333", // Gris oscuro para texto
};

/**
 * Genera el reporte mensual con estilo de plantilla profesional
 */
export async function generateMonthlyAnalysisReport(
  workbook: Workbook,
  ocupacionPorDia: OcupacionPorDia[],
  filtros?: FiltrosReporte,
  options: MonthlyAnalysisReportOptions = {}
): Promise<void> {
  const { includeCharts = true } = options;

  // Crear nueva hoja
  const worksheet = workbook.addWorksheet("Análisis Mensual");
  applyStandardWorksheetSettings(worksheet);

  let currentRow = 1;

  // 1. HEADER CON FONDO TEAL
  currentRow = createTealHeader(worksheet, filtros, currentRow);

  // 2. Agrupar datos por mes
  const datosMensuales = agruparDatosPorMes(
    ocupacionPorDia,
    filtros?.fecha_inicio,
    filtros?.fecha_fin
  );

  if (datosMensuales.length === 0) {
    // Si no hay datos, mostrar mensaje
    const noDataCell = worksheet.getCell(currentRow, 1);
    noDataCell.value = "No hay datos disponibles para el período seleccionado";
    noDataCell.style = {
      font: { name: "Calibri", size: 12, italic: true },
      alignment: { horizontal: "center", vertical: "middle" },
    };
    worksheet.mergeCells(currentRow, 1, currentRow, 6);
    return;
  }

  // 3. TABLA MENSUAL (guardamos la fila de inicio para el gráfico)
  const tableStartRow = currentRow;
  currentRow = createMonthlyTable(worksheet, datosMensuales, currentRow);

  // 4. GRÁFICO COMBINADO (si hay datos y está habilitado)
  if (includeCharts && datosMensuales.length > 0) {
    currentRow += 3; // Espacio antes del gráfico
    await createCombinedChart(worksheet, datosMensuales, currentRow, tableStartRow);
  }

  // 5. FOOTER
  currentRow += 20; // Espacio después del gráfico
  const footerCell = worksheet.getCell(currentRow, 1);
  footerCell.value = `Reporte generado automáticamente por el Sistema de Gestión Turística Isla Lobos - CONANP | ${new Date().toLocaleString("es-MX")}`;
  footerCell.style = {
    font: { name: "Calibri", size: 9, italic: true, color: { argb: "FF666666" } },
    alignment: { horizontal: "center", vertical: "middle" },
  };
  worksheet.mergeCells(currentRow, 1, currentRow, 6);
}

/**
 * Crea el header con fondo teal y texto blanco
 */
function createTealHeader(
  worksheet: Worksheet,
  filtros: FiltrosReporte | undefined,
  startRow: number
): number {
  let currentRow = startRow;

  // Header principal con fondo teal
  const headerCell = worksheet.getCell(currentRow, 1);
  headerCell.value = "Análisis de datos de operación - Isla Lobos";
  headerCell.style = {
    font: {
      name: "Calibri",
      size: 16,
      bold: true,
      color: { argb: `FF${TEAL_COLORS.headerText}` },
    },
    fill: {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: `FF${TEAL_COLORS.header}` },
    },
    alignment: { horizontal: "center", vertical: "middle" },
  };

  // Merge header en todas las columnas de la tabla (6 columnas)
  worksheet.mergeCells(currentRow, 1, currentRow, 6);
  worksheet.getRow(currentRow).height = 30;

  currentRow += 2;

  // Subtítulo con rango de fechas
  if (filtros?.fecha_inicio && filtros?.fecha_fin) {
    const fechaInicio = formatearFechaRegional(
      normalizarFechaDelBackend(filtros.fecha_inicio)
    );
    const fechaFin = formatearFechaRegional(
      normalizarFechaDelBackend(filtros.fecha_fin)
    );

    const subtitleCell = worksheet.getCell(currentRow, 1);
    subtitleCell.value = `Periodo: ${fechaInicio} - ${fechaFin}`;
    subtitleCell.style = {
      font: { name: "Calibri", size: 11, color: { argb: `FF${TEAL_COLORS.text}` } },
      alignment: { horizontal: "left", vertical: "middle" },
    };
    worksheet.mergeCells(currentRow, 1, currentRow, 6);
    currentRow++;
  }

  currentRow += 1; // Espacio antes de la tabla

  return currentRow;
}

/**
 * Crea la tabla mensual con datos
 */
function createMonthlyTable(
  worksheet: Worksheet,
  datosMensuales: DatosMensuales[],
  startRow: number
): number {
  let currentRow = startRow;

  // Configurar anchos de columna
  worksheet.getColumn(1).width = 15; // Tiempo (Mes)
  worksheet.getColumn(2).width = 15; // Objetivo
  worksheet.getColumn(3).width = 15; // Realizado
  worksheet.getColumn(4).width = 20; // Tasa de finalización
  worksheet.getColumn(5).width = 15; // Total Salidas
  worksheet.getColumn(6).width = 15; // Total (reservado)

  // HEADERS DE LA TABLA
  const headers = [
    "tiempo",
    "Objetivo",
    "Realizado",
    "Tasa de finalización",
    "Total Salidas",
    "total",
  ];

  headers.forEach((header, colIndex) => {
    const cell = worksheet.getCell(currentRow, colIndex + 1);
    cell.value = header;
    cell.style = {
      font: {
        name: "Calibri",
        size: 11,
        bold: true,
        color: { argb: `FF${TEAL_COLORS.headerText}` },
      },
      fill: {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: `FF${TEAL_COLORS.header}` },
      },
      alignment: { horizontal: "center", vertical: "middle" },
      border: {
        top: { style: "thin", color: { argb: `FF${TEAL_COLORS.border}` } },
        left: { style: "thin", color: { argb: `FF${TEAL_COLORS.border}` } },
        bottom: { style: "thin", color: { argb: `FF${TEAL_COLORS.border}` } },
        right: { style: "thin", color: { argb: `FF${TEAL_COLORS.border}` } },
      },
    };
  });

  worksheet.getRow(currentRow).height = 25;
  currentRow++;

  // DATOS POR MES
  datosMensuales.forEach((datos, index) => {
    const isEven = index % 2 === 0;
    const rowFill = isEven
      ? { argb: `FF${TEAL_COLORS.background}` }
      : { argb: "FFF5F5F5" }; // Gris muy claro para filas alternas

    // Mes
    const mesCell = worksheet.getCell(currentRow, 1);
    mesCell.value = datos.mes;
    mesCell.style = {
      font: { name: "Calibri", size: 11, color: { argb: `FF${TEAL_COLORS.text}` } },
      fill: { type: "pattern", pattern: "solid", fgColor: rowFill },
      alignment: { horizontal: "left", vertical: "middle" },
      border: {
        top: { style: "thin", color: { argb: `FF${TEAL_COLORS.border}` } },
        left: { style: "thin", color: { argb: `FF${TEAL_COLORS.border}` } },
        bottom: { style: "thin", color: { argb: `FF${TEAL_COLORS.border}` } },
        right: { style: "thin", color: { argb: `FF${TEAL_COLORS.border}` } },
      },
    };

    // Objetivo
    const objetivoCell = worksheet.getCell(currentRow, 2);
    objetivoCell.value = datos.objetivo;
    objetivoCell.style = {
      font: { name: "Calibri", size: 11, color: { argb: `FF${TEAL_COLORS.text}` } },
      fill: { type: "pattern", pattern: "solid", fgColor: rowFill },
      alignment: { horizontal: "right", vertical: "middle" },
      numFmt: "#,##0",
      border: {
        top: { style: "thin", color: { argb: `FF${TEAL_COLORS.border}` } },
        left: { style: "thin", color: { argb: `FF${TEAL_COLORS.border}` } },
        bottom: { style: "thin", color: { argb: `FF${TEAL_COLORS.border}` } },
        right: { style: "thin", color: { argb: `FF${TEAL_COLORS.border}` } },
      },
    };

    // Realizado
    const realizadoCell = worksheet.getCell(currentRow, 3);
    realizadoCell.value = datos.realizado;
    realizadoCell.style = {
      font: { name: "Calibri", size: 11, color: { argb: `FF${TEAL_COLORS.text}` } },
      fill: { type: "pattern", pattern: "solid", fgColor: rowFill },
      alignment: { horizontal: "right", vertical: "middle" },
      numFmt: "#,##0",
      border: {
        top: { style: "thin", color: { argb: `FF${TEAL_COLORS.border}` } },
        left: { style: "thin", color: { argb: `FF${TEAL_COLORS.border}` } },
        bottom: { style: "thin", color: { argb: `FF${TEAL_COLORS.border}` } },
        right: { style: "thin", color: { argb: `FF${TEAL_COLORS.border}` } },
      },
    };

    // Tasa de finalización
    const tasaCell = worksheet.getCell(currentRow, 4);
    tasaCell.value = datos.tasa_finalizacion / 100; // Excel espera decimal (0.85 = 85%)
    tasaCell.style = {
      font: { name: "Calibri", size: 11, color: { argb: `FF${TEAL_COLORS.text}` } },
      fill: { type: "pattern", pattern: "solid", fgColor: rowFill },
      alignment: { horizontal: "right", vertical: "middle" },
      numFmt: "0.00%",
      border: {
        top: { style: "thin", color: { argb: `FF${TEAL_COLORS.border}` } },
        left: { style: "thin", color: { argb: `FF${TEAL_COLORS.border}` } },
        bottom: { style: "thin", color: { argb: `FF${TEAL_COLORS.border}` } },
        right: { style: "thin", color: { argb: `FF${TEAL_COLORS.border}` } },
      },
    };

    // Total Salidas
    const salidasCell = worksheet.getCell(currentRow, 5);
    salidasCell.value = datos.total_salidas;
    salidasCell.style = {
      font: { name: "Calibri", size: 11, color: { argb: `FF${TEAL_COLORS.text}` } },
      fill: { type: "pattern", pattern: "solid", fgColor: rowFill },
      alignment: { horizontal: "right", vertical: "middle" },
      numFmt: "#,##0",
      border: {
        top: { style: "thin", color: { argb: `FF${TEAL_COLORS.border}` } },
        left: { style: "thin", color: { argb: `FF${TEAL_COLORS.border}` } },
        bottom: { style: "thin", color: { argb: `FF${TEAL_COLORS.border}` } },
        right: { style: "thin", color: { argb: `FF${TEAL_COLORS.border}` } },
      },
    };

    // Total (columna reservada, puede usarse para totales)
    const totalCell = worksheet.getCell(currentRow, 6);
    totalCell.value = ""; // Vacío por ahora
    totalCell.style = {
      font: { name: "Calibri", size: 11 },
      fill: { type: "pattern", pattern: "solid", fgColor: rowFill },
      alignment: { horizontal: "right", vertical: "middle" },
      border: {
        top: { style: "thin", color: { argb: `FF${TEAL_COLORS.border}` } },
        left: { style: "thin", color: { argb: `FF${TEAL_COLORS.border}` } },
        bottom: { style: "thin", color: { argb: `FF${TEAL_COLORS.border}` } },
        right: { style: "thin", color: { argb: `FF${TEAL_COLORS.border}` } },
      },
    };

    worksheet.getRow(currentRow).height = 20;
    currentRow++;
  });

  // FILA DE TOTALES
  const totalObjetivo = datosMensuales.reduce((sum, d) => sum + d.objetivo, 0);
  const totalRealizado = datosMensuales.reduce((sum, d) => sum + d.realizado, 0);
  const totalSalidas = datosMensuales.reduce((sum, d) => sum + d.total_salidas, 0);
  const promedioTasa =
    datosMensuales.length > 0
      ? datosMensuales.reduce((sum, d) => sum + d.tasa_finalizacion, 0) /
        datosMensuales.length
      : 0;

  // Label "total"
  const totalLabelCell = worksheet.getCell(currentRow, 1);
  totalLabelCell.value = "total";
  totalLabelCell.style = {
    font: { name: "Calibri", size: 11, bold: true, color: { argb: `FF${TEAL_COLORS.text}` } },
    fill: {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "FFE0E0E0" }, // Gris claro para fila de totales
    },
    alignment: { horizontal: "left", vertical: "middle" },
    border: {
      top: { style: "medium", color: { argb: `FF${TEAL_COLORS.border}` } },
      left: { style: "thin", color: { argb: `FF${TEAL_COLORS.border}` } },
      bottom: { style: "thin", color: { argb: `FF${TEAL_COLORS.border}` } },
      right: { style: "thin", color: { argb: `FF${TEAL_COLORS.border}` } },
    },
  };

  // Total Objetivo
  const totalObjetivoCell = worksheet.getCell(currentRow, 2);
  totalObjetivoCell.value = totalObjetivo;
  totalObjetivoCell.style = {
    font: { name: "Calibri", size: 11, bold: true, color: { argb: `FF${TEAL_COLORS.text}` } },
    fill: {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "FFE0E0E0" },
    },
    alignment: { horizontal: "right", vertical: "middle" },
    numFmt: "#,##0",
    border: {
      top: { style: "medium", color: { argb: `FF${TEAL_COLORS.border}` } },
      left: { style: "thin", color: { argb: `FF${TEAL_COLORS.border}` } },
      bottom: { style: "thin", color: { argb: `FF${TEAL_COLORS.border}` } },
      right: { style: "thin", color: { argb: `FF${TEAL_COLORS.border}` } },
    },
  };

  // Total Realizado
  const totalRealizadoCell = worksheet.getCell(currentRow, 3);
  totalRealizadoCell.value = totalRealizado;
  totalRealizadoCell.style = {
    font: { name: "Calibri", size: 11, bold: true, color: { argb: `FF${TEAL_COLORS.text}` } },
    fill: {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "FFE0E0E0" },
    },
    alignment: { horizontal: "right", vertical: "middle" },
    numFmt: "#,##0",
    border: {
      top: { style: "medium", color: { argb: `FF${TEAL_COLORS.border}` } },
      left: { style: "thin", color: { argb: `FF${TEAL_COLORS.border}` } },
      bottom: { style: "thin", color: { argb: `FF${TEAL_COLORS.border}` } },
      right: { style: "thin", color: { argb: `FF${TEAL_COLORS.border}` } },
    },
  };

  // Promedio Tasa
  const promedioTasaCell = worksheet.getCell(currentRow, 4);
  promedioTasaCell.value = promedioTasa / 100;
  promedioTasaCell.style = {
    font: { name: "Calibri", size: 11, bold: true, color: { argb: `FF${TEAL_COLORS.text}` } },
    fill: {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "FFE0E0E0" },
    },
    alignment: { horizontal: "right", vertical: "middle" },
    numFmt: "0.00%",
    border: {
      top: { style: "medium", color: { argb: `FF${TEAL_COLORS.border}` } },
      left: { style: "thin", color: { argb: `FF${TEAL_COLORS.border}` } },
      bottom: { style: "thin", color: { argb: `FF${TEAL_COLORS.border}` } },
      right: { style: "thin", color: { argb: `FF${TEAL_COLORS.border}` } },
    },
  };

  // Total Salidas
  const totalSalidasCell = worksheet.getCell(currentRow, 5);
  totalSalidasCell.value = totalSalidas;
  totalSalidasCell.style = {
    font: { name: "Calibri", size: 11, bold: true, color: { argb: `FF${TEAL_COLORS.text}` } },
    fill: {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "FFE0E0E0" },
    },
    alignment: { horizontal: "right", vertical: "middle" },
    numFmt: "#,##0",
    border: {
      top: { style: "medium", color: { argb: `FF${TEAL_COLORS.border}` } },
      left: { style: "thin", color: { argb: `FF${TEAL_COLORS.border}` } },
      bottom: { style: "thin", color: { argb: `FF${TEAL_COLORS.border}` } },
      right: { style: "thin", color: { argb: `FF${TEAL_COLORS.border}` } },
    },
  };

  // Total (vacío)
  const totalTotalCell = worksheet.getCell(currentRow, 6);
  totalTotalCell.value = "";
  totalTotalCell.style = {
    font: { name: "Calibri", size: 11 },
    fill: {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "FFE0E0E0" },
    },
    alignment: { horizontal: "right", vertical: "middle" },
    border: {
      top: { style: "medium", color: { argb: `FF${TEAL_COLORS.border}` } },
      left: { style: "thin", color: { argb: `FF${TEAL_COLORS.border}` } },
      bottom: { style: "thin", color: { argb: `FF${TEAL_COLORS.border}` } },
      right: { style: "thin", color: { argb: `FF${TEAL_COLORS.border}` } },
    },
  };

  worksheet.getRow(currentRow).height = 25;
  currentRow++;

  return currentRow;
}

/**
 * Crea un gráfico combinado nativo de Excel (barras + línea)
 */
async function createCombinedChart(
  worksheet: Worksheet,
  datosMensuales: DatosMensuales[],
  startRow: number,
  tableStartRow: number
): Promise<void> {
  // Título del gráfico
  const chartTitleCell = worksheet.getCell(startRow, 1);
  chartTitleCell.value = "Análisis de operación";
  chartTitleCell.style = {
    font: { name: "Calibri", size: 14, bold: true, color: { argb: `FF${TEAL_COLORS.text}` } },
    alignment: { horizontal: "left", vertical: "middle" },
  };
  worksheet.mergeCells(startRow, 1, startRow, 6);

  // La fila donde empiezan los datos es tableStartRow + 1 (después del header de la tabla)
  const dataStartRow = tableStartRow + 1;

  try {
    // Crear gráfico combinado nativo de Excel
    // ExcelJS soporta gráficos nativos usando worksheet.addChart()
    const chart = worksheet.addChart({
      type: "column", // Tipo base: columnas
      name: "Análisis de Operación",
      title: {
        name: "Análisis de operación",
      },
    });

    // Agregar serie de barras para Objetivo (columna B)
    chart.addSeries({
      name: "Objetivo",
      categories: {
        address: `A${dataStartRow + 1}:A${dataStartRow + datosMensuales.length}`,
      },
      values: {
        address: `B${dataStartRow + 1}:B${dataStartRow + datosMensuales.length}`,
      },
      fill: {
        color: TEAL_COLORS.objetivo,
      },
    });

    // Agregar serie de barras para Realizado (columna C)
    chart.addSeries({
      name: "Realizado",
      categories: {
        address: `A${dataStartRow + 1}:A${dataStartRow + datosMensuales.length}`,
      },
      values: {
        address: `C${dataStartRow + 1}:C${dataStartRow + datosMensuales.length}`,
      },
      fill: {
        color: TEAL_COLORS.realizado,
      },
    });

    // Agregar serie de línea para Tasa de finalización (columna D)
    // Nota: Para gráficos combinados, necesitamos cambiar el tipo de esta serie a línea
    chart.addSeries({
      name: "Tasa de finalización",
      categories: {
        address: `A${dataStartRow + 1}:A${dataStartRow + datosMensuales.length}`,
      },
      values: {
        address: `D${dataStartRow + 1}:D${dataStartRow + datosMensuales.length}`,
      },
      type: "line", // Cambiar a línea
      fill: {
        color: TEAL_COLORS.tasaLine,
      },
      line: {
        color: TEAL_COLORS.tasaLine,
        width: 2,
      },
      yAxis: 1, // Usar eje Y secundario (derecho)
    });

    // Configurar posición del gráfico
    chart.setPosition({
      x: 0,
      y: startRow + 2,
      width: 600,
      height: 400,
    });

    // Configurar ejes
    chart.yAxis = {
      left: {
        title: {
          name: "Pasajeros",
        },
        min: 0,
      },
      right: {
        title: {
          name: "Tasa de finalización (%)",
        },
        min: 0,
        max: 1.6, // 160%
      },
    };

    chart.xAxis = {
      title: {
        name: "Mes",
      },
    };
  } catch (error) {
    // Si falla la creación del gráfico nativo, mostrar nota
    const noteRow = startRow + 2;
    const noteCell = worksheet.getCell(noteRow, 1);
    noteCell.value =
      "Nota: El gráfico combinado se puede agregar manualmente en Excel usando los datos de la tabla. Barras: Objetivo (teal claro) y Realizado (teal oscuro). Línea: Tasa de finalización (amarillo) en eje Y secundario.";
    noteCell.style = {
      font: { name: "Calibri", size: 10, italic: true, color: { argb: "FF666666" } },
      alignment: { horizontal: "left", vertical: "middle" },
    };
    worksheet.mergeCells(noteRow, 1, noteRow, 6);
  }
}

/**
 * Aplica configuraciones estándar a la hoja
 */
function applyStandardWorksheetSettings(worksheet: Worksheet): void {
  worksheet.properties.defaultRowHeight = 20;
  worksheet.views = [
    {
      state: "normal",
      zoomScale: 100,
      showGridLines: true,
    },
  ];
}

