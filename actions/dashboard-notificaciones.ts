"use server";

import { cookies } from "next/headers";
import { ActionState } from "@/lib/types/actions";
import { actionLogger, apiLogger, errorLogger } from "@/lib/logger";
import { config } from "@/lib/config/env";
import {
  NotificacionDashboard,
  NotificacionesResponse,
  ContadorNotificacionesResponse,
  MarcarLeidaResponse,
} from "@/lib/types/dashboard-notificaciones";

const API_URL = config.api.baseUrl;

/**
 * Obtener todas las notificaciones no leídas del usuario CONANP actual
 */
export async function getNotificacionesNoLeidas(): Promise<
  ActionState<{
    notificaciones: NotificacionDashboard[];
    total: number;
    no_leidas: number;
  }>
> {
  try {
    actionLogger.info("Obteniendo notificaciones no leídas del dashboard");

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
        endpoint: "/dashboard/notificaciones",
        method: "GET",
      },
      "Consultando notificaciones del backend"
    );

    const response = await fetch(`${API_URL}/dashboard/notificaciones`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      cache: "no-store",
    });

    if (!response.ok) {
      const errorData = (await response.json()) as { message?: string };
      apiLogger.error(
        {
          status: response.status,
          error: errorData.message,
        },
        "Error al obtener notificaciones"
      );
      return {
        success: false,
        error: errorData.message || "Error al obtener notificaciones",
      };
    }

    const result = (await response.json()) as NotificacionesResponse;

    if (result.status !== "success" || !result.data) {
      return {
        success: false,
        error: result.message || "Error al obtener notificaciones",
      };
    }

    actionLogger.info(
      {
        total: result.data.total,
        no_leidas: result.data.no_leidas,
      },
      "Notificaciones obtenidas exitosamente"
    );

    return {
      success: true,
      data: {
        notificaciones: result.data.notificaciones,
        total: result.data.total,
        no_leidas: result.data.no_leidas,
      },
    };
  } catch (error) {
    errorLogger.error(
      {
        error: error instanceof Error ? error.message : String(error),
      },
      "Error crítico al obtener notificaciones"
    );
    return {
      success: false,
      error: error instanceof Error ? error.message : "Error desconocido",
    };
  }
}

/**
 * Obtener solo el contador de notificaciones no leídas
 */
export async function getContadorNotificaciones(): Promise<
  ActionState<{ no_leidas: number }>
> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(config.storage.tokenKey)?.value;
    if (!token) {
      return {
        success: false,
        error: "No autenticado",
      };
    }

    const response = await fetch(
      `${API_URL}/dashboard/notificaciones/contador`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        cache: "no-store",
      }
    );

    if (!response.ok) {
      const errorData = (await response.json()) as { message?: string };
      return {
        success: false,
        error: errorData.message || "Error al obtener contador",
      };
    }

    const result = (await response.json()) as ContadorNotificacionesResponse;

    if (result.status !== "success" || !result.data) {
      return {
        success: false,
        error: result.message || "Error al obtener contador",
      };
    }

    return {
      success: true,
      data: {
        no_leidas: result.data.no_leidas,
      },
    };
  } catch (error) {
    errorLogger.error(
      {
        error: error instanceof Error ? error.message : String(error),
      },
      "Error crítico al obtener contador de notificaciones"
    );
    return {
      success: false,
      error: error instanceof Error ? error.message : "Error desconocido",
    };
  }
}

/**
 * Marcar una notificación como leída
 */
export async function marcarNotificacionComoLeida(
  notificacionId: string
): Promise<ActionState<void>> {
  try {
    actionLogger.info(
      {
        notificacionId,
      },
      "Marcando notificación como leída"
    );

    const cookieStore = await cookies();
    const token = cookieStore.get(config.storage.tokenKey)?.value;
    if (!token) {
      actionLogger.warn("Intento de marcar notificación sin autenticación");
      return {
        success: false,
        error: "No autenticado",
      };
    }

    apiLogger.info(
      {
        endpoint: `/dashboard/notificaciones/${notificacionId}/leer`,
        method: "PUT",
      },
      "Marcando notificación como leída en el backend"
    );

    const response = await fetch(
      `${API_URL}/dashboard/notificaciones/${notificacionId}/leer`,
      {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      const errorData = (await response.json()) as { message?: string };
      apiLogger.error(
        {
          status: response.status,
          error: errorData.message,
          notificacionId,
        },
        "Error al marcar notificación como leída"
      );
      return {
        success: false,
        error: errorData.message || "Error al marcar notificación como leída",
      };
    }

    const result = (await response.json()) as MarcarLeidaResponse;

    if (result.status !== "success") {
      return {
        success: false,
        error: result.message || "Error al marcar notificación como leída",
      };
    }

    actionLogger.info(
      {
        notificacionId,
      },
      "Notificación marcada como leída exitosamente"
    );

    return {
      success: true,
    };
  } catch (error) {
    errorLogger.error(
      {
        error: error instanceof Error ? error.message : String(error),
        notificacionId,
      },
      "Error crítico al marcar notificación como leída"
    );
    return {
      success: false,
      error: error instanceof Error ? error.message : "Error desconocido",
    };
  }
}

