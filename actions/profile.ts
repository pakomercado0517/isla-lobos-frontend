"use server";

import { cookies } from "next/headers";
import { config } from "@/lib/config/env";
import { revalidatePath } from "next/cache";
import { clientLogger } from "@/lib/logger-client";

// Tipos para las acciones del perfil
export interface ProfileState {
  success: boolean;
  message?: string;
  error?: string;
  data?: {
    user?: {
      id: string;
      nombre: string;
      email: string;
      telefono: string;
      rol: "conanp" | "prestador";
      activo: boolean;
      avatar?: string;
      fechaVencimientoPermiso?: string;
      estadoPermiso?: string;
      diasNotificacion?: number;
      createdAt: string;
      updatedAt: string;
    };
  };
}

export interface ChangePasswordState {
  success: boolean;
  message?: string;
  error?: string;
}

export interface UploadAvatarState {
  success: boolean;
  message?: string;
  error?: string;
  data?: {
    avatarUrl?: string;
  };
}

export interface UpdatePhoneState {
  success: boolean;
  message?: string;
  error?: string;
  data?: {
    telefono?: string;
  };
}

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

    // Verificar si la respuesta es JSON válido
    const contentType = response.headers.get("content-type");
    let data;

    if (contentType && contentType.includes("application/json")) {
      data = await response.json();
    } else {
      // Si no es JSON, leer como texto
      const textData = await response.text();
      throw new Error(`Respuesta no válida del servidor: ${textData}`);
    }

    if (!response.ok) {
      throw new Error(
        data.message || `Error ${response.status}: ${response.statusText}`
      );
    }

    return data;
  } catch (error) {
    // Log del error para debugging
    clientLogger.error(`API Request failed for ${endpoint}:`, error);
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

    // Verificar si la respuesta es JSON válido
    const contentType = response.headers.get("content-type");
    let data;

    if (contentType && contentType.includes("application/json")) {
      data = await response.json();
    } else {
      // Si no es JSON, leer como texto
      const textData = await response.text();
      throw new Error(`Respuesta no válida del servidor: ${textData}`);
    }

    if (!response.ok) {
      throw new Error(
        data.message || `Error ${response.status}: ${response.statusText}`
      );
    }

    return data;
  } catch (error) {
    // Log del error para debugging
    clientLogger.error(`API FormData Request failed for ${endpoint}:`, error);
    throw error;
  }
}

// Función auxiliar para detectar si un error es recuperable
function isRecoverableError(error: Error): boolean {
  const message = error.message.toLowerCase();

  // Errores de rate limiting
  if (
    message.includes("demasiadas") ||
    message.includes("intenta de nuevo") ||
    message.includes("rate limit") ||
    message.includes("429")
  ) {
    return true;
  }

  // Errores temporales del servidor
  if (
    message.includes("502") ||
    message.includes("503") ||
    message.includes("504") ||
    message.includes("timeout") ||
    message.includes("temporal")
  ) {
    return true;
  }

  return false;
}

// Función auxiliar para manejar reintentos con backoff exponencial
async function retryWithBackoff<T>(
  fn: () => Promise<T>,
  maxRetries: number = 3,
  baseDelay: number = 1000
): Promise<T> {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      if (attempt === maxRetries) {
        throw error;
      }

      // Solo reintentar si es un error recuperable
      if (error instanceof Error && isRecoverableError(error)) {
        const delay = baseDelay * Math.pow(2, attempt - 1);
        clientLogger.info(
          `Reintentando en ${delay}ms (intento ${attempt}/${maxRetries}) - Error: ${error.message}`
        );
        await new Promise((resolve) => setTimeout(resolve, delay));
      } else {
        clientLogger.info(
          `Error no recuperable, no se reintentará: ${
            error instanceof Error ? error.message : "Error desconocido"
          }`
        );
        throw error;
      }
    }
  }
  throw new Error("Máximo número de reintentos alcanzado");
}

// OBTENER PERFIL DEL USUARIO
export async function getProfileAction(): Promise<ProfileState> {
  try {
    const response = await retryWithBackoff(() => apiRequest("/auth/profile"));
    return {
      success: true,
      message: "Perfil obtenido exitosamente",
      data: response.data,
    };
  } catch (error) {
    clientLogger.error("Error en getProfileAction:", error);

    // Manejar errores específicos
    let errorMessage = "Error al obtener el perfil";

    if (error instanceof Error) {
      if (
        error.message.includes("Demasiadas") ||
        error.message.includes("demasiadas") ||
        error.message.includes("intenta de nuevo")
      ) {
        errorMessage =
          "Demasiadas solicitudes. Por favor, espera un momento y vuelve a intentar.";
      } else if (error.message.includes("401")) {
        errorMessage = "Sesión expirada. Por favor, inicia sesión nuevamente.";
      } else if (error.message.includes("403")) {
        errorMessage = "No tienes permisos para acceder a esta información.";
      } else if (error.message.includes("404")) {
        errorMessage = "Perfil no encontrado.";
      } else if (error.message.includes("500")) {
        errorMessage =
          "Error interno del servidor. Por favor, intenta más tarde.";
      } else {
        errorMessage = error.message;
      }
    }

    return {
      success: false,
      error: errorMessage,
    };
  }
}

