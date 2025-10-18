/**
 * Tipos para el sistema de invitaciones
 */

/**
 * Rol del usuario invitado
 */
export type RolInvitacion = "conanp" | "prestador";

/**
 * Datos de una invitación
 */
export interface Invitacion {
  id: string;
  codigo: string;
  email: string | null;
  rol: RolInvitacion;
  expira_en: string; // YYYY-MM-DD
  usada: boolean;
  creada_por: string;
  created_at: string;
  updated_at: string;
  creador?: {
    id: string;
    nombre: string;
    email: string;
  };
  usuario?: {
    id: string;
    nombre: string;
    email: string;
  } | null;
}

/**
 * Request para crear una invitación
 */
export interface CrearInvitacionRequest {
  codigo: string; // Requerido
  email?: string; // Opcional - si se proporciona, envía email
  nombre?: string; // Opcional - nombre del destinatario
  rol?: RolInvitacion; // Opcional - default: prestador
  fecha_expiracion?: string; // Opcional - YYYY-MM-DD - default: 30 días
}

/**
 * Respuesta al crear una invitación
 */
export interface CrearInvitacionResponse {
  success: boolean;
  message?: string;
  error?: string;
  data?: {
    invitacion: Invitacion;
    email_enviado: boolean;
  };
}

/**
 * Respuesta al listar invitaciones
 */
export interface ListarInvitacionesResponse {
  success: boolean;
  message?: string;
  error?: string;
  data?: {
    invitaciones: Invitacion[];
    pagination: {
      current_page: number;
      total_pages: number;
      total_items: number;
      items_per_page: number;
      has_next: boolean;
      has_prev: boolean;
    };
  };
}

/**
 * Respuesta al validar una invitación
 */
export interface ValidarInvitacionResponse {
  success: boolean;
  message?: string;
  error?: string;
  data?: {
    valida: boolean;
    razon?: string;
    invitacion?: Invitacion;
  };
}

/**
 * Parámetros para listar invitaciones
 */
export interface ListarInvitacionesParams {
  page?: number;
  limit?: number;
  usada?: boolean;
}

/**
 * Estadísticas de invitaciones
 */
export interface EstadisticasInvitaciones {
  generales: {
    total: number;
    usadas: number;
    disponibles: number;
    expiradas: number;
    porcentaje_usadas: number;
  };
  este_mes: {
    creadas: number;
    usadas: number;
  };
  top_creadores: Array<{
    creador: {
      id: string;
      nombre: string;
      email: string;
    };
    total_creadas: number;
  }>;
}

/**
 * Respuesta de estadísticas
 */
export interface EstadisticasInvitacionesResponse {
  success: boolean;
  message?: string;
  error?: string;
  data?: {
    estadisticas: EstadisticasInvitaciones;
  };
}












