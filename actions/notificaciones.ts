/**
 * ═══════════════════════════════════════════════════════════════
 * 📱 NOTIFICACIONES WHATSAPP - SERVER ACTIONS
 * ═══════════════════════════════════════════════════════════════
 *
 * 🔧 CONFIGURACIÓN DE ENTORNOS:
 *
 * DESARROLLO (NODE_ENV=development):
 * - Los mensajes se envían a los números reales de los prestadores
 * - Verifica siempre que los teléfonos de prueba sean válidos
 *
 * PRODUCCIÓN (NODE_ENV=production):
 * - Los mensajes se envían a los números reales de los usuarios
 * - Se requiere número de WhatsApp Business aprobado
 *
 * 📝 MIGRACIÓN A PRODUCCIÓN:
 * 1. Cambiar NODE_ENV=production
 * 2. Remover NEXT_PUBLIC_TWILIO_TEST_NUMBER del .env
 * 3. Verificar que los usuarios tengan teléfonos reales
 * 4. Probar con un usuario antes de envíos masivos
 *
 * ═══════════════════════════════════════════════════════════════
 */

"use server";

import { cookies } from "next/headers";
import { ActionState } from "@/lib/types/actions";
import { actionLogger, apiLogger, errorLogger } from "@/lib/logger";
import { config } from "@/lib/config/env";
import {
  NotificacionResponse,
  NotificacionMasivaResponse,
  EnviarNotificacionRequest,
  EnviarNotificacionMasivaRequest,
  AlertaClimaRequest,
  AlertaPermisosRequest,
  EstadoServicioWhatsApp,
  EstadoServicioEmail,
  EstadoServiciosNotificaciones,
  PlantillaMensaje,
  EstadoMensajeResponse,
} from "@/lib/types/notificaciones";

const API_URL = config.api.baseUrl;
const isDevelopment = process.env.NODE_ENV === "development";
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

    try {
      const responseData = await response.json();
      if (responseData.status === "success" && responseData.data?.accessToken) {
        newAccessToken = responseData.data.accessToken;
      }
    } catch {
      return false;
    }

    try {
      const setCookieHeaders = response.headers.getSetCookie?.() || [];

      for (const cookieHeader of setCookieHeaders) {
        const [cookiePart] = cookieHeader.split(";");
        const [name, value] = cookiePart.split("=");

        if (name === config.storage.tokenKey && value) {
          newAccessToken = value;
          break;
        }
      }
    } catch {
      // Ignorar errores al leer Set-Cookie
    }

    if (newAccessToken) {
      cookieStore.set(config.storage.tokenKey, newAccessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
        path: "/",
        maxAge: process.env.NODE_ENV === "production" ? 60 * 15 : 10,
      });
      return true;
    }

    return false;
  } catch {
    return false;
  }
}

/**
 * Función auxiliar para hacer peticiones autenticadas con auto-renovación de token
 */
