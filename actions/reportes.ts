"use server";

import { cookies } from "next/headers";
import { config } from "@/lib/config/env";

// ============================================================================
// UTILIDADES COMPARTIDAS
// ============================================================================

/**
 * Función auxiliar para hacer peticiones al backend
 */
async function apiRequest(endpoint: string, options: RequestInit = {}) {
  const url = `${config.api.baseUrl}${endpoint}`;

  const defaultHeaders: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string>),
  };

  // Obtener token de las cookies
  const cookieStore = cookies();
  const token = (await cookieStore).get(config.storage.tokenKey)?.value;

  if (token) {
    defaultHeaders["Authorization"] = `Bearer ${token}`;
  }

  const response = await fetch(url, {
    ...options,
    headers: defaultHeaders,
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Error en la petición");
  }

  return data;
}

// ============================================================================
// TIPOS DE REPORTES
// ============================================================================

export interface EstadisticasGenerales {
  total_usuarios: number;
  total_embarcaciones: number;
  embarcaciones_activas: number;
  total_salidas_hoy: number;
  total_pasajeros_hoy: number;
  ocupacion_promedio: number;
  ingresos_estimados: number;
  salidas_este_mes: number;
  pasajeros_este_mes: number;
  tendencia_mes_anterior: number;
}

export interface OcupacionPorDia {
  fecha: string;
  total_salidas: number;
  total_pasajeros: number;
  ocupacion_porcentaje: number;
  ingresos_estimados: number;
}

export interface ReportePorPrestador {
  prestador_id: string;
  prestador_nombre: string;
  total_salidas: number;
  total_pasajeros: number;
  embarcaciones_count: number;
  ultima_salida: string;
  ingresos_estimados: number;
}

export interface FiltrosReporte {
  fecha_inicio: string;
  fecha_fin: string;
}

// ============================================================================
// ACCIONES DE REPORTES
// ============================================================================

/**
 * Obtiene las estadísticas generales del sistema
 * Endpoint: GET /api/dashboard/estadisticas
 */
export async function getEstadisticasGenerales(filtros?: FiltrosReporte) {
  try {
    console.log(
      "📊 getEstadisticasGenerales: Obteniendo estadísticas...",
      filtros
    );

    let endpoint = "/dashboard/estadisticas";

    if (filtros?.fecha_inicio && filtros?.fecha_fin) {
      const params = new URLSearchParams({
        fecha_inicio: filtros.fecha_inicio,
        fecha_fin: filtros.fecha_fin,
      });
      endpoint = `${endpoint}?${params}`;
    }

    const response = await apiRequest(endpoint);
    console.log("📊 getEstadisticasGenerales: Respuesta:", response);

    const stats = response.data?.estadisticas || response.data;

    // Transformar datos del backend al formato esperado por el frontend
    const estadisticas: EstadisticasGenerales = {
      total_usuarios: stats.usuarios?.total || 0,
      total_embarcaciones: stats.embarcaciones?.total || 0,
      embarcaciones_activas: stats.embarcaciones?.disponibles || 0,
      total_salidas_hoy: stats.salidas?.programadas || 0,
      total_pasajeros_hoy: stats.salidas?.este_mes || 0,
      ocupacion_promedio: stats.bloques?.porcentaje_disponibles || 75,
      ingresos_estimados: 0, // Calcular basado en pasajeros * precio promedio
      salidas_este_mes: stats.salidas?.este_mes || 0,
      pasajeros_este_mes: stats.salidas?.esta_semana || 0,
      tendencia_mes_anterior: 0, // Requiere cálculo comparativo
    };

    return {
      success: true,
      data: estadisticas,
    };
  } catch (error) {
    console.error("📊 getEstadisticasGenerales: Error:", error);
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Error al obtener estadísticas",
    };
  }
}

/**
 * Obtiene la ocupación por día
 * Endpoint: GET /api/dashboard/ocupacion?dias=7
 */
