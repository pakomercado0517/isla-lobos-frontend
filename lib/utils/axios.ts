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
    // Hacer petición directa al endpoint de refresh
    // Las cookies httpOnly se envían automáticamente
    const response = await fetch(`${config.api.baseUrl}/auth/refresh`, {
      method: "POST",
      credentials: "include", // Importante: incluir cookies
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      // const errorText = await response.text();
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();

    if (data.status === "success") {
      const newAccessToken = data.data?.accessToken;

      if (!newAccessToken) {
        throw new Error("El servidor no devolvió un access token válido");
      }

      // Verificar headers Set-Cookie antes de leer el body
      const setCookieHeader = response.headers.get("set-cookie");

      if (setCookieHeader) {
        // Si el backend envió Set-Cookie, esperar un momento para que el navegador procese la cookie
        await new Promise((resolve) => setTimeout(resolve, 100));
      } else {
        // Si el backend NO envió Set-Cookie, actualizar la cookie del servidor manualmente
        // Esto es necesario para sincronizar las cookies del cliente y del servidor
        // Las Server Actions leen las cookies del servidor, no del navegador
        try {
          const { updateAccessTokenCookie } = await import(
            "@/actions/token-service"
          );
          await updateAccessTokenCookie(newAccessToken);
          clientLogger.info(
            "Cookie del servidor actualizada mediante Server Action"
          );
        } catch (updateError) {
          clientLogger.error(
            "Error al actualizar cookie del servidor mediante Server Action",
            updateError
          );
          // No lanzamos error aquí porque el token fue renovado exitosamente
          // Solo logueamos el error para debugging
        }
      }

      return true;
    } else {
      throw new Error(data.message || "Error al refrescar token");
    }
  } catch (error) {
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

        clientLogger.error("Fallo al renovar token", {
          error: errorMessage,
        });

        // Limpiar cookies del servidor
        await clearAuthCookiesFromServer();

        // Limpiar sesión del cliente
        const { AuthService } = await import("@/lib/services/AuthService");
        AuthService.clearClientSession();

        // Notificar error a todas las peticiones encoladas
        processQueue(refreshError, null);

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
