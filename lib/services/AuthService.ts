import { config } from "@/lib/config/env";
import { AuthTokens } from "@/lib/types/auth";
import { clientLogger } from "@/lib/logger-client";

class AuthService {
  private static readonly ACCESS_TOKEN_KEY = "accessToken";
  private static readonly REFRESH_TOKEN_KEY = "refreshToken";
  private static readonly USER_KEY = config.storage.userKey;

  /**
   * Guarda los tokens en localStorage y cookies
   */
  static saveTokens(tokens: AuthTokens): void {
    try {
      if (typeof window === "undefined") return;

      localStorage.setItem(this.ACCESS_TOKEN_KEY, tokens.accessToken);
      localStorage.setItem(this.REFRESH_TOKEN_KEY, tokens.refreshToken);
    } catch (error) {
      clientLogger.error("Error al guardar tokens", error);
    }
  }

  /**
   * Obtiene los tokens del localStorage
   */
  static getTokens(): AuthTokens | null {
    try {
      if (typeof window === "undefined") return null;

      const accessToken = localStorage.getItem(this.ACCESS_TOKEN_KEY);
      const refreshToken = localStorage.getItem(this.REFRESH_TOKEN_KEY);

      if (!accessToken || !refreshToken) return null;

      return { accessToken, refreshToken };
    } catch (error) {
      clientLogger.error("Error al obtener tokens", error);
      return null;
    }
  }

  /**
   * Limpia los tokens del localStorage y cookies
   */
  static clearTokens(): void {
    try {
      if (typeof window === "undefined") return;

      localStorage.removeItem(this.ACCESS_TOKEN_KEY);
      localStorage.removeItem(this.REFRESH_TOKEN_KEY);
      localStorage.removeItem(this.USER_KEY);
    } catch (error) {
      clientLogger.error("Error al limpiar tokens", error);
    }
  }

  /**
   * Verifica si hay tokens almacenados
   */
  static hasTokens(): boolean {
    return !!this.getTokens();
  }

  /**
   * Obtiene el token de acceso
   */
  static getAccessToken(): string | null {
    const tokens = this.getTokens();
    return tokens?.accessToken || null;
  }

  /**
   * Obtiene el token de refresco
   */
  static getRefreshToken(): string | null {
    const tokens = this.getTokens();
    return tokens?.refreshToken || null;
  }

  /**
   * Actualiza solo el token de acceso
   */
  static updateAccessToken(newAccessToken: string): void {
    try {
      if (typeof window === "undefined") return;

      const currentTokens = this.getTokens();
      if (!currentTokens?.refreshToken) {
        throw new Error("No hay refresh token almacenado");
      }

      this.saveTokens({
        accessToken: newAccessToken,
        refreshToken: currentTokens.refreshToken,
      });
    } catch (error) {
      clientLogger.error("Error al actualizar access token", error);
    }
  }

  /**
   * Refresca el token de acceso usando el token de refresco
   */
  static async refreshAccessToken(): Promise<string> {
    try {
      const refreshToken = this.getRefreshToken();
      if (!refreshToken) {
        throw new Error("No hay refresh token disponible");
      }

      const response = await fetch(`${config.api.baseUrl}/auth/refresh`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ refreshToken }),
      });

      if (!response.ok) {
        throw new Error("Error al refrescar el token");
      }

      const data = await response.json();
      if (data.status !== "success" || !data.data?.accessToken) {
        throw new Error(data.error || "Error al refrescar el token");
      }

      this.updateAccessToken(data.data.accessToken);
      return data.data.accessToken;
    } catch (error) {
      clientLogger.error("Error en refreshAccessToken", error);
      this.clearTokens(); // Limpiar tokens en caso de error
      throw error;
    }
  }
}

export default AuthService;
