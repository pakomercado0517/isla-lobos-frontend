"use client";

import io from "socket.io-client";
import { config } from "@/lib/config/env";
import { clientLogger } from "@/lib/logger-client";
import { NotificacionDashboard } from "@/lib/types/dashboard-notificaciones";

/**
 * Servicio para manejar la conexión WebSocket con Socket.IO
 * 
 * Este servicio maneja:
 * - Conexión/desconexión del WebSocket
 * - Autenticación con token JWT
 * - Reintentos automáticos
 * - Eventos de notificaciones
 */

type SocketType = ReturnType<typeof io>;

let socketInstance: SocketType | null = null;
let isConnecting = false;
let reconnectAttempts = 0;
const MAX_RECONNECT_ATTEMPTS = 5;

/**
 * Obtiene el token JWT desde la API route del frontend
 * (las cookies httpOnly no son accesibles desde JavaScript)
 */
async function obtenerTokenParaSocket(): Promise<string | null> {
  try {
    const response = await fetch("/api/socket-token", {
      method: "GET",
      credentials: "include",
    });

    if (!response.ok) {
      clientLogger.warn("No se pudo obtener token para Socket.IO");
      return null;
    }

    const data = (await response.json()) as {
      success: boolean;
      token?: string;
      error?: string;
    };

    if (data.success && data.token) {
      return data.token;
    }

    return null;
  } catch (error) {
    clientLogger.error("Error al obtener token para Socket.IO", error);
    return null;
  }
}

/**
 * Crea una nueva conexión Socket.IO
 */
export async function conectarSocket(
  onNuevaNotificacion: (notificacion: NotificacionDashboard) => void,
  onConectado?: () => void,
  onDesconectado?: () => void,
  onError?: (error: Error) => void
): Promise<SocketType | null> {
  // Si ya hay una conexión activa, no crear otra
  if (socketInstance?.connected) {
    clientLogger.info("Socket ya está conectado");
    return socketInstance;
  }

  // Si ya está intentando conectar, esperar
  if (isConnecting) {
    clientLogger.info("Ya hay un intento de conexión en curso");
    return socketInstance;
  }

  isConnecting = true;

  try {
    // Obtener token JWT
    const token = await obtenerTokenParaSocket();
    if (!token) {
      clientLogger.warn("No se pudo obtener token, abortando conexión Socket.IO");
      isConnecting = false;
      return null;
    }

    // URL del backend (sin /api porque Socket.IO maneja su propia ruta)
    const socketUrl = config.api.baseUrl.replace("/api", "");

    clientLogger.info("Conectando a Socket.IO", {
      url: socketUrl,
      tieneToken: !!token,
    });

    // Crear conexión Socket.IO
    const socket = io(socketUrl, {
      auth: {
        token: token,
      },
      transports: ["websocket", "polling"], // Fallback a polling si WebSocket falla
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      reconnectionAttempts: MAX_RECONNECT_ATTEMPTS,
      timeout: 20000,
    });

    // Evento: Conectado exitosamente
    socket.on("connect", () => {
      clientLogger.info("✅ Conectado a Socket.IO", {
        socketId: socket.id,
      });
      reconnectAttempts = 0;
      isConnecting = false;
      if (onConectado) {
        onConectado();
      }
    });

    // Evento: Desconectado
    socket.on("disconnect", (reason: string) => {
      clientLogger.warn("❌ Desconectado de Socket.IO", { reason });
      isConnecting = false;
      if (onDesconectado) {
        onDesconectado();
      }
    });

    // Evento: Error de conexión
    socket.on("connect_error", (error: Error) => {
      clientLogger.error("Error de conexión Socket.IO", error);
      isConnecting = false;

      // Si es error de autenticación, no reintentar
      if (
        error.message.includes("token") ||
        error.message.includes("autorizado") ||
        error.message.includes("401") ||
        error.message.includes("403")
      ) {
        clientLogger.warn("Error de autenticación, no se reintentará");
        if (onError) {
          onError(new Error("Error de autenticación"));
        }
        return;
      }

      // Para otros errores, el cliente se encarga de reintentar
      reconnectAttempts++;
      if (reconnectAttempts >= MAX_RECONNECT_ATTEMPTS) {
        clientLogger.error("Máximo de intentos de reconexión alcanzado");
        if (onError) {
          onError(new Error("No se pudo conectar después de múltiples intentos"));
        }
      }
    });

    // Evento: Nueva notificación
    socket.on("nueva_notificacion", (notificacion: NotificacionDashboard) => {
      clientLogger.info("📨 Nueva notificación recibida vía WebSocket", {
        notificacionId: notificacion.id,
        tipo: notificacion.tipo,
      });
      onNuevaNotificacion(notificacion);
    });

    // Evento: Confirmación de conexión exitosa
    socket.on("conectado", (data: { mensaje: string; usuario_id?: string }) => {
      clientLogger.info("Confirmación de conexión Socket.IO", data);
    });

    socketInstance = socket;
    return socket;
  } catch (error) {
    clientLogger.error("Error crítico al crear conexión Socket.IO", error);
    isConnecting = false;
    if (onError) {
      onError(
        error instanceof Error ? error : new Error("Error desconocido")
      );
    }
    return null;
  }
}

/**
 * Desconecta el Socket.IO actual
 */
export function desconectarSocket(): void {
  if (socketInstance) {
    clientLogger.info("Desconectando Socket.IO");
    socketInstance.disconnect();
    socketInstance = null;
    isConnecting = false;
    reconnectAttempts = 0;
  }
}

/**
 * Verifica si el Socket.IO está conectado
 */
export function estaSocketConectado(): boolean {
  return socketInstance?.connected ?? false;
}

/**
 * Obtiene la instancia actual del Socket.IO
 */
export function obtenerSocket(): SocketType | null {
  return socketInstance;
}

