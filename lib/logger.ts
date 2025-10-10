/**
 * Sistema de Logging Estructurado con Pino
 *
 * Este módulo configura Pino para logging estructurado en el proyecto.
 * En desarrollo y producción genera JSON estructurado para agregación de logs.
 *
 * Nota: No usamos pino-pretty transport porque causa problemas con Next.js Server Actions
 * debido a workers threads. En su lugar, el output JSON puede ser formateado externamente
 * o enviado a servicios de logging.
 *
 * @module logger
 */

import pino from "pino";

// Detectar si estamos en desarrollo
const isDevelopment = process.env.NODE_ENV === "development";

/**
 * Logger principal de la aplicación
 *
 * Configuración:
 * - JSON estructurado en todos los entornos
 * - Nivel de log: Configurable via LOG_LEVEL env var
 * - Timestamp: ISO 8601
 * - Campos base: env, revision
 */
export const logger = pino({
  // Nivel de log configurable (default: info en desarrollo, error en producción)
  level: process.env.LOG_LEVEL || (isDevelopment ? "info" : "error"),

  // Formateo del nivel de log
  formatters: {
    level: (label) => {
      return { level: label };
    },
  },

  // Campos base que aparecen en todos los logs
  base: {
    env: process.env.NODE_ENV,
    revision: process.env.VERCEL_GIT_COMMIT_SHA || "local",
  },

  // Timestamp en formato ISO 8601
  timestamp: pino.stdTimeFunctions.isoTime,
});

/**
 * Logger especializado para Server Actions
 *
 * Uso: Para todas las funciones que son Server Actions de Next.js
 * Contexto: server-action
 */
export const actionLogger = logger.child({ context: "server-action" });

/**
 * Logger especializado para peticiones API
 *
 * Uso: Para logging de peticiones HTTP al backend
 * Contexto: api-request
 */
export const apiLogger = logger.child({ context: "api-request" });

/**
 * Logger especializado para errores críticos
 *
 * Uso: Para errores que requieren atención inmediata
 * Contexto: error
 * Nivel forzado: error
 */
export const errorLogger = logger.child({ context: "error", level: "error" });
