"use client";

import { useState, useEffect, useCallback, useRef, useMemo } from "react";
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
  // Usar useMemo para evitar que finalConfig cambie en cada render
  const finalConfig = useMemo(() => {
    const defaultConfig = getDefaultConfig();
    return {
      updateInterval: config.updateInterval ?? defaultConfig.updateInterval,
      autoRefresh: config.autoRefresh ?? defaultConfig.autoRefresh,
      maxRetries: config.maxRetries ?? defaultConfig.maxRetries,
    };
  }, [config.updateInterval, config.autoRefresh, config.maxRetries]);

  const [stats, setStats] = useState<HomepageStats | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const [lastUpdate, setLastUpdate] = useState<number | null>(null);

  // Referencias para cleanup y control
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const retryTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const retryCountRef = useRef<number>(0);
  const abortControllerRef = useRef<AbortController | null>(null);
  const loadStatsRef = useRef<(() => Promise<void>) | null>(null);
  const hasInitialLoadRef = useRef<boolean>(false);
  const isLoadingRef = useRef<boolean>(false); // Prevenir múltiples cargas simultáneas
  const lastLoadWasSuccessfulRef = useRef<boolean>(false); // Indicar si la última carga fue exitosa
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
          const errorText = await response.text().catch(() => "Error desconocido");
          throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
        }

        const result: PublicApiResponse<HomepageStats> = await response.json();

        // Validar que la respuesta tenga el formato esperado
        if (!result || typeof result !== "object") {
          throw new Error("Respuesta inválida: formato de datos incorrecto");
        }

        if (result.status !== "success") {
          throw new Error(result.error || "Error en la respuesta de la API");
        }

        if (!result.data) {
          throw new Error("Respuesta inválida: datos faltantes en la respuesta");
        }

        return result.data;
      } catch (fetchError) {
        if (fetchError instanceof Error && fetchError.name === "AbortError") {
          throw new Error("Request was cancelled");
        }
        throw fetchError;
      }
    },
    [apiURL]
  );

  /**
   * Función principal para cargar los datos con manejo de reintentos
   */
  const loadStats = useCallback(async (): Promise<void> => {
    // Prevenir múltiples cargas simultáneas
    if (isLoadingRef.current) {
      return;
    }

    // Verificar si ya se alcanzó el límite de reintentos antes de intentar
    if (retryCountRef.current >= finalConfig.maxRetries) {
      setLoading(false);
      setError("No se pudo cargar la información. Por favor, verifica que el servidor esté en ejecución.");
      return;
    }

    isLoadingRef.current = true;

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

      // Éxito: resetear contador y actualizar estado
      setStats(data);
      setLastUpdate(Date.now());
      setLoading(false);
      retryCountRef.current = 0; // Reset retry count on success
      isLoadingRef.current = false;
      lastLoadWasSuccessfulRef.current = true; // Marcar como exitoso

      clientLogger.info("Homepage stats loaded successfully", {
        fecha_consulta: data.fecha_consulta,
        hora_consulta: data.hora_consulta,
        puerto_estado: data.puerto.estado,
        embarcaciones_total: data.embarcaciones.total_registradas,
        salidas_programadas: data.actividad_hoy.salidas_programadas,
      });
    } catch (loadError) {
      isLoadingRef.current = false;

      const errorMessage =
        loadError instanceof Error ? loadError.message : "Error desconocido";
      const errorStack = loadError instanceof Error ? loadError.stack : undefined;

      // Ignorar errores de cancelación
      if (errorMessage === "Request was cancelled") {
        return;
      }

      retryCountRef.current++;

      clientLogger.error("Error loading homepage stats", loadError, {
        error_message: errorMessage,
        retry_count: retryCountRef.current,
        max_retries: finalConfig.maxRetries,
        stack: errorStack,
      });

      // Verificar si debemos detener los reintentos
      if (retryCountRef.current >= finalConfig.maxRetries) {
        lastLoadWasSuccessfulRef.current = false; // Marcar como fallido
        setError(
          `No se pudo conectar con el servidor después de ${finalConfig.maxRetries} intentos. Verifica que el backend esté en ejecución.`
        );
        setLoading(false);
        return;
      }

      lastLoadWasSuccessfulRef.current = false; // Marcar como fallido temporalmente

      // Reintentar solo si autoRefresh está activo y no hemos excedido el límite
      if (finalConfig.autoRefresh) {
        // Limpiar timeout anterior si existe
        if (retryTimeoutRef.current) {
          clearTimeout(retryTimeoutRef.current);
        }

        const delay = Math.min(
          1000 * Math.pow(2, retryCountRef.current - 1),
          30000
        ); // Exponential backoff, max 30s

        retryTimeoutRef.current = setTimeout(() => {
          loadStats();
        }, delay);
      } else {
        setError(errorMessage);
        setLoading(false);
      }
    }
  }, [fetchHomepageStats, finalConfig.maxRetries, finalConfig.autoRefresh]);

  /**
   * Función para refrescar manualmente los datos
   */
  const refresh = useCallback(async (): Promise<void> => {
    retryCountRef.current = 0; // Reset retry count on manual refresh
    await loadStats();
  }, [loadStats]);

  // Guardar referencia estable de loadStats para usar en useEffect
  // Usar useEffect para actualizar la referencia sin causar re-renders
  useEffect(() => {
    loadStatsRef.current = loadStats;
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

    // Guardar referencia al maxRetries para usar en el intervalo
    const maxRetries = finalConfig.maxRetries;

    // Configurar nuevo intervalo usando la referencia estable
    // Solo ejecutar si no hay una carga en progreso y la última carga fue exitosa
    // El intervalo es para actualizaciones periódicas, no para reintentos de errores
    intervalRef.current = setInterval(() => {
      // Verificar condiciones antes de ejecutar
      // Solo ejecutar si:
      // 1. No hay carga en progreso
      // 2. La última carga fue exitosa (o es la primera carga)
      // 3. No se ha alcanzado el límite de reintentos
      // Los reintentos de errores se manejan con retryTimeoutRef, no con el intervalo
      if (
        loadStatsRef.current &&
        !isLoadingRef.current &&
        (lastLoadWasSuccessfulRef.current || retryCountRef.current === 0) &&
        retryCountRef.current < finalConfig.maxRetries
      ) {
        loadStatsRef.current();
      }
    }, finalConfig.updateInterval);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      if (retryTimeoutRef.current) {
        clearTimeout(retryTimeoutRef.current);
        retryTimeoutRef.current = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [finalConfig.autoRefresh, finalConfig.updateInterval]); // No incluir loadStats para evitar recrear el intervalo

  /**
   * Cargar datos iniciales (solo una vez al montar)
   */
  useEffect(() => {
    // Prevenir múltiples ejecuciones usando un ref
    if (hasInitialLoadRef.current) {
      return;
    }
    hasInitialLoadRef.current = true;

    let isMounted = true;

    // Usar loadStats directamente en lugar de la referencia para evitar problemas de timing
    const initialLoad = async (): Promise<void> => {
      if (isMounted) {
        await loadStats();
      }
    };

    // Ejecutar después de que el componente esté montado
    initialLoad();

    // Cleanup al desmontar el componente
    return () => {
      isMounted = false;
      hasInitialLoadRef.current = false; // Reset para permitir recarga si el componente se vuelve a montar
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      if (retryTimeoutRef.current) {
        clearTimeout(retryTimeoutRef.current);
        retryTimeoutRef.current = null;
      }
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
        abortControllerRef.current = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Solo ejecutar una vez al montar, sin dependencias

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
