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

    // Si recibimos 401 y es el primer intento, renovar token y reintentar
    if (response.status === 401 && retryCount === 0 && refreshToken) {
      const renewed = await tryRefreshToken();

      if (renewed) {
        return apiRequest(endpoint, options, retryCount + 1);
      }
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