export async function getOcupacionPorDia(filtros?: FiltrosReporte) {
  try {
    console.log("📊 getOcupacionPorDia: Obteniendo ocupación...", filtros);

    // Calcular número de días entre fechas si se proporcionan
    let dias = 7;
    if (filtros?.fecha_inicio && filtros?.fecha_fin) {
      const inicio = new Date(filtros.fecha_inicio);
      const fin = new Date(filtros.fecha_fin);
      dias = Math.ceil(
        (fin.getTime() - inicio.getTime()) / (1000 * 60 * 60 * 24)
      );
    }

    const response = await apiRequest(`/dashboard/ocupacion?dias=${dias}`);
    console.log("📊 getOcupacionPorDia: Respuesta:", response);

    const ocupacionData = response.data?.ocupacion_por_dia || [];

    // Transformar datos del backend al formato esperado
    const ocupacion: OcupacionPorDia[] = ocupacionData.map(
      (dia: {
        fecha: string;
        bloques?: Array<{
          capacidad_registrada?: number;
          capacidad_total?: number;
        }>;
        total_capacidad?: number;
        total_ocupados?: number;
        porcentaje_ocupacion?: number;
      }) => {
        // Calcular totales por día
        const totalSalidas = dia.bloques?.length || 0;
        const totalPasajeros =
          dia.bloques?.reduce(
            (sum, bloque) => sum + (bloque.capacidad_registrada || 0),
            0
          ) ||
          dia.total_ocupados ||
          0;

        const totalCapacidad =
          dia.bloques?.reduce(
            (sum, bloque) => sum + (bloque.capacidad_total || 0),
            0
          ) ||
          dia.total_capacidad ||
          195; // 3 bloques x 65 = 195

        const ocupacionPorcentaje =
          totalCapacidad > 0
            ? Math.round((totalPasajeros / totalCapacidad) * 100)
            : dia.porcentaje_ocupacion || 0;

        // Estimar ingresos (promedio de $500 por pasajero)
        const ingresosEstimados = totalPasajeros * 500;

        return {
          fecha: dia.fecha,
          total_salidas: totalSalidas,
          total_pasajeros: totalPasajeros,
          ocupacion_porcentaje: ocupacionPorcentaje,
          ingresos_estimados: ingresosEstimados,
        };
      }
    );

    return {
      success: true,
      data: ocupacion,
    };
  } catch (error) {
    console.error("📊 getOcupacionPorDia: Error:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Error al obtener ocupación",
    };
  }
}

/**
 * Obtiene el reporte por prestador
 * Endpoint: GET /api/salidas/estadisticas con filtros por prestador
 */
export async function getReportePorPrestador(filtros?: FiltrosReporte) {
  try {
    console.log("📊 getReportePorPrestador: Obteniendo reporte...", filtros);

    let endpoint = "/salidas/estadisticas";

    if (filtros?.fecha_inicio && filtros?.fecha_fin) {
      const params = new URLSearchParams({
        fecha_inicio: filtros.fecha_inicio,
        fecha_fin: filtros.fecha_fin,
      });
      endpoint = `${endpoint}?${params}`;
    }

    const response = await apiRequest(endpoint);
    console.log("📊 getReportePorPrestador: Respuesta:", response);

    const porPrestador = response.data?.estadisticas?.por_prestador || [];

    // Transformar datos del backend al formato esperado
    const reportes: ReportePorPrestador[] = porPrestador.map(
      (prestador: {
        prestador: { id: string; nombre: string; email: string };
        total_salidas: number;
        total_pasajeros: number;
      }) => {
        const ingresosEstimados = prestador.total_pasajeros * 500; // $500 por pasajero

        return {
          prestador_id: prestador.prestador.id,
          prestador_nombre: prestador.prestador.nombre,
          total_salidas: prestador.total_salidas,
          total_pasajeros: prestador.total_pasajeros,
          embarcaciones_count: 2, // Esto requiere consulta adicional
          ultima_salida: new Date().toISOString(), // Esto requiere consulta adicional
          ingresos_estimados: ingresosEstimados,
        };
      }
    );

    return {
      success: true,
      data: reportes,
    };
  } catch (error) {
    console.error("📊 getReportePorPrestador: Error:", error);
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Error al obtener reporte por prestador",
    };
  }
}

/**
 * Obtiene todos los datos del reporte en una sola llamada
 * Combina estadísticas, ocupación y reporte por prestador
 */
