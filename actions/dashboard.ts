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
// DASHBOARD ACTIONS
// ============================================================================

/**
 * Obtiene las estadísticas generales del dashboard
 */
export async function getDashboardEstadisticas() {
  try {
    console.log("📊 getDashboardEstadisticas: Obteniendo estadísticas...");

    const response = await apiRequest("/dashboard/estadisticas");

    console.log("📊 getDashboardEstadisticas: Respuesta:", response);
    return {
      success: true,
      data: response.data?.estadisticas || response.data,
    };
  } catch (error) {
    console.error("📊 getDashboardEstadisticas: Error:", error);
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
 */
export async function getDashboardOcupacion(dias: number = 7) {
  try {
    console.log(
      `📊 getDashboardOcupacion: Obteniendo ocupación para ${dias} días...`
    );

    const response = await apiRequest(`/dashboard/ocupacion?dias=${dias}`);

    return {
      success: true,
      data: response.data,
    };
  } catch (error) {
    console.error("📊 getDashboardOcupacion: Error:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Error al obtener ocupación",
    };
  }
}

/**
 * Obtiene el estado de las embarcaciones
 */
export async function getDashboardEmbarcaciones() {
  try {
    console.log(
      "📊 getDashboardEmbarcaciones: Obteniendo estado de embarcaciones..."
    );

    const response = await apiRequest("/dashboard/embarcaciones");

    return {
      success: true,
      data: response.data,
    };
  } catch (error) {
    console.error("📊 getDashboardEmbarcaciones: Error:", error);
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Error al obtener embarcaciones",
    };
  }
}

/**
 * Obtiene el estado de permisos
 */
export async function getDashboardPermisos() {
  try {
    console.log("📊 getDashboardPermisos: Obteniendo estado de permisos...");

    const response = await apiRequest("/dashboard/permisos");

    return {
      success: true,
      data: response.data,
    };
  } catch (error) {
    console.error("📊 getDashboardPermisos: Error:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Error al obtener permisos",
    };
  }
}

/**
 * Obtiene el resumen meteorológico
 */
export async function getDashboardClima(dias: number = 7) {
  try {
    console.log(
      `📊 getDashboardClima: Obteniendo resumen meteorológico para ${dias} días...`
    );

    const response = await apiRequest(`/dashboard/clima?dias=${dias}`);

    return {
      success: true,
      data: response.data,
    };
  } catch (error) {
    console.error("📊 getDashboardClima: Error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Error al obtener clima",
    };
  }
}

/**
 * Obtiene las alertas del sistema
 */
export async function getDashboardAlertas() {
  try {
    console.log("📊 getDashboardAlertas: Obteniendo alertas...");

    const response = await apiRequest("/dashboard/alertas");

    return {
      success: true,
      data: response.data,
    };
  } catch (error) {
    console.error("📊 getDashboardAlertas: Error:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Error al obtener alertas",
    };
  }
}

/**
 * Obtiene todos los datos del dashboard usando fallback con endpoints individuales
 */
export async function getAllDashboardData() {
  try {
    console.log(
      "📊 getAllDashboardData: Iniciando carga de todos los datos..."
    );

    // Usar endpoints individuales como fallback
    const [usuariosStats, embarcacionesData, salidasStats, climaActual] =
      await Promise.all([
        apiRequest("/usuarios/stats").catch((e) => ({
          data: {
            stats: {
              total: 0,
              activos: 0,
              inactivos: 0,
              conanp: 0,
              prestadores: 0,
            },
          },
        })),
        apiRequest("/embarcaciones?limit=100").catch((e) => ({
          data: {
            embarcaciones: [],
            estadisticas: {
              total: 0,
              disponibles: 0,
              en_uso: 0,
              mantenimiento: 0,
            },
          },
        })),
        apiRequest("/salidas/estadisticas").catch((e) => ({
          data: {
            estadisticas: {
              totales: { salidas: 0, pasajeros: 0 },
              por_estado: {
                programadas: 0,
                en_curso: 0,
                completadas: 0,
                canceladas: 0,
              },
            },
          },
        })),
        apiRequest("/clima/actual").catch((e) => ({
          data: {
            condicion: {
              oleaje: 1.0,
              viento_velocidad: 15,
              viento_direccion: "SE",
              visibilidad: "Buena",
              estado_puerto: "abierto",
              prediccion_5_dias: "Condiciones favorables",
              fuente: "CONAGUA",
            },
          },
        })),
      ]);

    console.log("📊 getAllDashboardData: Datos obtenidos:", {
      usuariosStats: usuariosStats.data,
      embarcacionesData: embarcacionesData.data,
      salidasStats: salidasStats.data,
      climaActual: climaActual.data,
    });

    // Procesar y estructurar los datos
    const dashboardData = {
      estadisticas: {
        sistema: {
          fecha_actual: new Date().toISOString(),
          uptime: 3600,
          version: "1.0.0",
        },
        usuarios: usuariosStats.data?.stats || {
          total: 0,
          activos: 0,
          inactivos: 0,
          conanp: 0,
          prestadores: 0,
          porcentaje_activos: 0,
        },
        embarcaciones: embarcacionesData.data?.estadisticas || {
          total: 0,
          disponibles: 0,
          en_uso: 0,
          mantenimiento: 0,
          menor: 0,
          mayor: 0,
          porcentaje_disponibles: 0,
        },
        bloques: {
          total: 0,
          disponibles: 0,
          llenos: 0,
          cerrados: 0,
          porcentaje_disponibles: 0,
        },
        salidas: salidasStats.data?.estadisticas || {
          total: 0,
          programadas: 0,
          en_curso: 0,
          completadas: 0,
          canceladas: 0,
          este_mes: 0,
          esta_semana: 0,
          porcentaje_completadas: 0,
        },
        invitaciones: {
          total: 0,
          usadas: 0,
          disponibles: 0,
          porcentaje_usadas: 0,
        },
        clima: {
          condicion_actual: climaActual.data?.condicion || {
            fecha_hora: new Date().toISOString(),
            oleaje: 1.0,
            viento_velocidad: 15,
            visibilidad: "buena",
            estado_puerto: "abierto",
          },
        },
      },
      ocupacion_7_dias: [],
      embarcaciones: embarcacionesData.data?.embarcaciones || [],
      permisos: [],
      clima: climaActual.data?.condicion || {
        fecha: new Date().toISOString(),
        oleaje: 1.0,
        viento_velocidad: 15,
        viento_direccion: "SE",
        visibilidad: "buena",
        estado_puerto: "abierto",
        prediccion_5_dias: "Condiciones favorables",
        fuente: "CONAGUA",
        alertas_activas: [],
      },
      alertas: [],
    };

    console.log("📊 getAllDashboardData: Datos procesados:", dashboardData);

    return {
      success: true,
      data: dashboardData,
    };
  } catch (error) {
    console.error("📊 getAllDashboardData: Error:", error);
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Error al obtener datos del dashboard",
    };
  }
}

