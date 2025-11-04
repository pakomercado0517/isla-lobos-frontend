"use server";

import { cookies } from "next/headers";
import { config } from "@/lib/config/env";
import { errorLogger } from "@/lib/logger";

/**
 * Estructura de tokens de autenticación
 */
export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

/**
 * Respuesta del backend al refrescar token
 */
interface RefreshTokenResponse {
  status: "success" | "error";
  message?: string;
  data?: {
    accessToken: string;
  };
  error?: string;
}

/**
 * Opciones de configuración para cookies del usuario
 */
interface UserCookieOptions {
  httpOnly: false;
  secure: boolean;
  sameSite: "none" | "lax";
  maxAge: number;
  path: "/";
}

/**
 * Server Action: Obtiene el access token de las cookies
 * @returns Access token o null si no existe
 */
export async function getAccessTokenFromCookies(): Promise<string | null> {
  try {
    const cookieStore = await cookies();
    const tokenCookie = cookieStore.get(config.storage.tokenKey);
    return tokenCookie?.value || null;
  } catch (error) {
    errorLogger.error(
      { error: error instanceof Error ? error.message : String(error) },
      "Error al obtener access token de cookies"
    );
    return null;
  }
}

/**
 * Server Action: Obtiene el refresh token de las cookies
 * @returns Refresh token o null si no existe
 */
export async function getRefreshTokenFromCookies(): Promise<string | null> {
  try {
    const cookieStore = await cookies();
    const refreshTokenCookie = cookieStore.get(config.storage.refreshTokenKey);
    return refreshTokenCookie?.value || null;
  } catch (error) {
    errorLogger.error(
      { error: error instanceof Error ? error.message : String(error) },
      "Error al obtener refresh token de cookies"
    );
    return null;
  }
}

/**
 * Server Action: Verifica si existen tokens en las cookies
 * @returns true si existen ambos tokens
 */
export async function hasTokensInCookies(): Promise<boolean> {
  try {
    const accessToken = await getAccessTokenFromCookies();
    const refreshToken = await getRefreshTokenFromCookies();
    return !!(accessToken && refreshToken);
  } catch {
    return false;
  }
}

/**
 * Server Action: Actualiza solo el access token en las cookies
 *
 * NOTA: Esta función ya no establece cookies de tokens desde el frontend.
 * Los tokens ahora son manejados exclusivamente por el backend.
 * Esta función se mantiene por compatibilidad pero no hace nada.
 *
 * @param _newAccessToken - Nuevo access token (no usado, mantenido por compatibilidad)
 * @deprecated Los tokens ahora son manejados por el backend
 */
export async function updateAccessTokenCookie(
  _newAccessToken: string
): Promise<void> {
  // Los tokens ahora son manejados exclusivamente por el backend.
  // El backend establece las cookies automáticamente en las respuestas.
  // No necesitamos actualizar cookies desde el frontend.
  errorLogger.info(
    "updateAccessTokenCookie llamado - tokens ahora son manejados por el backend"
  );
}

/**
 * Server Action: Refresca el access token usando el refresh token de cookies
 *
 * NOTA: Esta función ahora hace una petición al backend que maneja las cookies automáticamente.
 * El backend establece las cookies en la respuesta, no necesitamos hacerlo desde el frontend.
 *
 * @returns Nuevo access token o null si falla
 */
