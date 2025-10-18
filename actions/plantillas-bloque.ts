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
    // Manejo mejorado de errores del backend
    let errorMessage = `Error ${response.status}: ${response.statusText}`;
    
    if (data) {
      // Si el backend envía errores de validación específicos
      if (data.error === 'VALIDATION_ERROR' && data.data?.errors) {
        const validationErrors = data.data.errors.map((err: any) => {
          if (typeof err === 'object' && err.field && err.message) {
            return `${err.field}: ${err.message}`;
          }
          return err.toString();
        }).join(', ');
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
        errorMessage = `${data.message || 'Error del servidor'}: ${data.details}`;
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
      ...(filters?.activa !== undefined && { activa: filters.activa.toString() }),
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
        error instanceof Error ? error.message : "Error al obtener plantillas de bloques",
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
        error instanceof Error ? error.message : "Error al crear plantilla de bloque",
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
        error instanceof Error ? error.message : "Error al actualizar plantilla",
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
    const response = await apiRequest(`/plantillas-bloque/${plantillaId}/estadisticas`);

    return {
      success: true,
      data: response.data,
      message: response.message || "Estadísticas obtenidas exitosamente",
    };
  } catch (error) {
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Error al obtener estadísticas",
    };
  }
}