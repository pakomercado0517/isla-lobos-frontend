/**
 * Tipos para el sistema de notificaciones multi-canal (WhatsApp + Email)
 * Alineado 100% con la API del backend
 *
 * @module types/notificaciones
 */

// ═══════════════════════════════════════════════════════════════
// ENUMS Y TIPOS BASE
// ═══════════════════════════════════════════════════════════════

/**
 * Canales de notificación disponibles
 */
export type CanalNotificacion = "whatsapp" | "email" | "ambos";

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
// INTERFACES PARA EMAILS
// ═══════════════════════════════════════════════════════════════

/**
 * Request para enviar email individual
 */
export interface EnviarEmailRequest {
  /** Email del destinatario */
  email: string;
  /** Asunto del email */
  asunto: string;
  /** Contenido del mensaje (HTML o texto plano) */
  mensaje: string;
  /** Tipo de notificación */
  tipo?: TipoNotificacion;
  /** Prioridad del mensaje */
  prioridad?: PrioridadNotificacion;
  /** Indica si el mensaje es HTML */
  html?: boolean;
  /** Datos adicionales personalizados */
  datos_adicionales?: Record<string, unknown>;
}

/**
 * Request para envío masivo de emails
 */
export interface EnviarEmailMasivoRequest {
  /** Array de UUIDs de usuarios destinatarios */
  usuarios_ids: string[];
  /** Asunto del email */
  asunto: string;
  /** Contenido del mensaje */
  mensaje: string;
  /** Tipo de notificación */
  tipo?: TipoNotificacion;
  /** Indica si el mensaje es HTML */
  html?: boolean;
  /** Nombre de plantilla a usar (opcional) */
  plantilla?: string;
}

/**
 * Request para enviar alerta meteorológica por email
 */
export interface AlertaClimaEmailRequest extends AlertaClimaRequest {
  /** Incluir gráficos/imágenes en el email */
  incluirGraficos?: boolean;
}

/**
 * Request para enviar alertas de permisos por email
 */
export interface AlertaPermisosEmailRequest extends AlertaPermisosRequest {
  /** Incluir documento adjunto con instrucciones */
  incluirAdjunto?: boolean;
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
 * Respuesta de un email individual enviado
 */
export interface EmailResponse {
  /** Indica si el envío fue exitoso */
  success: boolean;
  /** ID del mensaje en el servidor de emails */
  message_id?: string;
  /** Email del destinatario */
  email: string;
  /** Estado actual del email */
  estado: EstadoNotificacion;
  /** Fecha y hora de envío (ISO 8601) */
  fecha_envio: string;
  /** Mensaje de error (si falló) */
  error?: string;
}

/**
 * Respuesta de envío masivo de emails
 */
export interface EmailMasivoResponse {
  /** Resumen numérico del envío */
  resumen: ResumenEnvio;
  /** Detalle de cada envío individual */
  resultados: EmailResponse[];
}

/**
 * Estado del servicio de Email
 */
export interface EstadoServicioEmail {
  /** Indica si el servicio de email está configurado correctamente */
  configurado: boolean;
  /** Proveedor del servicio (ej: "SendGrid", "NodeMailer", etc.) */
  proveedor: string;
  /** Email remitente configurado */
  emailRemitente?: string;
}

/**
 * Estado consolidado de todos los servicios
 */
export interface EstadoServiciosNotificaciones {
  /** Estado del servicio WhatsApp */
  whatsapp: EstadoServicioWhatsApp;
  /** Estado del servicio Email */
  email: EstadoServicioEmail;
}

/**
 * Plantilla de mensaje predefinida (WhatsApp)
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
 * Plantilla de email predefinida
 */
export interface PlantillaEmail {
  /** Tipo de notificación asociada */
  tipo: TipoNotificacion;
  /** Título descriptivo de la plantilla */
  titulo: string;
  /** Asunto del email con variables {variable} */
  asunto: string;
  /** Contenido HTML del email con variables {variable} */
  plantillaHtml: string;
  /** Contenido de texto plano alternativo */
  plantillaTexto: string;
  /** Lista de variables disponibles */
  variables: string[];
  /** Ejemplo de email generado */
  ejemplo: {
    asunto: string;
    mensaje: string;
  };
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
  /** Fecha de vencimiento del permiso (YYYY-MM-DD) */
  fechaVencimientoPermiso?: string;
  /** Estado del permiso */
  estadoPermiso?: "vigente" | "por_vencer" | "vencido";
  /** Cantidad de brazaletes disponibles del prestador */
  brazaletesDisponibles?: number;
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