export async function getAllReportesData(filtros?: FiltrosReporte) {
  try {
    console.log(
      "📊 getAllReportesData: Obteniendo todos los datos...",
      filtros
    );

    // Ejecutar todas las consultas en paralelo
    const [estadisticasResult, ocupacionResult, prestadoresResult] =
      await Promise.allSettled([
        getEstadisticasGenerales(filtros),
        getOcupacionPorDia(filtros),
        getReportePorPrestador(filtros),
      ]);

    // Procesar resultados con valores por defecto garantizados
    const estadisticas: EstadisticasGenerales =
      estadisticasResult.status === "fulfilled" &&
      estadisticasResult.value.success &&
      estadisticasResult.value.data
        ? estadisticasResult.value.data
        : {
            total_usuarios: 0,
            total_embarcaciones: 0,
            embarcaciones_activas: 0,
            total_salidas_hoy: 0,
            total_pasajeros_hoy: 0,
            ocupacion_promedio: 0,
            ingresos_estimados: 0,
            salidas_este_mes: 0,
            pasajeros_este_mes: 0,
            tendencia_mes_anterior: 0,
          };

    const ocupacion_por_dia =
      ocupacionResult.status === "fulfilled" && ocupacionResult.value.success
        ? ocupacionResult.value.data || []
        : [];

    const reporte_por_prestador =
      prestadoresResult.status === "fulfilled" &&
      prestadoresResult.value.success
        ? prestadoresResult.value.data || []
        : [];

    console.log("📊 getAllReportesData: Datos procesados:", {
      estadisticas,
      ocupacion_count: ocupacion_por_dia.length,
      prestadores_count: reporte_por_prestador.length,
    });

    return {
      success: true,
      data: {
        estadisticas,
        ocupacion_por_dia,
        reporte_por_prestador,
      },
    };
  } catch (error) {
    console.error("📊 getAllReportesData: Error:", error);
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Error al obtener datos del reporte",
    };
  }
}

// ============================================================================
// GENERADORES DE REPORTES CSV
// ============================================================================

import {
  crearCSVConSecciones,
  formatearMoneda,
  formatearNumero,
  formatearFechaCSV,
  generarNombreArchivo,
} from "@/lib/utils/csv-generator";

/**
 * Genera el reporte ejecutivo completo en formato CSV
 */
async function generarReporteEjecutivo(
  filtros?: FiltrosReporte
): Promise<string> {
  console.log("📊 Generando reporte ejecutivo...", filtros);

  // Obtener todos los datos
  const resultado = await getAllReportesData(filtros);

  if (!resultado.success || !resultado.data) {
    throw new Error("No se pudieron obtener los datos del reporte");
  }

  const { estadisticas, ocupacion_por_dia, reporte_por_prestador } =
    resultado.data;

  // Calcular totales
  const totalPasajeros = ocupacion_por_dia.reduce(
    (sum, dia) => sum + dia.total_pasajeros,
    0
  );
  const totalSalidas = ocupacion_por_dia.reduce(
    (sum, dia) => sum + dia.total_salidas,
    0
  );
  const totalIngresos = ocupacion_por_dia.reduce(
    (sum, dia) => sum + dia.ingresos_estimados,
    0
  );

  const promedioOcupacion =
    ocupacion_por_dia.length > 0
      ? Math.round(
          ocupacion_por_dia.reduce(
            (sum, dia) => sum + dia.ocupacion_porcentaje,
            0
          ) / ocupacion_por_dia.length
        )
      : 0;

  const promedioPasajerosPorSalida =
    totalSalidas > 0 ? (totalPasajeros / totalSalidas).toFixed(1) : "0";

  // Calcular días operados (días con al menos una salida)
  const diasOperados = ocupacion_por_dia.filter(
    (dia) => dia.total_salidas > 0
  ).length;

  const csv = crearCSVConSecciones({
    titulo: "REPORTE EJECUTIVO - SISTEMA ISLA LOBOS",
    subtitulo: filtros
      ? `Periodo: Del ${formatearFechaCSV(
          filtros.fecha_inicio
        )} al ${formatearFechaCSV(filtros.fecha_fin)}`
      : "Reporte General",
    fecha: new Date().toLocaleString("es-MX"),
    bloques: [
      {
        titulo: "RESUMEN GENERAL",
        encabezados: ["Métrica", "Valor", "Unidad"],
        datos: [
          {
            metrica: "Total de Salidas",
            valor: formatearNumero(totalSalidas),
            unidad: "salidas",
          },
          {
            metrica: "Total de Pasajeros",
            valor: formatearNumero(totalPasajeros),
            unidad: "personas",
          },
          {
            metrica: "Ocupación Promedio",
            valor: promedioOcupacion,
            unidad: "%",
          },
          {
            metrica: "Ingresos Estimados",
            valor: formatearMoneda(totalIngresos),
            unidad: "MXN",
          },
          {
            metrica: "Promedio Pasajeros por Salida",
            valor: promedioPasajerosPorSalida,
            unidad: "personas",
          },
          { metrica: "Días Operados", valor: diasOperados, unidad: "días" },
          {
            metrica: "Embarcaciones Activas",
            valor: estadisticas.embarcaciones_activas,
            unidad: "embarcaciones",
          },
          {
            metrica: "Total Prestadores",
            valor: estadisticas.total_usuarios,
            unidad: "prestadores",
          },
        ],
      },
      {
        titulo: "TOP 10 PRESTADORES",
        encabezados: [
          "Prestador",
          "Salidas",
          "Pasajeros",
          "Ingresos Est.",
          "Eficiencia",
        ],
        datos: reporte_por_prestador.slice(0, 10).map((p) => ({
          prestador: p.prestador_nombre,
          salidas: formatearNumero(p.total_salidas),
          pasajeros: formatearNumero(p.total_pasajeros),
          ingresos: formatearMoneda(p.ingresos_estimados),
          eficiencia:
            p.total_salidas > 0
              ? `${Math.round(
                  (p.total_pasajeros / p.total_salidas / 30) * 100
                )}%`
              : "N/A",
        })),
      },
      {
        titulo: "OCUPACIÓN DIARIA",
        encabezados: [
          "Fecha",
          "Salidas",
          "Pasajeros",
          "Ocupación %",
          "Ingresos",
        ],
        datos: ocupacion_por_dia.map((dia) => ({
          fecha: formatearFechaCSV(dia.fecha),
          salidas: dia.total_salidas,
          pasajeros: formatearNumero(dia.total_pasajeros),
          ocupacion: `${dia.ocupacion_porcentaje}%`,
          ingresos: formatearMoneda(dia.ingresos_estimados),
        })),
        totales: {
          fecha: "TOTALES",
          salidas: formatearNumero(totalSalidas),
          pasajeros: formatearNumero(totalPasajeros),
          ocupacion: `${promedioOcupacion}%`,
          ingresos: formatearMoneda(totalIngresos),
        },
      },
    ],
  });

  return csv;
}

