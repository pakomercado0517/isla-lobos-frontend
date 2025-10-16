/**
 * ═══════════════════════════════════════════════════════════════
 * 📧 EMAILS - SERVER ACTIONS
 * ═══════════════════════════════════════════════════════════════
 *
 * Server Actions para el sistema de notificaciones por Email
 * Maneja envíos individuales, masivos, alertas y plantillas
 *
 * ═══════════════════════════════════════════════════════════════
 */

"use server";

import { cookies } from "next/headers";
import { ActionState } from "@/lib/types/actions";
import { actionLogger, apiLogger, errorLogger } from "@/lib/logger";
import { config } from "@/lib/config/env";
import {
  EnviarEmailRequest,
  EnviarEmailMasivoRequest,
  EmailResponse,
  EmailMasivoResponse,
  AlertaClimaEmailRequest,
  AlertaPermisosEmailRequest,
  EstadoServicioEmail,
  PlantillaEmail,
} from "@/lib/types/notificaciones";

const API_URL = config.api.baseUrl;

/**
 * Enviar email individual
 */
export async function enviarEmail(
  data: EnviarEmailRequest
): Promise<ActionState<EmailResponse>> {
  try {
    actionLogger.info(
      {
        email: data.email,
        tipo: data.tipo,
        prioridad: data.prioridad,
      },
      "Iniciando envío de email individual"
    );

    const cookieStore = await cookies();
    const token = cookieStore.get(config.storage.tokenKey)?.value;
    if (!token) {
      actionLogger.warn("Intento de envío de email sin autenticación");
      return {
        success: false,
        error: "No autenticado",
      };
    }

    apiLogger.info(
      {
        endpoint: "/emails/enviar",
        method: "POST",
        email: data.email,
      },
      "Enviando email al backend"
    );

    const response = await fetch(`${API_URL}/emails/enviar`, {
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
        "Error al enviar email"
      );
      return {
        success: false,
        error: errorData.message || "Error al enviar email",
      };
    }

    const result = await response.json();

    // Manejar diferentes estructuras de respuesta del backend
    const notificacion = result.data?.notificacion || result.data || result;

    actionLogger.info(
      {
        messageId: notificacion?.message_id || "N/A",
        estado: notificacion?.estado || "enviado",
      },
      "Email enviado exitosamente"
    );

    return {
      success: true,
      data: notificacion || {
        success: true,
        email: data.email,
        estado: "enviado",
        fecha_envio: new Date().toISOString(),
      },
    };
  } catch (error) {
    errorLogger.error(
      {
        error: error instanceof Error ? error.message : String(error),
        email: data.email,
      },
      "Error crítico al enviar email"
    );
    return {
      success: false,
      error: error instanceof Error ? error.message : "Error desconocido",
    };
  }
}

/**
 * Enviar emails masivos
 */
export async function enviarEmailMasivo(
  data: EnviarEmailMasivoRequest
): Promise<ActionState<EmailMasivoResponse>> {
  try {
    actionLogger.info(
      {
        cantidadUsuarios: data.usuarios_ids.length,
        tipo: data.tipo,
      },
      "Iniciando envío masivo de emails"
    );

    const cookieStore = await cookies();
    const token = cookieStore.get(config.storage.tokenKey)?.value;
    if (!token) {
      actionLogger.warn("Intento de envío masivo de emails sin autenticación");
      return {
        success: false,
        error: "No autenticado",
      };
    }

    apiLogger.info(
      {
        endpoint: "/emails/enviar-masivo",
        method: "POST",
        usuarios: data.usuarios_ids.length,
      },
      "Enviando emails masivos al backend"
    );

    const response = await fetch(`${API_URL}/emails/enviar-masivo`, {
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
        "Error al enviar emails masivos"
      );
      return {
        success: false,
        error: errorData.message || "Error al enviar emails masivos",
      };
    }

    const result = await response.json();

    // Manejar diferentes estructuras de respuesta
    const datos = result.data || result;
    const resumen = datos.resumen || { total: 0, enviados: 0, fallidos: 0 };

    actionLogger.info(
      {
        total: resumen.total,
        enviados: resumen.enviados,
        fallidos: resumen.fallidos,
      },
      "Emails masivos procesados exitosamente"
    );

    return {
      success: true,
      data: datos,
    };
  } catch (error) {
    errorLogger.error(
      {
        error: error instanceof Error ? error.message : String(error),
        usuarios: data.usuarios_ids.length,
      },
      "Error crítico al enviar emails masivos"
    );
    return {
      success: false,
      error: error instanceof Error ? error.message : "Error desconocido",
    };
  }
}

/**
 * Enviar alerta meteorológica por email
 */
export async function enviarAlertaClimaEmail(
  data: AlertaClimaEmailRequest
): Promise<ActionState<EmailMasivoResponse>> {
  try {
    actionLogger.info(
      {
        estadoPuerto: data.estado_puerto,
        oleaje: data.oleaje,
        viento: data.viento_velocidad,
      },
      "Iniciando envío de alerta de clima por email"
    );

    const cookieStore = await cookies();
    const token = cookieStore.get(config.storage.tokenKey)?.value;
    if (!token) {
      actionLogger.warn(
        "Intento de envío de alerta de clima por email sin autenticación"
      );
      return {
        success: false,
        error: "No autenticado",
      };
    }

    apiLogger.info(
      {
        endpoint: "/emails/alerta-clima",
        method: "POST",
        estadoPuerto: data.estado_puerto,
      },
      "Enviando alerta de clima por email al backend"
    );

    const response = await fetch(`${API_URL}/emails/alerta-clima`, {
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
        "Error al enviar alerta de clima por email"
      );
      return {
        success: false,
        error: errorData.message || "Error al enviar alerta de clima por email",
      };
    }

    const result = await response.json();

    // Manejar diferentes estructuras de respuesta
    const datos = result.data || result;
    const resumen = datos.resumen || { total: 0, enviados: 0, fallidos: 0 };

    actionLogger.info(
      {
        total: resumen.total,
        enviados: resumen.enviados,
        fallidos: resumen.fallidos,
      },
      "Alerta de clima por email enviada exitosamente"
    );

    return {
      success: true,
      data: datos,
    };
  } catch (error) {
    errorLogger.error(
      {
        error: error instanceof Error ? error.message : String(error),
        estadoPuerto: data.estado_puerto,
      },
      "Error crítico al enviar alerta de clima por email"
    );
    return {
      success: false,
      error: error instanceof Error ? error.message : "Error desconocido",
    };
  }
}

