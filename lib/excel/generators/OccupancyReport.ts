/**
 * Generador simple del Reporte de Ocupación Diaria
 */

import { Workbook } from "exceljs";
import { OcupacionPorDia, FiltrosReporte } from "@/actions/reportes";
import { 
  applyHeaderLayout, 
  applyStandardWorksheetSettings,
  createDataTable,
  TableColumn 
} from "../styles/layouts";
import { CELL_STYLES } from "../styles/theme";
import { 
  createVisualBarChart, 
  createComparativeBarChart 
} from "../charts/BarChart";
import { 
  createDonutChart 
} from "../charts/PieChart";

export interface OccupancyReportOptions {
  includeCharts?: boolean;
  includeConditionalFormatting?: boolean;
}

export async function generateOccupancyReport(
  workbook: Workbook,
  ocupacion: OcupacionPorDia[],
  filtros?: FiltrosReporte,
  options: OccupancyReportOptions = {}
): Promise<void> {
  const { includeCharts = true, includeConditionalFormatting = true } = options;
  
  // Crear nueva hoja
  const worksheet = workbook.addWorksheet("📊 Ocupación");
  applyStandardWorksheetSettings(worksheet, "📊 Ocupación");

  let currentRow = 1;

  // Header
  currentRow = applyHeaderLayout(worksheet, {
    title: "📊 ANÁLISIS DE OCUPACIÓN DIARIA - ISLA LOBOS",
    subtitle: "Estadísticas de Demanda y Capacidad",
    dateRange: filtros ? 
      `${formatDate(filtros.fecha_inicio)} - ${formatDate(filtros.fecha_fin)}` : 
      undefined,
  }, currentRow);

  // Preparar datos con análisis
  const ocupacionData = ocupacion.map((dia) => ({
    fecha: formatDate(dia.fecha),
    diaSemana: getDayOfWeek(dia.fecha),
    salidas: dia.total_salidas,
    pasajeros: dia.total_pasajeros,
    capacidad: 195, // Capacidad máxima por día
    ocupacion_pct: dia.ocupacion_porcentaje,
    ocupacion_display: `${dia.ocupacion_porcentaje}%`,
    disponibles: 195 - dia.total_pasajeros,
    ingresos: dia.ingresos_estimados,
    estado: getEstadoOcupacion(dia.ocupacion_porcentaje),
    tendencia: getTendencia(dia.ocupacion_porcentaje),
  }));

  // Definir columnas
  const columns: TableColumn[] = [
    { header: "Fecha", key: "fecha", width: 12, style: "text" },
    { header: "Día Semana", key: "diaSemana", width: 15, style: "text" },
    { header: "Salidas", key: "salidas", width: 10, style: "number" },
    { header: "Pasajeros", key: "pasajeros", width: 12, style: "number" },
    { header: "Capacidad", key: "capacidad", width: 10, style: "number" },
    { header: "Ocupación %", key: "ocupacion_display", width: 12, style: "text" },
    { header: "Disponibles", key: "disponibles", width: 12, style: "number" },
    { header: "Ingresos Est.", key: "ingresos", width: 18, style: "currency" },
    { header: "Estado", key: "estado", width: 15, style: "text" },
    { header: "Tendencia", key: "tendencia", width: 12, style: "text" },
  ];

  // Crear tabla principal
  currentRow = createDataTable(
    worksheet,
    columns,
    ocupacionData,
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
  if (includeCharts && ocupacion.length > 0) {
    await addOccupancyCharts(worksheet, ocupacion, currentRow + 3);
  }
}

/**
 * Agrega gráficos específicos para análisis de ocupación
 */
async function addOccupancyCharts(worksheet: import("exceljs").Worksheet, ocupacion: OcupacionPorDia[], startRow: number): Promise<void> {
  let currentRow = startRow;
  
  // Título de sección de gráficos
  const chartsTitle = worksheet.getCell(currentRow, 1);
  chartsTitle.value = "📊 ANÁLISIS VISUAL DE OCUPACIÓN";
  chartsTitle.style = CELL_STYLES.subtitle;
  worksheet.mergeCells(currentRow, 1, currentRow, 10);
  currentRow += 2;
  
  // 1. Gráfico de barras - Ocupación diaria (últimos 14 días o todos si son menos)
  const ocupacionReciente = ocupacion.slice(-14);
  const ocupacionBarData = ocupacionReciente.map(dia => ({
    label: formatDate(dia.fecha).substring(0, 5), // DD/MM
    value: dia.ocupacion_porcentaje,
    color: getColorByOccupancy(dia.ocupacion_porcentaje)
  }));
  
  if (ocupacionBarData.length > 0) {
    createVisualBarChart(
      worksheet,
      {
        title: "📈 EVOLUCIÓN DE OCUPACIÓN DIARIA (%)",
        labels: ocupacionBarData.map(d => d.label),
        values: ocupacionBarData.map(d => d.value)
      },
      {
        position: { row: currentRow, col: 1 },
        size: { width: 14, height: 8 },
        showDataLabels: true,
        colors: ocupacionBarData.map(d => d.color.replace('#', ''))
      }
    );
    
    currentRow += 12;
  }
  
  // 2. Gráfico comparativo - Pasajeros vs Capacidad Máxima
  if (ocupacion.length >= 3) {
    const comparativeData = ocupacionReciente.map(dia => ({
      label: formatDate(dia.fecha).substring(0, 5), // DD/MM
      pasajeros: dia.total_pasajeros,
      capacidad: 195, // Capacidad máxima
    }));
    
    createComparativeBarChart(
      worksheet,
      {
        title: "📊 PASAJEROS VS CAPACIDAD MÁXIMA",
        categories: comparativeData.map(d => d.label),
        series: [
          {
            name: "Pasajeros",
            values: comparativeData.map(d => d.pasajeros),
            color: "0066cc"
          },
          {
            name: "Cap. Máxima",
            values: comparativeData.map(d => d.capacidad),
            color: "cccccc"
          }
        ]
      },
      {
        position: { row: currentRow, col: 1 },
        size: { width: 14, height: 10 }
      }
    );
    
    currentRow += 13;
  }
  
  // 3. Gráfico circular - Distribución por estado de ocupación
  const estadosOcupacion = {
    altaDemanda: ocupacion.filter(d => d.ocupacion_porcentaje >= 80).length,
    buena: ocupacion.filter(d => d.ocupacion_porcentaje >= 60 && d.ocupacion_porcentaje < 80).length,
    moderada: ocupacion.filter(d => d.ocupacion_porcentaje >= 40 && d.ocupacion_porcentaje < 60).length,
    baja: ocupacion.filter(d => d.ocupacion_porcentaje >= 20 && d.ocupacion_porcentaje < 40).length,
    muyBaja: ocupacion.filter(d => d.ocupacion_porcentaje < 20).length,
  };
  
  const pieData = [
    { label: "Alta Demanda (≥80%)", value: estadosOcupacion.altaDemanda, color: "#00cc44" },
    { label: "Buena (60-79%)", value: estadosOcupacion.buena, color: "#66cc00" },
    { label: "Moderada (40-59%)", value: estadosOcupacion.moderada, color: "#ffaa00" },
    { label: "Baja (20-39%)", value: estadosOcupacion.baja, color: "#ff6600" },
    { label: "Muy Baja (<20%)", value: estadosOcupacion.muyBaja, color: "#cc4400" },
  ].filter(item => item.value > 0);
  
  if (pieData.length > 1) {
    createDonutChart(
      worksheet,
      {
        title: "🍰 DISTRIBUCIÓN DE DÍAS POR NIVEL DE OCUPACIÓN",
        labels: pieData.map(item => item.label),
        values: pieData.map(item => item.value),
        centerText: "Ocupación"
      },
      {
        position: { row: currentRow, col: 1 },
        showPercentages: true,
        colors: pieData.map(item => item.color.replace('#', ''))
      }
    );
    
    currentRow += 15;
  }
  
  // 4. Gráfico de barras - Análisis por día de la semana
  const porDiaSemana = obtenerPromediosPorDiaSemana(ocupacion);
  const diaSemanaData = Object.entries(porDiaSemana).map(([dia, promedio]) => ({
    label: dia,
    value: Math.round(promedio),
    color: getColorByOccupancy(promedio)
  }));
  
  if (diaSemanaData.length > 0) {
    createVisualBarChart(
      worksheet,
      {
        title: "📅 OCUPACIÓN PROMEDIO POR DÍA DE LA SEMANA",
        labels: diaSemanaData.map(d => d.label),
        values: diaSemanaData.map(d => d.value)
      },
      {
        position: { row: currentRow, col: 1 },
        size: { width: 12, height: 10 },
        showDataLabels: true,
        colors: diaSemanaData.map(d => d.color.replace('#', ''))
      }
    );
  }
}

/**
 * Obtiene color basado en porcentaje de ocupación
 */
function getColorByOccupancy(percentage: number): string {
  if (percentage >= 80) return "#00cc44"; // Verde - Alta
  if (percentage >= 60) return "#66cc00"; // Verde claro - Buena
  if (percentage >= 40) return "#ffaa00"; // Amarillo - Moderada
  if (percentage >= 20) return "#ff6600"; // Naranja - Baja
  return "#cc4400"; // Rojo - Muy baja
}

/**
 * Calcula promedios de ocupación por día de la semana
 */
function obtenerPromediosPorDiaSemana(ocupacion: OcupacionPorDia[]): Record<string, number> {
  const gruposPorDia: Record<string, number[]> = {
    "Lunes": [],
    "Martes": [],
    "Miércoles": [],
    "Jueves": [],
    "Viernes": [],
    "Sábado": [],
    "Domingo": []
  };
  
  ocupacion.forEach(dia => {
    const diaSemana = getDayOfWeek(dia.fecha);
    const diaKey = diaSemana.charAt(0).toUpperCase() + diaSemana.slice(1).toLowerCase();
    
    if (gruposPorDia[diaKey]) {
      gruposPorDia[diaKey].push(dia.ocupacion_porcentaje);
    }
  });
  
  const promedios: Record<string, number> = {};
  Object.entries(gruposPorDia).forEach(([dia, valores]) => {
    if (valores.length > 0) {
      promedios[dia] = valores.reduce((sum, val) => sum + val, 0) / valores.length;
    }
  });
  
  return promedios;
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

function getDayOfWeek(dateString: string): string {
  try {
    return new Date(dateString).toLocaleDateString("es-MX", {
      weekday: "long",
    });
  } catch {
    return "";
  }
}

function getEstadoOcupacion(porcentaje: number): string {
  if (porcentaje >= 90) return "🔥 Alta Demanda";
  if (porcentaje >= 70) return "✅ Buena";
  if (porcentaje >= 50) return "⚠️ Moderada";
  if (porcentaje >= 20) return "📉 Baja";
  return "❌ Muy Baja";
}

function getTendencia(porcentaje: number): string {
  if (porcentaje >= 85) return "📈 Excelente";
  if (porcentaje >= 60) return "➡️ Estable";
  return "📉 Preocupante";
}