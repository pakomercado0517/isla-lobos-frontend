import { config } from "@/lib/config/env";
import { clientLogger } from "@/lib/logger-client";

/**
 * Servicio de autenticación del lado del cliente
 *
 * IMPORTANTE: Este servicio ya NO almacena tokens en localStorage.
 * Los tokens se almacenan en cookies httpOnly del servidor por seguridad.
 *
 * Este servicio solo proporciona utilidades para:
 * - Leer datos del usuario desde cookies no-httpOnly
 * - Limpiar datos de sesión del cliente
 * - Verificar existencia de cookies de usuario
 */
class AuthService {
  private static readonly USER_KEY = config.storage.userKey;

  /**
   * Verifica si estamos en el cliente
   */
  private static isClient(): boolean {
    return typeof window !== "undefined";
  }

  /**
   * Obtiene los datos del usuario desde la cookie no-httpOnly
   * Los tokens NO están disponibles aquí por seguridad (están en httpOnly cookies)
   * @returns Datos del usuario o null
   */
  static getUserFromCookie(): {
    id: string;
    nombre: string;
    email: string;
    rol: "conanp" | "prestador";
  } | null {
    if (!this.isClient()) return null;

    try {
      // Leer cookie del usuario (esta es la única cookie accesible desde JS)
      const cookies = document.cookie.split(";");

      const userCookie = cookies.find((cookie) =>
        cookie.trim().startsWith(`${this.USER_KEY}=`)
      );

      if (!userCookie) {
        return null;
      }

      const cookieValue = userCookie.split("=")[1];
      const userData = JSON.parse(decodeURIComponent(cookieValue));

      return userData;
    } catch (error) {
      clientLogger.error(
        "❌ Error al obtener datos del usuario de cookies",
        error
      );
      return null;
    }
  }

  /**
   * Verifica si existe cookie de usuario
   * Los tokens están en httpOnly cookies y no son accesibles desde JS
   * @returns true si existe cookie de usuario
   */
  static hasUserCookie(): boolean {
    if (!this.isClient()) return false;

    try {
      const allCookies = document.cookie;
      
      // IMPORTANTE: Las cookies httpOnly (accessToken, refreshToken) NO aparecen en document.cookie
      // Esto es NORMAL y ESPERADO por seguridad. Solo aparecen cookies no-httpOnly como user_key
      const hasUserCookie = this.getUserFromCookie() !== null;
      
      clientLogger.info("🍪 Cookies disponibles (solo no-httpOnly):", {
        cookies: allCookies,
        hasUserKey: hasUserCookie,
        nota: "Las cookies httpOnly (accessToken, refreshToken) no son visibles aquí por seguridad",
      });

      return hasUserCookie;
    } catch (error) {
      clientLogger.error("Error al verificar cookie de usuario", error);
      return false;
    }
  }

  /**
   * Verifica si las cookies httpOnly están presentes haciendo una petición de prueba
   * Solo para diagnóstico - las cookies httpOnly se envían automáticamente en peticiones
   */
  static async verificarCookiesHttpOnly(): Promise<{
    cookiesPresentes: boolean;
    mensaje: string;
  }> {
    if (!this.isClient()) {
      return {
        cookiesPresentes: false,
        mensaje: "No disponible en servidor",
      };
    }

    try {
      // Hacer una petición simple a la API route para verificar cookies
      const response = await fetch("/api/auth/refresh", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
      });

      // Si la petición no devuelve 401 (no encontrado), significa que las cookies se enviaron
      const cookiesPresentes = response.status !== 401;

      return {
        cookiesPresentes,
        mensaje: cookiesPresentes
          ? "Las cookies httpOnly están presentes y se envían correctamente"
          : "No se encontraron cookies httpOnly en la petición",
      };
    } catch (error) {
      return {
        cookiesPresentes: false,
        mensaje: `Error al verificar: ${error instanceof Error ? error.message : String(error)}`,
      };
    }
  }

  /**
   * Limpia los datos de sesión del lado del cliente
   *
   * NOTA: Esta función NO puede eliminar las cookies httpOnly (tokens).
   * Las cookies httpOnly solo pueden ser eliminadas por el servidor.
   * Esta función solo limpia datos locales del navegador si los hubiera.
   */
  static clearClientSession(): void {
    if (!this.isClient()) return;

    try {
      // Limpiar cualquier dato en localStorage (por si acaso quedó algo antiguo)
      localStorage.clear();

      // Limpiar sessionStorage
      sessionStorage.clear();

      clientLogger.info("🧹 Sesión del cliente limpiada");
    } catch (error) {
      clientLogger.error("Error al limpiar sesión del cliente", error);
    }
  }

  /**
   * Guarda información del usuario en localStorage y cookie para acceso rápido
   * Los tokens permanecen seguros en httpOnly cookies del servidor
   * @param userData - Datos del usuario
   */
  static saveUserData(userData: {
    id: string;
    nombre: string;
    email: string;
    rol: "conanp" | "prestador";
  }): void {
    if (!this.isClient()) return;

    try {
      // Guardar en localStorage
      localStorage.setItem(this.USER_KEY, JSON.stringify(userData));

      // También establecer cookie desde el cliente
      // Esta cookie es del dominio del frontend (Vercel)
      const userDataString = JSON.stringify(userData);
      const maxAge = 60 * 60 * 24 * 7; // 7 días en segundos
      const isProduction = process.env.NODE_ENV === "production";
      
      // Construir la cookie string
      let cookieString = `${this.USER_KEY}=${encodeURIComponent(userDataString)}`;
      cookieString += `; Max-Age=${maxAge}`;
      cookieString += `; Path=/`;
      
      if (isProduction) {
        cookieString += `; Secure`; // Requerido para SameSite=None
        cookieString += `; SameSite=None`; // Para cross-origin en producción
      } else {
        cookieString += `; SameSite=Lax`; // Para desarrollo (localhost)
      }

      document.cookie = cookieString;
      
      clientLogger.info("✅ Usuario guardado en localStorage y cookie", {
        hasCookie: this.hasUserCookie(),
      });
    } catch (error) {
      clientLogger.error("❌ Error al guardar datos de usuario", error);
    }
  }

  /**
   * Obtiene datos del usuario desde localStorage
   * @returns Datos del usuario o null
   */
  static getUserFromLocalStorage(): {
    id: string;
    nombre: string;
    email: string;
    rol: "conanp" | "prestador";
  } | null {
    if (!this.isClient()) return null;

    try {
      const userData = localStorage.getItem(this.USER_KEY);
      if (!userData) return null;

      return JSON.parse(userData);
    } catch (error) {
      clientLogger.error("Error al obtener usuario de localStorage", error);
      return null;
    }
  }

  /**
   * Obtiene datos del usuario desde cookies o localStorage
   * Prioriza cookies sobre localStorage
   * @returns Datos del usuario o null
   */
  static getUser(): {
    id: string;
    nombre: string;
    email: string;
    rol: "conanp" | "prestador";
  } | null {
    // Intentar primero desde cookies
    const userFromCookie = this.getUserFromCookie();
    if (userFromCookie) return userFromCookie;

    // Fallback a localStorage
    return this.getUserFromLocalStorage();
  }
}

export { AuthService };
