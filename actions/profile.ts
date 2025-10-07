"use server";

import { cookies } from "next/headers";
import { config } from "@/lib/config/env";
import { revalidatePath } from "next/cache";

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

  const response = await fetch(url, {
    ...options,
    headers: defaultHeaders,
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Error en la petición");
  }

  return data;
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

  const response = await fetch(url, {
    method: "POST",
    headers,
    body: formData,
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Error en la petición");
  }

  return data;
}

// OBTENER PERFIL DEL USUARIO
export async function getProfileAction(): Promise<ProfileState> {
  try {
    const response = await apiRequest("/auth/profile");

    return {
      success: true,
      message: "Perfil obtenido exitosamente",
      data: response.data,
    };
  } catch (error) {
    console.error("Error en getProfileAction:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Error al obtener el perfil",
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
    console.error("Error en changePasswordAction:", error);
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
    console.error("Error en uploadAvatarAction:", error);
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
    console.error("Error en deleteAvatarAction:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Error al eliminar avatar",
    };
  }
}
