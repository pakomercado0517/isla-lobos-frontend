"use server";

import { cookies } from "next/headers";
import { config } from "@/lib/config/env";

// Función auxiliar para hacer peticiones al backend
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
// REPORTES ACTIONS
// ============================================================================

/**
 * Genera un reporte completo del sistema
 */
export async function generarReporteCompleto(filtros: {
  fecha_inicio: string;
  fecha_fin: string;
  tipo_reporte?: "mensual" | "semanal" | "diario" | "personalizado";
  incluir_prestadores?: boolean;
  incluir_embarcaciones?: boolean;
  incluir_clima?: boolean;
}) {
  try {
    console.log("📊 generarReporteCompleto: Generando reporte...", filtros);

    // Obtener datos de múltiples endpoints para crear un reporte completo
    const [
      salidasStats,
      usuariosStats,
      embarcacionesStats,
      bloquesStats,
      climaStats,
    ] = await Promise.all([
      apiRequest(
        `/salidas/estadisticas?fecha_inicio=${filtros.fecha_inicio}&fecha_fin=${filtros.fecha_fin}`
      ).catch((e) => ({ data: { estadisticas: {} } })),
      apiRequest("/usuarios/stats").catch((e) => ({ data: { stats: {} } })),
      apiRequest("/embarcaciones/estadisticas").catch((e) => ({
        data: { estadisticas: {} },
      })),
      apiRequest(
        `/bloques/estadisticas?fecha_inicio=${filtros.fecha_inicio}&fecha_fin=${filtros.fecha_fin}`
      ).catch((e) => ({ data: { estadisticas: {} } })),
      filtros.incluir_clima
        ? apiRequest(
            `/clima/estadisticas?fecha_inicio=${filtros.fecha_inicio}&fecha_fin=${filtros.fecha_fin}`
          ).catch((e) => ({ data: { estadisticas: {} } }))
        : Promise.resolve({ data: { estadisticas: {} } }),
    ]);

    // Estructurar el reporte
    const reporte = {
      metadata: {
        fecha_generacion: new Date().toISOString(),
        periodo: {
          inicio: filtros.fecha_inicio,
          fin: filtros.fecha_fin,
        },
        tipo: filtros.tipo_reporte || "personalizado",
      },
      resumen_ejecutivo: {
        total_salidas: salidasStats.data?.estadisticas?.totales?.salidas || 0,
        total_pasajeros:
          salidasStats.data?.estadisticas?.totales?.pasajeros || 0,
        promedio_pasajeros_por_salida:
          salidasStats.data?.estadisticas?.totales
            ?.promedio_pasajeros_por_salida || 0,
        total_prestadores_activos: usuariosStats.data?.stats?.prestadores || 0,
        total_embarcaciones_activas:
          embarcacionesStats.data?.estadisticas?.disponibles || 0,
        ocupacion_promedio:
          salidasStats.data?.estadisticas?.tendencias?.ocupacion_promedio || 0,
      },
      estadisticas_salidas: salidasStats.data?.estadisticas || {},
      estadisticas_usuarios: usuariosStats.data?.stats || {},
      estadisticas_embarcaciones: embarcacionesStats.data?.estadisticas || {},
      estadisticas_bloques: bloquesStats.data?.estadisticas || {},
      ...(filtros.incluir_clima && {
        estadisticas_clima: climaStats.data?.estadisticas || {},
      }),
    };

    console.log("📊 generarReporteCompleto: Reporte generado:", reporte);

    return {
      success: true,
      data: reporte,
      message: "Reporte generado exitosamente",
    };
  } catch (error) {
    console.error("📊 generarReporteCompleto: Error:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Error al generar el reporte",
    };
  }
}

/**
 * Obtiene estadísticas de ocupación por día
 */