async function apiRequest(
  endpoint: string,
  options: RequestInit = {},
  retryCount = 0
) {
  const url = `${API_URL}${endpoint}`;

  const headers = new Headers(options.headers);

  const cookieStore = await cookies();
  let accessToken = cookieStore.get(config.storage.tokenKey)?.value;
  const refreshToken = cookieStore.get(config.storage.refreshTokenKey)?.value;

  if (!accessToken && refreshToken && retryCount === 0) {
    const renewed = await tryRefreshToken();

    if (renewed) {
      const updatedCookieStore = await cookies();
      accessToken = updatedCookieStore.get(config.storage.tokenKey)?.value;
    } else {
      throw new Error("Sesión expirada. Por favor, inicia sesión nuevamente.");
    }
  }

  if (!accessToken) {
    throw new Error("Sesión expirada. Por favor, inicia sesión nuevamente.");
  }

  if (!(options.body instanceof FormData) && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  headers.set("Authorization", `Bearer ${accessToken}`);

  const cookieHeader: string[] = [];
  if (accessToken) {
    cookieHeader.push(`${config.storage.tokenKey}=${accessToken}`);
  }
  if (refreshToken) {
    cookieHeader.push(`${config.storage.refreshTokenKey}=${refreshToken}`);
  }
  if (cookieHeader.length > 0 && !headers.has("Cookie")) {
    headers.set("Cookie", cookieHeader.join("; "));
  }

  const response = await fetch(url, {
    ...options,
    headers,
  });

  const contentType = response.headers.get("content-type");
  let data: unknown = null;

  if (contentType && contentType.includes("application/json")) {
    data = await response.json();
  } else if (response.status !== 204) {
    const textData = await response.text();
    throw new Error(
      textData || `Respuesta no válida del servidor (${response.status})`
    );
  }

  if (response.status === 401 && retryCount === 0 && refreshToken) {
    const renewed = await tryRefreshToken();
    if (renewed) {
      return apiRequest(endpoint, options, retryCount + 1);
    }
  }

  if (!response.ok) {
    const errorMessage =
      (data as { message?: string; error?: string })?.message ||
      (data as { message?: string; error?: string })?.error ||
      `Error ${response.status}: ${response.statusText}`;
    throw new Error(errorMessage);
  }

  return data;
}

/**
 * 🔄 Normaliza el número de destino a 10 dígitos (formato MX sin prefijo)
 *
 * @param numeroReal - Número real del destinatario
 * @returns Número normalizado de 10 dígitos
 */
function obtenerNumeroDestino(numeroReal: string): string {
  const digitos = numeroReal.replace(/\D/g, "");

  if (digitos.length < 10) {
    throw new Error(
      `Número de teléfono inválido para WhatsApp: ${numeroReal} (se requieren al menos 10 dígitos)`
    );
  }

  const telefonoDestino = digitos.slice(-10);

  actionLogger.info(
    {
      numeroOriginal: numeroReal,
      telefonoDestino,
      entorno: isDevelopment ? "desarrollo" : "produccion",
    },
    "Número de destino para WhatsApp normalizado"
  );

  return telefonoDestino;
}

function sanitizarVariablesPlantilla(
  variables: Record<string, string | number>
): Record<string, string> {
  const sanitizadas: Record<string, string> = {};

  Object.entries(variables).forEach(([clave, valor]) => {
    if (valor === undefined || valor === null) {
      return;
    }

    const valorNormalizado =
      typeof valor === "number" ? valor.toString() : String(valor).trim();

    if (valorNormalizado !== "") {
      sanitizadas[clave] = valorNormalizado;
    }
  });

  return sanitizadas;
}

/**
 * Obtener estado del servicio WhatsApp
 */
export async function getEstadoServicio(): Promise<
  ActionState<EstadoServicioWhatsApp>
> {
  try {
    actionLogger.info("Verificando estado del servicio WhatsApp");

    const result = await apiRequest("/notificaciones/estado", {
      cache: "no-store",
    });
    const { data } = result as { data: EstadoServicioWhatsApp };
    actionLogger.info(
      {
        configurado: data?.configurado,
        proveedor: data?.proveedor,
      },
      "Estado del servicio obtenido exitosamente"
    );

    return {
      success: true,
      data,
    };
  } catch (error) {
    errorLogger.error(
      {
        error: error instanceof Error ? error.message : String(error),
      },
      "Error crítico al verificar estado del servicio"
    );
    return {
      success: false,
      error: error instanceof Error ? error.message : "Error desconocido",
    };
  }
}

/**
 * Enviar notificación individual
 */
export async function enviarNotificacion(
  data: EnviarNotificacionRequest
): Promise<ActionState<NotificacionResponse>> {
  try {
    actionLogger.info(
      {
        telefono: data.telefono,
        tipo: data.tipo || "recordatorio_generico",
        prioridad: data.prioridad || "media",
        template: data.template,
        variables: Object.keys(data.variables || {}),
        entorno: isDevelopment ? "desarrollo" : "produccion",
      },
      "Iniciando envío de notificación individual"
    );

    const numeroDestino = obtenerNumeroDestino(data.telefono);

    if (!data.template) {
      throw new Error("La plantilla de WhatsApp es obligatoria.");
    }

    if (!data.variables || Object.keys(data.variables).length === 0) {
      throw new Error(
        "Las variables de la plantilla de WhatsApp son requeridas."
      );
    }

    const variablesSanitizadas = sanitizarVariablesPlantilla(data.variables);

    if (Object.keys(variablesSanitizadas).length === 0) {
      throw new Error(
        "Las variables de la plantilla no pueden quedar vacías. Verifica la información capturada."
      );
    }

    apiLogger.info(
      {
        endpoint: "/notificaciones/enviar",
        method: "POST",
        numeroOriginal: data.telefono,
        numeroDestino,
      },
      "Enviando notificación al backend"
    );

    const payload = {
      telefono: numeroDestino,
      template: data.template,
      variables: variablesSanitizadas,
      tipo: data.tipo ?? "recordatorio_generico",
      prioridad: data.prioridad ?? "media",
      mensaje: data.mensaje ?? "Mensaje para el prestaor",
    };

    actionLogger.info(
      {
        endpoint: "/notificaciones/enviar",
        telefonoNormalizado: payload.telefono,
        template: payload.template,
        variables: Object.keys(payload.variables),
        tipo: payload.tipo,
        prioridad: payload.prioridad,
      },
      "Payload preparado para enviar notificación individual"
    );

    const result = await apiRequest("/notificaciones/enviar", {
      method: "POST",
      body: JSON.stringify({
        telefono: payload.telefono,
        template: payload.template,
        variables: payload.variables,
        tipo: payload.tipo,
        prioridad: payload.prioridad,
        mensaje: payload.mensaje,
      }),
    });

    console.log(" payload", payload);

    actionLogger.info(
      {
        messageId: (
          result as {
            data?: { notificacion?: NotificacionResponse };
          }
        )?.data?.notificacion?.message_id,
        estado: (result as { data?: { notificacion?: NotificacionResponse } })
          ?.data?.notificacion?.estado,
      },
      "Notificación enviada exitosamente"
    );

    return {
      success: true,
      data: (result as { data?: { notificacion?: NotificacionResponse } })?.data
        ?.notificacion,
    };
  } catch (error) {
    console.log("error", error);
    errorLogger.error(
      {
        error: error instanceof Error ? error.message : String(error),
        telefono: data.telefono,
      },
      "Error crítico al enviar notificación"
    );
    return {
      success: false,
      error: error instanceof Error ? error.message : "Error desconocido",
    };
  }
}

/**
 * Enviar notificaciones masivas
 */
export async function enviarNotificacionMasiva(
  data: EnviarNotificacionMasivaRequest
): Promise<ActionState<NotificacionMasivaResponse>> {
  try {
    actionLogger.info(
      {
        totalUsuarios: data.usuarios_ids.length,
        tipo: data.tipo || "recordatorio_generico",
        template: data.template,
        variables: Object.keys(data.variables || {}),
        entorno: isDevelopment ? "desarrollo" : "produccion",
      },
      "Iniciando envío masivo de notificaciones"
    );

    if (!data.template) {
      throw new Error(
        "La plantilla de WhatsApp es obligatoria para el envío masivo."
      );
    }

    if (!data.variables || Object.keys(data.variables).length === 0) {
      throw new Error(
        "Las variables de la plantilla de WhatsApp son requeridas para el envío masivo."
      );
    }

    const variablesSanitizadas = sanitizarVariablesPlantilla(data.variables);

    if (Object.keys(variablesSanitizadas).length === 0) {
      throw new Error(
        "Las variables de la plantilla no pueden quedar vacías. Verifica la información capturada."
      );
    }

    apiLogger.info(
      {
        endpoint: "/notificaciones/enviar-masivo",
        method: "POST",
        totalUsuarios: data.usuarios_ids.length,
      },
      "Enviando notificaciones masivas al backend"
    );

    actionLogger.info(
      {
        endpoint: "/notificaciones/enviar-masivo",
        totalDestinatarios: data.usuarios_ids.length,
        template: data.template,
        variables: Object.keys(variablesSanitizadas),
        tipo: data.tipo ?? "recordatorio_generico",
        prioridad: data.prioridad ?? "media",
      },
      "Payload preparado para envío masivo de notificaciones"
    );

    const result = await apiRequest("/notificaciones/enviar-masivo", {
      method: "POST",
      body: JSON.stringify({
        usuarios_ids: data.usuarios_ids,
        template: data.template,
        variables: variablesSanitizadas,
        tipo: data.tipo ?? "recordatorio_generico",
        prioridad: data.prioridad ?? "media",
      }),
    });
    actionLogger.info(
      {
        total: (result as { data?: NotificacionMasivaResponse })?.data?.resumen
          ?.total,
        enviados: (result as { data?: NotificacionMasivaResponse })?.data
          ?.resumen?.enviados,
        fallidos: (result as { data?: NotificacionMasivaResponse })?.data
          ?.resumen?.fallidos,
      },
      "Envío masivo completado"
    );

    return {
      success: true,
      data: (result as { data?: NotificacionMasivaResponse })?.data,
    };
  } catch (error) {
    errorLogger.error(
      {
        error: error instanceof Error ? error.message : String(error),
        totalUsuarios: data.usuarios_ids.length,
      },
      "Error crítico al enviar notificaciones masivas"
    );
    return {
      success: false,
      error: error instanceof Error ? error.message : "Error desconocido",
    };
  }
}

/**
 * Enviar alerta de clima a todos los prestadores activos
 */
export async function enviarAlertaClima(
  data: AlertaClimaRequest
): Promise<ActionState<NotificacionMasivaResponse>> {
  try {
    actionLogger.info(
      {
        estado_puerto: data.estado_puerto,
        oleaje: data.oleaje,
        viento: data.viento_velocidad,
        entorno: isDevelopment ? "desarrollo" : "produccion",
      },
      "Iniciando envío de alerta meteorológica"
    );

    actionLogger.warn(
      isDevelopment
        ? "DESARROLLO: Alerta de clima se enviará a números reales de prestadores"
        : "PRODUCCIÓN: Alerta de clima se enviará a TODOS los prestadores activos"
    );

    apiLogger.info(
      {
        endpoint: "/notificaciones/alerta-clima",
        method: "POST",
        estadoPuerto: data.estado_puerto,
      },
      "Enviando alerta de clima al backend"
    );

    const payload = { ...data };

    actionLogger.info(
      {
        endpoint: "/notificaciones/alerta-clima",
        estado_puerto: payload.estado_puerto,
        oleaje: payload.oleaje,
        viento_velocidad: payload.viento_velocidad,
      },
      "Payload preparado para alerta de clima"
    );

    const result = await apiRequest("/notificaciones/alerta-clima", {
      method: "POST",
      body: JSON.stringify(payload),
    });
    actionLogger.info(
      {
        total: (result as { data?: NotificacionMasivaResponse })?.data?.resumen
          ?.total,
        enviados: (result as { data?: NotificacionMasivaResponse })?.data
          ?.resumen?.enviados,
        fallidos: (result as { data?: NotificacionMasivaResponse })?.data
          ?.resumen?.fallidos,
      },
      "Alerta de clima enviada exitosamente"
    );

    return {
      success: true,
      data: (result as { data?: NotificacionMasivaResponse })?.data,
    };
  } catch (error) {
    errorLogger.error(
      {
        error: error instanceof Error ? error.message : String(error),
        estadoPuerto: data.estado_puerto,
      },
      "Error crítico al enviar alerta de clima"
    );
    return {
      success: false,
      error: error instanceof Error ? error.message : "Error desconocido",
    };
  }
}

/**
 * Enviar alertas de permisos próximos a vencer
 */
export async function enviarAlertaPermisos(
  data: AlertaPermisosRequest = {}
): Promise<ActionState<NotificacionMasivaResponse>> {
  try {
    const diasAnticipacion = data.dias_anticipacion || 30;

    actionLogger.info(
      {
        dias_anticipacion: diasAnticipacion,
        entorno: isDevelopment ? "desarrollo" : "produccion",
      },
      "Iniciando envío de alertas de permisos"
    );

    apiLogger.info(
      {
        endpoint: "/notificaciones/alerta-permisos",
        method: "POST",
        diasAnticipacion,
      },
      "Enviando alertas de permisos al backend"
    );

    const payload = { ...data, dias_anticipacion: diasAnticipacion };

    actionLogger.info(
      {
        endpoint: "/notificaciones/alerta-permisos",
        dias_anticipacion: payload.dias_anticipacion,
      },
      "Payload preparado para alerta de permisos"
    );

    const result = await apiRequest("/notificaciones/alerta-permisos", {
      method: "POST",
      body: JSON.stringify(payload),
    });
    actionLogger.info(
      {
        total: (result as { data?: NotificacionMasivaResponse })?.data?.resumen
          ?.total,
        enviados: (result as { data?: NotificacionMasivaResponse })?.data
          ?.resumen?.enviados,
        fallidos: (result as { data?: NotificacionMasivaResponse })?.data
          ?.resumen?.fallidos,
      },
      "Alertas de permisos enviadas exitosamente"
    );

    return {
      success: true,
      data: (result as { data?: NotificacionMasivaResponse })?.data,
    };
  } catch (error) {
    errorLogger.error(
      {
        error: error instanceof Error ? error.message : String(error),
      },
      "Error crítico al enviar alertas de permisos"
    );
    return {
      success: false,
      error: error instanceof Error ? error.message : "Error desconocido",
    };
  }
}

/**
 * Obtener plantillas de mensajes predefinidas
 */
export async function getPlantillas(): Promise<
  ActionState<PlantillaMensaje[]>
> {
  try {
    actionLogger.info("Obteniendo plantillas de mensajes");

    apiLogger.info(
      {
        endpoint: "/notificaciones/plantillas",
        method: "GET",
      },
      "Consultando plantillas del backend"
    );

    const result = await apiRequest("/notificaciones/plantillas", {
      cache: "no-store",
    });
    const { plantillas } = (
      result as {
        data?: { plantillas?: PlantillaMensaje[] };
      }
    ).data || { plantillas: [] };
    actionLogger.info(
      {
        totalPlantillas: plantillas?.length || 0,
      },
      "Plantillas obtenidas exitosamente"
    );

    return {
      success: true,
      data: plantillas || [],
    };
  } catch (error) {
    errorLogger.error(
      {
        error: error instanceof Error ? error.message : String(error),
      },
      "Error crítico al obtener plantillas"
    );
    return {
      success: false,
      error: error instanceof Error ? error.message : "Error desconocido",
    };
  }
}

/**
 * Verificar estado de un mensaje enviado
 */
export async function verificarEstadoMensaje(
  messageSid: string
): Promise<ActionState<EstadoMensajeResponse>> {
  try {
    actionLogger.info(
      {
        messageSid,
      },
      "Verificando estado de mensaje"
    );

    apiLogger.info(
      {
        endpoint: `/notificaciones/estado/${messageSid}`,
        method: "GET",
      },
      "Consultando estado del mensaje"
    );

    const result = await apiRequest(`/notificaciones/estado/${messageSid}`, {
      cache: "no-store",
    });
    const data = (result as { data?: EstadoMensajeResponse }).data;
    actionLogger.info(
      {
        messageSid,
        estado: data?.estado,
      },
      "Estado del mensaje obtenido exitosamente"
    );

    return {
      success: true,
      data,
    };
  } catch (error) {
    errorLogger.error(
      {
        error: error instanceof Error ? error.message : String(error),
        messageSid,
      },
      "Error crítico al verificar estado del mensaje"
    );
    return {
      success: false,
      error: error instanceof Error ? error.message : "Error desconocido",
    };
  }
}

/**
 * Obtener lista de prestadores activos con teléfonos
 */
export async function getPrestadores(): Promise<
  ActionState<{
    prestadores: import("@/lib/types/notificaciones").PrestadorSelector[];
  }>
> {
  try {
    actionLogger.info("Obteniendo lista de prestadores para notificaciones");

    apiLogger.info(
      {
        endpoint: "/usuarios",
        method: "GET",
        queryParams: { rol: "prestador", activo: "true" },
      },
      "Obteniendo prestadores del backend"
    );

    const result = await apiRequest("/usuarios?rol=prestador&activo=true", {
      cache: "no-store",
    });

    // El backend puede devolver "users" (inglés) o "usuarios" (español)
    const parsedResult = result as {
      data?:
        | {
            users?: unknown;
            usuarios?: unknown;
          }
        | unknown[];
      usuarios?: unknown;
    };
    const dataField = parsedResult.data;
    const usuarios = Array.isArray(dataField)
      ? dataField
      : Array.isArray((dataField as { users?: unknown[] } | undefined)?.users)
      ? (dataField as { users?: unknown[] }).users
      : Array.isArray(
          (dataField as { usuarios?: unknown[] } | undefined)?.usuarios
        )
      ? (dataField as { usuarios?: unknown[] }).usuarios
      : Array.isArray(parsedResult.usuarios)
      ? parsedResult.usuarios
      : [];

    /**
     * Limpia y normaliza un número de teléfono
     * Soporta formatos: "2291234567", "+52 229 123 4567", "+522291234567"
     * Retorna solo los últimos 10 dígitos o null si no es válido
     */
    const limpiarTelefono = (telefono: string | null): string | null => {
      if (!telefono) return null;

      // Remover todos los caracteres no numéricos (espacios, +, guiones, etc)
      const soloDigitos = telefono.replace(/\D/g, "");

      // Si tiene 12 dígitos y empieza con 52 (código de México), tomar los últimos 10
      if (soloDigitos.length === 12 && soloDigitos.startsWith("52")) {
        return soloDigitos.slice(2);
      }

      // Si tiene 11 dígitos y empieza con 52, tomar los últimos 10
      if (soloDigitos.length === 11 && soloDigitos.startsWith("52")) {
        return soloDigitos.slice(1);
      }

      // Si tiene exactamente 10 dígitos, usarlo directamente
      if (soloDigitos.length === 10) {
        return soloDigitos;
      }

      // Cualquier otra longitud no es válida
      return null;
    };

    // Filtrar solo prestadores con teléfono válido
    type UsuarioConTelefonoLimpio = {
      id: string;
      nombre: string;
      telefono: string | null;
      telefonoOriginal: string | null;
      telefonoLimpio: string | null;
      email: string;
      rol?: string;
      empresa?: string;
      fechaVencimientoPermiso?: string;
      estadoPermiso?: string;
    };

    const prestadoresConTelefono =
      usuarios ||
      []
        .map(
          (usuario: {
            id: string;
            nombre: string;
            telefono: string | null;
            email: string;
            rol?: string;
            empresa?: string;
            fechaVencimientoPermiso?: string;
            estadoPermiso?: string;
          }): UsuarioConTelefonoLimpio => {
            const telefonoLimpio = limpiarTelefono(usuario.telefono);

            return {
              ...usuario,
              telefonoOriginal: usuario.telefono,
              telefonoLimpio,
            };
          }
        )
        .filter((usuario: UsuarioConTelefonoLimpio): boolean => {
          // Incluir si tiene teléfono válido O email válido
          const tieneTelefono = usuario.telefonoLimpio !== null;
          const tieneEmail = Boolean(
            usuario.email && usuario.email.trim() !== ""
          );
          const esRolValido = !usuario.rol || usuario.rol === "prestador";

          // Cambio: Aceptar usuarios con teléfono O email (no solo teléfono)
          const tieneAlMenosUnContacto = tieneTelefono || tieneEmail;
          return tieneAlMenosUnContacto && esRolValido;
        })
        .map((usuario: UsuarioConTelefonoLimpio) => ({
          id: usuario.id,
          nombre: usuario.nombre,
          telefono: usuario.telefonoLimpio || "", // Si no tiene teléfono, string vacío
          email: usuario.email,
          empresa: usuario.empresa || undefined,
          fechaVencimientoPermiso: usuario.fechaVencimientoPermiso || undefined,
          estadoPermiso:
            (usuario.estadoPermiso as
              | "vigente"
              | "por_vencer"
              | "vencido"
              | undefined) || undefined,
        }));

    actionLogger.info(
      {
        totalPrestadoresFiltrados: prestadoresConTelefono.length,
        prestadoresConTelefono: prestadoresConTelefono.filter(
          (p: { telefono: string }) => p.telefono && p.telefono.trim() !== ""
        ).length,
        prestadoresSoloEmail: prestadoresConTelefono.filter(
          (p: { telefono: string; email: string }) =>
            (!p.telefono || p.telefono.trim() === "") &&
            p.email &&
            p.email.trim() !== ""
        ).length,
      },
      "Prestadores obtenidos y filtrados exitosamente"
    );

    return {
      success: true,
      data: {
        prestadores: prestadoresConTelefono,
      },
    };
  } catch (error) {
    errorLogger.error(
      {
        error: error instanceof Error ? error.message : String(error),
      },
      "Error crítico al obtener prestadores"
    );
    return {
      success: false,
      error: error instanceof Error ? error.message : "Error desconocido",
    };
  }
}

/**
 * Enviar mensaje de prueba (solo desarrollo)
 */
export async function enviarMensajePrueba(
  telefono: string
): Promise<ActionState<NotificacionResponse>> {
  try {
    if (!isDevelopment) {
      actionLogger.warn("Intento de envío de prueba en producción");
      return {
        success: false,
        error: "Función solo disponible en desarrollo",
      };
    }

    actionLogger.info(
      {
        telefono,
      },
      "Enviando mensaje de prueba"
    );

    apiLogger.info(
      {
        endpoint: "/notificaciones/test",
        method: "POST",
        telefono,
      },
      "Enviando mensaje de prueba al backend"
    );

    const result = await apiRequest("/notificaciones/test", {
      method: "POST",
      body: JSON.stringify({ telefono }),
    });
    actionLogger.info(
      {
        messageId: (
          result as { data?: { notificacion?: NotificacionResponse } }
        )?.data?.notificacion?.message_id,
      },
      "Mensaje de prueba enviado exitosamente"
    );

    return {
      success: true,
      data: (result as { data?: { notificacion?: NotificacionResponse } })?.data
        ?.notificacion,
    };
  } catch (error) {
    errorLogger.error(
      {
        error: error instanceof Error ? error.message : String(error),
        telefono,
      },
      "Error crítico al enviar mensaje de prueba"
    );
    return {
      success: false,
      error: error instanceof Error ? error.message : "Error desconocido",
    };
  }
}

// ═══════════════════════════════════════════════════════════════
// 📧 FUNCIONES PARA EMAILS
// ═══════════════════════════════════════════════════════════════

/**
 * Obtener estado del servicio Email
 */
export async function getEstadoServicioEmail(): Promise<
  ActionState<EstadoServicioEmail>
> {
  try {
    actionLogger.info("Verificando estado del servicio Email");

    apiLogger.info(
      {
        endpoint: "/emails/estado",
        method: "GET",
      },
      "Consultando estado del servicio Email"
    );

    const result = await apiRequest("/emails/estado");
    actionLogger.info(
      {
        configurado: (result as { data?: EstadoServicioEmail }).data
          ?.configurado,
        proveedor: (result as { data?: EstadoServicioEmail }).data?.proveedor,
      },
      "Estado del servicio Email obtenido exitosamente"
    );

    return {
      success: true,
      data: (result as { data?: EstadoServicioEmail }).data,
    };
  } catch (error) {
    errorLogger.error(
      {
        error: error instanceof Error ? error.message : String(error),
      },
      "Error crítico al verificar estado del servicio Email"
    );
    return {
      success: false,
      error: error instanceof Error ? error.message : "Error desconocido",
    };
  }
}

/**
 * Obtener estado consolidado de ambos servicios
 */
export async function getEstadoServicios(): Promise<
  ActionState<EstadoServiciosNotificaciones>
> {
  try {
    actionLogger.info(
      "Obteniendo estado de todos los servicios de notificaciones"
    );

    const [whatsappResult, emailResult] = await Promise.all([
      getEstadoServicio(),
      getEstadoServicioEmail(),
    ]);

    if (!whatsappResult.success || !emailResult.success) {
      return {
        success: false,
        error: "Error al obtener estado de los servicios",
      };
    }

    return {
      success: true,
      data: {
        whatsapp: whatsappResult.data!,
        email: emailResult.data!,
      },
    };
  } catch (error) {
    errorLogger.error(
      {
        error: error instanceof Error ? error.message : String(error),
      },
      "Error crítico al obtener estado de servicios"
    );
    return {
      success: false,
      error: error instanceof Error ? error.message : "Error desconocido",
    };
  }
}
