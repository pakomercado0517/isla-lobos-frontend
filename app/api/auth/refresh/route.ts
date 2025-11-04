import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { serialize } from "cookie";
import { config } from "@/lib/config/env";
import { logger, errorLogger } from "@/lib/logger";

/**
 * API Route que actúa como proxy para el refresh token
 * Establece el nuevo accessToken en cookies del dominio de Vercel
 * 
 * IMPORTANTE: Usa runtime "nodejs" porque necesitamos cookies() de next/headers
 */
export const runtime = "nodejs";

export async function POST(_request: NextRequest) {
  const requestId = crypto.randomUUID();

  try {
    logger.info({ requestId }, "API Route: Iniciando refresh token proxy");

    // Leer refreshToken de las cookies (frontend domain)
    const cookieStore = await cookies();
    const refreshToken = cookieStore.get(config.storage.refreshTokenKey)?.value;

    if (!refreshToken) {
      logger.info({ requestId }, "Refresh token no encontrado");
      return NextResponse.json(
        { status: "error", message: "Refresh token no encontrado" },
        { status: 401 }
      );
    }

    // Llamada al backend (server-to-server). No credentials.
    const backendResponse = await fetch(`${config.api.baseUrl}/auth/refresh`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        // forward the refresh cookie value in Cookie header so backend can read it
        Cookie: `${config.storage.refreshTokenKey}=${refreshToken}`,
      },
    });

    const data = await backendResponse.json().catch(() => null);

    if (!backendResponse.ok || !data || data.status !== "success") {
      logger.info(
        { requestId, status: backendResponse.status },
        "Refresh failed at backend"
      );
      return NextResponse.json(
        {
          status: data?.status || "error",
          message: data?.message || "Error al renovar token",
        },
        { status: backendResponse.status || 401 }
      );
    }

    // Backend returned success. It may contain new accessToken and optionally a new refreshToken.
    const { accessToken, refreshToken: newRefreshToken } = data.data ?? {};

    if (!accessToken) {
      errorLogger.error(
        { requestId },
        "Backend no devolvió accessToken en refresh"
      );
      return NextResponse.json(
        { status: "error", message: "No se recibió access token" },
        { status: 500 }
      );
    }

    const isProd = process.env.NODE_ENV === "production";
    const accessTokenMaxAge = isProd ? 15 * 60 : 10; // segundos
    const refreshTokenMaxAge = 7 * 24 * 60 * 60; // segundos

    // Serializar cookies (evita errores de formato)
    const accessTokenCookie = serialize(config.storage.tokenKey, accessToken, {
      httpOnly: true,
      secure: isProd,
      sameSite: "lax", // first-party via proxy
      path: "/",
      maxAge: accessTokenMaxAge,
    });

    // Si el backend retornó un nuevo refresh token, actualizamos la cookie.
    const cookiesToSet = [accessTokenCookie];
    if (newRefreshToken) {
      const refreshCookie = serialize(
        config.storage.refreshTokenKey,
        newRefreshToken,
        {
          httpOnly: true,
          secure: isProd,
          sameSite: "lax",
          path: "/",
          maxAge: refreshTokenMaxAge,
        }
      );
      cookiesToSet.push(refreshCookie);
    }

    const response = NextResponse.json({
      status: "success",
      message: data.message || "Token renovado exitosamente",
      // no es necesario devolver tokens; si lo haces, evita exponer refreshToken
      data: {
        /* opcional info que quieras exponer */
      },
    });

    // Añadir cada Set-Cookie por separado para que el navegador reciba múltiples cookies
    cookiesToSet.forEach((c) => response.headers.append("Set-Cookie", c));

    logger.info(
      { requestId },
      "API Route: Access token y (posible) refresh token establecidos"
    );

    return response;
  } catch (error) {
    errorLogger.error(
      {
        requestId,
        error: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined,
      },
      "API Route: Error en refresh token proxy"
    );

    return NextResponse.json(
      { status: "error", message: "Error interno del servidor" },
      { status: 500 }
    );
  }
}