export async function refreshAccessTokenFromCookies(): Promise<string | null> {
  const requestId = crypto.randomUUID();

  try {
    // Hacer petición al backend para refrescar el token
    // El backend leerá el refreshToken de las cookies automáticamente
    // y establecerá el nuevo accessToken en las cookies de la respuesta
    const response = await fetch(`${config.api.baseUrl}/auth/refresh`, {
      method: "POST",
      credentials: "include", // CRÍTICO: Incluir cookies en la petición
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data: RefreshTokenResponse = await response.json();

    // Verificar respuesta exitosa
    if (!response.ok || data.status !== "success") {
      const errorMessage =
        data.error || data.message || "Error al refrescar el token";
      errorLogger.error(
        {
          requestId,
          status: response.status,
          error: errorMessage,
        },
        "Error en respuesta del backend al refrescar token"
      );
      throw new Error(errorMessage);
    }

    // Verificar que tenemos el nuevo token (aunque no lo guardamos, lo retornamos para compatibilidad)
    const newAccessToken = data.data?.accessToken;

    if (!newAccessToken) {
      errorLogger.error(
        { requestId },
        "No se recibió access token en la respuesta del refresh"
      );
      throw new Error("El servidor no devolvió un access token válido");
    }

    // El backend ya estableció las cookies en la respuesta Set-Cookie
    // No necesitamos actualizar cookies desde el frontend
    return newAccessToken;
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Error desconocido";

    errorLogger.error(
      {
        requestId,
        error: errorMessage,
      },
      "Error al renovar access token"
    );

    // Limpiar solo la cookie del usuario si falla la renovación
    // Los tokens son manejados por el backend y se limpian automáticamente
    await clearAuthCookies();

    return null;
  }
}

/**
 * Server Action: Limpia las cookies de autenticación del frontend
 *
 * NOTA: Solo limpia la cookie del usuario (userKey) del dominio del frontend.
 * Los tokens (accessToken y refreshToken) son manejados por el backend
 * y se limpian automáticamente cuando el backend lo requiere.
 */
export async function clearAuthCookies(): Promise<void> {
  try {
    const cookieStore = await cookies();

    // Solo limpiar la cookie del usuario del frontend
    // Los tokens son manejados por el backend y no están en el dominio del frontend
    cookieStore.delete(config.storage.userKey);

    // Intentar limpiar tokens por si acaso existen (legacy)
    // pero normalmente estos no existen en el dominio del frontend
    cookieStore.delete(config.storage.tokenKey);
    cookieStore.delete(config.storage.refreshTokenKey);
  } catch (error) {
    errorLogger.error(
      { error: error instanceof Error ? error.message : String(error) },
      "Error al limpiar cookies de autenticación"
    );
  }
}

/**
 * Server Action: Establece las cookies de autenticación
 *
 * IMPORTANTE: Los tokens (accessToken y refreshToken) ahora son manejados
 * exclusivamente por el backend. Esta función solo establece la cookie del
 * usuario (userKey) que es accesible desde el cliente para mostrar información.
 *
 * @param tokens - Tokens de acceso y refresh (no se usan, mantenidos por compatibilidad)
 * @param userData - Datos del usuario (string JSON) - Solo esto se guarda en cookies del frontend
 */
export async function setAuthCookies(
  tokens: AuthTokens,
  userData: string
): Promise<void> {
  try {
    const cookieStore = await cookies();

    // Los tokens ahora son manejados por el backend
    // El backend establece las cookies de accessToken y refreshToken en su dominio
    // No necesitamos establecerlas desde el frontend

    // Solo establecer datos del usuario (no sensible, accesible desde cliente)
    // Esta cookie es útil para mostrar información del usuario sin hacer peticiones al backend
    const maxAgeRefresh = 60 * 60 * 24 * 7; // 7 días (mismo tiempo que el refresh token)
    const isProduction = process.env.NODE_ENV === "production";

    const userCookieOptions: UserCookieOptions = {
      httpOnly: false, // Accesible desde el cliente para mostrar info del usuario
      secure: isProduction,
      sameSite: isProduction ? "none" : "lax",
      maxAge: maxAgeRefresh,
      path: "/",
    };

    cookieStore.set(config.storage.userKey, userData, userCookieOptions);

    errorLogger.info(
      "Cookie de usuario establecida - tokens manejados por el backend"
    );
  } catch (error) {
    errorLogger.error(
      { error: error instanceof Error ? error.message : String(error) },
      "Error al establecer cookie de usuario"
    );
    throw error;
  }
}
