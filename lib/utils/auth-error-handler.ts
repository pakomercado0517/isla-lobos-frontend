import AuthService from "@/lib/services/AuthService";
import { clientLogger } from "@/lib/logger-client";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";

/**
 * Tipo para errores de autenticación
 */
interface AuthError {
  status?: number;
  response?: {
    status?: number;
  };
  message?: string;
  error?: string;
}

/**
 * Handler simple para errores de autenticación
 */
export class AuthErrorHandler {
  /**
   * Verifica si un error requiere logout
   * @param error - Error a verificar
   * @returns true si requiere logout
   */
  static requiresLogout(error: unknown): boolean {
    // Type guard para verificar si es un objeto con las propiedades necesarias
    if (!error || typeof error !== "object") {
      return false;
    }

    const authError = error as AuthError;
    const status = authError.status || authError.response?.status;

    // Error 401 siempre requiere logout
    if (status === 401) {
      return true;
    }

    // Verificar mensaje de error
    const message = (authError.message || authError.error || "").toLowerCase();
    const keywords = [
      "token",
      "sesión",
      "sesion",
      "unauthorized",
      "autenticación",
      "autenticacion",
    ];

    return keywords.some((keyword) => message.includes(keyword));
  }

  /**
   * Maneja logout y redirección al login
   * @param router - Router de Next.js
   * @param error - Error opcional para logging
   */
  static async handleAuthFailure(
    router: AppRouterInstance,
    error?: unknown
  ): Promise<void> {
    let errorMsg = "Sesión expirada";

    if (error && typeof error === "object" && "message" in error) {
      errorMsg = (error as AuthError).message || errorMsg;
    }

    clientLogger.warn("🔐 Sesión terminada", {
      reason: errorMsg,
    });

    // Limpiar sesión del cliente
    AuthService.clearClientSession();

    // Limpiar cookies del servidor mediante Server Action
    try {
      const { clearAuthCookies } = await import("@/actions/token-service");
      await clearAuthCookies();
    } catch (clearError) {
      clientLogger.error("Error al limpiar cookies del servidor", clearError);
      // Continuar con logout aunque falle la limpieza de cookies
    }

    // Guardar mensaje para mostrar en login
    if (typeof window !== "undefined") {
      const message =
        "Tu sesión ha expirado. Por favor inicia sesión nuevamente.";
      sessionStorage.setItem("auth_error", message);
    }

    // Redirigir a login
    router.replace("/login");
  }

  /**
   * Obtiene mensaje de error guardado
   * @returns Mensaje de error o null
   */
  static getStoredError(): string | null {
    if (typeof window === "undefined") {
      return null;
    }

    const message = sessionStorage.getItem("auth_error");

    if (message) {
      // Limpiar después de leer
      sessionStorage.removeItem("auth_error");
    }

    return message;
  }
}

export default AuthErrorHandler;
