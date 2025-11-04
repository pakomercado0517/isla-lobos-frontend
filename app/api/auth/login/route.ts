import { NextRequest, NextResponse } from "next/server";
import { serialize } from "cookie";
import { config } from "@/lib/config/env";
import { logger, errorLogger } from "@/lib/logger";
import { LoginRequest, LoginResponse, User } from "@/lib/types/auth";

/**
 * API Route que actúa como proxy para el login
 * Establece las cookies en el dominio de Vercel después de recibir la respuesta del backend
 *
 * IMPORTANTE: Usa runtime "nodejs" porque necesitamos cookies() de next/headers
 */
export const runtime = "nodejs";

export async function POST(
  request: NextRequest
): Promise<NextResponse<LoginResponse>> {
  const requestId = crypto.randomUUID();

  try {
    const body = (await request.json()) as LoginRequest;
    const { email, password } = body;

    if (!email || !password) {
      const defaultUser: User = {
        id: "",
        nombre: "",
        email: "",
        rol: "prestador",
        telefono: "",
        activo: false,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      const errorResponse: LoginResponse = {
        status: "error",
        message: "Email y contraseña son requeridos",
        data: {
          user: defaultUser,
          accessToken: "",
          refreshToken: "",
        },
      };
      return NextResponse.json(errorResponse, { status: 400 });
    }

    logger.info(
      { requestId, email },
      "API Route: proxy login -> calling backend"
    );

    const backendRes = await fetch(`${config.api.baseUrl}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const backendData = (await backendRes.json()) as {
      status: string;
      message?: string;
      data?: {
        accessToken?: string;
        refreshToken?: string;
        user?: User;
      };
    };

    if (
      !backendRes.ok ||
      backendData.status !== "success" ||
      !backendData.data
    ) {
      logger.info({ requestId }, "Login falló en el backend");
      const defaultUser: User = {
        id: "",
        nombre: "",
        email: "",
        rol: "prestador",
        telefono: "",
        activo: false,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      const errorResponse: LoginResponse = {
        status: "error",
        message: backendData.message || "Error al iniciar sesión",
        data: {
          user: defaultUser,
          accessToken: "",
          refreshToken: "",
        },
      };
      return NextResponse.json(errorResponse, {
        status: backendRes.status || 400,
      });
    }

    const { accessToken, refreshToken, user } = backendData.data;

    if (!accessToken || !refreshToken || !user) {
      errorLogger.error({ requestId }, "Backend no devolvió tokens o usuario");
      const defaultUser: User = {
        id: "",
        nombre: "",
        email: "",
        rol: "prestador",
        telefono: "",
        activo: false,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      const errorResponse: LoginResponse = {
        status: "error",
        message: "Error al obtener tokens de autenticación",
        data: {
          user: defaultUser,
          accessToken: "",
          refreshToken: "",
        },
      };
      return NextResponse.json(errorResponse, { status: 500 });
    }

    const isProd = process.env.NODE_ENV === "production";

    const accessTokenMaxAge = isProd ? 15 * 60 : 10; // segundos
    const refreshTokenMaxAge = 7 * 24 * 60 * 60; // segundos

    // Serializar cookies usando la librería cookie para formato correcto
    const accessTokenCookie = serialize(config.storage.tokenKey, accessToken, {
      httpOnly: true,
      secure: isProd,
      sameSite: "lax", // first-party via proxy
      path: "/",
      maxAge: accessTokenMaxAge,
    });

    const refreshTokenCookie = serialize(
      config.storage.refreshTokenKey,
      refreshToken,
      {
        httpOnly: true,
        secure: isProd,
        sameSite: "lax",
        path: "/",
        maxAge: refreshTokenMaxAge,
      }
    );

    const responseBody: LoginResponse = {
      status: "success",
      message: backendData.message || "Login exitoso",
      data: {
        user,
        accessToken: "", // No exponer tokens en la respuesta
        refreshToken: "", // No exponer tokens en la respuesta
      },
    };

    const res = NextResponse.json(responseBody);

    // Establecer cada cookie por separado usando append para múltiples Set-Cookie headers
    res.headers.append("Set-Cookie", accessTokenCookie);
    res.headers.append("Set-Cookie", refreshTokenCookie);

    // Logging detallado para diagnóstico
    const setCookieHeaders = res.headers.getSetCookie();
    logger.info(
      {
        requestId,
        userId: user.id,
        isProduction: isProd,
        cookiesConfig: {
          accessToken: {
            maxAge: accessTokenMaxAge,
            secure: isProd,
            sameSite: "lax",
            httpOnly: true,
          },
          refreshToken: {
            maxAge: refreshTokenMaxAge,
            secure: isProd,
            sameSite: "lax",
            httpOnly: true,
          },
        },
        setCookieHeadersCount: setCookieHeaders.length,
        setCookieHeaders: setCookieHeaders,
      },
      "API Route: Cookies establecidas en dominio del frontend"
    );

    return res;
  } catch (error) {
    errorLogger.error(
      {
        requestId,
        error: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined,
      },
      "API Route: Error en login proxy"
    );

    const defaultUser: User = {
      id: "",
      nombre: "",
      email: "",
      rol: "prestador",
      telefono: "",
      activo: false,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    const errorResponse: LoginResponse = {
      status: "error",
      message: "Error interno del servidor",
      data: {
        user: defaultUser,
        accessToken: "",
        refreshToken: "",
      },
    };
    return NextResponse.json(errorResponse, { status: 500 });
  }
}
