import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { config } from "@/lib/config/env";
import { logger } from "@/lib/logger";

/**
 * API Route para obtener el token JWT para conexión WebSocket
 *
 * Esta ruta es necesaria porque Socket.IO requiere el token en el handshake,
 * y las cookies httpOnly no son accesibles desde JavaScript del cliente.
 *
 * IMPORTANTE: Solo devuelve el token si el usuario está autenticado.
 * El backend de Socket.IO debe validar el token antes de permitir la conexión.
 */
export async function GET(_request: NextRequest) {
  const requestId = `socket-token-request-${Date.now()}`;
  try {
    logger.info({ requestId }, "Solicitud de token para WebSocket recibida");

    const cookieStore = await cookies();
    const token = cookieStore.get(config.storage.tokenKey)?.value;

    if (!token) {
      logger.warn({ requestId }, "No se encontró accessToken en las cookies");
      return NextResponse.json(
        {
          success: false,
          error: "No autenticado",
        },
        { status: 401 }
      );
    }

    logger.info(
      { requestId },
      "AccessToken obtenido exitosamente para WebSocket"
    );
    // Devolver solo el token (no información sensible adicional)
    return NextResponse.json({
      success: true,
      token: token,
    });
  } catch (_error) {
    logger.error(
      {
        requestId,
        error: _error instanceof Error ? _error.message : String(_error),
      },
      "Error al obtener token para WebSocket"
    );
    return NextResponse.json(
      {
        success: false,
        error: "Error al obtener token",
      },
      { status: 500 }
    );
  }
}
