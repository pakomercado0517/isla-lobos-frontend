/**
 * Generador simple del Reporte de Prestadores
 */

import { Workbook } from "exceljs";
import { ReportePorPrestador, FiltrosReporte } from "@/actions/reportes";
import { 
  applyHeaderLayout, 
  applyStandardWorksheetSettings,
  createDataTable,
  TableColumn 
} from "../styles/layouts";
import { CELL_STYLES } from "../styles/theme";
import { 
  createVisualBarChart, 
  createStackedBarChart 
} from "../charts/BarChart";
import { 
  createVisualPieChart 
} from "../charts/PieChart";

export interface ProvidersReportOptions {
  includeCharts?: boolean;
  includeConditionalFormatting?: boolean;
}

export async function generateProvidersReport(
  workbook: Workbook,
  providers: ReportePorPrestador[],
  filtros?: FiltrosReporte,
  options: ProvidersReportOptions = {}
): Promise<void> {
  const { includeCharts = true, includeConditionalFormatting = true } = options;
  
  // Crear nueva hoja
  const worksheet = workbook.addWorksheet("👥 Prestadores");
  applyStandardWorksheetSettings(worksheet, "👥 Prestadores");

  let currentRow = 1;

  // Header
  currentRow = applyHeaderLayout(worksheet, {
    title: "👥 ANÁLISIS POR PRESTADORES - ISLA LOBOS",
    subtitle: "Desempeño y Estadísticas Detalladas",
    dateRange: filtros ? 
      `${formatDate(filtros.fecha_inicio)} - ${formatDate(filtros.fecha_fin)}` : 
      undefined,
  }, currentRow);

  // Preparar datos con métricas calculadas
  const providersData = providers.map((p, index) => ({
    ranking: index + 1,
    nombre: p.prestador_nombre,
    salidas: p.total_salidas,
    pasajeros: p.total_pasajeros,
    promedio_pasajeros: p.total_salidas > 0 ? (p.total_pasajeros / p.total_salidas).toFixed(1) : "0.0",
    embarcaciones: p.embarcaciones_count,
    ingresos: p.ingresos_estimados,
    eficiencia: p.total_salidas > 0 ? `${Math.round((p.total_pasajeros / p.total_salidas / 30) * 100)}%` : "0%",
    estado: p.total_salidas === 0 ? "🔴 Inactivo" : p.total_salidas > 10 ? "🟢 Activo" : "🟡 Bajo",
  }));

  // Definir columnas
  const columns: TableColumn[] = [
    { header: "#", key: "ranking", width: 5, style: "number" },
    { header: "Prestador", key: "nombre", width: 25, style: "text" },
    { header: "Salidas", key: "salidas", width: 10, style: "number" },
    { header: "Pasajeros", key: "pasajeros", width: 12, style: "number" },
    { header: "Prom/Salida", key: "promedio_pasajeros", width: 12, style: "number" },
    { header: "Embarcaciones", key: "embarcaciones", width: 12, style: "number" },
    { header: "Ingresos Est.", key: "ingresos", width: 18, style: "currency" },
    { header: "Eficiencia", key: "eficiencia", width: 12, style: "text" },
    { header: "Estado", key: "estado", width: 12, style: "text" },
  ];

  // Crear tabla principal
  currentRow = createDataTable(
    worksheet,
    columns,
    providersData,
    currentRow,
    { 
      alternateRows: true, 
      addTotals: true, 
      freezeHeaders: true 
    }
  );

  // Formato condicional simplificado
  if (includeConditionalFormatting) {
    // El formato condicional se implementará en versiones futuras de ExcelJS
  }

  // Agregar gráficos visuales
  if (includeCharts && providers.length > 0) {
    await addProvidersCharts(worksheet, providers, currentRow + 3);
  }
}

/**
 * Agrega gráficos específicos para análisis de prestadores
 */
