/**
 * Tipos para el sistema de notificaciones WhatsApp
 * Alineado 100% con la API del backend
 *
 * @module types/notificaciones
 */

// ═══════════════════════════════════════════════════════════════
// ENUMS Y TIPOS BASE
// ═══════════════════════════════════════════════════════════════

/**
 * Tipos de notificaciones disponibles en el sistema
 */
export type TipoNotificacion =
  | "alerta_clima"
  | "permiso_por_vencer"
  | "permiso_vencido"
  | "confirmacion_salida"
  | "cancelacion_salida"
  | "stock_brazaletes_bajo"
  | "resumen_diario"
  | "bienvenida"
  | "recordatorio_generico";

/**
 * Niveles de prioridad para las notificaciones
 */
export type PrioridadNotificacion = "urgente" | "alta" | "media" | "baja";

/**
 * Estados posibles de una notificación enviada
 */
export type EstadoNotificacion =
  | "pendiente"
  | "enviado"
  | "entregado"
  | "leido"
  | "fallido"
  | "reintentando";

/**
 * Estados del puerto según condiciones meteorológicas
 */
export type EstadoPuerto =
  | "abierto"
  | "restricciones"
  | "cerrado"
  | "emergencia";

// ═══════════════════════════════════════════════════════════════
// INTERFACES PARA REQUESTS
// ═══════════════════════════════════════════════════════════════

/**
 * Request para enviar notificación individual
 */
export interface EnviarNotificacionRequest {
  /** Número de teléfono (10 dígitos para México) */
  telefono: string;
  /** Contenido del mensaje (10-1600 caracteres) */
  mensaje: string;
  /** Tipo de notificación */
  tipo?: TipoNotificacion;
  /** Prioridad del mensaje */
  prioridad?: PrioridadNotificacion;
  /** Datos adicionales personalizados */
  datos_adicionales?: Record<string, unknown>;
}

/**
 * Request para envío masivo de notificaciones
 */
export interface EnviarNotificacionMasivaRequest {
  /** Array de UUIDs de usuarios destinatarios */
  usuarios_ids: string[];
  /** Contenido del mensaje */
  mensaje: string;
  /** Tipo de notificación */
  tipo?: TipoNotificacion;
  /** Nombre de plantilla a usar (opcional) */
  plantilla?: string;
}

/**
 * Request para enviar alerta meteorológica
 */
export interface AlertaClimaRequest {
  /** Estado actual del puerto */
  estado_puerto: EstadoPuerto;
  /** Altura del oleaje en metros (0-10) */
  oleaje: number;
  /** Velocidad del viento en km/h (0-200) */
  viento_velocidad: number;
  /** Mensaje adicional opcional (max 500 caracteres) */
  mensaje_adicional?: string;
}

/**
 * Request para enviar alertas de permisos
 */
export interface AlertaPermisosRequest {
  /** Días de anticipación para la alerta (1-90, default: 30) */
  dias_anticipacion?: number;
}

// ═══════════════════════════════════════════════════════════════
// INTERFACES PARA RESPONSES
// ═══════════════════════════════════════════════════════════════

/**
 * Respuesta de una notificación individual enviada
 */
export interface NotificacionResponse {
  /** Indica si el envío fue exitoso */
  success: boolean;
  /** ID del mensaje de Twilio (si fue exitoso) */
  message_id?: string;
  /** Número de teléfono destino (formato WhatsApp) */
  telefono: string;
  /** Estado actual de la notificación */
  estado: EstadoNotificacion;
  /** Fecha y hora de envío (ISO 8601) */
  fecha_envio: string;
  /** Mensaje de error (si falló) */
  error?: string;
}

/**
 * Resumen de envío masivo
 */
export interface ResumenEnvio {
  /** Total de mensajes procesados */
  total: number;
  /** Mensajes enviados exitosamente */
  enviados: number;
  /** Mensajes que fallaron */
  fallidos: number;
}

/**
 * Respuesta de envío masivo de notificaciones
 */
export interface NotificacionMasivaResponse {
  /** Resumen numérico del envío */
  resumen: ResumenEnvio;
  /** Detalle de cada envío individual */
  resultados: NotificacionResponse[];
}

/**
 * Estado del servicio de WhatsApp (Twilio)
 */
export interface EstadoServicioWhatsApp {
  /** Indica si Twilio está configurado correctamente */
  configurado: boolean;
  /** Proveedor del servicio (siempre "Twilio") */
  proveedor: string;
}

/**
 * Plantilla de mensaje predefinida
 */
export interface PlantillaMensaje {
  /** Tipo de notificación asociada */
  tipo: TipoNotificacion;
  /** Título descriptivo de la plantilla */
  titulo: string;
  /** Contenido de la plantilla con variables {variable} */
  plantilla: string;
  /** Lista de variables disponibles */
  variables: string[];
  /** Ejemplo de mensaje generado */
  ejemplo: string;
}

/**
 * Respuesta al consultar estado de un mensaje
 */
export interface EstadoMensajeResponse {
  /** ID del mensaje en Twilio */
  message_sid: string;
  /** Estado actual del mensaje */
  estado: EstadoNotificacion;
  /** Última fecha de actualización */
  fecha_actualizacion: string;
}

// ═══════════════════════════════════════════════════════════════
// INTERFACES PARA UI
// ═══════════════════════════════════════════════════════════════

/**
 * Datos de un usuario para selector múltiple
 */
export interface UsuarioSelector {
  /** UUID del usuario */
  id: string;
  /** Nombre completo del usuario */
  nombre: string;
  /** Número de teléfono */
  telefono: string;
  /** Email del usuario */
  email: string;
  /** Indica si está seleccionado en el UI */
  seleccionado: boolean;
}

/**
 * Datos de un prestador para selector individual
 */
export interface PrestadorSelector {
  /** UUID del prestador */
  id: string;
  /** Nombre completo del prestador */
  nombre: string;
  /** Número de teléfono (10 dígitos) */
  telefono: string;
  /** Email del prestador */
  email: string;
  /** Nombre de la empresa/negocio (si disponible) */
  empresa?: string;
}

/**
 * Resultado de validación de mensaje
 */
export interface ValidacionMensaje {
  /** Indica si el mensaje es válido */
  valid: boolean;
  /** Mensaje de error o éxito */
  message: string;
  /** Cantidad de caracteres */
  caracteres: number;
}

/**
 * Configuración de entorno para números de prueba
 */
export interface ConfiguracionEntorno {
  /** Indica si está en modo desarrollo */
  isDevelopment: boolean;
  /** Número de prueba para sandbox de Twilio */
  numeroTest: string | undefined;
  /** Indica si hay un número de prueba configurado */
  isConfigured: boolean;
}