// ============================================================================
// USUARIOS ACTIONS
// ============================================================================

/**
 * Obtiene la lista de usuarios
 */
export async function getUsuarios(
  page: number = 1,
  limit: number = 10,
  filters?: { rol?: string; activo?: boolean }
) {
  try {
    console.log("👥 getUsuarios: Obteniendo usuarios...", {
      page,
      limit,
      filters,
    });

    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      ...(filters?.rol && { rol: filters.rol }),
      ...(filters?.activo !== undefined && {
        activo: filters.activo.toString(),
      }),
    });

    const response = await apiRequest(`/usuarios?${params}`);

    return {
      success: true,
      data: response.data,
    };
  } catch (error) {
    console.error("👥 getUsuarios: Error:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Error al obtener usuarios",
    };
  }
}

/**
 * Crea un nuevo usuario
 */
export async function createUsuario(userData: {
  nombre: string;
  email: string;
  telefono: string;
  password: string;
  rol: "conanp" | "prestador";
  activo: boolean;
}) {
  try {
    console.log("👥 createUsuario: Creando usuario...", {
      ...userData,
      password: "***",
    });

    const response = await apiRequest("/usuarios", {
      method: "POST",
      body: JSON.stringify(userData),
    });

    return {
      success: true,
      data: response.data,
      message: "Usuario creado exitosamente",
    };
  } catch (error) {
    console.error("👥 createUsuario: Error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Error al crear usuario",
    };
  }
}

