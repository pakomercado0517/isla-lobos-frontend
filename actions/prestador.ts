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
    console.log("🚤 getMisSalidas: Obteniendo mis salidas...", filters);

    const params = new URLSearchParams({
      page: (filters?.page || 1).toString(),
      limit: (filters?.limit || 10).toString(),
      ...(filters?.fecha && { fecha: filters.fecha }),
      ...(filters?.estado && { estado: filters.estado }),
    });

    const response = await apiRequest(`/salidas/mis-salidas?${params}`);

    return {
      success: true,
      data: response.data,
    };
  } catch (error) {
    console.error("🚤 getMisSalidas: Error:", error);
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
    console.log("🚤 getSalida: Obteniendo salida...", { salidaId });

    const response = await apiRequest(`/salidas/${salidaId}`);

    return {
      success: true,
      data: response.data,
    };
  } catch (error) {
    console.error("🚤 getSalida: Error:", error);
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
  bloque_id?: string; // Opcional, solo requerido para Isla Lobos
}) {
  try {
    console.log("🚤 registrarSalida: Registrando nueva salida...", salidaData);
    console.log(
      "🚤 registrarSalida: Datos que se enviarán al backend:",
      JSON.stringify(salidaData, null, 2)
    );

    const response = await apiRequest("/salidas", {
      method: "POST",
      body: JSON.stringify(salidaData),
    });

    console.log(
      "🚤 registrarSalida: Respuesta del backend:",
      JSON.stringify(response, null, 2)
    );

    return {
      success: true,
      data: response.data,
      message: "Salida registrada exitosamente",
    };
  } catch (error) {
    console.error("🚤 registrarSalida: Error:", error);
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
    console.log("🚤 actualizarSalida: Actualizando salida...", {
      salidaId,
      salidaData,
    });

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
    console.error("🚤 actualizarSalida: Error:", error);
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
export async function cancelarSalida(salidaId: string) {
  try {
    console.log("🚤 cancelarSalida: Cancelando salida...", { salidaId });

    const response = await apiRequest(`/salidas/${salidaId}`, {
      method: "DELETE",
    });

    return {
      success: true,
      data: response.data,
      message: "Salida cancelada exitosamente",
    };
  } catch (error) {
    console.error("🚤 cancelarSalida: Error:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Error al cancelar la salida",
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
    console.log(
      "🚢 getMisEmbarcaciones: Obteniendo mis embarcaciones...",
      filters
    );

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
    console.error("🚢 getMisEmbarcaciones: Error:", error);
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
    console.log(
      "🚢 crearMiEmbarcacion: Creando mi embarcación...",
      embarcacionData
    );

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
    console.error("🚢 crearMiEmbarcacion: Error:", error);
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
    console.log("🚢 actualizarMiEmbarcacion: Actualizando mi embarcación...", {
      embarcacionId,
      embarcacionData,
    });

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
    console.error("🚢 actualizarMiEmbarcacion: Error:", error);
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
    console.log("⏰ getBloquesDisponibles: Obteniendo bloques disponibles...", {
      fecha,
    });

    const response = await apiRequest(`/bloques?fecha=${fecha}&estado=activo`);

    return {
      success: true,
      data: response.data,
    };
  } catch (error) {
    console.error("⏰ getBloquesDisponibles: Error:", error);
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
    console.log("⏰ getBloque: Obteniendo bloque...", { bloqueId });

    const response = await apiRequest(`/bloques/${bloqueId}`);

    return {
      success: true,
      data: response.data,
    };
  } catch (error) {
    console.error("⏰ getBloque: Error:", error);
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
    console.log("📊 getMisEstadisticas: Obteniendo mis estadísticas...", {
      fechaInicio,
      fechaFin,
    });

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
    console.error("📊 getMisEstadisticas: Error:", error);
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
    console.log(
      "🌤️ getCondicionesActuales: Obteniendo condiciones actuales..."
    );

    const response = await apiRequest("/clima/actual");

    return {
      success: true,
      data: response.data,
    };
  } catch (error) {
    console.error("🌤️ getCondicionesActuales: Error:", error);
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
    console.log(
      "🌤️ getAlertasMeteorologicas: Obteniendo alertas meteorológicas..."
    );

    const response = await apiRequest("/clima/alertas");

    return {
      success: true,
      data: response.data,
    };
  } catch (error) {
    console.error("🌤️ getAlertasMeteorologicas: Error:", error);
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
    console.log("🌤️ getPrediccionMeteorologica: Obteniendo predicción...", {
      dias,
    });

    const response = await apiRequest(`/clima/prediccion?dias=${dias}`);

    return {
      success: true,
      data: response.data,
    };
  } catch (error) {
    console.error("🌤️ getPrediccionMeteorologica: Error:", error);
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
    console.log(
      "📊 getPrestadorDashboardData: Cargando datos del dashboard..."
    );

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
    console.error("📊 getPrestadorDashboardData: Error:", error);
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Error al cargar datos del dashboard",
    };
  }
}
