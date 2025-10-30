import AuthService from "@/lib/services/AuthService";
import { clientLogger } from "@/lib/logger-client";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";

/**
 * Handler simple para errores de autenticación
 */
export class AuthErrorHandler {
  /**
   * Verifica si un error requiere logout
   * @param error - Error a verificar
   * @returns true si requiere logout
   */
  static requiresLogout(error: any): boolean {
    const status = error.status || error.response?.status;
    
    // Error 401 siempre requiere logout
    if (status === 401) {
      return true;
    }

    // Verificar mensaje de error
    const message = (error.message || error.error || "").toLowerCase();
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
  static handleAuthFailure(router: AppRouterInstance, error?: any): void {
    const errorMsg = error?.message || "Sesión expirada";

    clientLogger.warn("🔐 Sesión terminada", {
      reason: errorMsg,
    });

    // Limpiar tokens
    AuthService.clearTokens();

    // Guardar mensaje para mostrar en login
    if (typeof window !== "undefined") {
      const message = "Tu sesión ha expirado. Por favor inicia sesión nuevamente.";
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

