import axios, {
  AxiosError,
  InternalAxiosRequestConfig,
  AxiosRequestHeaders,
} from "axios";
import { config } from "@/lib/config/env";
import AuthService from "@/lib/services/AuthService";

// Crear instancia de axios con configuración base
const axiosInstance = axios.create({
  baseURL: config.api.baseUrl,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Variable para controlar si hay un refresh en curso
let isRefreshing = false;
interface QueueItem {
  resolve: (token: string) => void;
  reject: (error: Error | unknown) => void;
}

let failedQueue: QueueItem[] = [];

// Procesar cola de peticiones fallidas
const processQueue = (
  error: Error | unknown | null,
  token: string | null = null
): void => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else if (token) {
      prom.resolve(token);
    } else {
      prom.reject(new Error("No se recibió token ni error"));
    }
  });

  failedQueue = [];
};

// Interceptor de peticiones
axiosInstance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const accessToken = AuthService.getAccessToken();
    if (accessToken) {
      config.headers["Authorization"] = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor de respuestas
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    // Asegurarnos de que tenemos una configuración válida
    if (!error.config) {
      return Promise.reject(error);
    }

    interface RequestWithRetry extends InternalAxiosRequestConfig {
      _retry?: boolean;
      headers: AxiosRequestHeaders;
    }

    // Si no hay config o ya se reintentó, rechazar
    const requestWithRetry = error.config as RequestWithRetry;
    if (requestWithRetry._retry) {
      return Promise.reject(error);
    }

    // Si el error es 401 y tenemos refresh token, intentar renovar
    if (error.response?.status === 401 && AuthService.hasTokens()) {
      if (isRefreshing) {
        // Si ya hay un refresh en curso, encolar esta petición
        try {
          const token = await new Promise<string>((resolve, reject) => {
            failedQueue.push({ resolve, reject });
          });
          requestWithRetry.headers.Authorization = `Bearer ${token}`;
          return axios(requestWithRetry);
        } catch (err) {
          return Promise.reject(err);
        }
      }

      // Marcar que estamos refrescando y que este request se reintentará
      isRefreshing = true;
      requestWithRetry._retry = true;

      try {
        // Intentar refrescar el token
        const newToken = await AuthService.refreshAccessToken();

        // Procesar cola de peticiones pendientes
        processQueue(null, newToken);

        // Actualizar el token en la petición original y reintentarla
        requestWithRetry.headers.Authorization = `Bearer ${newToken}`;
        return axios(requestWithRetry);
      } catch (refreshError) {
        // Si falla el refresh, procesar cola con error y rechazar
        processQueue(refreshError, null);
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    // Para otros errores, simplemente rechazar
    return Promise.reject(error);
  }
);

export default axiosInstance;
