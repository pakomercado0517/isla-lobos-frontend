"use server";

import { cookies } from "next/headers";
import { config } from "@/lib/config/env";

/**
 * Server Action para actualizar las cookies cuando se renueva el token
 * Esto sincroniza el token renovado del cliente con las cookies del servidor
 */
export async function updateServerTokens(accessToken: string): Promise<void> {
  const cookieStore = await cookies();

  // Actualizar solo el access token (el refresh token no cambia)
  cookieStore.set(config.storage.tokenKey, accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 15, // 15 minutos
    path: "/",
  });
}

/**
 * Server Action para verificar si el token en las cookies sigue válido
 */
export async function checkServerToken(): Promise<boolean> {
  const cookieStore = await cookies();
  const token = cookieStore.get(config.storage.tokenKey)?.value;
  return !!token;
}



