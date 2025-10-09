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
// SALIDAS ACTIONS (PARA PRESTADORES)
// ============================================================================

/**
 * Obtiene las salidas del prestador actual
 */
export async function getMisSalidas(filters?: {
  page?: number;
  limit?: number;
  fecha?: string;
  estado?: string;
}) {
  try {
    const params = new URLSearchParams({
      page: (filters?.page || 1).toString(),
      limit: (filters?.limit || 10).toString(),
      ...(filters?.fecha && { fecha: filters.fecha }),
      ...(filters?.estado && { estado: filters.estado }),
    });

    const response = await apiRequest(`/salidas/mis-salidas?${params}`, {
      cache: "no-store", // Forzar actualización de datos
    });

    return {
      success: true,
      data: response.data,
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
    const response = await apiRequest(`/salidas/${salidaId}`);

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
}) {
  try {
    const response = await apiRequest("/salidas", {
      method: "POST",
      body: JSON.stringify(salidaData),
    });

    return {
      success: true,
      data: response.data,
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
    const response = await apiRequest(`/salidas/${salidaId}`, {
      method: "PUT",
      body: JSON.stringify(salidaData),
    });

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
    const response = await apiRequest(`/salidas/${salidaId}`, {
      method: "DELETE",
      body: JSON.stringify({
        motivo_cancelacion: motivo,
      }),
    });

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
    salida: {
      id: string;
      estado: "completada";
      observaciones?: string;
    };
    brazaletes_actualizados: number;
    message: string;
  };
  error?: string;
}> {
  try {
    // Primero actualizar el estado de la salida a completada
    const salidaResponse = await apiRequest(`/salidas/${salidaId}`, {
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
          const brazaletesResponse = await apiRequest(
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
            brazaletesResponse.data.brazaletes_actualizados || 0;
          brazaletesMessage = `${brazaletesActualizados} brazaletes actualizados exitosamente`;
        }
      }
    } catch (brazaletesError) {
      // No fallar la operación completa si hay error con brazaletes
      brazaletesMessage =
        "Error al verificar brazaletes, pero la salida se completó exitosamente";
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
    const response = await apiRequest("/brazaletes/uso/actualizar", {
      method: "PUT",
      body: JSON.stringify({
        salida_id: salidaId,
        fecha_uso: fechaUso,
      }),
    });

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

    const response = await apiRequest(
      `/embarcaciones/mis-embarcaciones?${params}`
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
          : "Error al obtener mis embarcaciones",
    };
  }
}

/**
 * Crea una nueva embarcación para el prestador actual
 */
export async function crearMiEmbarcacion(embarcacionData: {
  nombre: string;
  matricula: string;
  capacidad: number;
  tipo: "menor" | "mayor";
  estado?: "disponible" | "en_uso" | "mantenimiento";
}) {
  try {
    // El prestador_id se obtiene automáticamente del token en el backend
    const response = await apiRequest("/embarcaciones", {
      method: "POST",
      body: JSON.stringify({
        ...embarcacionData,
        estado: embarcacionData.estado || "disponible",
      }),
    });

    return {
      success: true,
      data: response.data,
      message: "Embarcación creada exitosamente",
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
    estado?: "disponible" | "en_uso" | "mantenimiento";
  }
) {
  try {
    const response = await apiRequest(`/embarcaciones/${embarcacionId}`, {
      method: "PUT",
      body: JSON.stringify(embarcacionData),
    });

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
    const response = await apiRequest(`/bloques?fecha=${fecha}&estado=activo`);

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
          : "Error al obtener bloques disponibles",
    };
  }
}

/**
 * Obtiene un bloque específico por ID
 */
export async function getBloque(bloqueId: string) {
  try {
    const response = await apiRequest(`/bloques/${bloqueId}`);

    return {
      success: true,
      data: response.data,
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

    const response = await apiRequest(`/salidas/estadisticas?${params}`);

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
    const response = await apiRequest("/clima/actual");

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
    const response = await apiRequest("/clima/alertas");

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
    const response = await apiRequest(`/clima/prediccion?dias=${dias}`);

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
