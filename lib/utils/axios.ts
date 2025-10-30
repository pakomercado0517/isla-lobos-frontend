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
 * Obtiene el access token desde las cookies del servidor mediante Server Action
 * @returns Access token o null
 */
async function getAccessTokenFromServer(): Promise<string | null> {
  try {
    const { getAccessTokenFromCookies } = await import("@/actions/token-service");
    return await getAccessTokenFromCookies();
  } catch (error) {
    clientLogger.error("Error al obtener access token del servidor", error);
    return null;
  }
}

/**
 * Refresca el access token mediante Server Action
 * @returns Nuevo access token o null si falla
 */
async function refreshAccessTokenFromServer(): Promise<string | null> {
  try {
    const { refreshAccessTokenFromCookies } = await import("@/actions/token-service");
    return await refreshAccessTokenFromCookies();
  } catch (error) {
    clientLogger.error("Error al refrescar token desde servidor", error);
    return null;
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
 */
const axiosInstance = axios.create({
  baseURL: config.api.baseUrl,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
  // Permitir envío de cookies
  withCredentials: true,
});

// ========================================
// INTERCEPTOR DE REQUEST
// Agrega el Authorization header automáticamente obteniendo token de cookies
// ========================================
axiosInstance.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    // Obtener token desde cookies del servidor
    const accessToken = await getAccessTokenFromServer();

    if (accessToken && config.headers) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }

    return config;
  },
  (error) => {
    clientLogger.error("Error en interceptor de request", error);
    return Promise.reject(error);
  }
);

// ========================================
// INTERCEPTOR DE RESPONSE
// Maneja renovación automática de tokens en 401
// ========================================
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    // Verificar que tenemos configuración válida
    if (!error.config) {
      return Promise.reject(error);
    }

    const originalRequest = error.config as RequestWithRetry;

    // Evitar loop infinito: si ya se reintentó, rechazar
    if (originalRequest._retry) {
      clientLogger.warn("Petición ya fue reintentada, abortando");
      return Promise.reject(error);
    }

    // Evitar intentar refresh en endpoints de autenticación
    const authEndpoints = ["/auth/login", "/auth/register", "/auth/refresh"];
    const isAuthEndpoint = authEndpoints.some((endpoint) =>
      originalRequest.url?.includes(endpoint)
    );

    if (isAuthEndpoint) {
      return Promise.reject(error);
    }

    // Manejar error 401 (token expirado)
    if (error.response?.status === 401) {
      clientLogger.info("🔐 Detectado 401, iniciando renovación de token...");

      // Si ya hay un refresh en curso, encolar esta petición
      if (isRefreshing) {
        clientLogger.info("⏳ Refresh en curso, encolando petición...");

        try {
          const token = await new Promise<string>((resolve, reject) => {
            failedQueue.push({ resolve, reject });
          });

          // Actualizar el header con el nuevo token
          if (originalRequest.headers) {
            originalRequest.headers.Authorization = `Bearer ${token}`;
          }

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
        // Intentar renovar el token mediante Server Action
        clientLogger.info("🔄 Renovando access token desde servidor...");
        const newToken = await refreshAccessTokenFromServer();

        if (!newToken) {
          throw new Error("No se pudo obtener nuevo access token");
        }

        // Notificar a las peticiones encoladas
        processQueue(null, newToken);

        // Actualizar el header de la petición original
        if (originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
        }

        clientLogger.info("✅ Token renovado, reintentando petición original");

        // Reintentar la petición original
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        const errorMessage =
          refreshError instanceof Error
            ? refreshError.message
            : "Error desconocido";

        clientLogger.error("❌ Fallo al renovar token", {
          error: errorMessage,
          action: "Limpiando cookies y requiriendo re-login",
        });

        // Limpiar cookies mediante Server Action
        await clearAuthCookiesFromServer();

        // Notificar error a todas las peticiones encoladas
        processQueue(refreshError, null);

        // Rechazar la petición original
        // El componente debe manejar el error y redirigir
        return Promise.reject(refreshError);
      } finally {
        // Resetear flag de refresh en curso
        isRefreshing = false;
      }
    }

    // Para otros errores (no 401), simplemente rechazar
    return Promise.reject(error);
  }
);

export default axiosInstance;