/**
 * Genera el reporte detallado por prestador en formato CSV
 */
async function generarReportePrestadores(
  filtros?: FiltrosReporte
): Promise<string> {
  console.log("📊 Generando reporte por prestadores...", filtros);

  const resultado = await getReportePorPrestador(filtros);

  if (!resultado.success || !resultado.data) {
    throw new Error("No se pudieron obtener los datos de prestadores");
  }

  const prestadores = resultado.data;

  const csv = crearCSVConSecciones({
    titulo: "REPORTE DETALLADO POR PRESTADOR - SISTEMA ISLA LOBOS",
    subtitulo: filtros
      ? `Periodo: Del ${formatearFechaCSV(
          filtros.fecha_inicio
        )} al ${formatearFechaCSV(filtros.fecha_fin)}`
      : "Reporte General",
    fecha: new Date().toLocaleString("es-MX"),
    bloques: [
      {
        titulo: "DESEMPEÑO POR PRESTADOR",
        encabezados: [
          "Prestador",
          "Total Salidas",
          "Total Pasajeros",
          "Promedio Pasajeros/Salida",
          "Embarcaciones",
          "Ingresos Estimados",
          "Eficiencia %",
        ],
        datos: prestadores.map((p) => ({
          prestador: p.prestador_nombre,
          salidas: formatearNumero(p.total_salidas),
          pasajeros: formatearNumero(p.total_pasajeros),
          promedio:
            p.total_salidas > 0
              ? (p.total_pasajeros / p.total_salidas).toFixed(1)
              : "0.0",
          embarcaciones: p.embarcaciones_count,
          ingresos: formatearMoneda(p.ingresos_estimados),
          eficiencia:
            p.total_salidas > 0
              ? `${Math.round(
                  (p.total_pasajeros / p.total_salidas / 30) * 100
                )}%`
              : "N/A",
        })),
        totales: {
          prestador: "TOTALES",
          salidas: formatearNumero(
            prestadores.reduce((sum, p) => sum + p.total_salidas, 0)
          ),
          pasajeros: formatearNumero(
            prestadores.reduce((sum, p) => sum + p.total_pasajeros, 0)
          ),
          promedio: "-",
          embarcaciones: "-",
          ingresos: formatearMoneda(
            prestadores.reduce((sum, p) => sum + p.ingresos_estimados, 0)
          ),
          eficiencia: "-",
        },
      },
    ],
  });

  return csv;
}