/**
 * Enviar alertas de permisos por email
 */
export async function enviarAlertaPermisosEmail(
  data: AlertaPermisosEmailRequest = {}
): Promise<ActionState<EmailMasivoResponse>> {
  try {
    const diasAnticipacion = data.dias_anticipacion || 30;

    actionLogger.info(
      {
        dias_anticipacion: diasAnticipacion,
      },
      "Iniciando envío de alertas de permisos por email"
    );

    const cookieStore = await cookies();
    const token = cookieStore.get(config.storage.tokenKey)?.value;
    if (!token) {
      actionLogger.warn(
        "Intento de envío de alerta de permisos por email sin autenticación"
      );
      return {
        success: false,
        error: "No autenticado",
      };
    }

    apiLogger.info(
      {
        endpoint: "/emails/alerta-permisos",
        method: "POST",
        diasAnticipacion,
      },
      "Enviando alertas de permisos por email al backend"
    );

    const response = await fetch(`${API_URL}/emails/alerta-permisos`, {
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
        "Error al enviar alertas de permisos por email"
      );
      return {
        success: false,
        error:
          errorData.message || "Error al enviar alertas de permisos por email",
      };
    }

    const result = await response.json();

    // Manejar diferentes estructuras de respuesta
    const datos = result.data || result;
    const resumen = datos.resumen || { total: 0, enviados: 0, fallidos: 0 };

    actionLogger.info(
      {
        total: resumen.total,
        enviados: resumen.enviados,
        fallidos: resumen.fallidos,
      },
      "Alertas de permisos por email enviadas exitosamente"
    );

    return {
      success: true,
      data: datos,
    };
  } catch (error) {
    errorLogger.error(
      {
        error: error instanceof Error ? error.message : String(error),
      },
      "Error crítico al enviar alertas de permisos por email"
    );
    return {
      success: false,
      error: error instanceof Error ? error.message : "Error desconocido",
    };
  }
}

/**
 * Obtener plantillas de emails predefinidas
 */
export async function getPlantillasEmail(): Promise<
  ActionState<PlantillaEmail[]>
> {
  try {
    actionLogger.info("Obteniendo plantillas de emails");

    const cookieStore = await cookies();
    const token = cookieStore.get(config.storage.tokenKey)?.value;
    if (!token) {
      actionLogger.warn(
        "Intento de acceso a plantillas de emails sin autenticación"
      );
      return {
        success: false,
        error: "No autenticado",
      };
    }

    apiLogger.info(
      {
        endpoint: "/emails/plantillas",
        method: "GET",
      },
      "Consultando plantillas de emails desde el backend"
    );

    const response = await fetch(`${API_URL}/emails/plantillas`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      apiLogger.error(
        {
          status: response.status,
          error: errorData.message,
        },
        "Error al obtener plantillas de emails"
      );
      return {
        success: false,
        error: errorData.message || "Error al obtener plantillas de emails",
      };
    }

    const result = await response.json();

    // Manejar diferentes estructuras de respuesta
    const datos = result.data || result;
    const plantillas = datos.plantillas || datos || [];

    actionLogger.info(
      {
        total: Array.isArray(plantillas) ? plantillas.length : 0,
      },
      "Plantillas de emails obtenidas exitosamente"
    );

    return {
      success: true,
      data: Array.isArray(plantillas) ? plantillas : [],
    };
  } catch (error) {
    errorLogger.error(
      {
        error: error instanceof Error ? error.message : String(error),
      },
      "Error crítico al obtener plantillas de emails"
    );
    return {
      success: false,
      error: error instanceof Error ? error.message : "Error desconocido",
    };
  }
}

/**
 * Obtener estado del servicio Email
 */
export async function getEstadoServicioEmail(): Promise<
  ActionState<EstadoServicioEmail>
> {
  try {
    actionLogger.info("Verificando estado del servicio Email");

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
        endpoint: "/emails/estado",
        method: "GET",
      },
      "Consultando estado del servicio Email"
    );

    const response = await fetch(`${API_URL}/emails/estado`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      apiLogger.error(
        {
          status: response.status,
          error: errorData.message,
        },
        "Error al obtener estado del servicio Email"
      );
      return {
        success: false,
        error: errorData.message || "Error al obtener estado del servicio",
      };
    }

    const result = await response.json();

    // Manejar diferentes estructuras de respuesta
    const datos = result.data || result;

    actionLogger.info(
      {
        configurado: datos.configurado ?? false,
        proveedor: datos.proveedor || "Desconocido",
      },
      "Estado del servicio Email obtenido exitosamente"
    );

    return {
      success: true,
      data: {
        configurado: datos.configurado ?? false,
        proveedor: datos.proveedor || "Email Service",
        emailRemitente: datos.emailRemitente || datos.email_remitente,
      },
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
