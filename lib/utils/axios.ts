import axios, {
  AxiosError,
  InternalAxiosRequestConfig,
  AxiosRequestHeaders,
} from "axios";
import { config } from "@/lib/config/env";
import { clientLogger } from "@/lib/logger-client";

/**
 * Item en la cola de peticiones pendientes durante refresh
 */
interface QueueItem {
  resolve: (token: string) => void;
  reject: (error: Error | unknown) => void;
}

/**
 * Request con flag de reintento
 */
interface RequestWithRetry extends InternalAxiosRequestConfig {
  _retry?: boolean;
  headers: AxiosRequestHeaders;
}

// Variable para controlar si hay un refresh en curso
let isRefreshing = false;
let failedQueue: QueueItem[] = [];

/**
 * Procesa la cola de peticiones pendientes
 * @param error - Error si falló el refresh, null si fue exitoso
 * @param token - Nuevo token si fue exitoso, null si falló
 */
const processQueue = (
  error: Error | unknown | null,
  token: string | null = null
): void => {
  failedQueue.forEach((promise) => {
    if (error) {
      promise.reject(error);
    } else if (token) {
      promise.resolve(token);
    } else {
      promise.reject(new Error("No se recibió token ni error"));
    }
  });

  // Limpiar la cola
  failedQueue = [];
};

/**
 * Refresca el access token llamando al endpoint de refresh
 * Las cookies se envían automáticamente por el navegador
 * @returns true si fue exitoso, false si falló
 */
