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
      clientLogger.info("🍪 Cookies disponibles:", { cookies: allCookies });

      const hasUserCookie = this.getUserFromCookie() !== null;
      clientLogger.info(`🔍 ¿Tiene cookie de usuario? ${hasUserCookie}`);

      return hasUserCookie;
    } catch (error) {
      clientLogger.error("Error al verificar cookie de usuario", error);
      return false;
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
   * Guarda información del usuario en localStorage para acceso rápido
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
      localStorage.setItem(this.USER_KEY, JSON.stringify(userData));
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
