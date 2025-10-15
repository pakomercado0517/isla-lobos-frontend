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
 * Función auxiliar para hacer peticiones al backend con autenticación
 */
async function apiRequest(endpoint: string, options: RequestInit = {}) {
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

  // Obtener token de las cookies
  const cookieStore = await cookies();
  const token = cookieStore.get(config.storage.tokenKey)?.value;

  if (token) {
    defaultHeaders["Authorization"] = `Bearer ${token}`;
  }

  try {
    const response = await fetch(url, {
      ...options,
      headers: defaultHeaders,
    });

    const data = await response.json();

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
