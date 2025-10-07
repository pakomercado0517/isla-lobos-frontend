// Tipos para el dashboard de CONANP

export interface DashboardStats {
  total_usuarios: number;
  total_embarcaciones: number;
  total_salidas_hoy: number;
  total_pasajeros_hoy: number;
  ocupacion_promedio: number;
  embarcaciones_activas: number;
  embarcaciones_mantenimiento: number;
  salidas_programadas: number;
  salidas_completadas: number;
  salidas_canceladas: number;
}

export interface OcupacionPorDia {
  fecha: string;
  total_capacidad: number;
  pasajeros_registrados: number;
  porcentaje_ocupacion: number;
  bloques_disponibles: number;
  bloques_llenos: number;
  bloques_suspendidos: number;
}

export interface EstadoEmbarcacion {
  id: string;
  nombre: string;
  matricula: string;
  capacidad: number;
  tipo: "menor" | "mayor";
  estado: "disponible" | "en_uso" | "mantenimiento";
  prestador: {
    id: string;
    nombre: string;
    email: string;
  };
  ultima_salida?: string;
  salidas_mes: number;
}

export interface EstadoPermiso {
  id: string;
  prestador: {
    id: string;
    nombre: string;
    email: string;
    telefono: string;
  };
  embarcaciones: number;
  salidas_mes: number;
  ultima_actividad: string;
  estado_permiso: "activo" | "suspendido" | "vencido";
  fecha_vencimiento?: string;
}

export interface ResumenMeteorologico {
  fecha: string;
  oleaje: number;
  viento_velocidad: number;
  viento_direccion: string;
  visibilidad: string;
  estado_puerto: "abierto" | "restricciones" | "cerrado" | "emergencia";
  prediccion_5_dias: string;
  fuente: string;
  alertas_activas: string[];
}

export interface AlertaSistema {
  id: string;
  tipo:
    | "permisos_vencidos"
    | "permisos_por_vencer"
    | "clima_oleaje_alto"
    | "clima_viento_fuerte"
    | "puerto_cerrado"
    | "puerto_restricciones"
    | "stock_bajo"
    | "lote_por_vencer"
    | "prestador_sin_stock"
    | "embarcacion_mantenimiento"
    | "bloque_suspendido"
    | "capacidad_critica"
    | "clima"
    | "capacidad"
    | "mantenimiento"
    | "permiso"
    | "seguridad";
  severidad: "baja" | "media" | "alta" | "critica";
  titulo: string;
  mensaje: string;
  fecha: string;
  leida: boolean;
  accion_requerida: boolean;
  accion?: string;
  link_accion?: string;
}

export interface DashboardData {
  estadisticas: DashboardStats;
  ocupacion_7_dias: OcupacionPorDia[];
  embarcaciones: EstadoEmbarcacion[];
  permisos: EstadoPermiso[];
  clima: ResumenMeteorologico;
  alertas: AlertaSistema[];
}

/**
 * Tipo de actividad que puede ocurrir en el sistema
 */
export type TipoActividadReciente =
  | "salida_nueva"
  | "embarcacion_nueva"
  | "usuario_nuevo"
  | "venta_brazaletes"
  | "uso_brazaletes"
  | "bloque_actualizado"
  | "clima_actualizado";

/**
 * Color del indicador visual de la actividad
 */
export type ColorActividadReciente =
  | "blue"
  | "green"
  | "purple"
  | "yellow"
  | "red"
  | "orange";

/**
 * Representa una actividad reciente en el sistema
 */
export interface ActividadReciente {
  /** Identificador único de la actividad */
  id: string;
  /** Tipo de actividad */
  tipo: TipoActividadReciente;
  /** Título descriptivo de la actividad */
  titulo: string;
  /** Descripción detallada de la actividad */
  descripcion: string;
  /** Fecha y hora de la actividad en formato ISO8601 */
  fecha: string;
  /** Color del indicador visual */
  color: ColorActividadReciente;
  /** ID del recurso relacionado (opcional) */
  recurso_id?: string;
  /** Tipo de recurso relacionado (opcional) */
  recurso_tipo?: "salida" | "embarcacion" | "usuario" | "venta";
}