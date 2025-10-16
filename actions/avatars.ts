"use server";

import { cookies } from "next/headers";
import { config } from "@/lib/config/env";
import { revalidatePath, revalidateTag } from "next/cache";
import {
  UploadAvatarResponse,
  DeleteAvatarResponse,
  GenerateDefaultAvatarResponse,
  AvatarInfoResponse,
  AvatarStatsResponse,
  AvatarHealthResponse,
  User,
  AvatarInfo,
  AvatarStats,
} from "@/lib/types/auth";

// Función auxiliar para hacer peticiones al backend
async function apiRequest(endpoint: string, options: RequestInit = {}) {
  const url = `${config.api.baseUrl}${endpoint}`;

  const defaultHeaders: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string>),
  };

  // Obtener token de las cookies si existe
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
      throw new Error(
        data.message || `Error ${response.status}: ${response.statusText}`
      );
    }

    return data;
  } catch (error) {
    // Log del error para debugging
    console.error(`API Request failed for ${endpoint}:`, error);
    throw error;
  }
}

// Función auxiliar para hacer peticiones con FormData (para archivos)
async function apiRequestFormData(endpoint: string, formData: FormData) {
  const url = `${config.api.baseUrl}${endpoint}`;

  // Obtener token de las cookies si existe
  const cookieStore = await cookies();
  const token = cookieStore.get(config.storage.tokenKey)?.value;

  const headers: Record<string, string> = {};

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  try {
    const response = await fetch(url, {
      method: "POST",
      headers,
      body: formData,
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        data.message || `Error ${response.status}: ${response.statusText}`
      );
    }

    return data;
  } catch (error) {
    // Log del error para debugging
    console.error(`API FormData Request failed for ${endpoint}:`, error);
    throw error;
  }
}

// Estados para las acciones de avatares
export interface AvatarActionState {
  success: boolean;
  message?: string;
  error?: string;
  data?: {
    user?: User;
    avatar_url?: string;
    avatar_info?: AvatarInfo;
    stats?: AvatarStats;
    health?: {
      cloudinary_connected: boolean;
      service_status: "healthy" | "degraded" | "down";
    };
  };
}

// SUBIR AVATAR
export async function uploadAvatarAction(
  prevState: AvatarActionState,
  formData: FormData
): Promise<AvatarActionState> {
  try {
    const imageFile = formData.get("image") as File;

    if (!imageFile || imageFile.size === 0) {
      return {
        success: false,
        error: "Por favor selecciona una imagen válida",
      };
    }

    // Validar tipo de archivo
    const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
    if (!allowedTypes.includes(imageFile.type)) {
      return {
        success: false,
        error: "Solo se permiten archivos JPG, PNG o WebP",
      };
    }

    // Validar tamaño del archivo (máximo 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (imageFile.size > maxSize) {
      return {
        success: false,
        error: "El archivo no puede ser mayor a 5MB",
      };
    }

    // Crear FormData para enviar el archivo
    const uploadFormData = new FormData();
    uploadFormData.append("image", imageFile);

    // Hacer petición al backend
    const response: UploadAvatarResponse = await apiRequestFormData(
      "/avatars/upload",
      uploadFormData
    );

    if (response.status === "error") {
      return {
        success: false,
        error: response.error || "Error al subir el avatar",
      };
    }

    // Revalidar las páginas de perfil y tags relacionados
    revalidatePath("/prestador/perfil");
    revalidatePath("/dashboard/perfil");
    revalidateTag("user-profile");
    revalidateTag("user-avatar");

    return {
      success: true,
      message: "Avatar actualizado exitosamente",
      data: {
        user: response.data?.user,
        avatar_url:
          response.data?.avatar?.url || response.data?.user?.avatar_url,
      },
    };
  } catch (error) {
    console.error("Error en uploadAvatarAction:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Error al subir avatar",
    };
  }
}

// ELIMINAR AVATAR
export async function deleteAvatarAction(): Promise<AvatarActionState> {
  try {
    const response: DeleteAvatarResponse = await apiRequest("/avatars", {
      method: "DELETE",
    });

    if (response.status === "error") {
      return {
        success: false,
        error: response.error || "Error al eliminar el avatar",
      };
    }

    // Revalidar las páginas de perfil y tags relacionados
    revalidatePath("/prestador/perfil");
    revalidatePath("/dashboard/perfil");
    revalidateTag("user-profile");
    revalidateTag("user-avatar");

    return {
      success: true,
      message: "Avatar eliminado exitosamente",
      data: {
        user: response.data?.user,
      },
    };
  } catch (error) {
    console.error("Error en deleteAvatarAction:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Error al eliminar avatar",
    };
  }
}

// GENERAR AVATAR POR DEFECTO
export async function generateDefaultAvatarAction(
  _prevState: AvatarActionState,
  _formData: FormData
): Promise<AvatarActionState> {
  try {
    const response: GenerateDefaultAvatarResponse = await apiRequest(
      "/avatars/generate-default",
      {
        method: "POST",
      }
    );

    if (response.status === "error") {
      return {
        success: false,
        error: response.error || "Error al generar avatar por defecto",
      };
    }

    // Revalidar las páginas de perfil y tags relacionados
    revalidatePath("/prestador/perfil");
    revalidatePath("/dashboard/perfil");
    revalidateTag("user-profile");
    revalidateTag("user-avatar");

    return {
      success: true,
      message: "Avatar por defecto generado exitosamente",
      data: {
        user: response.data?.user,
        avatar_url:
          response.data?.avatar?.url || response.data?.user?.avatar_url,
      },
    };
  } catch (error) {
    console.error("Error en generateDefaultAvatarAction:", error);
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Error al generar avatar por defecto",
    };
  }
}

// OBTENER INFORMACIÓN DEL AVATAR
export async function getAvatarInfoAction(): Promise<AvatarActionState> {
  try {
    const response: AvatarInfoResponse = await apiRequest("/avatars/info");

    if (response.status === "error") {
      return {
        success: false,
        error: response.error || "Error al obtener información del avatar",
      };
    }

    return {
      success: true,
      message: "Información del avatar obtenida exitosamente",
      data: {
        avatar_info: response.data,
      },
    };
  } catch (error) {
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Error al obtener información del avatar",
    };
  }
}

// OBTENER ESTADÍSTICAS DE AVATARES (Solo CONANP)
export async function getAvatarStatsAction(): Promise<AvatarActionState> {
  try {
    const response: AvatarStatsResponse = await apiRequest("/avatars/stats");

    if (response.status === "error") {
      return {
        success: false,
        error: response.error || "Error al obtener estadísticas de avatares",
      };
    }

    return {
      success: true,
      message: "Estadísticas de avatares obtenidas exitosamente",
      data: {
        stats: response.data,
      },
    };
  } catch (error) {
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Error al obtener estadísticas de avatares",
    };
  }
}

// VERIFICAR SALUD DEL SERVICIO DE AVATARES
export async function getAvatarHealthAction(): Promise<AvatarActionState> {
  try {
    const response: AvatarHealthResponse = await apiRequest("/avatars/health");

    if (response.status === "error") {
      return {
        success: false,
        error: response.error || "Error al verificar salud del servicio",
      };
    }

    return {
      success: true,
      message: "Salud del servicio verificada exitosamente",
      data: {
        health: response.data,
      },
    };
  } catch (error) {
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Error al verificar salud del servicio",
    };
  }
}
