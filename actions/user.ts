"use server";

import { cookies } from "next/headers";
import { User } from "@/lib/types/auth";
import { config } from "@/lib/config/env";

// Función para obtener el usuario actual desde las cookies
export async function getCurrentUser(): Promise<User | null> {
  try {
    const cookieStore = cookies();
    const userCookie = (await cookieStore).get(config.storage.userKey);

    if (!userCookie?.value) {
      return null;
    }

    const user = JSON.parse(userCookie.value) as User;
    return user;
  } catch (error) {
    return null;
  }
}

// Función para verificar si hay una sesión activa
export async function getAuthToken(): Promise<string | null> {
  try {
    const cookieStore = cookies();
    const tokenCookie = (await cookieStore).get(config.storage.tokenKey);

    return tokenCookie?.value || null;
  } catch (error) {
    return null;
  }
}

// Función para verificar el estado de autenticación
export async function checkAuthStatus(): Promise<{
  isAuthenticated: boolean;
  user: User | null;
  token: string | null;
}> {
  const user = await getCurrentUser();
  const token = await getAuthToken();

  // Si tenemos usuario y token en cookies, estamos autenticados
  if (user && token) {
    return {
      isAuthenticated: true,
      user,
      token,
    };
  }

  // Si no hay datos en cookies, verificar localStorage (para compatibilidad con client-side)
  if (typeof window !== "undefined") {
    try {
      const clientToken = localStorage.getItem(config.storage.tokenKey);
      const refreshToken = localStorage.getItem(config.storage.refreshTokenKey);

      if (clientToken && user) {
        return {
          isAuthenticated: true,
          user,
          token: clientToken,
        };
      }
    } catch (error) {}
  }

  return {
    isAuthenticated: false,
    user: null,
    token: null,
  };
}
