"use server";

import { cookies } from "next/headers";
import { config } from "@/lib/config/env";
import type {
  CondicionMeteorologica,
  CrearCondicionMeteorologicaData,
  ActualizarCondicionMeteorologicaData,
  ConsultarCondicionesParams,
  ObtenerPrediccionParams,
  ObtenerEstadisticasParams,
  SincronizarSMNParams,
  ObtenerCondicionesResponse,
  ObtenerCondicionResponse,
  ObtenerCondicionActualResponse,
  ObtenerPrediccionResponse,
  ObtenerAlertasResponse,
  ObtenerEstadisticasResponse,
  SincronizarSMNResponse,
  MutacionCondicionResponse,
} from "@/lib/types/clima";

// ============================================================================
// FUNCIÓN AUXILIAR PARA PETICIONES AL BACKEND
// ============================================================================

/**
 * Intenta renovar el accessToken usando el refreshToken
 */
async function tryRefreshToken(): Promise<boolean> {
  try {
    const cookieStore = await cookies();
    const refreshToken = cookieStore.get(config.storage.refreshTokenKey)?.value;

    if (!refreshToken) {
      return false;
    }

    const refreshUrl = `${config.api.baseUrl}/auth/refresh`;

    const response = await fetch(refreshUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Cookie: `${config.storage.refreshTokenKey}=${refreshToken}`,
      },
    });

    if (!response.ok) {
      return false;
    }

    let newAccessToken: string | null = null;

    // Leer el body JSON (el backend siempre envía el token aquí)
    let responseData;
    try {
      responseData = await response.json();
      if (responseData.status === "success" && responseData.data?.accessToken) {
        newAccessToken = responseData.data.accessToken;
      }
    } catch (error) {
      // Si falla leer el body, retornar false
      return false;
    }

    // Intentar también leer del header Set-Cookie como verificación adicional
    // (aunque el token del body tiene prioridad)
    try {
      const setCookieHeaders = response.headers.getSetCookie?.() || [];

      for (const cookieHeader of setCookieHeaders) {
        const [cookiePart] = cookieHeader.split(";");
        const [name, value] = cookiePart.split("=");

        if (name === config.storage.tokenKey && value) {
          // Si Set-Cookie tiene un valor, usarlo (puede ser más actualizado)
          newAccessToken = value;
          break;
        }
      }
    } catch (error) {
      // Si falla leer Set-Cookie, usar el token del body que ya tenemos
    }

    // Si tenemos el nuevo token, actualizar la cookie del servidor
    if (newAccessToken) {
      cookieStore.set(config.storage.tokenKey, newAccessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "none" : "lax", // "none" para cross-origin en producción
        path: "/",
        maxAge: process.env.NODE_ENV === "production" ? 60 * 15 : 10, // 15 minutos en producción, 10 segundos en desarrollo
      });
      return true;
    }

    return false;
  } catch (error) {
    return false;
  }
}

async function apiRequest(
  endpoint: string,
  options: RequestInit = {},
  retryCount = 0
) {
  const url = `${config.api.baseUrl}${endpoint}`;

  const defaultHeaders: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string>),
  };

  const cookieStore = await cookies();
  let accessToken = cookieStore.get(config.storage.tokenKey)?.value;
  const refreshToken = cookieStore.get(config.storage.refreshTokenKey)?.value;

  // Si no hay accessToken pero sí refreshToken, intentar renovar
  if (!accessToken && refreshToken && retryCount === 0) {
    const renewed = await tryRefreshToken();

    if (renewed) {
      const updatedCookieStore = await cookies();
      accessToken = updatedCookieStore.get(config.storage.tokenKey)?.value;
    } else {
      throw new Error("Sesión expirada. Por favor, inicia sesión nuevamente.");
    }
  }

  // Construir el header Cookie manualmente
  const cookieHeader: string[] = [];
  if (accessToken)
    cookieHeader.push(`${config.storage.tokenKey}=${accessToken}`);
  if (refreshToken)
    cookieHeader.push(`${config.storage.refreshTokenKey}=${refreshToken}`);

  if (cookieHeader.length > 0) {
    defaultHeaders["Cookie"] = cookieHeader.join("; ");
  }

  const response = await fetch(url, {
    ...options,
    headers: defaultHeaders,
  });

  const data = await response.json();

  // Si recibimos 401 y es el primer intento, renovar token y reintentar
  if (response.status === 401 && retryCount === 0 && refreshToken) {
    const renewed = await tryRefreshToken();

    if (renewed) {
      return apiRequest(endpoint, options, retryCount + 1);
    }
  }

  if (!response.ok) {
    throw new Error(data.message || "Error en la petición");
  }

  return data;
}