async function refreshAccessToken(): Promise<boolean> {
  try {
    // Usar la API route local que actúa como proxy
    // Esto permite que las cookies se lean correctamente desde el dominio del frontend
    const baseUrl =
      typeof window !== "undefined"
        ? window.location.origin
        : process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

    const response = await fetch(`${baseUrl}/api/auth/refresh`, {
      method: "POST",
      credentials: "include", // Importante: incluir cookies
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      // Si el refresh token está expirado o es inválido (401), lanzar error específico
      if (response.status === 401) {
        clientLogger.warn(
          "Refresh token expirado o inválido - sesión expirada completamente"
        );
        throw new Error("REFRESH_TOKEN_EXPIRED");
      }
      // Para otros errores HTTP, lanzar error genérico
      const errorText = await response.text().catch(() => "");
      clientLogger.error("Error al renovar token", {
        status: response.status,
        statusText: response.statusText,
        errorText,
      });
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }

    const data = (await response.json()) as {
      status: string;
      message?: string;
      data?: { accessToken?: string };
    };

    if (data.status === "success") {
      // La API route local establece las cookies automáticamente en la respuesta Set-Cookie
      // No necesitamos hacer nada adicional, el navegador procesa las cookies automáticamente
      // Esperar un momento para que el navegador procese las cookies
      await new Promise((resolve) => setTimeout(resolve, 100));

      clientLogger.info("✅ Token renovado - cookies establecidas por API route");
      return true;
    } else {
      throw new Error(data.message || "Error al refrescar token");
    }
  } catch (error) {
    // Si es el error específico de refresh token expirado, propagarlo
    if (error instanceof Error && error.message === "REFRESH_TOKEN_EXPIRED") {
      throw error;
    }
    clientLogger.error("Error al renovar access token", error);
    return false;
  }
}

/**
 * Limpia las cookies de autenticación mediante Server Action
 */
async function clearAuthCookiesFromServer(): Promise<void> {
  try {
    const { clearAuthCookies } = await import("@/actions/token-service");
    await clearAuthCookies();
  } catch (error) {
    clientLogger.error("Error al limpiar cookies desde servidor", error);
  }
}

/**
 * Instancia de Axios configurada con interceptores de autenticación
 *
 * IMPORTANTE: Las cookies httpOnly se envían AUTOMÁTICAMENTE por el navegador.
 * NO necesitamos leerlas ni agregarlas manualmente al header Authorization.
 * El backend debe leer el token directamente de las cookies de la petición.
 */
const axiosInstance = axios.create({
  baseURL: config.api.baseUrl,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
  // CRÍTICO: Permitir envío automático de cookies httpOnly
  withCredentials: true,
});

// ========================================
// NOTA: NO hay interceptor de REQUEST
// Las cookies httpOnly se envían automáticamente con cada petición.
// El backend las lee del header Cookie de la petición HTTP.
// ========================================

// ========================================
// INTERCEPTOR DE RESPONSE
// Maneja renovación automática de tokens en 401
// ========================================
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    clientLogger.info("🔍 Interceptor detectó error", {
      status: error.response?.status,
      url: error.config?.url,
      hasConfig: !!error.config,
    });

    // Verificar que tenemos configuración válida
    if (!error.config) {
      clientLogger.warn("Error sin configuración, rechazando");
      return Promise.reject(error);
    }

    const originalRequest = error.config as RequestWithRetry;

    // Evitar loop infinito: si ya se reintentó, rechazar
    if (originalRequest._retry) {
      clientLogger.warn("⚠️ Petición ya fue reintentada, abortando");
      return Promise.reject(error);
    }

    // Evitar intentar refresh en endpoints de autenticación
    const authEndpoints = ["/auth/login", "/auth/register", "/auth/refresh"];
    const isAuthEndpoint = authEndpoints.some((endpoint) =>
      originalRequest.url?.includes(endpoint)
    );

    if (isAuthEndpoint) {
      clientLogger.info("Endpoint de auth, no renovar token");
      return Promise.reject(error);
    }

    // Manejar error 401 (token expirado)
    if (error.response?.status === 401) {
      // Si ya hay un refresh en curso, encolar esta petición
      if (isRefreshing) {
        try {
          // Esperar a que el refresh termine
          await new Promise<string>((resolve, reject) => {
            failedQueue.push({ resolve, reject });
          });

          // Las cookies actualizadas se envían automáticamente
          // Reintentar la petición
          return axiosInstance(originalRequest);
        } catch (queueError) {
          clientLogger.error("Error al procesar petición encolada", queueError);
          return Promise.reject(queueError);
        }
      }

      // Marcar como en proceso de refresh
      isRefreshing = true;
      originalRequest._retry = true;

      try {
        // Intentar renovar el token
        const success = await refreshAccessToken();

        if (!success) {
          throw new Error("refreshAccessToken retornó false");
        }

        // Notificar a las peticiones encoladas que todo está listo
        processQueue(null, "refreshed");

        // Reintentar la petición original
        // Las cookies actualizadas se envían automáticamente
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        const errorMessage =
          refreshError instanceof Error
            ? refreshError.message
            : "Error desconocido";

        const isRefreshTokenExpired =
          refreshError instanceof Error &&
          refreshError.message === "REFRESH_TOKEN_EXPIRED";

        if (isRefreshTokenExpired) {
          clientLogger.warn(
            "🔄 Refresh token expirado - redirigiendo al login automáticamente"
          );
        } else {
          clientLogger.error("Fallo al renovar token", {
            error: errorMessage,
          });
        }

        // Limpiar cookies del servidor
        await clearAuthCookiesFromServer();

        // Limpiar sesión del cliente
        const { AuthService } = await import("@/lib/services/AuthService");
        AuthService.clearClientSession();

        // Notificar error a todas las peticiones encoladas
        processQueue(refreshError, null);

        // Redirigir al login cuando el refresh token ha expirado o cuando cualquier refresh falla
        // Esto sucede cuando el usuario cierra el navegador y regresa después de mucho tiempo
        if (typeof window !== "undefined") {
          // Guardar mensaje para mostrar en login
          const message = isRefreshTokenExpired
            ? "Tu sesión ha expirado. Por favor inicia sesión nuevamente."
            : "Error de autenticación. Por favor inicia sesión nuevamente.";
          sessionStorage.setItem("auth_error", message);
          // Redirigir al login
          window.location.href = "/login";
        }

        // Rechazar la petición original
        return Promise.reject(refreshError);
      } finally {
        // Resetear flag de refresh en curso
        isRefreshing = false;
      }
    }

    // Para otros errores (no 401), simplemente rechazar
    clientLogger.info(
      `Rechazando error ${error.response?.status || "sin status"}`
    );
    return Promise.reject(error);
  }
);

export default axiosInstance;
