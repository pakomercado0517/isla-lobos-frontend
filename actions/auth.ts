"use server";

import { cookies } from "next/headers";
import {
  LoginState,
  RegisterState,
  LogoutState,
  ForgotPasswordState,
  ResetPasswordState,
  ChangePasswordState,
  ValidateInvitationState,
} from "@/lib/types/actions";
import { User } from "@/lib/types/auth";
import { config } from "@/lib/config/env";
import { revalidatePath } from "next/cache";

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

// Función auxiliar para establecer cookies de autenticación
async function setAuthCookies(token: string, user: User) {
  const cookieStore = await cookies();

  // Establecer token en cookie httpOnly
  cookieStore.set(config.storage.tokenKey, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7, // 7 días
    path: "/",
  });

  // Establecer datos del usuario en cookie (no sensible)
  cookieStore.set(config.storage.userKey, JSON.stringify(user), {
    httpOnly: false, // Accesible desde el cliente
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7, // 7 días
    path: "/",
  });
}

// Función auxiliar para limpiar cookies de autenticación
async function clearAuthCookies() {
  const cookieStore = await cookies();

  cookieStore.delete(config.storage.tokenKey);
  cookieStore.delete(config.storage.userKey);
}

// LOGIN ACTION
export async function loginAction(
  prevState: LoginState,
  formData: FormData
): Promise<LoginState> {
  try {
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    // Validaciones básicas
    if (!email || !password) {
      return {
        success: false,
        error: "Por favor completa todos los campos",
      };
    }

    // Validación de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return {
        success: false,
        error: "Por favor ingresa un email válido",
      };
    }

    // Hacer petición al backend
    const response = await apiRequest("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });

    // Normalizar rol del usuario
    const user = response.data.user;
    if (user.rol) {
      const normalizedRole = user.rol.toLowerCase();
      if (normalizedRole === "conanp" || normalizedRole === "prestador") {
        user.rol = normalizedRole as "conanp" | "prestador";
      }
    }

    // Establecer cookies de autenticación
    setAuthCookies(response.data.token, user);

    // Determinar redirección basada en el rol
    const redirectTo = user.rol === "conanp" ? "/dashboard" : "/prestador";

    return {
      success: true,
      message: "Inicio de sesión exitoso",
      data: user,
      redirectTo,
      token: response.data.token, // Pasar el token para que el cliente lo pueda guardar
    };
  } catch (error) {
    console.error("Error en loginAction:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Error al iniciar sesión",
    };
  }
}

// REGISTER ACTION
export async function registerAction(
  prevState: RegisterState,
  formData: FormData
): Promise<RegisterState> {
  try {
    const nombre = formData.get("nombre") as string;
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const confirmPassword = formData.get("confirmPassword") as string;
    const codigoInvitacion = formData.get("codigoInvitacion") as string;

    // Validaciones básicas
    if (
      !nombre ||
      !email ||
      !password ||
      !confirmPassword ||
      !codigoInvitacion
    ) {
      return {
        success: false,
        error: "Por favor completa todos los campos",
      };
    }

    // Validación de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return {
        success: false,
        error: "Por favor ingresa un email válido",
      };
    }

    // Validación de contraseñas
    if (password !== confirmPassword) {
      return {
        success: false,
        error: "Las contraseñas no coinciden",
      };
    }

    if (password.length < 6) {
      return {
        success: false,
        error: "La contraseña debe tener al menos 6 caracteres",
      };
    }

    // Hacer petición al backend
    await apiRequest("/auth/register", {
      method: "POST",
      body: JSON.stringify({
        nombre,
        email,
        password,
        codigoInvitacion,
      }),
    });

    return {
      success: true,
      message: "Registro exitoso. Puedes iniciar sesión ahora.",
    };
  } catch (error) {
    console.error("Error en registerAction:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Error al registrarse",
    };
  }
}

// LOGOUT ACTION
export async function logoutAction(): Promise<LogoutState> {
  try {
    // Limpiar cookies
    await clearAuthCookies();

    revalidatePath("/login");

    return {
      success: true,
      message: "Sesión cerrada exitosamente",
    };
  } catch (error) {
    console.error("Error en logoutAction:", error);
    return {
      success: false,
      error: "Error al cerrar sesión",
    };
  }
}

// FORGOT PASSWORD ACTION
export async function forgotPasswordAction(
  prevState: ForgotPasswordState,
  formData: FormData
): Promise<ForgotPasswordState> {
  try {
    const email = formData.get("email") as string;

    if (!email) {
      return {
        success: false,
        error: "Por favor ingresa tu email",
      };
    }

    // Validación de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return {
        success: false,
        error: "Por favor ingresa un email válido",
      };
    }

    await apiRequest("/auth/forgot-password", {
      method: "POST",
      body: JSON.stringify({ email }),
    });

    return {
      success: true,
      message: "Se ha enviado un enlace de recuperación a tu email",
    };
  } catch (error) {
    console.error("Error en forgotPasswordAction:", error);
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Error al enviar email de recuperación",
    };
  }
}

// RESET PASSWORD ACTION
export async function resetPasswordAction(
  prevState: ResetPasswordState,
  formData: FormData
): Promise<ResetPasswordState> {
  try {
    const token = formData.get("token") as string;
    const password = formData.get("password") as string;
    const confirmPassword = formData.get("confirmPassword") as string;

    if (!token || !password || !confirmPassword) {
      return {
        success: false,
        error: "Por favor completa todos los campos",
      };
    }

    if (password !== confirmPassword) {
      return {
        success: false,
        error: "Las contraseñas no coinciden",
      };
    }

    if (password.length < 6) {
      return {
        success: false,
        error: "La contraseña debe tener al menos 6 caracteres",
      };
    }

    await apiRequest("/auth/reset-password", {
      method: "POST",
      body: JSON.stringify({ token, password }),
    });

    return {
      success: true,
      message: "Contraseña restablecida exitosamente",
    };
  } catch (error) {
    console.error("Error en resetPasswordAction:", error);
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Error al restablecer contraseña",
    };
  }
}

// CHANGE PASSWORD ACTION
export async function changePasswordAction(
  prevState: ChangePasswordState,
  formData: FormData
): Promise<ChangePasswordState> {
  try {
    const currentPassword = formData.get("currentPassword") as string;
    const newPassword = formData.get("newPassword") as string;
    const confirmPassword = formData.get("confirmPassword") as string;

    if (!currentPassword || !newPassword || !confirmPassword) {
      return {
        success: false,
        error: "Por favor completa todos los campos",
      };
    }

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

    await apiRequest("/auth/change-password", {
      method: "POST",
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

// VALIDATE INVITATION ACTION
export async function validateInvitationAction(
  prevState: ValidateInvitationState,
  formData: FormData
): Promise<ValidateInvitationState> {
  try {
    const codigo = formData.get("codigo") as string;

    if (!codigo) {
      return {
        success: false,
        error: "Por favor ingresa el código de invitación",
      };
    }

    const response = await apiRequest("/auth/validate-invitation", {
      method: "POST",
      body: JSON.stringify({ codigo }),
    });

    return {
      success: true,
      message: "Código de invitación válido",
      data: {
        valid: true,
        organizacion: response.data?.organizacion,
      },
    };
  } catch (error) {
    console.error("Error en validateInvitationAction:", error);
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Código de invitación inválido",
      data: {
        valid: false,
      },
    };
  }
}
