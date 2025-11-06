"use server";

import { cookies } from "next/headers";
import { config } from "@/lib/config/env";
import { EmbarcacionFormData } from "@/lib/types/embarcacion";
import { Salida } from "@/lib/types/salida";
import {
  BloqueActionState,
  ClimaActionState,
  EmbarcacionActionState,
  SalidaActionState,
} from "@/lib/types/actions";
import { ActualizarBrazaletesUsoResponse } from "@/lib/types/brazaletes";
import { Embarcacion } from "@/lib/types/embarcacion";

/**
 * Intenta renovar el accessToken usando el refreshToken
 * @returns true si se renovó exitosamente, false en caso contrario
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

/**
 * Función auxiliar para hacer peticiones al backend con auto-renovación de tokens
 */
async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {},
  retryCount = 0
): Promise<T> {
  const url = `${config.api.baseUrl}${endpoint}`;

  const defaultHeaders: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string>),
  };

  // IMPORTANTE: Las Server Actions se ejecutan en el SERVIDOR de Next.js.
  // Necesitamos leer las cookies del usuario y reenviarlas al backend.
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

  // Construir el header Cookie manualmente para enviarlo al backend
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
// SALIDAS ACTIONS (PARA PRESTADORES)
// ============================================================================

/**
 * Obtiene las salidas del prestador actual
 */
export async function getMisSalidas(filters?: {
  page?: number;
  limit?: number;
  fecha_inicio?: string;
  fecha_fin?: string;
  estado?: string;
}) {
  try {
    const params = new URLSearchParams({
      page: (filters?.page || 1).toString(),
      limit: (filters?.limit || 10).toString(),
      ...(filters?.fecha_inicio && { fecha_inicio: filters.fecha_inicio }),
      ...(filters?.fecha_fin && { fecha_fin: filters.fecha_fin }),
      ...(filters?.estado && { estado: filters.estado }),
    });

    const response = await apiRequest<
      SalidaActionState<{
        salidas: Salida[];
        pagination?: {
          page: number;
          limit: number;
          total: number;
          totalPages: number;
        };
        estadisticas?: {
          total: number;
          programadas: number;
          en_curso: number;
          completadas: number;
          canceladas: number;
        };
      }>
    >(`/salidas/mis-salidas?${params}`, {
      cache: "no-store", // Forzar actualización de datos
    });

    return {
      success: true,
      data: response.data as {
        salidas: Salida[];
        pagination?: {
          page: number;
          limit: number;
          total: number;
          totalPages: number;
        };
        estadisticas?: {
          total: number;
          programadas: number;
          en_curso: number;
          completadas: number;
          canceladas: number;
        };
      },
    };
  } catch (error) {
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Error al obtener mis salidas",
    };
  }
}

/**
 * Obtiene una salida específica por ID
 */
export async function getSalida(salidaId: string) {
  try {
    const response = await apiRequest<SalidaActionState<{ salida: Salida }>>(
      `/salidas/${salidaId}`
    );

    return {
      success: true,
      data: response.data,
    };
  } catch (error) {
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Error al obtener la salida",
    };
  }
}

/**
 * Registra una nueva salida
 */
export async function registrarSalida(salidaData: {
  fecha: string;
  numero_pasajeros: number;
  numero_brazaletes?: number;
  destino: string;
  observaciones?: string;
  embarcacion_id: string;
  bloque_id?: string | null; // Opcional, solo requerido para Isla Lobos, null para otros destinos
  hora?: string; // Opcional, solo requerido para otros destinos (Arrecifes)
}): Promise<
  | { success: true; data: { salida: Salida }; message: string }
  | { success: false; error: string }
> {
  try {
    const response = await apiRequest<SalidaActionState<{ salida: Salida }>>(
      "/salidas",
      {
        method: "POST",
        body: JSON.stringify(salidaData),
      }
    );

    return {
      success: true,
      data: response.data as { salida: Salida },
      message: "Salida registrada exitosamente",
    };
  } catch (error) {
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Error al registrar la salida",
    };
  }
}

/**
 * Actualiza una salida existente
 */
