"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
  useCallback,
  useRef,
} from "react";
import { useRouter } from "next/navigation";
import { clientLogger } from "@/lib/logger-client";
import {
  NotificacionDashboard,
  TipoNotificacionDashboard,
} from "@/lib/types/dashboard-notificaciones";
import {
  getNotificacionesNoLeidas,
  getContadorNotificaciones,
  marcarNotificacionComoLeida,
} from "@/actions/dashboard-notificaciones";
import {
  conectarSocket,
  desconectarSocket,
  estaSocketConectado,
} from "@/lib/services/socket-service";
import { useAuth } from "./AuthContext";

interface NotificationsContextType {
  /** Lista de notificaciones */
  notificaciones: NotificacionDashboard[];
  /** Contador de notificaciones no leídas */
  noLeidas: number;
  /** Indica si el Socket.IO está conectado */
  socketConectado: boolean;
  /** Indica si está cargando las notificaciones */
  loading: boolean;
  /** Error si hay algún problema */
  error: string | null;
  /** Función para marcar una notificación como leída */
  marcarComoLeida: (notificacionId: string) => Promise<void>;
  /** Función para recargar las notificaciones */
  recargarNotificaciones: () => Promise<void>;
  /** Función para actualizar el contador */
  actualizarContador: () => Promise<void>;
}

const NotificationsContext = createContext<
  NotificationsContextType | undefined
>(undefined);

interface NotificationsProviderProps {
  children: ReactNode;
}

