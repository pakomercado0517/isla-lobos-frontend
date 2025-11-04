"use server";

import { cookies } from "next/headers";
import { config } from "@/lib/config/env";
import { actionLogger, apiLogger, errorLogger } from "@/lib/logger";
import {
  CrearInvitacionRequest,
  CrearInvitacionResponse,
  ListarInvitacionesResponse,
  ListarInvitacionesParams,
  ValidarInvitacionResponse,
  EstadisticasInvitacionesResponse,
} from "@/lib/types/invitaciones";

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

/**
 * Función auxiliar para hacer peticiones al backend con autenticación y auto-renovación de tokens
 */
async function apiRequest(
  endpoint: string,
  options: RequestInit = {},
  retryCount = 0
) {
  const url = `${config.api.baseUrl}${endpoint}`;

  apiLogger.info(
    {
      endpoint,
      method: options.method || "GET",
    },
    "API Request iniciado"
  );

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

  try {
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
      apiLogger.error(
        {
          endpoint,
          status: response.status,
          errorMessage: data.message,
        },
        "API Request falló"
      );

      throw new Error(data.message || "Error en la petición");
    }

    apiLogger.info(
      {
        endpoint,
        status: response.status,
      },
      "API Request exitoso"
    );

    return data;
  } catch (error) {
    errorLogger.error(
      {
        endpoint,
        error: error instanceof Error ? error.message : String(error),
      },
      "Error en fetch"
    );

    throw error;
  }
}

/**
 * Crear una nueva invitación
 * Si se proporciona email, el backend enviará automáticamente un correo
 */
export async function crearInvitacion(
  datos: CrearInvitacionRequest
): Promise<CrearInvitacionResponse> {
  const requestId = crypto.randomUUID();

  actionLogger.info(
    {
      requestId,
      codigo: datos.codigo,
      conEmail: !!datos.email,
    },
    "Creando invitación"
  );

  try {
    // Validaciones básicas
    if (!datos.codigo || datos.codigo.trim().length === 0) {
      return {
        success: false,
        error: "El código de invitación es requerido",
      };
    }

    // Email y nombre ahora son siempre requeridos
    if (!datos.email || datos.email.trim().length === 0) {
      return {
        success: false,
        error: "El email del destinatario es requerido",
      };
    }

    if (!datos.nombre || datos.nombre.trim().length === 0) {
      return {
        success: false,
        error: "El nombre del destinatario es requerido",
      };
    }

    // Preparar payload (email y nombre ahora siempre incluidos)
    const payload: CrearInvitacionRequest = {
      codigo: datos.codigo.trim().toUpperCase(),
      email: datos.email.trim(),
      nombre: datos.nombre.trim(),
      ...(datos.rol && { rol: datos.rol }),
      ...(datos.fecha_expiracion && {
        fecha_expiracion: datos.fecha_expiracion,
      }),
    };

    const response = await apiRequest("/invitaciones", {
      method: "POST",
      body: JSON.stringify(payload),
    });

    actionLogger.info(
      {
        requestId,
        invitacionId: response.data?.invitacion?.id,
        emailEnviado: response.data?.email_enviado,
      },
      "Invitación creada exitosamente"
    );

    return {
      success: true,
      message: response.message || "Invitación creada exitosamente",
      data: response.data,
    };
  } catch (error) {
    errorLogger.error(
      {
        requestId,
        error: error instanceof Error ? error.message : String(error),
      },
      "Error al crear invitación"
    );

    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Error al crear invitación",
    };
  }
}

/**
 * Listar invitaciones con paginación y filtros
 */
