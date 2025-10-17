"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import {
  HomepageStats,
  HomepageStatsConfig,
  HomepageStatsHookState,
  PublicApiResponse,
} from "@/lib/types/public";
import { getHomepageConfig } from "@/lib/config/homepage";
import { clientLogger } from "../logger-client";

/**
 * Obtener configuración centralizada del sistema
 */
function getDefaultConfig(): HomepageStatsConfig {
  const config = getHomepageConfig();
  return {
    updateInterval: config.intervals.homepage_stats,
    autoRefresh: true,
    maxRetries: config.retries.max_attempts,
  };
}

/**
 * Hook para manejar las estadísticas públicas de la homepage
 * Actualización automática cada hora (configurable) con manejo de errores y cache local
 */
export function useHomepageStats(
  config: Partial<HomepageStatsConfig> = {}
): HomepageStatsHookState {
  const finalConfig = { ...getDefaultConfig(), ...config };

  const [stats, setStats] = useState<HomepageStats | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const [lastUpdate, setLastUpdate] = useState<number | null>(null);

  // Referencias para cleanup y control
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const retryCountRef = useRef<number>(0);
  const abortControllerRef = useRef<AbortController | null>(null);
  const apiURL = process.env.NEXT_PUBLIC_API_URL;

  /**
   * Función para hacer la petición HTTP a la API
   */
  const fetchHomepageStats = useCallback(
    async (signal?: AbortSignal): Promise<HomepageStats> => {
      try {
        const response = await fetch(`${apiURL}/public/homepage-stats`, {
          signal,
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result: PublicApiResponse<HomepageStats> = await response.json();

        if (result.status !== "success") {
          throw new Error(result.error || "Error en la respuesta de la API");
        }

        return result.data;
      } catch (fetchError) {
        if (fetchError instanceof Error && fetchError.name === "AbortError") {
          throw new Error("Request was cancelled");
        }
        throw fetchError;
      }
    },
    []
  );

  /**
   * Función principal para cargar los datos con manejo de reintentos
   */
  const loadStats = useCallback(async (): Promise<void> => {
    try {
      setLoading(true);
      setError("");

      // Cancelar petición anterior si existe
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }

      // Crear nuevo AbortController para esta petición
      abortControllerRef.current = new AbortController();

      const data = await fetchHomepageStats(abortControllerRef.current.signal);

      setStats(data);
      setLastUpdate(Date.now());
      retryCountRef.current = 0; // Reset retry count on success

      clientLogger.info("Homepage stats loaded successfully", {
        fecha_consulta: data.fecha_consulta,
        hora_consulta: data.hora_consulta,
        puerto_estado: data.puerto.estado,
        embarcaciones_total: data.embarcaciones.total_registradas,
        salidas_programadas: data.actividad_hoy.salidas_programadas,
      });
    } catch (loadError) {
      const errorMessage =
        loadError instanceof Error ? loadError.message : "Error desconocido";

      // Ignorar errores de cancelación
      if (errorMessage === "Request was cancelled") {
        return;
      }

      setError(errorMessage);
      retryCountRef.current++;

      clientLogger.error("Error loading homepage stats", {
        error: errorMessage,
        retry_count: retryCountRef.current,
        max_retries: finalConfig.maxRetries,
      });

      // Reintentar si no hemos excedido el límite
      if (
        retryCountRef.current < finalConfig.maxRetries &&
        finalConfig.autoRefresh
      ) {
        setTimeout(() => {
          loadStats();
        }, Math.min(1000 * Math.pow(2, retryCountRef.current), 30000)); // Exponential backoff, max 30s
      }
    } finally {
      setLoading(false);
    }
  }, [fetchHomepageStats, finalConfig.maxRetries, finalConfig.autoRefresh]);

  /**
   * Función para refrescar manualmente los datos
   */
  const refresh = useCallback(async (): Promise<void> => {
    retryCountRef.current = 0; // Reset retry count on manual refresh
    await loadStats();
  }, [loadStats]);

  /**
   * Configurar el intervalo de actualización automática
   */
  useEffect(() => {
    if (!finalConfig.autoRefresh) {
      return;
    }

    // Limpiar intervalo anterior si existe
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    // Configurar nuevo intervalo
    intervalRef.current = setInterval(() => {
      loadStats();
    }, finalConfig.updateInterval);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [finalConfig.autoRefresh, finalConfig.updateInterval, loadStats]);

  /**
   * Cargar datos iniciales
   */
  useEffect(() => {
    loadStats();

    // Cleanup al desmontar el componente
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [loadStats]);

  return {
    stats,
    loading,
    error,
    refresh,
    lastUpdate,
  };
}

/**
 * Hook simplificado para obtener solo el estado del puerto
 * Útil para componentes que solo necesitan esta información
 */
export function usePuertoStatus() {
  const config = getHomepageConfig();
  const { stats, loading, error } = useHomepageStats({
    autoRefresh: true,
    updateInterval: config.intervals.puerto_status, // Usar configuración específica para puerto
  });

  return {
    puerto: stats?.puerto || null,
    loading,
    error,
  };
}
