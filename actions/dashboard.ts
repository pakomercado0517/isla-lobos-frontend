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
    const [
      usuariosStats,
      embarcacionesData,
      salidasStats,
      climaActual,
      alertasData,
    ] = await Promise.all([
      apiRequest("/usuarios/stats").catch(() => ({
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
      apiRequest("/embarcaciones?limit=100").catch(() => ({
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
      apiRequest("/salidas/estadisticas").catch(() => ({
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
      apiRequest("/clima/actual").catch(() => ({
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
      apiRequest("/dashboard/alertas").catch(() => ({
        data: {
          alertas: [],
        },
      })),
    ]);

    console.log("📊 getAllDashboardData: Datos obtenidos:", {
      usuariosStats: usuariosStats.data,
      embarcacionesData: embarcacionesData.data,
      salidasStats: salidasStats.data,
      climaActual: climaActual.data,
      alertasData: alertasData.data,
    });

    // Procesar y estructurar los datos según lo que espera el componente Dashboard
    const usuariosStatsData = usuariosStats.data?.stats || {
      total: 0,
      activos: 0,
      inactivos: 0,
      conanp: 0,
      prestadores: 0,
    };

    const embarcacionesStatsData = embarcacionesData.data?.estadisticas || {
      total: 0,
      disponibles: 0,
      en_uso: 0,
      mantenimiento: 0,
      menor: 0,
      mayor: 0,
    };

    const salidasStatsData = salidasStats.data?.estadisticas || {
      totales: { salidas: 0, pasajeros: 0 },
      por_estado: {
        programadas: 0,
        en_curso: 0,
        completadas: 0,
        canceladas: 0,
      },
    };

    const climaData = climaActual.data?.condicion || {
      oleaje: 1.0,
      viento_velocidad: 15,
      viento_direccion: "SE",
      visibilidad: "buena",
      estado_puerto: "abierto",
    };

    const alertasArray = alertasData.data?.alertas || [];

    const dashboardData = {
      estadisticas: {
        // Estructura que espera el componente Dashboard
        total_usuarios: usuariosStatsData.total,
        total_embarcaciones: embarcacionesStatsData.total,
        embarcaciones_activas:
          embarcacionesStatsData.disponibles + embarcacionesStatsData.en_uso,
        embarcaciones_mantenimiento: embarcacionesStatsData.mantenimiento,
        total_salidas_hoy:
          salidasStatsData.por_estado?.programadas +
            salidasStatsData.por_estado?.en_curso || 0,
        total_pasajeros_hoy: salidasStatsData.totales?.pasajeros || 0,
        salidas_programadas: salidasStatsData.por_estado?.programadas || 0,
        salidas_completadas: salidasStatsData.por_estado?.completadas || 0,
        salidas_canceladas: salidasStatsData.por_estado?.canceladas || 0,
        ocupacion_promedio: 75, // Valor por defecto, se puede calcular mejor
      },
      clima: climaData,
      alertas: alertasArray,
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

    console.log("👥 getUsuarios: URL de petición:", `/usuarios?${params}`);
    const response = await apiRequest(`/usuarios?${params}`);
    console.log("👥 getUsuarios: Respuesta completa:", response);

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

/**
 * Obtiene la actividad reciente del sistema
 * Combina datos de múltiples endpoints y los ordena cronológicamente
 */
export async function getActividadReciente(limit: number = 10): Promise<{
  success: boolean;
  data?: Array<{
    id: string;
    tipo: string;
    titulo: string;
    descripcion: string;
    fecha: string;
    color: string;
    recurso_id?: string;
    recurso_tipo?: string;
  }>;
  error?: string;
}> {
  try {
    console.log("📊 getActividadReciente: Obteniendo actividad reciente...");

    // Calcular fechas para el rango de búsqueda
    const hoy = new Date();
    const hace7Dias = new Date(hoy);
    hace7Dias.setDate(hace7Dias.getDate() - 7);

    // Extraer fechas sin conversión de timezone
    const yearHoy = hoy.getFullYear();
    const monthHoy = String(hoy.getMonth() + 1).padStart(2, "0");
    const dayHoy = String(hoy.getDate()).padStart(2, "0");
    const fechaHoy = `${yearHoy}-${monthHoy}-${dayHoy}`;

    const yearHace7 = hace7Dias.getFullYear();
    const monthHace7 = String(hace7Dias.getMonth() + 1).padStart(2, "0");
    const dayHace7 = String(hace7Dias.getDate()).padStart(2, "0");
    const fechaHace7Dias = `${yearHace7}-${monthHace7}-${dayHace7}`;

    // Consultar múltiples endpoints en paralelo
    const [salidasResult, embarcacionesResult, usuariosResult, ventasResult] =
      await Promise.allSettled([
        apiRequest(`/salidas?page=1&limit=5&fecha=${fechaHoy}`).catch(
          () => null
        ),
        apiRequest(`/embarcaciones?page=1&limit=5`).catch(() => null),
        apiRequest(`/usuarios?page=1&limit=5`).catch(() => null),
        apiRequest(
          `/brazaletes/reportes/ventas?fecha_inicio=${fechaHace7Dias}&fecha_fin=${fechaHoy}`
        ).catch(() => null),
      ]);

    console.log("📊 Resultados de consultas:", {
      salidas: salidasResult.status,
      embarcaciones: embarcacionesResult.status,
      usuarios: usuariosResult.status,
      ventas: ventasResult.status,
    });

    // Array para almacenar las actividades
    interface ActividadTemp {
      id: string;
      tipo: string;
      titulo: string;
      descripcion: string;
      fecha: string;
      color: string;
      recurso_id?: string;
      recurso_tipo?: string;
    }

    const actividades: ActividadTemp[] = [];

    // Procesar salidas
    if (
      salidasResult.status === "fulfilled" &&
      salidasResult.value &&
      typeof salidasResult.value === "object" &&
      "data" in salidasResult.value
    ) {
      const salidasData = salidasResult.value.data as {
        salidas?: Array<{
          id: string;
          createdAt: string;
          prestador: { nombre: string };
          numero_pasajeros: number;
          destino: string;
        }>;
      };

      if (Array.isArray(salidasData.salidas)) {
        salidasData.salidas.forEach((salida) => {
          actividades.push({
            id: `salida-${salida.id}`,
            tipo: "salida_nueva",
            titulo: "Nueva salida programada",
            descripcion: `${salida.prestador.nombre} - ${salida.numero_pasajeros} pasajeros a ${salida.destino}`,
            fecha: salida.createdAt,
            color: "blue",
            recurso_id: salida.id,
            recurso_tipo: "salida",
          });
        });
      }
    }

    // Procesar embarcaciones
    if (
      embarcacionesResult.status === "fulfilled" &&
      embarcacionesResult.value &&
      typeof embarcacionesResult.value === "object" &&
      "data" in embarcacionesResult.value
    ) {
      const embarcacionesData = embarcacionesResult.value.data as {
        embarcaciones?: Array<{
          id: string;
          createdAt: string;
          nombre: string;
          prestador?: { nombre: string };
        }>;
      };

      if (Array.isArray(embarcacionesData.embarcaciones)) {
        embarcacionesData.embarcaciones.forEach((emb) => {
          actividades.push({
            id: `embarcacion-${emb.id}`,
            tipo: "embarcacion_nueva",
            titulo: "Nueva embarcación registrada",
            descripcion: `${emb.nombre}${
              emb.prestador ? ` - ${emb.prestador.nombre}` : ""
            }`,
            fecha: emb.createdAt,
            color: "green",
            recurso_id: emb.id,
            recurso_tipo: "embarcacion",
          });
        });
      }
    }

    // Procesar usuarios
    if (
      usuariosResult.status === "fulfilled" &&
      usuariosResult.value &&
      typeof usuariosResult.value === "object" &&
      "data" in usuariosResult.value
    ) {
      const usuariosData = usuariosResult.value.data as {
        users?: Array<{
          id: string;
          createdAt: string;
          nombre: string;
          rol: string;
        }>;
      };

      if (Array.isArray(usuariosData.users)) {
        usuariosData.users.forEach((user) => {
          if (user.rol === "prestador") {
            actividades.push({
              id: `usuario-${user.id}`,
              tipo: "usuario_nuevo",
              titulo: "Nuevo prestador registrado",
              descripcion: user.nombre,
              fecha: user.createdAt,
              color: "purple",
              recurso_id: user.id,
              recurso_tipo: "usuario",
            });
          }
        });
      }
    }

    // Procesar ventas de brazaletes
    if (
      ventasResult.status === "fulfilled" &&
      ventasResult.value &&
      typeof ventasResult.value === "object" &&
      "data" in ventasResult.value
    ) {
      const ventasData = ventasResult.value.data as {
        ventas_detalle?: Array<{
          id: string;
          fecha_venta: string;
          cantidad: number;
          prestador?: { nombre: string };
        }>;
      };

      if (Array.isArray(ventasData.ventas_detalle)) {
        ventasData.ventas_detalle.slice(0, 3).forEach((venta) => {
          actividades.push({
            id: `venta-${venta.id}`,
            tipo: "venta_brazaletes",
            titulo: "Venta de brazaletes",
            descripcion: `${venta.cantidad} brazaletes${
              venta.prestador ? ` - ${venta.prestador.nombre}` : ""
            }`,
            fecha: venta.fecha_venta,
            color: "yellow",
            recurso_id: venta.id,
            recurso_tipo: "venta",
          });
        });
      }
    }

    // Ordenar por fecha (más reciente primero)
    actividades.sort((a, b) => {
      const fechaA = new Date(a.fecha).getTime();
      const fechaB = new Date(b.fecha).getTime();
      return fechaB - fechaA;
    });

    // Limitar resultados
    const actividadesLimitadas = actividades.slice(0, limit);

    console.log(
      `📊 getActividadReciente: ${actividadesLimitadas.length} actividades encontradas`
    );

    return {
      success: true,
      data: actividadesLimitadas,
    };
  } catch (error) {
    console.error("📊 getActividadReciente: Error:", error);
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Error al obtener actividad reciente",
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