export async function actualizarSalida(
  salidaId: string,
  salidaData: {
    numero_pasajeros?: number;
    observaciones?: string;
    estado?: "programada" | "en_curso" | "completada" | "cancelada";
  }
) {
  try {
    const response = await apiRequest<SalidaActionState>(
      `/salidas/${salidaId}`,
      {
        method: "PUT",
        body: JSON.stringify(salidaData),
      }
    );

    return {
      success: true,
      data: response.data,
      message: "Salida actualizada exitosamente",
    };
  } catch (error) {
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Error al actualizar la salida",
    };
  }
}

/**
 * Cancela una salida
 */
export async function cancelarSalida(salidaId: string, motivo: string) {
  try {
    const response = await apiRequest<SalidaActionState>(
      `/salidas/${salidaId}`,
      {
        method: "DELETE",
        body: JSON.stringify({
          motivo_cancelacion: motivo,
        }),
      }
    );

    return {
      success: true,
      data: response.data,
      message: "Salida cancelada exitosamente",
    };
  } catch (error) {
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Error al cancelar la salida",
    };
  }
}

/**
 * Marca una salida como completada y actualiza los brazaletes asociados
 */
export async function completarServicio(
  salidaId: string,
  fechaServicio: string
): Promise<{
  success: boolean;
  data?: {
    salida: Salida;
    brazaletes_actualizados: number;
    message: string;
  };
  error?: string;
}> {
  try {
    // Primero actualizar el estado de la salida a completada
    const salidaResponse = await apiRequest<
      SalidaActionState<{ salida: Salida }>
    >(`/salidas/${salidaId}`, {
      method: "PUT",
      body: JSON.stringify({
        estado: "completada",
        observaciones: "Servicio completado exitosamente",
      }),
    });

    // Verificar si la salida tiene brazaletes asignados antes de actualizarlos
    let brazaletesActualizados = 0;
    let brazaletesMessage = "No hay brazaletes asignados a esta salida";

    try {
      // Importar la función para verificar brazaletes
      const { getBrazaletesUtilizadosSalida } = await import("./brazaletes");

      // Verificar si hay brazaletes asignados a esta salida
      const brazaletesResult = await getBrazaletesUtilizadosSalida(salidaId);

      if (brazaletesResult.success && brazaletesResult.data) {
        const brazaletesAsignados =
          brazaletesResult.data.brazaletes_utilizados || [];

        if (brazaletesAsignados.length > 0) {
          // Solo actualizar brazaletes si existen
          const brazaletesResponse =
            await apiRequest<ActualizarBrazaletesUsoResponse>(
              "/brazaletes/uso/actualizar",
              {
                method: "PUT",
                body: JSON.stringify({
                  salida_id: salidaId,
                  fecha_uso: fechaServicio, // Usar la fecha de la salida, no la fecha actual
                }),
              }
            );

          brazaletesActualizados =
            brazaletesResponse.data?.brazaletes_actualizados || 0;
          brazaletesMessage = `${brazaletesActualizados} brazaletes actualizados exitosamente`;
        }
      }
    } catch (brazaletesError) {
      // No fallar la operación completa si hay error con brazaletes
      brazaletesMessage =
        "Error al verificar brazaletes, pero la salida se completó exitosamente";
    }

    if (!salidaResponse.data?.salida) {
      throw new Error(
        "No se pudo obtener la información de la salida actualizada"
      );
    }

    return {
      success: true,
      data: {
        salida: salidaResponse.data.salida,
        brazaletes_actualizados: brazaletesActualizados,
        message: `Servicio completado exitosamente. ${brazaletesMessage}`,
      },
    };
  } catch (error) {
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Error al completar el servicio",
    };
  }
}

/**
 * Actualiza el estado de los brazaletes de una salida a "utilizado"
 */
export async function actualizarBrazaletesUso(
  salidaId: string,
  fechaUso: string
): Promise<{
  success: boolean;
  data?: {
    brazaletes_actualizados: number;
    message: string;
  };
  error?: string;
}> {
  try {
    const response = await apiRequest<ActualizarBrazaletesUsoResponse>(
      "/brazaletes/uso/actualizar",
      {
        method: "PUT",
        body: JSON.stringify({
          salida_id: salidaId,
          fecha_uso: fechaUso,
        }),
      }
    );

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
          : "Error al actualizar brazaletes",
    };
  }
}