export async function getEstadisticasOcupacion(filtros: {
  fecha_inicio: string;
  fecha_fin: string;
}) {
  try {
    console.log(
      "📊 getEstadisticasOcupacion: Obteniendo estadísticas de ocupación...",
      filtros
    );

    // Obtener datos de bloques y salidas para calcular ocupación
    const [bloquesData, salidasData] = await Promise.all([
      apiRequest(
        `/bloques/estadisticas?fecha_inicio=${filtros.fecha_inicio}&fecha_fin=${filtros.fecha_fin}`
      ),
      apiRequest(
        `/salidas/estadisticas?fecha_inicio=${filtros.fecha_inicio}&fecha_fin=${filtros.fecha_fin}`
      ),
    ]);

    const estadisticas = {
      periodo: {
        fecha_inicio: filtros.fecha_inicio,
        fecha_fin: filtros.fecha_fin,
        total_dias:
          Math.ceil(
            (new Date(filtros.fecha_fin).getTime() -
              new Date(filtros.fecha_inicio).getTime()) /
              (1000 * 60 * 60 * 24)
          ) + 1,
      },
      bloques: bloquesData.data?.estadisticas || {},
      salidas: salidasData.data?.estadisticas || {},
      ocupacion: {
        total_capacidad: bloquesData.data?.estadisticas?.capacidad?.total || 0,
        total_ocupada: bloquesData.data?.estadisticas?.capacidad?.ocupada || 0,
        porcentaje_ocupacion:
          bloquesData.data?.estadisticas?.capacidad?.porcentaje_ocupacion || 0,
        promedio_diario:
          (salidasData.data?.estadisticas?.totales?.salidas || 0) /
          (Math.ceil(
            (new Date(filtros.fecha_fin).getTime() -
              new Date(filtros.fecha_inicio).getTime()) /
              (1000 * 60 * 60 * 24)
          ) +
            1),
      },
    };

    return {
      success: true,
      data: estadisticas,
    };
  } catch (error) {
    console.error("📊 getEstadisticasOcupacion: Error:", error);
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Error al obtener estadísticas de ocupación",
    };
  }
}

/**
 * Obtiene reporte por prestador
 */
export async function getReportePorPrestador(filtros: {
  fecha_inicio: string;
  fecha_fin: string;
  prestador_id?: string;
}) {
  try {
    console.log(
      "📊 getReportePorPrestador: Obteniendo reporte por prestador...",
      filtros
    );

    // Obtener estadísticas de salidas que incluye datos por prestador
    const salidasStats = await apiRequest(
      `/salidas/estadisticas?fecha_inicio=${filtros.fecha_inicio}&fecha_fin=${filtros.fecha_fin}`
    );

    const reportePorPrestador =
      salidasStats.data?.estadisticas?.por_prestador || [];

    // Si se especifica un prestador, filtrar
    const reporte = filtros.prestador_id
      ? reportePorPrestador.filter(
          (p: any) => p.prestador?.id === filtros.prestador_id
        )
      : reportePorPrestador;

    return {
      success: true,
      data: {
        periodo: {
          fecha_inicio: filtros.fecha_inicio,
          fecha_fin: filtros.fecha_fin,
        },
        prestadores: reporte,
        totales: {
          prestadores_activos: reporte.length,
          total_salidas: reporte.reduce(
            (sum: number, p: any) => sum + (p.total_salidas || 0),
            0
          ),
          total_pasajeros: reporte.reduce(
            (sum: number, p: any) => sum + (p.total_pasajeros || 0),
            0
          ),
        },
      },
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
 * Obtiene reporte por embarcación
 */
export async function getReportePorEmbarcacion(filtros: {
  fecha_inicio: string;
  fecha_fin: string;
  embarcacion_id?: string;
}) {
  try {
    console.log(
      "📊 getReportePorEmbarcacion: Obteniendo reporte por embarcación...",
      filtros
    );

    // Obtener estadísticas de salidas que incluye datos por embarcación
    const salidasStats = await apiRequest(
      `/salidas/estadisticas?fecha_inicio=${filtros.fecha_inicio}&fecha_fin=${filtros.fecha_fin}`
    );

    const reportePorEmbarcacion =
      salidasStats.data?.estadisticas?.por_embarcacion || [];

    // Si se especifica una embarcación, filtrar
    const reporte = filtros.embarcacion_id
      ? reportePorEmbarcacion.filter(
          (e: any) => e.embarcacion?.id === filtros.embarcacion_id
        )
      : reportePorEmbarcacion;

    return {
      success: true,
      data: {
        periodo: {
          fecha_inicio: filtros.fecha_inicio,
          fecha_fin: filtros.fecha_fin,
        },
        embarcaciones: reporte,
        totales: {
          embarcaciones_utilizadas: reporte.length,
          total_salidas: reporte.reduce(
            (sum: number, e: any) => sum + (e.total_salidas || 0),
            0
          ),
          total_pasajeros: reporte.reduce(
            (sum: number, e: any) => sum + (e.total_pasajeros || 0),
            0
          ),
        },
      },
    };
  } catch (error) {
    console.error("📊 getReportePorEmbarcacion: Error:", error);
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Error al obtener reporte por embarcación",
    };
  }
}

/**
 * Obtiene reporte meteorológico
 */
export async function getReporteMeteorologico(filtros: {
  fecha_inicio: string;
  fecha_fin: string;
}) {
  try {
    console.log(
      "📊 getReporteMeteorologico: Obteniendo reporte meteorológico...",
      filtros
    );

    const climaStats = await apiRequest(
      `/clima/estadisticas?fecha_inicio=${filtros.fecha_inicio}&fecha_fin=${filtros.fecha_fin}`
    );

    return {
      success: true,
      data: {
        periodo: {
          fecha_inicio: filtros.fecha_inicio,
          fecha_fin: filtros.fecha_fin,
        },
        estadisticas: climaStats.data?.estadisticas || {},
      },
    };
  } catch (error) {
    console.error("📊 getReporteMeteorologico: Error:", error);
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Error al obtener reporte meteorológico",
    };
  }
}

// ============================================================================
// EXPORTACIÓN DE REPORTES
// ============================================================================

/**
 * Genera datos para exportación en formato Excel/CSV
 */
export async function generarDatosExportacion(
  tipo: "excel" | "csv",
  filtros: {
    fecha_inicio: string;
    fecha_fin: string;
    incluir_prestadores?: boolean;
    incluir_embarcaciones?: boolean;
    incluir_clima?: boolean;
  }
) {
  try {
    console.log(
      "📊 generarDatosExportacion: Generando datos para exportación...",
      { tipo, filtros }
    );

    // Obtener el reporte completo
    const reporteResult = await generarReporteCompleto(filtros);

    if (!reporteResult.success) {
      return reporteResult;
    }

    const reporte = reporteResult.data;

    // Estructurar datos para exportación
    const datosExportacion = {
      metadata: reporte.metadata,
      resumen: [
        {
          concepto: "Total de Salidas",
          valor: reporte.resumen_ejecutivo.total_salidas,
        },
        {
          concepto: "Total de Pasajeros",
          valor: reporte.resumen_ejecutivo.total_pasajeros,
        },
        {
          concepto: "Promedio de Pasajeros por Salida",
          valor: reporte.resumen_ejecutivo.promedio_pasajeros_por_salida,
        },
        {
          concepto: "Prestadores Activos",
          valor: reporte.resumen_ejecutivo.total_prestadores_activos,
        },
        {
          concepto: "Embarcaciones Activas",
          valor: reporte.resumen_ejecutivo.total_embarcaciones_activas,
        },
        {
          concepto: "Ocupación Promedio (%)",
          valor: reporte.resumen_ejecutivo.ocupacion_promedio,
        },
      ],
      // Agregar más datos según sea necesario para el tipo de exportación
    };

    return {
      success: true,
      data: datosExportacion,
      message: `Datos preparados para exportación en formato ${tipo.toUpperCase()}`,
    };
  } catch (error) {
    console.error("📊 generarDatosExportacion: Error:", error);
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Error al generar datos para exportación",
    };
  }
}

