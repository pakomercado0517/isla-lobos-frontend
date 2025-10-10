/**
 * Logger para componentes del lado del cliente (browser)
 *
 * Pino no funciona en el navegador, así que usamos una implementación simple
 * que puede ser reemplazada por servicios como Sentry, LogRocket, etc.
 *
 * @module logger-client
 */

interface LogContext {
  [key: string]: unknown;
}

/**
 * Logger para el cliente (browser)
 * Solo activo en desarrollo. En producción debería integrarse con servicios externos.
 */
export const clientLogger = {
  /**
   * Log de información
   */
  info: (message: string, context?: LogContext) => {
    if (process.env.NODE_ENV === "development") {
      console.log(`[INFO] ${message}`, context || {});
    }
    // TODO: En producción, enviar a servicio de logging externo (Sentry, LogRocket, etc.)
  },

  /**
   * Log de advertencia
   */
  warn: (message: string, context?: LogContext) => {
    if (process.env.NODE_ENV === "development") {
      console.warn(`[WARN] ${message}`, context || {});
    }
    // TODO: En producción, enviar a servicio de logging externo
  },

  /**
   * Log de error
   */
  error: (message: string, error?: Error | unknown, context?: LogContext) => {
    const errorDetails = {
      ...context,
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
    };

    if (process.env.NODE_ENV === "development") {
      console.error(`[ERROR] ${message}`, errorDetails);
    } else {
      // En producción, también loguear para servicios externos
      console.error(`[ERROR] ${message}`, errorDetails);
      // TODO: Enviar a Sentry, LogRocket, etc.
    }
  },

  /**
   * Log de debug (solo desarrollo)
   */
  debug: (message: string, context?: LogContext) => {
    if (process.env.NODE_ENV === "development") {
      console.debug(`[DEBUG] ${message}`, context || {});
    }
  },
};
