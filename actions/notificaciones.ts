/**
 * ═══════════════════════════════════════════════════════════════
 * 📱 NOTIFICACIONES WHATSAPP - SERVER ACTIONS
 * ═══════════════════════════════════════════════════════════════
 *
 * 🔧 CONFIGURACIÓN DE ENTORNOS:
 *
 * DESARROLLO (NODE_ENV=development):
 * - Todos los mensajes se envían a NEXT_PUBLIC_TWILIO_TEST_NUMBER
 * - Usado para pruebas con Twilio Sandbox
 * - Los logs muestran el destinatario real y el de prueba
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
  PlantillaMensaje,
  EstadoMensajeResponse,
} from "@/lib/types/notificaciones";

const API_URL = config.api.baseUrl;
const isDevelopment = process.env.NODE_ENV === "development";
const numeroTest = process.env.NEXT_PUBLIC_TWILIO_TEST_NUMBER;

/**
 * 🔄 Determina el número de destino según el entorno
 * En desarrollo usa NEXT_PUBLIC_TWILIO_TEST_NUMBER
 * En producción usa el número real
 *
 * @param numeroReal - Número real del destinatario
 * @returns Número a usar en el envío
 */
function obtenerNumeroDestino(numeroReal: string): string {
  if (isDevelopment && numeroTest) {
    actionLogger.info(
      {
        numeroReal,
        numeroTest,
        entorno: "desarrollo",
      },
      "Usando número de prueba para desarrollo"
    );
    return numeroTest;
  }

  actionLogger.info(
    {
      numeroReal,
      entorno: "produccion",
    },
    "Usando número real del destinatario"
  );
  return numeroReal;
}

/**
 * Obtener estado del servicio WhatsApp
 */
export async function getEstadoServicio(): Promise<
  ActionState<EstadoServicioWhatsApp>
