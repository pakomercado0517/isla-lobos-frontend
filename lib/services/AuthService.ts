import { config } from "@/lib/config/env";
import { AuthTokens } from "@/lib/types/auth";
import { clientLogger } from "@/lib/logger-client";

/**
 * Respuesta del backend al refrescar el token
 */
interface RefreshTokenResponse {
  status: "success" | "error";
  message?: string;
  data?: {
    accessToken: string;
  };
  error?: string;
}

/**
 * Servicio de autenticación para gestión de tokens
 * Maneja almacenamiento, renovación y limpieza de tokens
 */
class AuthService {
  private static readonly ACCESS_TOKEN_KEY = "accessToken";
  private static readonly REFRESH_TOKEN_KEY = "refreshToken";
  private static readonly USER_KEY = config.storage.userKey;

  /**
   * Verifica si estamos en el cliente
   */
  private static isClient(): boolean {
    return typeof window !== "undefined";
  }

  /**
   * Guarda los tokens en localStorage
   * @param tokens - Objeto con accessToken y refreshToken
   */
  static saveTokens(tokens: AuthTokens): void {
    if (!this.isClient()) {
      clientLogger.warn("Intento de guardar tokens en el servidor");
      return;
    }

    try {
      localStorage.setItem(this.ACCESS_TOKEN_KEY, tokens.accessToken);
      localStorage.setItem(this.REFRESH_TOKEN_KEY, tokens.refreshToken);

      clientLogger.info("✅ Tokens guardados exitosamente", {
        hasAccessToken: !!tokens.accessToken,
        hasRefreshToken: !!tokens.refreshToken,
      });
    } catch (error) {
      clientLogger.error("❌ Error al guardar tokens en localStorage", error);
      throw error;
    }
  }

  /**
   * Obtiene los tokens del localStorage
   * @returns Objeto con tokens o null si no existen
   */
  static getTokens(): AuthTokens | null {
    if (!this.isClient()) return null;

    try {
      const accessToken = localStorage.getItem(this.ACCESS_TOKEN_KEY);
      const refreshToken = localStorage.getItem(this.REFRESH_TOKEN_KEY);

      if (!accessToken || !refreshToken) {
        return null;
      }

      return { accessToken, refreshToken };
    } catch (error) {
      clientLogger.error("Error al obtener tokens de localStorage", error);
      return null;
    }
  }

  /**
   * Limpia todos los datos de autenticación del localStorage
   */
  static clearTokens(): void {
    if (!this.isClient()) return;

    try {
      localStorage.removeItem(this.ACCESS_TOKEN_KEY);
      localStorage.removeItem(this.REFRESH_TOKEN_KEY);
      localStorage.removeItem(this.USER_KEY);

      clientLogger.info("🧹 Tokens limpiados exitosamente");
    } catch (error) {
      clientLogger.error("Error al limpiar tokens", error);
    }
  }

  /**
   * Verifica si hay tokens almacenados
   * @returns true si existen ambos tokens
   */
  static hasTokens(): boolean {
    const tokens = this.getTokens();
    return !!(tokens?.accessToken && tokens?.refreshToken);
  }

  /**
   * Obtiene solo el token de acceso
   * @returns Access token o null
   */
  static getAccessToken(): string | null {
    const tokens = this.getTokens();
    return tokens?.accessToken || null;
  }

  /**
   * Obtiene solo el token de refresco
   * @returns Refresh token o null
   */
  static getRefreshToken(): string | null {
    const tokens = this.getTokens();
    return tokens?.refreshToken || null;
  }

  /**
   * Actualiza solo el access token (mantiene el refresh token)
   * @param newAccessToken - Nuevo access token
   */
  static updateAccessToken(newAccessToken: string): void {
    if (!this.isClient()) return;

    try {
      const currentTokens = this.getTokens();
      
      if (!currentTokens?.refreshToken) {
        throw new Error("No hay refresh token almacenado para actualizar");
      }

      this.saveTokens({
        accessToken: newAccessToken,
        refreshToken: currentTokens.refreshToken,
      });

      clientLogger.info("🔄 Access token actualizado exitosamente");
    } catch (error) {
      clientLogger.error("Error al actualizar access token", error);
      throw error;
    }
  }

  /**
   * Refresca el access token usando el refresh token
   * Limpia los tokens si el refresh token es inválido o expiró
   * También actualiza las cookies del servidor para sincronización
   * @returns Nuevo access token
   * @throws Error si no se puede renovar el token
   */
  static async refreshAccessToken(): Promise<string> {
    const refreshToken = this.getRefreshToken();

    if (!refreshToken) {
      const error = new Error("No hay refresh token disponible para renovar");
      clientLogger.error("❌ Intento de renovación sin refresh token");
      throw error;
    }

    clientLogger.info("🔄 Iniciando renovación de access token...");

    try {
      const response = await fetch(`${config.api.baseUrl}/auth/refresh`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ refreshToken }),
      });

      // Parsear respuesta
      const data: RefreshTokenResponse = await response.json();

      // Verificar respuesta exitosa
      if (!response.ok || data.status !== "success") {
        const errorMessage = data.error || data.message || "Error al refrescar el token";
        throw new Error(errorMessage);
      }

      // Verificar que tenemos el nuevo token
      if (!data.data?.accessToken) {
        throw new Error("El servidor no devolvió un access token válido");
      }

      const newAccessToken = data.data.accessToken;

      // Actualizar el access token en localStorage
      this.updateAccessToken(newAccessToken);

      // Actualizar también las cookies del servidor (sincronización)
      try {
        const { updateServerTokens } = await import("@/actions/token");
        await updateServerTokens(newAccessToken);
        clientLogger.info("🔄 Cookies del servidor actualizadas");
      } catch (serverError) {
        const errorMsg = serverError instanceof Error ? serverError.message : "Error desconocido";
        clientLogger.warn("⚠️ No se pudieron actualizar las cookies del servidor", {
          error: errorMsg,
        });
        // No fallar si no se puede actualizar el servidor, el token local está actualizado
      }

      clientLogger.info("✅ Access token renovado exitosamente");

      return newAccessToken;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Error desconocido";
      
      clientLogger.error("❌ Error al renovar access token", {
        error: errorMessage,
        action: "Limpiando tokens y requiriendo re-login",
      });

      // Limpiar tokens si falla la renovación
      this.clearTokens();

      throw error;
    }
  }
}

export default AuthService;







