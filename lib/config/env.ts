import { logger } from "@/lib/logger";

// Configuración centralizada de variables de entorno
export const config = {
  // API Configuration
  api: {
    baseUrl: process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api",
    timeout: parseInt(process.env.NEXT_PUBLIC_API_TIMEOUT || "10000"),
  },

  // App Configuration
  app: {
    name: process.env.NEXT_PUBLIC_APP_NAME || "Isla Lobos",
    version: process.env.NEXT_PUBLIC_APP_VERSION || "1.0.0",
    environment: process.env.NODE_ENV || "development",
  },

  // Storage Configuration
  storage: {
    tokenKey: process.env.NEXT_PUBLIC_TOKEN_KEY || "auth_token",
    userKey: process.env.NEXT_PUBLIC_USER_KEY || "user_key",
    refreshTokenKey:
      process.env.NEXT_PUBLIC_REFRESH_TOKEN_KEY || "refresh_token",
  },

  // Feature Flags
  features: {
    enableDebug: process.env.NODE_ENV === "development",
    enableAnalytics: process.env.NODE_ENV === "production",
  },
} as const;

// Validación de variables críticas
export const validateConfig = () => {
  const errors: string[] = [];

  if (!config.api.baseUrl) {
    errors.push("NEXT_PUBLIC_API_URL is required");
  }

  if (config.api.timeout < 1000) {
    errors.push("API timeout should be at least 1000ms");
  }

  if (errors.length > 0) {
    logger.error({ errors }, "Configuration validation failed");
    throw new Error(`Configuration validation failed: ${errors.join(", ")}`);
  }

  return true;
};

// Log de configuración en desarrollo
if (config.features.enableDebug) {
  logger.info(
    {
      api: {
        baseUrl: config.api.baseUrl,
        timeout: config.api.timeout,
      },
      app: {
        name: config.app.name,
        version: config.app.version,
        environment: config.app.environment,
      },
    },
    "App Configuration loaded"
  );
}
