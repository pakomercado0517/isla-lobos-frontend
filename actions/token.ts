"use server";

/**
 * DEPRECATED: Este archivo se mantiene por compatibilidad.
 * Usa las funciones de @/actions/token-service en su lugar.
 * 
 * Redirige todas las llamadas al nuevo servicio centralizado.
 */

import {
  updateAccessTokenCookie,
  hasTokensInCookies,
} from "./token-service";

/**
 * @deprecated Usa updateAccessTokenCookie de @/actions/token-service
 * Server Action para actualizar las cookies cuando se renueva el token
 */
export async function updateServerTokens(accessToken: string): Promise<void> {
  return updateAccessTokenCookie(accessToken);
}

/**
 * @deprecated Usa hasTokensInCookies de @/actions/token-service
 * Server Action para verificar si el token en las cookies sigue válido
 */
export async function checkServerToken(): Promise<boolean> {
  return hasTokensInCookies();
}



