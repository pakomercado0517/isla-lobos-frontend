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
    clientLogger.info("🔄 Iniciando renovación de access token...");
    clientLogger.info(`📡 Llamando a: ${config.api.baseUrl}/auth/refresh`);
    
    // Hacer petición directa al endpoint de refresh
    // Las cookies httpOnly se envían automáticamente
    const response = await fetch(`${config.api.baseUrl}/auth/refresh`, {
      method: "POST",
      credentials: "include", // Importante: incluir cookies
      headers: {
        "Content-Type": "application/json",
      },
    });

    clientLogger.info(`📥 Respuesta recibida - Status: ${response.status}`);

    if (!response.ok) {
      const errorText = await response.text();
      clientLogger.error(`❌ Response no OK: ${response.status} - ${errorText}`);
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    clientLogger.info("📦 Data recibida:", data);

    if (data.status === "success") {
      clientLogger.info("✅ Access token renovado exitosamente");
      return true;
    } else {
      clientLogger.error("❌ Backend retornó error:", data);
      throw new Error(data.message || "Error al refrescar token");
    }
  } catch (error) {
    clientLogger.error("❌ Error al renovar access token:", error);
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
      clientLogger.info("🔐 Detectado 401, iniciando renovación de token...");

      // Si ya hay un refresh en curso, encolar esta petición
      if (isRefreshing) {
        clientLogger.info("⏳ Refresh en curso, encolando petición...");

        try {
          // Esperar a que el refresh termine
          await new Promise<string>((resolve, reject) => {
            failedQueue.push({ resolve, reject });
          });

          clientLogger.info("✅ Refresh completado, reintentando petición encolada");

          // Las cookies actualizadas se envían automáticamente
          // Reintentar la petición
          return axiosInstance(originalRequest);
        } catch (queueError) {
          clientLogger.error("❌ Error al procesar petición encolada", queueError);
          return Promise.reject(queueError);
        }
      }

      // Marcar como en proceso de refresh
      isRefreshing = true;
      originalRequest._retry = true;

      try {
        // Intentar renovar el token
        clientLogger.info("🔄 Llamando a refreshAccessToken()...");
        const success = await refreshAccessToken();

        if (!success) {
          throw new Error("refreshAccessToken retornó false");
        }

        // Notificar a las peticiones encoladas que todo está listo
        processQueue(null, "refreshed");

        clientLogger.info("✅ Token renovado exitosamente, reintentando petición original");

        // Reintentar la petición original
        // Las cookies actualizadas se envían automáticamente
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
        clientLogger.info("🏁 Refresh process finalizado");
      }
    }

    // Para otros errores (no 401), simplemente rechazar
    clientLogger.info(`Rechazando error ${error.response?.status || 'sin status'}`);
    return Promise.reject(error);
  }
);

export default axiosInstance;