// ============================================================================
// EMBARCACIONES ACTIONS (PARA PRESTADORES)
// ============================================================================

/**
 * Obtiene las embarcaciones del prestador actual
 */
export async function getMisEmbarcaciones(filters?: {
  page?: number;
  limit?: number;
}) {
  try {
    const params = new URLSearchParams({
      page: (filters?.page || 1).toString(),
      limit: (filters?.limit || 10).toString(),
    });

    const response = await apiRequest<
      EmbarcacionActionState<{ embarcaciones: Embarcacion[] }>
    >(`/embarcaciones/mis-embarcaciones?${params}`);

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
          : "Error al obtener mis embarcaciones",
    };
  }
}

/**
 * Crea una nueva embarcación para el prestador actual
 */
export async function crearMiEmbarcacion(
  embarcacionData: EmbarcacionFormData,
  prestadorId: string
) {
  try {
    // Enviar el prestador_id explícitamente en el body
    // Todas las embarcaciones nuevas se crean con estado "pendiente_autorizacion"
    const response = await apiRequest<EmbarcacionActionState>(
      "/embarcaciones",
      {
        method: "POST",
        body: JSON.stringify({
          ...embarcacionData,
          estado: "pendiente_autorizacion",
          prestador_id: prestadorId,
        }),
      }
    );

    return {
      success: true,
      data: response.data,
      message: "Embarcación creada exitosamente. Pendiente de autorización.",
    };
  } catch (error) {
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Error al crear la embarcación",
    };
  }
}

/**
 * Actualiza una embarcación del prestador actual
 */
export async function actualizarMiEmbarcacion(
  embarcacionId: string,
  embarcacionData: {
    nombre?: string;
    capacidad?: number;
    estado?:
      | "disponible"
      | "en_uso"
      | "mantenimiento"
      | "pendiente_autorizacion";
  }
) {
  try {
    const response = await apiRequest<EmbarcacionActionState>(
      `/embarcaciones/${embarcacionId}`,
      {
        method: "PUT",
        body: JSON.stringify(embarcacionData),
      }
    );

    return {
      success: true,
      data: response.data,
      message: "Embarcación actualizada exitosamente",
    };
  } catch (error) {
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Error al actualizar la embarcación",
    };
  }
}

// ============================================================================
// BLOQUES ACTIONS (PARA PRESTADORES - SOLO LECTURA)
// ============================================================================

/**
 * Obtiene los bloques disponibles para una fecha específica
 */
export async function getBloquesDisponibles(fecha: string) {
  try {
    const response = await apiRequest<
      BloqueActionState<{
        bloques: Array<{
          id: string;
          nombre: string;
          hora_inicio: string;
          hora_fin: string;
          capacidad_total: number;
          capacidad_registrada: number;
          capacidad_disponible?: number;
          estado: string;
          destino?: string;
          fecha: string;
          es_plantilla?: boolean;
          plantilla_id?: string;
          embarcaciones_ocupadas?: Array<{
            id: string;
            nombre: string;
            tipo: string;
            capacidad: number;
            estado: string;
            salida: {
              id: string;
              estado: string;
              numero_pasajeros: number;
              destino: string;
              observaciones?: string;
            };
          }>;
        }>;
      }>
    >(`/bloques?fecha=${fecha}&estado=activo`);

    return {
      success: true,
      data: response.data as {
        bloques: Array<{
          id: string;
          nombre: string;
          hora_inicio: string;
          hora_fin: string;
          capacidad_total: number;
          capacidad_registrada: number;
          capacidad_disponible?: number;
          estado: string;
          destino?: string;
          fecha: string;
          es_plantilla?: boolean;
          plantilla_id?: string;
          embarcaciones_ocupadas?: Array<{
            id: string;
            nombre: string;
            tipo: string;
            capacidad: number;
            estado: string;
            salida: {
              id: string;
              estado: string;
              numero_pasajeros: number;
              destino: string;
              observaciones?: string;
            };
          }>;
        }>;
      },
    };
  } catch (error) {
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Error al obtener bloques disponibles",
    };
  }
}