> {
  try {
    actionLogger.info("Verificando estado del servicio WhatsApp");

    const cookieStore = await cookies();
    const token = cookieStore.get(config.storage.tokenKey)?.value;
    if (!token) {
      actionLogger.warn("Intento de acceso sin autenticación");
      return {
        success: false,
        error: "No autenticado",
      };
    }

    apiLogger.info(
      {
        endpoint: "/notificaciones/estado",
        method: "GET",
      },
      "Consultando estado del servicio"
    );

    const response = await fetch(`${API_URL}/notificaciones/estado`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    });

    if (!response.ok) {
      const errorData = await response.json();
      apiLogger.error(
        {
          status: response.status,
          error: errorData.message,
        },
        "Error al verificar estado del servicio"
      );
      return {
        success: false,
        error: errorData.message || "Error al verificar estado del servicio",
      };
    }

    const result = await response.json();
    actionLogger.info(
      {
        configurado: result.data.configurado,
        proveedor: result.data.proveedor,
      },
      "Estado del servicio obtenido exitosamente"
    );

    return {
      success: true,
      data: result.data,
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
        caracteresMsg: data.mensaje.length,
        entorno: isDevelopment ? "desarrollo" : "produccion",
      },
      "Iniciando envío de notificación individual"
    );

    const cookieStore = await cookies();
    const token = cookieStore.get(config.storage.tokenKey)?.value;
    if (!token) {
      actionLogger.warn("Intento de envío sin autenticación");
      return {
        success: false,
        error: "No autenticado",
      };
    }

    const numeroDestino = obtenerNumeroDestino(data.telefono);

    apiLogger.info(
      {
        endpoint: "/notificaciones/enviar",
        method: "POST",
        numeroOriginal: data.telefono,
        numeroDestino,
      },
      "Enviando notificación al backend"
    );

    const response = await fetch(`${API_URL}/notificaciones/enviar`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        ...data,
        telefono: numeroDestino,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      apiLogger.error(
        {
          status: response.status,
          error: errorData.message,
        },
        "Error al enviar notificación"
      );
      return {
        success: false,
        error: errorData.message || "Error al enviar notificación",
      };
    }

    const result = await response.json();
    actionLogger.info(
      {
        messageId: result.data.notificacion.message_id,
        estado: result.data.notificacion.estado,
      },
      "Notificación enviada exitosamente"
    );

    return {
      success: true,
      data: result.data.notificacion,
    };
  } catch (error) {
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
        caracteresMsg: data.mensaje.length,
        entorno: isDevelopment ? "desarrollo" : "produccion",
      },
      "Iniciando envío masivo de notificaciones"
    );

    if (isDevelopment && numeroTest) {
      actionLogger.warn(
        {
          numeroTest,
          totalUsuarios: data.usuarios_ids.length,
        },
        "MODO DESARROLLO: Todos los mensajes se enviarán al número de prueba"
      );
    }

    const cookieStore = await cookies();
    const token = cookieStore.get(config.storage.tokenKey)?.value;
    if (!token) {
      actionLogger.warn("Intento de envío masivo sin autenticación");
      return {
        success: false,
        error: "No autenticado",
      };
    }

    apiLogger.info(
      {
        endpoint: "/notificaciones/enviar-masivo",
        method: "POST",
        totalUsuarios: data.usuarios_ids.length,
      },
      "Enviando notificaciones masivas al backend"
    );

    const response = await fetch(`${API_URL}/notificaciones/enviar-masivo`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json();
      apiLogger.error(
        {
          status: response.status,
          error: errorData.message,
        },
        "Error al enviar notificaciones masivas"
      );
      return {
        success: false,
        error: errorData.message || "Error al enviar notificaciones masivas",
      };
    }

    const result = await response.json();
    actionLogger.info(
      {
        total: result.data.resumen.total,
        enviados: result.data.resumen.enviados,
        fallidos: result.data.resumen.fallidos,
      },
      "Envío masivo completado"
    );

    return {
      success: true,
      data: result.data,
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

    if (isDevelopment && numeroTest) {
      actionLogger.warn(
        {
          numeroTest,
        },
        "MODO DESARROLLO: Alerta de clima se enviará al número de prueba"
      );
    } else {
      actionLogger.warn(
        "PRODUCCIÓN: Alerta de clima se enviará a TODOS los prestadores activos"
      );
    }

    const cookieStore = await cookies();
    const token = cookieStore.get(config.storage.tokenKey)?.value;
    if (!token) {
      actionLogger.warn("Intento de envío de alerta sin autenticación");
      return {
        success: false,
        error: "No autenticado",
      };
    }

    apiLogger.info(
      {
        endpoint: "/notificaciones/alerta-clima",
        method: "POST",
        estadoPuerto: data.estado_puerto,
      },
      "Enviando alerta de clima al backend"
    );

    const response = await fetch(`${API_URL}/notificaciones/alerta-clima`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json();
      apiLogger.error(
        {
          status: response.status,
          error: errorData.message,
        },
        "Error al enviar alerta de clima"
      );
      return {
        success: false,
        error: errorData.message || "Error al enviar alerta de clima",
      };
    }

    const result = await response.json();
    actionLogger.info(
      {
        total: result.data.resumen.total,
        enviados: result.data.resumen.enviados,
        fallidos: result.data.resumen.fallidos,
      },
      "Alerta de clima enviada exitosamente"
    );

    return {
      success: true,
      data: result.data,
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

    const cookieStore = await cookies();
    const token = cookieStore.get(config.storage.tokenKey)?.value;
    if (!token) {
      actionLogger.warn(
        "Intento de envío de alerta de permisos sin autenticación"
      );
      return {
        success: false,
        error: "No autenticado",
      };
    }

    apiLogger.info(
      {
        endpoint: "/notificaciones/alerta-permisos",
        method: "POST",
        diasAnticipacion,
      },
      "Enviando alertas de permisos al backend"
    );

    const response = await fetch(`${API_URL}/notificaciones/alerta-permisos`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json();
      apiLogger.error(
        {
          status: response.status,
          error: errorData.message,
        },
        "Error al enviar alertas de permisos"
      );
      return {
        success: false,
        error: errorData.message || "Error al enviar alertas de permisos",
      };
    }

    const result = await response.json();
    actionLogger.info(
      {
        total: result.data.resumen.total,
        enviados: result.data.resumen.enviados,
        fallidos: result.data.resumen.fallidos,
      },
      "Alertas de permisos enviadas exitosamente"
    );

    return {
      success: true,
      data: result.data,
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

    const cookieStore = await cookies();
    const token = cookieStore.get(config.storage.tokenKey)?.value;
    if (!token) {
      return {
        success: false,
        error: "No autenticado",
      };
    }

    apiLogger.info(
      {
        endpoint: "/notificaciones/plantillas",
        method: "GET",
      },
      "Consultando plantillas del backend"
    );

    const response = await fetch(`${API_URL}/notificaciones/plantillas`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    });

    if (!response.ok) {
      const errorData = await response.json();
      apiLogger.error(
        {
          status: response.status,
          error: errorData.message,
        },
        "Error al obtener plantillas"
      );
      return {
        success: false,
        error: errorData.message || "Error al obtener plantillas",
      };
    }

    const result = await response.json();
    actionLogger.info(
      {
        totalPlantillas: result.data.plantillas?.length || 0,
      },
      "Plantillas obtenidas exitosamente"
    );

    return {
      success: true,
      data: result.data.plantillas || [],
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

    const cookieStore = await cookies();
    const token = cookieStore.get(config.storage.tokenKey)?.value;
    if (!token) {
      return {
        success: false,
        error: "No autenticado",
      };
    }

    apiLogger.info(
      {
        endpoint: `/notificaciones/estado/${messageSid}`,
        method: "GET",
      },
      "Consultando estado del mensaje"
    );

    const response = await fetch(
      `${API_URL}/notificaciones/estado/${messageSid}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        cache: "no-store",
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      apiLogger.error(
        {
          status: response.status,
          error: errorData.message,
          messageSid,
        },
        "Error al verificar estado del mensaje"
      );
      return {
        success: false,
        error: errorData.message || "Error al verificar estado del mensaje",
      };
    }

    const result = await response.json();
    actionLogger.info(
      {
        messageSid,
        estado: result.data.estado,
      },
      "Estado del mensaje obtenido exitosamente"
    );

    return {
      success: true,
      data: result.data,
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

    const cookieStore = await cookies();
    const token = cookieStore.get(config.storage.tokenKey)?.value;
    if (!token) {
      actionLogger.warn("Intento de acceso sin autenticación");
      return {
        success: false,
        error: "No autenticado",
      };
    }

    apiLogger.info(
      {
        endpoint: "/usuarios",
        method: "GET",
        queryParams: { rol: "prestador", activo: "true" },
      },
      "Obteniendo prestadores del backend"
    );

    const response = await fetch(
      `${API_URL}/usuarios?rol=prestador&activo=true`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        cache: "no-store",
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      apiLogger.error(
        {
          status: response.status,
          error: errorData.message,
        },
        "Error al obtener prestadores"
      );
      return {
        success: false,
        error: errorData.message || "Error al obtener prestadores",
      };
    }

    const result = await response.json();

    // El backend puede devolver "users" (inglés) o "usuarios" (español)
    const usuarios =
      result.data?.users ||
      result.data?.usuarios ||
      result.usuarios ||
      (Array.isArray(result.data) ? result.data : []) ||
      (Array.isArray(result) ? result : []);

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
    };

    const prestadoresConTelefono = usuarios
      .map(
        (usuario: {
          id: string;
          nombre: string;
          telefono: string | null;
          email: string;
          rol?: string;
          empresa?: string;
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
        const tieneTelefono = usuario.telefonoLimpio !== null;
        const esRolValido = !usuario.rol || usuario.rol === "prestador";
        return tieneTelefono && esRolValido;
      })
      .map((usuario: UsuarioConTelefonoLimpio) => ({
        id: usuario.id,
        nombre: usuario.nombre,
        telefono: usuario.telefonoLimpio as string, // Ya está validado que no es null
        email: usuario.email,
        empresa: usuario.empresa || undefined,
      }));

    actionLogger.info(
      {
        total: prestadoresConTelefono.length,
      },
      "Prestadores obtenidos exitosamente"
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

    const cookieStore = await cookies();
    const token = cookieStore.get(config.storage.tokenKey)?.value;
    if (!token) {
      return {
        success: false,
        error: "No autenticado",
      };
    }

    apiLogger.info(
      {
        endpoint: "/notificaciones/test",
        method: "POST",
        telefono,
      },
      "Enviando mensaje de prueba al backend"
    );

    const response = await fetch(`${API_URL}/notificaciones/test`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ telefono }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      apiLogger.error(
        {
          status: response.status,
          error: errorData.message,
        },
        "Error al enviar mensaje de prueba"
      );
      return {
        success: false,
        error: errorData.message || "Error al enviar mensaje de prueba",
      };
    }

    const result = await response.json();
    actionLogger.info(
      {
        messageId: result.data.notificacion.message_id,
      },
      "Mensaje de prueba enviado exitosamente"
    );

    return {
      success: true,
      data: result.data.notificacion,
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
