/**
 * ChartsDemo - Visualizaciones impresionantes para demo con clientes
 * Integra los distintos tipos de charts para crear experiencias de alta calidad visual
 */

import { Worksheet } from "exceljs";
import { ExcelReportData } from "../ExcelBuilder";
import { createVisualBarChart } from "./BarChart";
import { createVisualPieChart, createDonutChart } from "./PieChart";

export async function addDemoCharts(
  worksheet: Worksheet,
  data: ExcelReportData,
  startRow: number
): Promise<number> {
  let currentRow = startRow;

  // Título de sección de gráficos
  const chartsTitle = worksheet.getCell(currentRow, 1);
  chartsTitle.value = "🎨 VISUALIZACIONES EJECUTIVAS - DEMO PROFESIONAL";
  chartsTitle.style = {
    font: {
      name: "Calibri",
      size: 16,
      bold: true,
      color: { argb: "FF0066CC" },
    },
    alignment: { horizontal: "center", vertical: "middle" },
  };
  worksheet.mergeCells(currentRow, 1, currentRow, 12);
  currentRow += 3;

  // 1. GRÁFICO DE BARRAS - OCUPACIÓN POR DÍA
  const ocupacionData = {
    title: "📊 OCUPACIÓN DIARIA - TENDENCIA DE DEMANDA",
    subtitle: "Análisis de flujo turístico por día",
    labels: data.ocupacion_por_dia.slice(0, 7).map((dia) => {
      try {
        const date = new Date(dia.fecha);
        return date.toLocaleDateString("es-MX", {
          day: "2-digit",
          month: "short",
        });
      } catch {
        return dia.fecha;
      }
    }),
    values: data.ocupacion_por_dia
      .slice(0, 7)
      .map((dia) => dia.total_pasajeros),
  };

  const barChartResult = createVisualBarChart(worksheet, ocupacionData, {
    position: { row: currentRow, col: 1 },
    showDataLabels: true,
    colors: [
      "0066CC",
      "009900",
      "FF6600",
      "9900CC",
      "CC6600",
      "00CC99",
      "CC0066",
    ],
  });

  currentRow = barChartResult.endRow + 3;

  // 2. GRÁFICO CIRCULAR - DISTRIBUCIÓN POR PRESTADORES
  const topPrestadores = data.reporte_por_prestador
    .sort((a, b) => b.total_pasajeros - a.total_pasajeros)
    .slice(0, 5);

  const pieData = {
    title: "🍰 PARTICIPACIÓN DE MERCADO - TOP 5 PRESTADORES",
    subtitle: "Distribución de pasajeros por operador turístico",
    labels: topPrestadores.map((p) =>
      p.prestador_nombre.length > 15
        ? p.prestador_nombre.substring(0, 12) + "..."
        : p.prestador_nombre
    ),
    values: topPrestadores.map((p) => p.total_pasajeros),
  };

  const pieChartResult = createVisualPieChart(worksheet, pieData, {
    position: { row: currentRow, col: 1 },
    showPercentages: true,
    showLegend: true,
    colors: ["0066CC", "009900", "FF6600", "9900CC", "CC6600"],
  });

  currentRow = pieChartResult.endRow + 3;

  // 3. GRÁFICO DONUT - INGRESOS POR CATEGORÍA
  const totalPasajeros = data.ocupacion_por_dia.reduce(
    (sum, dia) => sum + dia.total_pasajeros,
    0
  );
  const totalIngresos = data.ocupacion_por_dia.reduce(
    (sum, dia) => sum + dia.ingresos_estimados,
    0
  );
  const diasBuenos = data.ocupacion_por_dia.filter(
    (d) => d.ocupacion_porcentaje >= 70
  ).length;
  const diasRegulares = data.ocupacion_por_dia.filter(
    (d) => d.ocupacion_porcentaje >= 40 && d.ocupacion_porcentaje < 70
  ).length;
  const diasBajos = data.ocupacion_por_dia.filter(
    (d) => d.ocupacion_porcentaje < 40
  ).length;

  const donutData = {
    title: "🍩 RENDIMIENTO OPERATIVO - CLASIFICACIÓN DE DÍAS",
    labels: [
      "Días Óptimos (>70%)",
      "Días Regulares (40-70%)",
      "Días Bajo (< 40%)",
    ],
    values: [diasBuenos, diasRegulares, diasBajos],
    centerText: `${data.ocupacion_por_dia.length}\nDías\nAnalizados`,
  };

  if (donutData.values.some((v) => v > 0)) {
    const donutResult = createDonutChart(worksheet, donutData, {
      position: { row: currentRow, col: 1 },
      showPercentages: true,
      colors: ["28A745", "FFC107", "DC3545"],
    });
    currentRow = donutResult.endRow + 3;
  }

  // 4. RESUMEN VISUAL DE IMPACTO
  const impactTitle = worksheet.getCell(currentRow, 1);
  impactTitle.value = "🎆 IMPACTO DEL SISTEMA - BENEFICIOS CUANTIFICABLES";
  impactTitle.style = {
    font: {
      name: "Calibri",
      size: 14,
      bold: true,
      color: { argb: "FF009900" },
    },
    alignment: { horizontal: "center", vertical: "middle" },
    fill: {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "FFF0FFF0" },
    },
  };
  worksheet.mergeCells(currentRow, 1, currentRow, 10);
  currentRow += 2;

  // Beneficios en formato visual
  const beneficios = [
    `📈 TRANSPARENCIA: Control total de ${totalPasajeros.toLocaleString(
      "es-MX"
    )} visitantes registrados`,
    `💰 INGRESOS MONITOREADOS: $${totalIngresos.toLocaleString(
      "es-MX"
    )} en ingresos estimados rastreados`,
    `🎯 EFICIENCIA OPERATIVA: ${data.reporte_por_prestador.length} prestadores monitoreados en tiempo real`,
    `🗺️ CONSERVACIÓN: Capacidad de carga controlada para proteger Isla Lobos`,
    `⚙️ AUTOMATIZACIÓN: Reportes generados automáticamente, ahorro de 8+ horas semanales`,
  ];

  // Agregar cada beneficio y su index por ej. beneficios.forEach((beneficio, index)=>...)
  beneficios.forEach((beneficio) => {
    const beneficioCell = worksheet.getCell(currentRow, 1);
    beneficioCell.value = beneficio;
    beneficioCell.style = {
      font: {
        name: "Calibri",
        size: 12,
        bold: true,
        color: { argb: "FF009900" },
      },
      alignment: { horizontal: "left", vertical: "middle" },
    };
    worksheet.mergeCells(currentRow, 1, currentRow, 10);
    worksheet.getRow(currentRow).height = 25;
    currentRow++;
  });

  // Call-to-action final
  currentRow += 2;
  const ctaCell = worksheet.getCell(currentRow, 1);
  ctaCell.value =
    "🚀 ¿QUÉ OTROS REPORTES NECESITA SU ORGANIZACIÓN? - PLATIQUEMOS";
  ctaCell.style = {
    font: {
      name: "Calibri",
      size: 16,
      bold: true,
      color: { argb: "FFFFFFFF" },
    },
    alignment: { horizontal: "center", vertical: "middle" },
    fill: {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "FFFF6600" },
    },
  };
  worksheet.mergeCells(currentRow, 1, currentRow, 10);
  worksheet.getRow(currentRow).height = 35;

  return currentRow;
}