// ============================================================================
// CONDICIONES METEOROLÓGICAS - CRUD
// ============================================================================

/**
 * Obtiene una lista paginada de condiciones meteorológicas
 *
 * @param params - Parámetros de consulta (paginación, filtros)
 * @returns Lista de condiciones con paginación y estadísticas
 */
export async function getCondicionesMeteorologicas(
  params: ConsultarCondicionesParams = {}
) {
  try {
    // Construir query string con parámetros
    const queryParams = new URLSearchParams();

    if (params.page) queryParams.append("page", params.page.toString());
    if (params.limit) queryParams.append("limit", params.limit.toString());
    if (params.fecha_inicio)
      queryParams.append("fecha_inicio", params.fecha_inicio);
    if (params.fecha_fin) queryParams.append("fecha_fin", params.fecha_fin);
    if (params.estado_puerto)
      queryParams.append("estado_puerto", params.estado_puerto);
    if (params.fuente) queryParams.append("fuente", params.fuente);

    const queryString = queryParams.toString();
    const endpoint = queryString ? `/clima?${queryString}` : "/clima";

    const response: ObtenerCondicionesResponse = await apiRequest(endpoint);

    return {
      success: true,
      data: response.data,
    };
  } catch (error) {
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Error al obtener condiciones meteorológicas",
    };
  }
}

/**
 * Obtiene una condición meteorológica específica por su ID
 *
 * @param id - ID de la condición meteorológica
 * @returns Condición meteorológica encontrada
 */
export async function getCondicionMeteorologica(id: string) {
  try {
    const response: ObtenerCondicionResponse = await apiRequest(`/clima/${id}`);

    return {
      success: true,
      data: response.data.condicion,
    };
  } catch (error) {
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Error al obtener condición meteorológica",
    };
  }
}

/**
 * Crea una nueva condición meteorológica en el sistema
 * Solo disponible para usuarios con rol CONANP
 *
 * @param data - Datos de la nueva condición meteorológica
 * @returns Condición meteorológica creada
 */
export async function crearCondicionMeteorologica(
  data: CrearCondicionMeteorologicaData
) {
  try {
    const response: MutacionCondicionResponse = await apiRequest("/clima", {
      method: "POST",
      body: JSON.stringify(data),
    });

    return {
      success: true,
      data: response.data?.condicion,
      message: response.message,
    };
  } catch (error) {
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Error al crear condición meteorológica",
    };
  }
}

/**
 * Actualiza una condición meteorológica existente
 * Solo disponible para usuarios con rol CONANP
 *
 * @param id - ID de la condición a actualizar
 * @param data - Datos a actualizar (parciales)
 * @returns Condición meteorológica actualizada
 */
export async function actualizarCondicionMeteorologica(
  id: string,
  data: ActualizarCondicionMeteorologicaData
) {
  try {
    const response: MutacionCondicionResponse = await apiRequest(
      `/clima/${id}`,
      {
        method: "PUT",
        body: JSON.stringify(data),
      }
    );

    return {
      success: true,
      data: response.data?.condicion,
      message: response.message,
    };
  } catch (error) {
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Error al actualizar condición meteorológica",
    };
  }
}

/**
 * Elimina una condición meteorológica del sistema
 * Solo disponible para usuarios con rol CONANP
 *
 * @param id - ID de la condición a eliminar
 * @returns Resultado de la operación
 */
export async function eliminarCondicionMeteorologica(id: string) {
  try {
    const response: MutacionCondicionResponse = await apiRequest(
      `/clima/${id}`,
      {
        method: "DELETE",
      }
    );

    return {
      success: true,
      message: response.message,
    };
  } catch (error) {
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Error al eliminar condición meteorológica",
    };
  }
}

// ============================================================================
// CONSULTAS ESPECIALIZADAS
// ============================================================================

/**
 * Obtiene la condición meteorológica más reciente del sistema
 *
 * @returns Condición actual con información de actualización
 */
export async function getCondicionActual() {
  try {
    const response: ObtenerCondicionActualResponse = await apiRequest(
      "/clima/actual"
    );

    return {
      success: true,
      data: {
        condicion: response.data.condicion,
        tiempo_transcurrido_horas: response.data.tiempo_transcurrido_horas,
        necesita_actualizacion: response.data.necesita_actualizacion,
      },
    };
  } catch (error) {
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Error al obtener condición actual",
    };
  }
}

/**
 * Obtiene la predicción meteorológica basada en datos históricos
 *
 * @param params - Parámetros de la predicción (número de días)
 * @returns Predicción meteorológica con tendencias y recomendaciones
 */