/**
 * Obtiene un bloque específico por ID
 */
export async function getBloque(bloqueId: string): Promise<
  | {
      success: true;
      data: {
        bloque: {
          id: string;
          nombre: string;
          hora_inicio: string;
          hora_fin: string;
          capacidad_total?: number;
          capacidad_registrada?: number;
          capacidad_disponible?: number;
          estado?: string;
          fecha?: string;
        };
      };
    }
  | { success: false; error: string }
> {
  try {
    const response = await apiRequest<
      BloqueActionState<{
        bloque: {
          id: string;
          nombre: string;
          hora_inicio: string;
          hora_fin: string;
          capacidad_total?: number;
          capacidad_registrada?: number;
          capacidad_disponible?: number;
          estado?: string;
          fecha?: string;
        };
      }>
    >(`/bloques/${bloqueId}`);

    return {
      success: true,
      data: response.data as {
        bloque: {
          id: string;
          nombre: string;
          hora_inicio: string;
          hora_fin: string;
          capacidad_total?: number;
          capacidad_registrada?: number;
          capacidad_disponible?: number;
          estado?: string;
          fecha?: string;
        };
      },
    };
  } catch (error) {
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Error al obtener el bloque",
    };
  }
}

// ============================================================================
// ESTADÍSTICAS ACTIONS (PARA PRESTADORES)
// ============================================================================

/**
 * Obtiene las estadísticas de salidas del prestador actual
 */
export async function getMisEstadisticas(
  fechaInicio?: string,
  fechaFin?: string
) {
  try {
    const params = new URLSearchParams({
      ...(fechaInicio && { fecha_inicio: fechaInicio }),
      ...(fechaFin && { fecha_fin: fechaFin }),
    });

    const response = await apiRequest<
      SalidaActionState<{
        estadisticas: {
          total: number;
          programadas: number;
          en_curso: number;
          completadas: number;
          canceladas: number;
        };
      }>
    >(`/salidas/estadisticas?${params}`);

    return {
      success: true,
      data: response.data as {
        estadisticas: {
          total: number;
          programadas: number;
          en_curso: number;
          completadas: number;
          canceladas: number;
        };
      },
    };
  } catch (error) {
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Error al obtener mis estadísticas",
    };
  }
}

// ============================================================================
// CLIMA ACTIONS (PARA PRESTADORES - SOLO LECTURA)
// ============================================================================

/**
 * Obtiene las condiciones meteorológicas actuales
 */
export async function getCondicionesActuales() {
  try {
    const response = await apiRequest<ClimaActionState>("/clima/actual");

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
 * Obtiene las alertas meteorológicas
 */
export async function getAlertasMeteorologicas() {
  try {
    const response = await apiRequest<ClimaActionState>("/clima/alertas");

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
 * Obtiene la predicción meteorológica
 */
export async function getPrediccionMeteorologica(dias: number = 5) {
  try {
    const response = await apiRequest<ClimaActionState>(
      `/clima/prediccion?dias=${dias}`
    );

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
          : "Error al obtener predicción meteorológica",
    };
  }
}

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Obtiene todos los datos necesarios para el dashboard del prestador
 */
export async function getPrestadorDashboardData() {
  try {
    const [salidasResult, embarcacionesResult, climaResult] = await Promise.all(
      [
        getMisSalidas({ limit: 5 }),
        getMisEmbarcaciones(),
        getCondicionesActuales().catch(() => ({ success: false, data: null })),
      ]
    );

    return {
      success: true,
      data: {
        salidas: salidasResult.success
          ? salidasResult.data
          : { salidas: [], estadisticas: {} },
        embarcaciones: embarcacionesResult.success
          ? embarcacionesResult.data
          : { embarcaciones: [], estadisticas: {} },
        clima: climaResult.success ? climaResult.data : null,
      },
    };
  } catch (error) {
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Error al cargar datos del dashboard",
    };
  }
}