export async function listarInvitaciones(
  params?: ListarInvitacionesParams
): Promise<ListarInvitacionesResponse> {
  const requestId = crypto.randomUUID();

  actionLogger.info(
    {
      requestId,
      params,
    },
    "Listando invitaciones"
  );

  try {
    // Construir query params
    const queryParams = new URLSearchParams();

    if (params?.page) {
      queryParams.append("page", params.page.toString());
    }
    if (params?.limit) {
      queryParams.append("limit", params.limit.toString());
    }
    if (params?.usada !== undefined) {
      queryParams.append("usada", params.usada.toString());
    }

    const endpoint = `/invitaciones${
      queryParams.toString() ? `?${queryParams.toString()}` : ""
    }`;

    const response = await apiRequest(endpoint, {
      method: "GET",
    });

    actionLogger.info(
      {
        requestId,
        total: response.data?.invitaciones?.length || 0,
      },
      "Invitaciones listadas exitosamente"
    );

    return {
      success: true,
      message: response.message || "Invitaciones obtenidas exitosamente",
      data: response.data,
    };
  } catch (error) {
    errorLogger.error(
      {
        requestId,
        error: error instanceof Error ? error.message : String(error),
      },
      "Error al listar invitaciones"
    );

    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Error al listar invitaciones",
    };
  }
}

/**
 * Validar un código de invitación (endpoint público)
 */
export async function validarInvitacion(
  codigo: string
): Promise<ValidarInvitacionResponse> {
  const requestId = crypto.randomUUID();

  actionLogger.info(
    {
      requestId,
      codigo,
    },
    "Validando código de invitación"
  );

  try {
    if (!codigo || codigo.trim().length === 0) {
      return {
        success: false,
        error: "El código de invitación es requerido",
        data: {
          valida: false,
          razon: "Código vacío",
        },
      };
    }

    const response = await apiRequest(
      `/invitaciones/validar/${codigo.trim()}`,
      {
        method: "GET",
      }
    );

    actionLogger.info(
      {
        requestId,
        valida: response.data?.valida,
      },
      "Código validado"
    );

    return {
      success: true,
      message: response.message || "Código validado",
      data: response.data,
    };
  } catch (error) {
    errorLogger.error(
      {
        requestId,
        codigo,
        error: error instanceof Error ? error.message : String(error),
      },
      "Error al validar invitación"
    );

    const errorMessage =
      error instanceof Error ? error.message : "Error al validar invitación";

    return {
      success: false,
      error: errorMessage,
      data: {
        valida: false,
        razon: errorMessage,
      },
    };
  }
}

/**
 * Obtener estadísticas de invitaciones
 */
export async function getEstadisticasInvitaciones(): Promise<EstadisticasInvitacionesResponse> {
  const requestId = crypto.randomUUID();

  actionLogger.info(
    {
      requestId,
    },
    "Obteniendo estadísticas de invitaciones"
  );

  try {
    const response = await apiRequest("/invitaciones/estadisticas", {
      method: "GET",
    });

    actionLogger.info(
      {
        requestId,
      },
      "Estadísticas obtenidas exitosamente"
    );

    return {
      success: true,
      message: response.message || "Estadísticas obtenidas exitosamente",
      data: response.data,
    };
  } catch (error) {
    errorLogger.error(
      {
        requestId,
        error: error instanceof Error ? error.message : String(error),
      },
      "Error al obtener estadísticas"
    );

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
 * Eliminar una invitación
 */
export async function eliminarInvitacion(
  id: string
): Promise<{ success: boolean; message?: string; error?: string }> {
  const requestId = crypto.randomUUID();

  actionLogger.info(
    {
      requestId,
      invitacionId: id,
    },
    "Eliminando invitación"
  );

  try {
    if (!id || id.trim().length === 0) {
      return {
        success: false,
        error: "El ID de la invitación es requerido",
      };
    }

    const response = await apiRequest(`/invitaciones/${id}`, {
      method: "DELETE",
    });

    actionLogger.info(
      {
        requestId,
        invitacionId: id,
      },
      "Invitación eliminada exitosamente"
    );

    return {
      success: true,
      message: response.message || "Invitación eliminada exitosamente",
    };
  } catch (error) {
    errorLogger.error(
      {
        requestId,
        invitacionId: id,
        error: error instanceof Error ? error.message : String(error),
      },
      "Error al eliminar invitación"
    );

    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Error al eliminar invitación",
    };
  }
}
