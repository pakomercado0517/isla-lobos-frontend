import axios, {
  AxiosError,
  InternalAxiosRequestConfig,
  AxiosRequestHeaders,
} from "axios";
import { config } from "@/lib/config/env";
import AuthService from "@/lib/services/AuthService";
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
 * Instancia de Axios configurada con interceptores de autenticación
 */
const axiosInstance = axios.create({
  baseURL: config.api.baseUrl,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// ========================================
// INTERCEPTOR DE REQUEST
// Agrega el Authorization header automáticamente
// ========================================
axiosInstance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const accessToken = AuthService.getAccessToken();
    
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
    if (error.response?.status === 401 && AuthService.hasTokens()) {
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
        // Intentar renovar el token
        clientLogger.info("🔄 Renovando access token...");
        const newToken = await AuthService.refreshAccessToken();

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
          action: "Limpiando tokens y requiriendo re-login",
        });

        // Limpiar tokens (la sesión ya no es válida)
        AuthService.clearTokens();

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
