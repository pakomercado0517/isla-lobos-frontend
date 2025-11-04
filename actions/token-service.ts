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
 * @param newAccessToken - Nuevo access token
 */
export async function updateAccessTokenCookie(
  newAccessToken: string
): Promise<void> {
  try {
    const cookieStore = await cookies();
    const maxAge = process.env.NODE_ENV === "production" ? 60 * 15 : 10; // 10 segundos en desarrollo

    cookieStore.set(config.storage.tokenKey, newAccessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax", // "none" para cross-origin en producción
      maxAge: maxAge,
      path: "/",
    });
  } catch (error) {
    errorLogger.error(
      { error: error instanceof Error ? error.message : String(error) },
      "Error al actualizar access token en cookies"
    );
    throw error;
  }
}

/**
 * Server Action: Refresca el access token usando el refresh token de cookies
 * @returns Nuevo access token o null si falla
 */
export async function refreshAccessTokenFromCookies(): Promise<string | null> {
  const requestId = crypto.randomUUID();

  try {
    const refreshToken = await getRefreshTokenFromCookies();

    if (!refreshToken) {
      return null;
    }

    // Hacer petición al backend para refrescar el token
    const response = await fetch(`${config.api.baseUrl}/auth/refresh`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ refreshToken }),
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

    // Verificar que tenemos el nuevo token
    if (!data.data?.accessToken) {
      errorLogger.error(
        { requestId },
        "No se recibió access token en la respuesta del refresh"
      );
      throw new Error("El servidor no devolvió un access token válido");
    }

    const newAccessToken = data.data.accessToken;

    // Actualizar el access token en las cookies
    await updateAccessTokenCookie(newAccessToken);

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

    // Limpiar cookies si falla la renovación
    await clearAuthCookies();

    return null;
  }
}

/**
 * Server Action: Limpia todas las cookies de autenticación
 */
export async function clearAuthCookies(): Promise<void> {
  try {
    const cookieStore = await cookies();

    cookieStore.delete(config.storage.tokenKey);
    cookieStore.delete(config.storage.refreshTokenKey);
    cookieStore.delete(config.storage.userKey);
  } catch (error) {
    errorLogger.error(
      { error: error instanceof Error ? error.message : String(error) },
      "Error al limpiar cookies de autenticación"
    );
  }
}

/**
 * Server Action: Establece las cookies de autenticación
 * @param tokens - Tokens de acceso y refresh
 * @param userData - Datos del usuario (string JSON)
 */
export async function setAuthCookies(
  tokens: AuthTokens,
  userData: string
): Promise<void> {
  try {
    const cookieStore = await cookies();
    const maxAgeAccess = process.env.NODE_ENV === "production" ? 60 * 15 : 10; // 10 segundos (TESTING - cambiar a 60 * 15 en producción)
    const maxAgeRefresh = 60 * 60 * 24 * 7; // 7 días

    cookieStore.set(config.storage.tokenKey, tokens.accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax", // "none" para cross-origin en producción
      maxAge: maxAgeAccess,
      path: "/",
    });

    // Establecer refresh token
    cookieStore.set(config.storage.refreshTokenKey, tokens.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax", // "none" para cross-origin en producción
      maxAge: maxAgeRefresh,
      path: "/",
    });

    // Establecer datos del usuario (no sensible, accesible desde cliente)
    cookieStore.set(config.storage.userKey, userData, {
      httpOnly: false, // Accesible desde el cliente para mostrar info del usuario
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax", // "none" para cross-origin en producción
      maxAge: maxAgeRefresh,
      path: "/",
    });
  } catch (error) {
    errorLogger.error(
      { error: error instanceof Error ? error.message : String(error) },
      "Error al establecer cookies de autenticación"
    );
    throw error;
  }
}