/**
 * Genera el reporte de ocupación diaria en formato CSV
 */
async function generarReporteOcupacion(
  filtros?: FiltrosReporte
): Promise<string> {
  console.log("📊 Generando reporte de ocupación diaria...", filtros);

  const resultado = await getOcupacionPorDia(filtros);

  if (!resultado.success || !resultado.data) {
    throw new Error("No se pudieron obtener los datos de ocupación");
  }

  const ocupacion = resultado.data;

  const csv = crearCSVConSecciones({
    titulo: "REPORTE DE OCUPACIÓN DIARIA - SISTEMA ISLA LOBOS",
    subtitulo: filtros
      ? `Periodo: Del ${formatearFechaCSV(
          filtros.fecha_inicio
        )} al ${formatearFechaCSV(filtros.fecha_fin)}`
      : "Reporte General",
    fecha: new Date().toLocaleString("es-MX"),
    bloques: [
      {
        titulo: "OCUPACIÓN POR DÍA",
        encabezados: [
          "Fecha",
          "Total Salidas",
          "Total Pasajeros",
          "Capacidad (195)",
          "Ocupación %",
          "Ingresos Estimados",
          "Estado",
        ],
        datos: ocupacion.map((dia) => {
          let estado = "Normal";
          if (dia.ocupacion_porcentaje >= 90) estado = "Alta Demanda";
          else if (dia.ocupacion_porcentaje >= 70) estado = "Moderada";
          else if (dia.ocupacion_porcentaje < 50) estado = "Baja";

          return {
            fecha: formatearFechaCSV(dia.fecha),
            salidas: dia.total_salidas,
            pasajeros: formatearNumero(dia.total_pasajeros),
            capacidad: 195,
            ocupacion: `${dia.ocupacion_porcentaje}%`,
            ingresos: formatearMoneda(dia.ingresos_estimados),
            estado,
          };
        }),
        totales: {
          fecha: "TOTALES",
          salidas: formatearNumero(
            ocupacion.reduce((sum, d) => sum + d.total_salidas, 0)
          ),
          pasajeros: formatearNumero(
            ocupacion.reduce((sum, d) => sum + d.total_pasajeros, 0)
          ),
          capacidad: `-`,
          ocupacion: `${Math.round(
            ocupacion.reduce((sum, d) => sum + d.ocupacion_porcentaje, 0) /
              ocupacion.length
          )}%`,
          ingresos: formatearMoneda(
            ocupacion.reduce((sum, d) => sum + d.ingresos_estimados, 0)
          ),
          estado: "-",
        },
      },
    ],
  });

  return csv;
}

/**
 * Exporta el reporte en formato CSV
 * Genera 3 tipos de reportes: ejecutivo, prestadores, ocupacion
 */
export async function exportarReporte(
  tipo: "ejecutivo" | "prestadores" | "ocupacion",
  filtros?: FiltrosReporte
) {
  try {
    console.log(`📊 exportarReporte: Generando reporte ${tipo}...`, filtros);

    let csv: string;
    let nombreArchivo: string;

    // Generar el CSV según el tipo solicitado
    switch (tipo) {
      case "ejecutivo":
        csv = await generarReporteEjecutivo(filtros);
        nombreArchivo = generarNombreArchivo(
          "ejecutivo",
          filtros?.fecha_inicio,
          filtros?.fecha_fin
        );
        break;

      case "prestadores":
        csv = await generarReportePrestadores(filtros);
        nombreArchivo = generarNombreArchivo(
          "prestadores",
          filtros?.fecha_inicio,
          filtros?.fecha_fin
        );
        break;

      case "ocupacion":
        csv = await generarReporteOcupacion(filtros);
        nombreArchivo = generarNombreArchivo(
          "ocupacion",
          filtros?.fecha_inicio,
          filtros?.fecha_fin
        );
        break;

      default:
        throw new Error(`Tipo de reporte no soportado: ${tipo}`);
    }

    console.log(`✅ Reporte ${tipo} generado exitosamente`);

    return {
      success: true,
      csv,
      nombreArchivo,
      mensaje: `Reporte ${tipo} generado exitosamente`,
    };
  } catch (error) {
    console.error("📊 exportarReporte: Error:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Error al exportar reporte",
    };
  }
}
