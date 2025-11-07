/**
 * Tipos TypeScript para el sistema de notificaciones del dashboard de CONANP
 * 
 * Este módulo define todos los tipos necesarios para manejar notificaciones
 * en tiempo real y desde base de datos en el dashboard de CONANP.
 */

/**
 * Tipos de notificaciones disponibles en el sistema
 */
export enum TipoNotificacionDashboard {
  NUEVA_EMBARCACION = "nueva_embarcacion",
  EMBARCACION_AUTORIZADA = "embarcacion_autorizada",
  EMBARCACION_RECHAZADA = "embarcacion_rechazada",
  PERMISO_POR_VENCER = "permiso_por_vencer",
  PERMISO_VENCIDO = "permiso_vencido",
  STOCK_BRAZALETES_BAJO = "stock_brazaletes_bajo",
  NUEVA_SALIDA_REGISTRADA = "nueva_salida_registrada",
  ALERTA_CLIMA = "alerta_clima",
  OTRO = "otro",
}

/**
 * Niveles de prioridad de las notificaciones
 */
export enum PrioridadNotificacionDashboard {
  ALTA = "alta",
  MEDIA = "media",
  BAJA = "baja",
}

/**
 * Metadata adicional de la notificación según su tipo
 */
export interface MetadataNotificacion {
  embarcacion_id?: string;
  embarcacionId?: string; // Variante en camelCase por si viene del backend así
  prestador_id?: string;
  prestador_nombre?: string;
  matricula?: string;
  capacidad?: number;
  tipo?: string;
  salida_id?: string;
  bloque_id?: string;
  [key: string]: string | number | boolean | null | undefined;
}

/**
 * Representa una notificación del dashboard de CONANP
 */
export interface NotificacionDashboard {
  /** ID único de la notificación */
  id: string;
  /** Tipo de notificación */
  tipo: TipoNotificacionDashboard;
  /** Título de la notificación */
  titulo: string;
  /** Mensaje descriptivo de la notificación */
  mensaje: string;
  /** ID del usuario destinatario (null si es para todos los CONANP) */
  usuario_id: string | null;
  /** Enlace relativo para navegar al detalle (ej: "/embarcaciones/uuid") */
  enlace: string | null;
  /** Indica si la notificación ha sido leída */
  leida: boolean;
  /** Prioridad de la notificación */
  prioridad: PrioridadNotificacionDashboard;
  /** Metadata adicional según el tipo de notificación */
  metadata: MetadataNotificacion;
  /** Fecha en que se marcó como leída (formato YYYY-MM-DD) */
  read_at: string | null;
  /** Fecha de creación (formato YYYY-MM-DD) */
  created_at: string;
  /** Fecha de última actualización (formato YYYY-MM-DD) */
  updated_at: string;
}

/**
 * Respuesta de la API al obtener notificaciones
 */
export interface NotificacionesResponse {
  status: "success" | "error";
  message: string;
  data: {
    notificaciones: NotificacionDashboard[];
    total: number;
    no_leidas: number;
  };
}

/**
 * Respuesta de la API al obtener el contador de notificaciones
 */
export interface ContadorNotificacionesResponse {
  status: "success" | "error";
  message: string;
  data: {
    no_leidas: number;
  };
}

/**
 * Respuesta de la API al marcar una notificación como leída
 */
export interface MarcarLeidaResponse {
  status: "success" | "error";
  message: string;
}