async function addProvidersCharts(worksheet: import("exceljs").Worksheet, providers: ReportePorPrestador[], startRow: number): Promise<void> {
  let currentRow = startRow;
  
  // Título de sección de gráficos
  const chartsTitle = worksheet.getCell(currentRow, 1);
  chartsTitle.value = "📊 ANÁLISIS VISUAL DE PRESTADORES";
  chartsTitle.style = CELL_STYLES.subtitle;
  worksheet.mergeCells(currentRow, 1, currentRow, 9);
  currentRow += 2;
  
  // 1. Gráfico de barras - Ranking de prestadores por pasajeros
  const topPrestadores = providers
    .sort((a, b) => b.total_pasajeros - a.total_pasajeros)
    .slice(0, 8); // Top 8 para mejor visualización
  
  const prestadoresData = topPrestadores.map(p => ({
    label: p.prestador_nombre.substring(0, 15), // Nombre corto
    value: p.total_pasajeros,
    color: p.total_pasajeros > 500 ? "#00cc44" : p.total_pasajeros > 200 ? "#ffaa00" : "#cc4400"
  }));
  
  if (prestadoresData.length > 0) {
    createVisualBarChart(
      worksheet,
      {
        title: "🏆 RANKING POR TOTAL DE PASAJEROS",
        labels: prestadoresData.map(p => p.label),
        values: prestadoresData.map(p => p.value)
      },
      {
        position: { row: currentRow, col: 1 },
        size: { width: 12, height: prestadoresData.length + 5 },
        showDataLabels: true,
        colors: prestadoresData.map(p => p.color.replace('#', ''))
      }
    );
    
    currentRow += prestadoresData.length + 8;
  }
  
  // 2. Gráfico circular - Distribución por estado de actividad
  const estadoConteo = {
    activos: providers.filter(p => p.total_salidas > 10).length,
    moderados: providers.filter(p => p.total_salidas > 0 && p.total_salidas <= 10).length,
    inactivos: providers.filter(p => p.total_salidas === 0).length,
  };
  
  const estadoPieData = [
    { label: "Activos (>10 salidas)", value: estadoConteo.activos, color: "#00cc44" },
    { label: "Moderados (1-10 salidas)", value: estadoConteo.moderados, color: "#ffaa00" },
    { label: "Inactivos (0 salidas)", value: estadoConteo.inactivos, color: "#cc4400" },
  ].filter(item => item.value > 0);
  
  if (estadoPieData.length > 1) {
    createVisualPieChart(
      worksheet,
      {
        title: "📈 DISTRIBUCIÓN POR NIVEL DE ACTIVIDAD",
        labels: estadoPieData.map(item => item.label),
        values: estadoPieData.map(item => item.value)
      },
      {
        position: { row: currentRow, col: 1 },
        showPercentages: true,
        showLegend: true,
        colors: estadoPieData.map(item => item.color.replace('#', ''))
      }
    );
    
    currentRow += 15;
  }
  
  // 3. Gráfico de barras apiladas - Salidas vs Pasajeros (Top 5)
  if (topPrestadores.length >= 3) {
    const stackedData = topPrestadores.slice(0, 5).map(p => ({
      label: p.prestador_nombre.substring(0, 12),
      salidas: p.total_salidas,
      pasajeros: Math.round(p.total_pasajeros / 10), // Escalar para mejor visualización
    }));
    
    createStackedBarChart(
      worksheet,
      {
        title: "📊 COMPARATIVO: SALIDAS Y PASAJEROS (TOP 5)",
        labels: stackedData.map(d => d.label),
        series: [
          {
            name: "Salidas",
            values: stackedData.map(d => d.salidas),
            color: "0066cc"
          },
          {
            name: "Pasajeros (÷10)",
            values: stackedData.map(d => d.pasajeros),
            color: "66cc00"
          }
        ]
      },
      {
        position: { row: currentRow, col: 1 },
        size: { width: 12, height: 10 }
      }
    );
  }
}

function formatDate(dateString: string): string {
  try {
    return new Date(dateString).toLocaleDateString("es-MX", {
      day: "2-digit",
      month: "2-digit", 
      year: "numeric",
    });
  } catch {
    return dateString;
  }
}