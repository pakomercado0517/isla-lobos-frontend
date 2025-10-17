/**
 * Configuración para la homepage y estadísticas públicas
 * Sistema configurable para futuras modificaciones
 */

export interface HomepageConfiguration {
  /** Configuración de intervalos de actualización */
  intervals: {
    /** Estadísticas generales (default: 1 hora) */
    homepage_stats: number;
    /** Estado del puerto (más crítico - default: 10 minutos) */
    puerto_status: number;
  };
  /** Configuración de reintentos */
  retries: {
    /** Máximo número de reintentos en caso de error */
    max_attempts: number;
    /** Base para backoff exponencial (ms) */
    backoff_base: number;
    /** Máximo tiempo de espera entre reintentos (ms) */
    max_backoff: number;
  };
  /** Configuración de UI */
  ui: {
    /** Mostrar alertas de error */
    show_error_alerts: boolean;
    /** Mostrar botón de retry en alertas */
    show_retry_button: boolean;
    /** Animaciones de loading */
    show_loading_animations: boolean;
  };
  /** Configuración de logging */
  logging: {
    /** Nivel de logging para cliente */
    level: "debug" | "info" | "warn" | "error";
    /** Incluir metadata en logs */
    include_metadata: boolean;
  };
}

/**
 * Configuración por defecto del sistema
 * NOTA: Estos valores pueden ser modificados en el futuro sin cambiar código
 */
export const DEFAULT_HOMEPAGE_CONFIG: HomepageConfiguration = {
  intervals: {
    // 1 hora = 60 * 60 * 1000 ms
    homepage_stats: 60 * 60 * 1000,
    // 10 minutos = 10 * 60 * 1000 ms (más frecuente por ser crítico)
    puerto_status: 10 * 60 * 1000,
  },
  retries: {
    max_attempts: 3,
    backoff_base: 1000, // 1 segundo base
    max_backoff: 30000, // 30 segundos máximo
  },
  ui: {
    show_error_alerts: true,
    show_retry_button: true,
    show_loading_animations: true,
  },
  logging: {
    level: "info",
    include_metadata: true,
  },
};

/**
 * Configuraciones predefinidas para diferentes escenarios
 */
export const HOMEPAGE_PRESETS = {
  /**
   * Configuración para desarrollo - más frecuente y verbose
   */
  development: {
    ...DEFAULT_HOMEPAGE_CONFIG,
    intervals: {
      homepage_stats: 2 * 60 * 1000, // 2 minutos
      puerto_status: 1 * 60 * 1000,  // 1 minuto
    },
    logging: {
      level: "debug" as const,
      include_metadata: true,
    },
  },

  /**
   * Configuración para producción - optimizada para rendimiento
   */
  production: {
    ...DEFAULT_HOMEPAGE_CONFIG,
    intervals: {
      homepage_stats: 60 * 60 * 1000, // 1 hora
      puerto_status: 15 * 60 * 1000,  // 15 minutos
    },
    logging: {
      level: "warn" as const,
      include_metadata: false,
    },
  },

  /**
   * Configuración para emergencias - muy frecuente
   */
  emergency: {
    ...DEFAULT_HOMEPAGE_CONFIG,
    intervals: {
      homepage_stats: 5 * 60 * 1000,  // 5 minutos
      puerto_status: 1 * 60 * 1000,   // 1 minuto
    },
    retries: {
      max_attempts: 5,
      backoff_base: 500,
      max_backoff: 10000,
    },
  },

  /**
   * Configuración conservadora - menos frecuente
   */
  conservative: {
    ...DEFAULT_HOMEPAGE_CONFIG,
    intervals: {
      homepage_stats: 2 * 60 * 60 * 1000, // 2 horas
      puerto_status: 30 * 60 * 1000,      // 30 minutos
    },
  },
} as const;

/**
 * Función para obtener la configuración actual
 * Permite cambiar fácilmente entre presets o usar configuración personalizada
 */
export function getHomepageConfig(): HomepageConfiguration {
  // En el futuro, esto podría leer de:
  // - Variables de entorno
  // - Base de datos de configuración
  // - Local Storage
  // - API de configuración
  
  const environment = process.env.NODE_ENV;
  
  switch (environment) {
    case "development":
      return HOMEPAGE_PRESETS.development;
    case "production":
      return HOMEPAGE_PRESETS.production;
    default:
      return DEFAULT_HOMEPAGE_CONFIG;
  }
}

/**
 * Utilidades para conversión de intervalos
 */
export const INTERVAL_HELPERS = {
  /** Convierte minutos a milisegundos */
  minutes: (min: number) => min * 60 * 1000,
  /** Convierte horas a milisegundos */
  hours: (hours: number) => hours * 60 * 60 * 1000,
  /** Convierte días a milisegundos */
  days: (days: number) => days * 24 * 60 * 60 * 1000,
} as const;

/**
 * Función para crear configuración personalizada fácilmente
 */
export function createHomepageConfig(
  overrides: Partial<HomepageConfiguration>
): HomepageConfiguration {
  return {
    ...DEFAULT_HOMEPAGE_CONFIG,
    ...overrides,
    intervals: {
      ...DEFAULT_HOMEPAGE_CONFIG.intervals,
      ...overrides.intervals,
    },
    retries: {
      ...DEFAULT_HOMEPAGE_CONFIG.retries,
      ...overrides.retries,
    },
    ui: {
      ...DEFAULT_HOMEPAGE_CONFIG.ui,
      ...overrides.ui,
    },
    logging: {
      ...DEFAULT_HOMEPAGE_CONFIG.logging,
      ...overrides.logging,
    },
  };
}

/**
 * Ejemplo de uso futuro:
 * 
 * // Cambiar a modo emergencia
 * const emergencyConfig = HOMEPAGE_PRESETS.emergency;
 * 
 * // Configuración personalizada
 * const customConfig = createHomepageConfig({
 *   intervals: {
 *     homepage_stats: INTERVAL_HELPERS.minutes(30),
 *     puerto_status: INTERVAL_HELPERS.minutes(5),
 *   }
 * });
 */