/**
 * Actualiza un usuario
 */
export async function updateUsuario(
  userId: string,
  userData: {
    nombre?: string;
    telefono?: string;
    activo?: boolean;
  }
) {
  try {
    console.log("👥 updateUsuario: Actualizando usuario...", {
      userId,
      userData,
    });

    const response = await apiRequest(`/usuarios/${userId}`, {
      method: "PUT",
      body: JSON.stringify(userData),
    });

    return {
      success: true,
      data: response.data,
      message: "Usuario actualizado exitosamente",
    };
  } catch (error) {
    console.error("👥 updateUsuario: Error:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Error al actualizar usuario",
    };
  }
}

/**
 * Desactiva un usuario
 */
export async function deleteUsuario(userId: string) {
  try {
    console.log("👥 deleteUsuario: Desactivando usuario...", { userId });

    const response = await apiRequest(`/usuarios/${userId}`, {
      method: "DELETE",
    });

    return {
      success: true,
      data: response.data,
      message: "Usuario desactivado exitosamente",
    };
  } catch (error) {
    console.error("👥 deleteUsuario: Error:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Error al desactivar usuario",
    };
  }
}

/**
 * Activa un usuario
 */
export async function activateUsuario(userId: string) {
  try {
    console.log("👥 activateUsuario: Activando usuario...", { userId });

    const response = await apiRequest(`/usuarios/${userId}/activate`, {
      method: "PATCH",
    });

    return {
      success: true,
      data: response.data,
      message: "Usuario activado exitosamente",
    };
  } catch (error) {
    console.error("👥 activateUsuario: Error:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Error al activar usuario",
    };
  }
}

// ============================================================================
// BLOQUES ACTIONS
// ============================================================================

/**
 * Obtiene la lista de bloques
 */
export async function getBloques(filters?: {
  fecha?: string;
  estado?: string;
  page?: number;
  limit?: number;
}) {
  try {
    console.log("⏰ getBloques: Obteniendo bloques...", filters);

    const params = new URLSearchParams({
      page: (filters?.page || 1).toString(),
      limit: (filters?.limit || 10).toString(),
      ...(filters?.fecha && { fecha: filters.fecha }),
      ...(filters?.estado && { estado: filters.estado }),
    });

    const response = await apiRequest(`/bloques?${params}`);

    return {
      success: true,
      data: response.data,
    };
  } catch (error) {
    console.error("⏰ getBloques: Error:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Error al obtener bloques",
    };
  }
}

/**
 * Crea un nuevo bloque
 */
export async function createBloque(bloqueData: {
  nombre: string;
  hora_inicio: string;
  hora_fin: string;
  capacidad_total: number;
  fecha: string;
  estado: "activo" | "lleno" | "suspendido_por_clima" | "cerrado_capitaria";
}) {
  try {
    console.log("⏰ createBloque: Creando bloque...", bloqueData);

    const response = await apiRequest("/bloques", {
      method: "POST",
      body: JSON.stringify(bloqueData),
    });

    return {
      success: true,
      data: response.data,
      message: "Bloque creado exitosamente",
    };
  } catch (error) {
    console.error("⏰ createBloque: Error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Error al crear bloque",
    };
  }
}

/**
 * Actualiza un bloque
 */
