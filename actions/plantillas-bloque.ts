"use server";

import { cookies } from "next/headers";
import { config } from "@/lib/config/env";
import {
  type CreatePlantillaBloqueData,
  type UpdatePlantillaBloqueData,
  type PlantillasBloqueFilters,
  type PlantillasBloqueResponse,
  type EstadisticasPlantillaResponse,
} from "@/lib/types/bloques";
import { type ValidationErrorItem } from "@/lib/types/api";

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
        sameSite: "lax",
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
 * Función auxiliar para hacer peticiones al backend con auto-renovación de tokens
 */
async function apiRequest(
  endpoint: string,
  options: RequestInit = {},
  retryCount = 0
) {
  const url = `${config.api.baseUrl}${endpoint}`;

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
    // Manejo mejorado de errores del backend
    let errorMessage = `Error ${response.status}: ${response.statusText}`;

    if (data) {
      // Si el backend envía errores de validación específicos
      if (data.error === "VALIDATION_ERROR" && data.data?.errors) {
        const validationErrors = data.data.errors
          .map((err: ValidationErrorItem) => {
            if (
              typeof err === "object" &&
              err !== null &&
              "field" in err &&
              "message" in err
            ) {
              return `${err.field}: ${err.message}`;
            }
            return String(err ?? "");
          })
          .join(", ");
        errorMessage = `Errores de validación: ${validationErrors}`;
      }
      // Si hay un summary más legible
      else if (data.data?.summary) {
        errorMessage = `Error de validación: ${data.data.summary}`;
      }
      // Si hay un mensaje general del backend
      else if (data.message) {
        errorMessage = data.message;
      }
      // Si es un error con detalles anidados
      else if (data.details) {
        errorMessage = `${data.message || "Error del servidor"}: ${
          data.details
        }`;
      }
    }

    throw new Error(errorMessage);
  }

  return data;
}

/**
 * Obtiene todas las plantillas de bloques
 */
export async function getPlantillasBloques(
  filters?: PlantillasBloqueFilters
): Promise<PlantillasBloqueResponse> {
  try {
    const params = new URLSearchParams({
      page: (filters?.page || 1).toString(),
      limit: (filters?.limit || 10).toString(),
      ...(filters?.activa !== undefined && {
        activa: filters.activa.toString(),
      }),
      ...(filters?.destino && { destino: filters.destino }),
    });

    const response = await apiRequest(`/plantillas-bloque?${params}`);

    return {
      success: true,
      data: response.data,
      message: response.message || "Plantillas obtenidas exitosamente",
    };
  } catch (error) {
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Error al obtener plantillas de bloques",
    };
  }
}

/**
 * Obtiene una plantilla específica por ID
 */
export async function getPlantillaBloque(
  plantillaId: number
): Promise<PlantillasBloqueResponse> {
  try {
    const response = await apiRequest(`/plantillas-bloque/${plantillaId}`);

    return {
      success: true,
      data: {
        plantilla: response.data,
      },
      message: response.message || "Plantilla obtenida exitosamente",
    };
  } catch (error) {
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Error al obtener plantilla",
    };
  }
}

/**
 * Crea una nueva plantilla de bloque
 */
export async function createPlantillaBloque(
  plantillaData: CreatePlantillaBloqueData
): Promise<PlantillasBloqueResponse> {
  try {
    const response = await apiRequest("/plantillas-bloque", {
      method: "POST",
      body: JSON.stringify(plantillaData),
    });

    return {
      success: true,
      data: {
        plantilla: response.data,
      },
      message: response.message || "Plantilla creada exitosamente",
    };
  } catch (error) {
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Error al crear plantilla de bloque",
    };
  }
}

/**
 * Actualiza una plantilla de bloque existente
 */
export async function updatePlantillaBloque(
  plantillaId: number,
  plantillaData: UpdatePlantillaBloqueData
): Promise<PlantillasBloqueResponse> {
  try {
    const response = await apiRequest(`/plantillas-bloque/${plantillaId}`, {
      method: "PUT",
      body: JSON.stringify(plantillaData),
    });

    return {
      success: true,
      data: {
        plantilla: response.data,
      },
      message: response.message || "Plantilla actualizada exitosamente",
    };
  } catch (error) {
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Error al actualizar plantilla",
    };
  }
}

/**
 * Elimina una plantilla de bloque
 */
export async function deletePlantillaBloque(
  plantillaId: number
): Promise<PlantillasBloqueResponse> {
  try {
    const response = await apiRequest(`/plantillas-bloque/${plantillaId}`, {
      method: "DELETE",
    });

    return {
      success: true,
      message: response.message || "Plantilla eliminada exitosamente",
    };
  } catch (error) {
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Error al eliminar plantilla",
    };
  }
}

/**
 * Obtiene estadísticas de uso de una plantilla
 */
export async function getEstadisticasPlantilla(
  plantillaId: number
): Promise<EstadisticasPlantillaResponse> {
  try {
    const response = await apiRequest(
      `/plantillas-bloque/${plantillaId}/estadisticas`
    );

    return {
      success: true,
      data: response.data,
      message: response.message || "Estadísticas obtenidas exitosamente",
    };
  } catch (error) {
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Error al obtener estadísticas",
    };
  }
}