export async function getPrediccionMeteorologica(
  params: ObtenerPrediccionParams = {}
) {
  try {
    const queryParams = new URLSearchParams();
    if (params.dias) queryParams.append("dias", params.dias.toString());

    const queryString = queryParams.toString();
    const endpoint = queryString
      ? `/clima/prediccion?${queryString}`
      : "/clima/prediccion";

    const response: ObtenerPrediccionResponse = await apiRequest(endpoint);

    return {
      success: true,
      data: response.data.prediccion,
    };
  } catch (error) {
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Error al obtener predicción meteorológica",
    };
  }
}

/**
 * Obtiene alertas meteorológicas automáticas basadas en umbrales
 *
 * @returns Lista de alertas activas con niveles de severidad
 */
export async function getAlertasMeteorologicas() {
  try {
    const response: ObtenerAlertasResponse = await apiRequest("/clima/alertas");

    return {
      success: true,
      data: response.data,
    };
  } catch (error) {
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Error al obtener alertas meteorológicas",
    };
  }
}

/**
 * Obtiene estadísticas meteorológicas detalladas para un periodo
 * Solo disponible para usuarios con rol CONANP
 *
 * @param params - Parámetros de consulta (rango de fechas)
 * @returns Estadísticas completas de oleaje, viento, visibilidad y puerto
 */
export async function getEstadisticasMeteorologicas(
  params: ObtenerEstadisticasParams = {}
) {
  try {
    const queryParams = new URLSearchParams();
    if (params.fecha_inicio)
      queryParams.append("fecha_inicio", params.fecha_inicio);
    if (params.fecha_fin) queryParams.append("fecha_fin", params.fecha_fin);

    const queryString = queryParams.toString();
    const endpoint = queryString
      ? `/clima/estadisticas?${queryString}`
      : "/clima/estadisticas";

    const response: ObtenerEstadisticasResponse = await apiRequest(endpoint);

    return {
      success: true,
      data: response.data.estadisticas,
    };
  } catch (error) {
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Error al obtener estadísticas meteorológicas",
    };
  }
}

// ============================================================================
// SINCRONIZACIÓN SMN-CONAGUA
// ============================================================================

/**
 * Sincroniza datos meteorológicos desde la API del SMN-CONAGUA
 * Solo disponible para usuarios con rol CONANP
 *
 * Obtiene pronósticos horarios oficiales del Servicio Meteorológico Nacional
 * y los almacena en el sistema, realizando conversiones automáticas de:
 * - Oleaje (mediante escala de Beaufort)
 * - Visibilidad (desde cobertura de nubes)
 * - Estado del puerto (basado en condiciones combinadas)
 *
 * @param params - Parámetros de sincronización
 * @returns Resultado con número de registros procesados y errores
 */
export async function sincronizarDatosSMN(params: SincronizarSMNParams = {}) {
  try {
    const queryParams = new URLSearchParams();
    if (params.horas_limite)
      queryParams.append("horas_limite", params.horas_limite.toString());
    if (params.solo_isla_lobos !== undefined)
      queryParams.append("solo_isla_lobos", params.solo_isla_lobos.toString());

    const queryString = queryParams.toString();
    const endpoint = queryString
      ? `/clima/sincronizar-smn?${queryString}`
      : "/clima/sincronizar-smn";

    const response: SincronizarSMNResponse = await apiRequest(endpoint, {
      method: "POST",
    });

    return {
      success: true,
      data: response.data,
      message: response.message,
    };
  } catch (error) {
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Error al sincronizar datos del SMN",
    };
  }
}

// ============================================================================
// FUNCIONES DE UTILIDAD
// ============================================================================

/**
 * Obtiene un resumen completo de las condiciones meteorológicas actuales
 * Combina la condición actual con las alertas activas
 *
 * Útil para widgets y cards en el dashboard
 *
 * @returns Resumen con condición, alertas y estado de actualización
 */
export async function getResumenClima() {
  try {
    // Obtener datos en paralelo
    const [condicionResult, alertasResult] = await Promise.all([
      getCondicionActual(),
      getAlertasMeteorologicas(),
    ]);

    if (!condicionResult.success || !condicionResult.data) {
      throw new Error(condicionResult.error || "Error al obtener condición");
    }

    if (!alertasResult.success || !alertasResult.data) {
      throw new Error(alertasResult.error || "Error al obtener alertas");
    }

    return {
      success: true,
      data: {
        condicion: condicionResult.data.condicion,
        alertas: alertasResult.data.alertas,
        tiempo_actualizacion_horas:
          condicionResult.data.tiempo_transcurrido_horas,
        necesita_actualizacion: condicionResult.data.necesita_actualizacion,
      },
    };
  } catch (error) {
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Error al obtener resumen del clima",
    };
  }
}