export async function updateBloque(
  bloqueId: string,
  bloqueData: {
    nombre?: string;
    hora_inicio?: string;
    hora_fin?: string;
    capacidad_total?: number;
    estado?: "activo" | "lleno" | "suspendido_por_clima" | "cerrado_capitaria";
  }
) {
  try {
    console.log("⏰ updateBloque: Actualizando bloque...", {
      bloqueId,
      bloqueData,
    });

    const response = await apiRequest(`/bloques/${bloqueId}`, {
      method: "PUT",
      body: JSON.stringify(bloqueData),
    });

    return {
      success: true,
      data: response.data,
      message: "Bloque actualizado exitosamente",
    };
  } catch (error) {
    console.error("⏰ updateBloque: Error:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Error al actualizar bloque",
    };
  }
}

/**
 * Elimina un bloque
 */
export async function deleteBloque(bloqueId: string) {
  try {
    console.log("⏰ deleteBloque: Eliminando bloque...", { bloqueId });

    const response = await apiRequest(`/bloques/${bloqueId}`, {
      method: "DELETE",
    });

    return {
      success: true,
      message: "Bloque eliminado exitosamente",
    };
  } catch (error) {
    console.error("⏰ deleteBloque: Error:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Error al eliminar bloque",
    };
  }
}

// ============================================================================
// EMBARCACIONES ACTIONS
// ============================================================================

/**
 * Obtiene la lista de embarcaciones
 */
export async function getEmbarcaciones(filters?: {
  estado?: string;
  tipo?: string;
  page?: number;
  limit?: number;
}) {
  try {
    console.log("🚢 getEmbarcaciones: Obteniendo embarcaciones...", filters);

    const params = new URLSearchParams({
      page: (filters?.page || 1).toString(),
      limit: (filters?.limit || 10).toString(),
      ...(filters?.estado && { estado: filters.estado }),
      ...(filters?.tipo && { tipo: filters.tipo }),
    });

    const response = await apiRequest(`/embarcaciones?${params}`);

    return {
      success: true,
      data: response.data,
    };
  } catch (error) {
    console.error("🚢 getEmbarcaciones: Error:", error);
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Error al obtener embarcaciones",
    };
  }
}

/**
 * Crea una nueva embarcación
 */
export async function createEmbarcacion(embarcacionData: {
  nombre: string;
  matricula: string;
  capacidad: number;
  tipo: "menor" | "mayor";
  estado: "disponible" | "en_uso" | "mantenimiento";
  prestador_id: string;
}) {
  try {
    console.log(
      "🚢 createEmbarcacion: Creando embarcación...",
      embarcacionData
    );

    const response = await apiRequest("/embarcaciones", {
      method: "POST",
      body: JSON.stringify(embarcacionData),
    });

    return {
      success: true,
      data: response.data,
      message: "Embarcación creada exitosamente",
    };
  } catch (error) {
    console.error("🚢 createEmbarcacion: Error:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Error al crear embarcación",
    };
  }
}

/**
 * Actualiza una embarcación
 */
export async function updateEmbarcacion(
  embarcacionId: string,
  embarcacionData: {
    nombre?: string;
    capacidad?: number;
    estado?: "disponible" | "en_uso" | "mantenimiento";
  }
) {
  try {
    console.log("🚢 updateEmbarcacion: Actualizando embarcación...", {
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
    console.error("🚢 updateEmbarcacion: Error:", error);
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Error al actualizar embarcación",
    };
  }
}

/**
 * Elimina una embarcación
 */
export async function deleteEmbarcacion(embarcacionId: string) {
  try {
    console.log("🚢 deleteEmbarcacion: Eliminando embarcación...", {
      embarcacionId,
    });

    const response = await apiRequest(`/embarcaciones/${embarcacionId}`, {
      method: "DELETE",
    });

    return {
      success: true,
      message: "Embarcación eliminada exitosamente",
    };
  } catch (error) {
    console.error("🚢 deleteEmbarcacion: Error:", error);
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Error al eliminar embarcación",
    };
  }
}
