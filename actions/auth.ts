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
import { actionLogger, apiLogger, errorLogger } from "@/lib/logger";

// Función auxiliar para hacer peticiones al backend
async function apiRequest(endpoint: string, options: RequestInit = {}) {
  const url = `${config.api.baseUrl}${endpoint}`;

  // LOG: Petición iniciada
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
      // LOG: Error de API
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

    // LOG: Éxito
    apiLogger.info(
      {
        endpoint,
        status: response.status,
      },
      "API Request exitoso"
    );

    return data;
  } catch (error) {
    // LOG: Error de red
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

// Función auxiliar para establecer cookies de autenticación
async function setAuthCookies(
  tokens: { accessToken: string; refreshToken: string },
  user: User
) {
  const cookieStore = await cookies();

  // Establecer access token en cookie httpOnly (corta duración)
  cookieStore.set(config.storage.tokenKey, tokens.accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 15, // 15 minutos
    path: "/",
  });

  // Establecer refresh token en cookie httpOnly (larga duración)
  cookieStore.set(config.storage.refreshTokenKey, tokens.refreshToken, {
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
  cookieStore.delete(config.storage.refreshTokenKey);
  cookieStore.delete(config.storage.userKey);
}

// LOGIN ACTION
export async function loginAction(
  prevState: LoginState,
  formData: FormData
): Promise<LoginState> {
  const requestId = crypto.randomUUID(); // ID único para trazabilidad

  // LOG: Inicio
  actionLogger.info({ requestId }, "Intento de login iniciado");

  try {
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    // Validaciones básicas
    if (!email || !password) {
      // LOG: Validación fallida
      actionLogger.warn(
        {
          requestId,
          email,
        },
        "Login falló: campos incompletos"
      );

      return {
        success: false,
        error: "Por favor completa todos los campos",
      };
    }

    // Validación de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      // LOG: Email inválido
      actionLogger.warn(
        {
          requestId,
          email,
        },
        "Login falló: email inválido"
      );

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

    // Verificar y normalizar rol del usuario
    if (!response.data?.user) {
      throw new Error("No se recibieron los datos del usuario del servidor");
    }

    const user = response.data.user;

    // Asegurarse de que el usuario tenga un rol válido
    if (!user.rol) {
      throw new Error("El usuario no tiene un rol asignado");
    }

    // Normalizar el rol
    const normalizedRole = user.rol.toLowerCase();
    if (normalizedRole !== "conanp" && normalizedRole !== "prestador") {
      throw new Error("Rol de usuario no válido");
    }

    user.rol = normalizedRole as "conanp" | "prestador";

    // Verificar que tenemos los tokens necesarios
    if (!response.data.accessToken || !response.data.refreshToken) {
      throw new Error("No se recibieron los tokens necesarios del servidor");
    }

    // Establecer cookies de autenticación
    const tokens = {
      accessToken: response.data.accessToken,
      refreshToken: response.data.refreshToken,
    };

    await setAuthCookies(tokens, user);

    // Determinar redirección basada en el rol
    const redirectTo = user.rol === "conanp" ? "/dashboard" : "/prestador";

    // LOG: Éxito
    actionLogger.info(
      {
        requestId,
        userId: user.id,
        userRole: user.rol,
        email: user.email,
      },
      "Login exitoso"
    );

    return {
      success: true,
      message: "Inicio de sesión exitoso",
      data: user,
      tokens, // Incluir tokens para que el cliente los guarde
      redirectTo,
    };
  } catch (error) {
    // LOG: Error crítico
    errorLogger.error(
      {
        requestId,
        error: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined,
      },
      "Login falló con error"
    );

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
  const requestId = crypto.randomUUID();

  // LOG: Inicio
  actionLogger.info({ requestId }, "Intento de registro iniciado");

  try {
    const nombre = formData.get("nombre") as string;
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const confirmPassword = formData.get("confirmPassword") as string;
    const codigoInvitacion = formData.get("codigoInvitacion") as string;
    const telefono = formData.get("telefono") as string;

    // Validaciones básicas
    if (
      !nombre ||
      !email ||
      !password ||
      !confirmPassword ||
      !codigoInvitacion
    ) {
      // LOG: Validación fallida
      actionLogger.warn(
        { requestId, email },
        "Registro falló: campos incompletos"
      );

      return {
        success: false,
        error: "Por favor completa todos los campos",
      };
    }

    // Validación de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      // LOG: Email inválido
      actionLogger.warn({ requestId, email }, "Registro falló: email inválido");

      return {
        success: false,
        error: "Por favor ingresa un email válido",
      };
    }

    // Validación de contraseñas
    if (password !== confirmPassword) {
      // LOG: Contraseñas no coinciden
      actionLogger.warn(
        { requestId, email },
        "Registro falló: contraseñas no coinciden"
      );

      return {
        success: false,
        error: "Las contraseñas no coinciden",
      };
    }

    if (password.length < 6) {
      // LOG: Contraseña muy corta
      actionLogger.warn(
        { requestId, email },
        "Registro falló: contraseña muy corta"
      );

      return {
        success: false,
        error: "La contraseña debe tener al menos 6 caracteres",
      };
    }

    // Preparar datos para enviar al backend
    const registroData: {
      nombre: string;
      email: string;
      password: string;
      codigo_invitacion: string;
      telefono?: string;
    } = {
      nombre,
      email,
      password,
      codigo_invitacion: codigoInvitacion, // Backend espera codigo_invitacion con guion bajo
    };

    // Agregar teléfono solo si fue proporcionado
    if (telefono && telefono.trim() !== "") {
      registroData.telefono = telefono.trim();
    }

    // Hacer petición al backend
    const response = await apiRequest("/auth/register", {
      method: "POST",
      body: JSON.stringify(registroData),
    });

    const user = response.data?.user;

    // LOG: Éxito
    actionLogger.info(
      {
        requestId,
        userId: user?.id,
        userRole: user?.rol,
        email: user?.email || email,
      },
      "Registro exitoso"
    );

    return {
      success: true,
      message: "Registro exitoso. Puedes iniciar sesión ahora.",
    };
  } catch (error) {
    // LOG: Error
    errorLogger.error(
      {
        requestId,
        error: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined,
      },
      "Registro falló con error"
    );

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
  } catch {
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

    // Usar el endpoint correcto de validación GET /invitaciones/validar/:codigo
    const response = await apiRequest(
      `/invitaciones/validar/${codigo.trim()}`,
      {
        method: "GET",
      }
    );

    // El backend devuelve { data: { valida: boolean, invitacion: {...} } }
    if (response.data?.valida) {
      return {
        success: true,
        message: "Código de invitación válido",
        data: {
          valid: true,
          organizacion:
            response.data?.invitacion?.rol === "conanp"
              ? "CONANP"
              : "Prestador de Servicios",
          email: response.data?.invitacion?.email || "",
          nombre: response.data?.invitacion?.nombre || "",
        },
      };
    } else {
      return {
        success: false,
        error: response.data?.razon || "Código de invitación inválido",
        data: {
          valid: false,
        },
      };
    }
  } catch (error) {
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