// ============================================================================
// REPORTES PREDEFINIDOS
// ============================================================================

/**
 * Genera reporte diario
 */
export async function generarReporteDiario(fecha: string) {
  const filtros = {
    fecha_inicio: fecha,
    fecha_fin: fecha,
    tipo_reporte: "diario" as const,
    incluir_prestadores: true,
    incluir_embarcaciones: true,
    incluir_clima: true,
  };

  return await generarReporteCompleto(filtros);
}

/**
 * Genera reporte semanal
 */
export async function generarReporteSemanal(fechaInicio: string) {
  const fecha = new Date(fechaInicio);
  const fechaFin = new Date(fecha);
  fechaFin.setDate(fecha.getDate() + 6);

  const filtros = {
    fecha_inicio: fechaInicio,
    fecha_fin: fechaFin.toISOString().split("T")[0],
    tipo_reporte: "semanal" as const,
    incluir_prestadores: true,
    incluir_embarcaciones: true,
    incluir_clima: true,
  };

  return await generarReporteCompleto(filtros);
}

/**
 * Genera reporte mensual
 */
export async function generarReporteMensual(año: number, mes: number) {
  const fechaInicio = new Date(año, mes - 1, 1);
  const fechaFin = new Date(año, mes, 0);

  const filtros = {
    fecha_inicio: fechaInicio.toISOString().split("T")[0],
    fecha_fin: fechaFin.toISOString().split("T")[0],
    tipo_reporte: "mensual" as const,
    incluir_prestadores: true,
    incluir_embarcaciones: true,
    incluir_clima: true,
  };

  return await generarReporteCompleto(filtros);
}