// CAMBIAR CONTRASEÑA
export async function changePasswordAction(
  prevState: ChangePasswordState,
  formData: FormData
): Promise<ChangePasswordState> {
  try {
    const currentPassword = formData.get("currentPassword") as string;
    const newPassword = formData.get("newPassword") as string;
    const confirmPassword = formData.get("confirmPassword") as string;

    // Validaciones básicas
    if (!currentPassword || !newPassword || !confirmPassword) {
      return {
        success: false,
        error: "Por favor completa todos los campos",
      };
    }

    // Validación de contraseñas
    if (newPassword !== confirmPassword) {
      return {
        success: false,
        error: "Las contraseñas no coinciden",
      };
    }

    if (newPassword.length < 6) {
      return {
        success: false,
        error: "La nueva contraseña debe tener al menos 6 caracteres",
      };
    }

    // Validación de seguridad adicional
    if (newPassword === currentPassword) {
      return {
        success: false,
        error: "La nueva contraseña debe ser diferente a la actual",
      };
    }

    // Hacer petición al backend
    await apiRequest("/auth/change-password", {
      method: "PUT",
      body: JSON.stringify({
        currentPassword,
        newPassword,
      }),
    });

    return {
      success: true,
      message: "Contraseña cambiada exitosamente",
    };
  } catch (error) {
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Error al cambiar contraseña",
    };
  }
}

// SUBIR AVATAR
export async function uploadAvatarAction(
  prevState: UploadAvatarState,
  formData: FormData
): Promise<UploadAvatarState> {
  try {
    const avatarFile = formData.get("avatar") as File;

    if (!avatarFile) {
      return {
        success: false,
        error: "Por favor selecciona una imagen",
      };
    }

    // Validar tipo de archivo
    const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
    if (!allowedTypes.includes(avatarFile.type)) {
      return {
        success: false,
        error: "Solo se permiten archivos JPG, PNG o WebP",
      };
    }

    // Validar tamaño del archivo (máximo 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (avatarFile.size > maxSize) {
      return {
        success: false,
        error: "El archivo no puede ser mayor a 5MB",
      };
    }

    // Crear FormData para enviar el archivo
    const uploadFormData = new FormData();
    uploadFormData.append("avatar", avatarFile);

    // Hacer petición al backend
    const response = await apiRequestFormData(
      "/auth/upload-avatar",
      uploadFormData
    );

    // Revalidar la página para actualizar la información del usuario
    revalidatePath("/prestador/perfil");

    return {
      success: true,
      message: "Avatar actualizado exitosamente",
      data: {
        avatarUrl: response.data?.avatarUrl,
      },
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Error al subir avatar",
    };
  }
}

// ELIMINAR AVATAR
export async function deleteAvatarAction(): Promise<UploadAvatarState> {
  try {
    await apiRequest("/auth/delete-avatar", {
      method: "DELETE",
    });

    // Revalidar la página para actualizar la información del usuario
    revalidatePath("/prestador/perfil");

    return {
      success: true,
      message: "Avatar eliminado exitosamente",
    };
  } catch (error) {
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Error al eliminar avatar",
    };
  }
}

// ACTUALIZAR TELÉFONO
export async function updatePhoneAction(
  prevState: UpdatePhoneState,
  formData: FormData
): Promise<UpdatePhoneState> {
  try {
    const telefono = formData.get("telefono") as string;

    // Validaciones
    if (!telefono) {
      return {
        success: false,
        error: "Por favor ingresa tu número de teléfono",
      };
    }

    // Validar que sea solo números
    if (!/^[0-9]+$/.test(telefono)) {
      return {
        success: false,
        error: "El teléfono solo debe contener números",
      };
    }

    // Validar longitud (10 dígitos)
    if (telefono.length !== 10) {
      return {
        success: false,
        error: "El teléfono debe tener exactamente 10 dígitos",
      };
    }

    // Hacer petición al backend
    const response = await apiRequest("/auth/update-phone", {
      method: "PUT",
      body: JSON.stringify({
        telefono,
      }),
    });

    // Revalidar la página para actualizar la información del usuario
    revalidatePath("/prestador/perfil");

    return {
      success: true,
      message: "Teléfono actualizado exitosamente",
      data: {
        telefono: response.data?.telefono,
      },
    };
  } catch (error) {
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Error al actualizar teléfono",
    };
  }
}