export function NotificationsProvider({
  children,
}: NotificationsProviderProps) {
  const { user } = useAuth();
  const router = useRouter();
  const [notificaciones, setNotificaciones] = useState<
    NotificacionDashboard[]
  >([]);
  const [noLeidas, setNoLeidas] = useState(0);
  const [socketConectado, setSocketConectado] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const intervaloPollingRef = useRef<NodeJS.Timeout | null>(null);
  const socketInicializadoRef = useRef(false);

  /**
   * Carga las notificaciones desde la API REST
   */
  const cargarNotificaciones = useCallback(async () => {
    try {
      setError(null);
      const result = await getNotificacionesNoLeidas();

      if (result.success && result.data) {
        setNotificaciones(result.data.notificaciones);
        setNoLeidas(result.data.no_leidas);
        clientLogger.info("Notificaciones cargadas", {
          total: result.data.total,
          noLeidas: result.data.no_leidas,
        });
      } else {
        throw new Error(result.error || "Error al cargar notificaciones");
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Error desconocido";
      setError(errorMessage);
      clientLogger.error("Error al cargar notificaciones", err);
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Actualiza solo el contador de notificaciones no leídas
   */
  const actualizarContador = useCallback(async () => {
    try {
      const result = await getContadorNotificaciones();
      if (result.success && result.data) {
        setNoLeidas(result.data.no_leidas);
      }
    } catch (err) {
      clientLogger.error("Error al actualizar contador", err);
      // No actualizar estado de error para no interrumpir la UX
    }
  }, []);

  /**
   * Maneja una nueva notificación recibida vía WebSocket
   */
  const manejarNuevaNotificacion = useCallback(
    (notificacion: NotificacionDashboard) => {
      // Agregar al inicio de la lista
      setNotificaciones((prev) => [notificacion, ...prev]);
      // Incrementar contador
      setNoLeidas((prev) => prev + 1);
      clientLogger.info("Nueva notificación agregada", {
        notificacionId: notificacion.id,
      });
    },
    []
  );

  /**
   * Marca una notificación como leída
   */
  const marcarComoLeida = useCallback(
    async (notificacionId: string) => {
      try {
        // Buscar la notificación antes de hacer cambios
        const notificacion = notificaciones.find((n) => n.id === notificacionId);
        if (!notificacion) {
          clientLogger.warn("Notificación no encontrada", { notificacionId });
          return;
        }

        // Determinar la ruta de navegación ANTES de marcar como leída
        let rutaNavegacion: string | null = null;
        
        // Convertir tipo a string para comparación segura (puede venir como string desde el backend)
        const tipoNotificacion = String(notificacion.tipo).toLowerCase();
        
        // Obtener embarcacion_id del metadata
        // El metadata puede tener embarcacion_id o embarcacionId (camelCase)
        const embarcacionId = 
          notificacion.metadata?.embarcacion_id || 
          notificacion.metadata?.embarcacionId ||
          null;
        
        clientLogger.info("Procesando click en notificación", {
          notificacionId,
          tipo: notificacion.tipo,
          tipoNormalizado: tipoNotificacion,
          enlace: notificacion.enlace,
          metadata: notificacion.metadata,
          embarcacionId: embarcacionId,
          tiposEmbarcacion: [
            TipoNotificacionDashboard.NUEVA_EMBARCACION,
            TipoNotificacionDashboard.EMBARCACION_AUTORIZADA,
            TipoNotificacionDashboard.EMBARCACION_RECHAZADA,
          ],
        });

        // Verificar si es un tipo de notificación de embarcación
        // Comparar tanto con el enum como con el string normalizado
        const esNotificacionEmbarcacion = 
          tipoNotificacion === TipoNotificacionDashboard.NUEVA_EMBARCACION.toLowerCase() ||
          tipoNotificacion === TipoNotificacionDashboard.EMBARCACION_AUTORIZADA.toLowerCase() ||
          tipoNotificacion === TipoNotificacionDashboard.EMBARCACION_RECHAZADA.toLowerCase() ||
          tipoNotificacion === "nueva_embarcacion" ||
          tipoNotificacion === "embarcacion_autorizada" ||
          tipoNotificacion === "embarcacion_rechazada";

        // Para notificaciones de embarcaciones, navegar al detalle si hay embarcacion_id
        if (esNotificacionEmbarcacion) {
          // Si hay embarcacion_id en el metadata, navegar al detalle
          if (embarcacionId) {
            rutaNavegacion = `/dashboard/embarcaciones/${embarcacionId}`;
            clientLogger.info("Navegando al detalle de embarcación", {
              embarcacionId,
              ruta: rutaNavegacion,
            });
          } else {
            // Si no hay ID, navegar a la lista de embarcaciones
            rutaNavegacion = "/dashboard/embarcaciones";
            clientLogger.warn("No hay embarcacion_id en metadata, navegando a lista", {
              metadata: notificacion.metadata,
            });
          }
        } else if (notificacion.enlace && notificacion.enlace !== "/dashboard") {
          // Para otros tipos, usar el enlace del backend si existe y no es /dashboard
          rutaNavegacion = notificacion.enlace;
        }

        // Optimistic update: actualizar UI inmediatamente
        setNotificaciones((prev) =>
          prev.map((notif) =>
            notif.id === notificacionId ? { ...notif, leida: true } : notif
          )
        );
        setNoLeidas((prev) => Math.max(0, prev - 1));

        // Llamar a la API
        const result = await marcarNotificacionComoLeida(notificacionId);
        if (!result.success) {
          // Revertir si falla
          await cargarNotificaciones();
          throw new Error(result.error || "Error al marcar como leída");
        }

        // Navegar después de marcar como leída (si hay ruta)
        if (rutaNavegacion) {
          clientLogger.info("Navegando a ruta de notificación", {
            notificacionId,
            tipo: notificacion.tipo,
            ruta: rutaNavegacion,
          });
          // Usar replace para evitar problemas con el historial
          router.replace(rutaNavegacion);
        }
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Error desconocido";
        setError(errorMessage);
        clientLogger.error("Error al marcar notificación como leída", err);
        // Recargar para sincronizar estado
        await cargarNotificaciones();
      }
    },
    [notificaciones, cargarNotificaciones, router]
  );

  /**
   * Recarga las notificaciones desde la API
   */
  const recargarNotificaciones = useCallback(async () => {
    setLoading(true);
    await cargarNotificaciones();
  }, [cargarNotificaciones]);

  /**
   * Inicializa la conexión WebSocket
   */
  const inicializarWebSocket = useCallback(async () => {
    // Solo si es usuario CONANP y no está ya inicializado
    if (user?.rol !== "conanp" || socketInicializadoRef.current) {
      return;
    }

    socketInicializadoRef.current = true;

    try {
      await conectarSocket(
        manejarNuevaNotificacion,
        () => {
          setSocketConectado(true);
          clientLogger.info("Socket.IO conectado");
        },
        () => {
          setSocketConectado(false);
          clientLogger.warn("Socket.IO desconectado");
        },
        (error) => {
          clientLogger.error("Error en Socket.IO", error);
          setSocketConectado(false);
        }
      );
    } catch (err) {
      clientLogger.error("Error al inicializar WebSocket", err);
      setSocketConectado(false);
    }
  }, [user, manejarNuevaNotificacion]);

  /**
   * Inicializa el polling de backup (si WebSocket falla)
   */
  const inicializarPolling = useCallback(() => {
    // Limpiar intervalo anterior si existe
    if (intervaloPollingRef.current) {
      clearInterval(intervaloPollingRef.current);
    }

    // Polling cada 60 segundos para verificar nuevas notificaciones
    intervaloPollingRef.current = setInterval(() => {
      // Solo actualizar contador si Socket.IO no está conectado
      if (!estaSocketConectado()) {
        actualizarContador();
      }
    }, 60000); // 60 segundos
  }, [actualizarContador]);

  /**
   * Efecto: Cargar notificaciones cuando el usuario es CONANP
   */
  useEffect(() => {
    if (user?.rol === "conanp") {
      cargarNotificaciones();
    }
  }, [user, cargarNotificaciones]);

  /**
   * Efecto: Inicializar WebSocket cuando el usuario es CONANP
   */
  useEffect(() => {
    if (user?.rol === "conanp") {
      inicializarWebSocket();
    }

    // Cleanup al desmontar
    return () => {
      desconectarSocket();
      socketInicializadoRef.current = false;
    };
  }, [user, inicializarWebSocket]);

  /**
   * Efecto: Inicializar polling de backup
   */
  useEffect(() => {
    if (user?.rol === "conanp") {
      inicializarPolling();
    }

    // Cleanup
    return () => {
      if (intervaloPollingRef.current) {
        clearInterval(intervaloPollingRef.current);
        intervaloPollingRef.current = null;
      }
    };
  }, [user, inicializarPolling]);

  const value: NotificationsContextType = {
    notificaciones,
    noLeidas,
    socketConectado,
    loading,
    error,
    marcarComoLeida,
    recargarNotificaciones,
    actualizarContador,
  };

  return (
    <NotificationsContext.Provider value={value}>
      {children}
    </NotificationsContext.Provider>
  );
}

/**
 * Hook para usar el contexto de notificaciones
 */
export function useNotifications(): NotificationsContextType {
  const context = useContext(NotificationsContext);
  if (context === undefined) {
    throw new Error(
      "useNotifications debe usarse dentro de NotificationsProvider"
    );
  }
  return context;
}

