/**
 * Tipos para los endpoints públicos de estadísticas
 * Basados en la documentación de PUBLIC_STATS.md
 */

export interface PuertoStatus {
  /** Estado del puerto: "abierto" | "restricciones" | "cerrado" | "emergencia" | "desconocido" */
  estado: "abierto" | "restricciones" | "cerrado" | "emergencia" | "desconocido";
  /** Texto descriptivo del estado del puerto */
  texto: string;
  /** Color sugerido para UI: "green" | "yellow" | "red" | "gray" */
  color: "green" | "yellow" | "red" | "gray";
  /** true si permite salidas (abierto/restricciones) */
  operativo: boolean;
  /** Fecha de última actualización YYYY-MM-DD */
  ultima_actualizacion: string;
}

export interface EmbarcacionesStats {
  /** Total de embarcaciones registradas en el sistema */
  total_registradas: number;
}

export interface ActividadHoyStats {
  /** Total de salidas programadas para hoy */
  salidas_programadas: number;
  /** Desglose de salidas por estado */
  salidas_por_estado: {
    programadas: number;
    en_curso: number;
    completadas: number;
  };
  /** Total de pasajeros estimados para hoy */
  total_pasajeros: number;
  /** Promedio de pasajeros por salida */
  promedio_pasajeros_por_salida: number;
}

export interface ClimaStats {
  /** Altura del oleaje en metros */
  oleaje: number;
  /** Velocidad del viento en km/h */
  viento: number;
  /** Condición general: "favorables" | "aceptables" | "moderadas" | "adversas" */
  condicion_general: "favorables" | "aceptables" | "moderadas" | "adversas";
  /** Fecha de última actualización YYYY-MM-DD */
  ultima_actualizacion: string;
}

export interface SistemaStats {
  /** true si el sistema está operativo */
  operativo: boolean;
  /** Versión del sistema */
  version: string;
  /** Fecha de última actualización YYYY-MM-DD */
  ultima_actualizacion: string;
}

/**
 * Respuesta completa del endpoint /api/public/homepage-stats
 */
export interface HomepageStats {
  /** Fecha actual en formato YYYY-MM-DD */
  fecha_consulta: string;
  /** Hora actual en formato HH:MM:SS (zona México) */
  hora_consulta: string;
  /** Estado del puerto */
  puerto: PuertoStatus;
  /** Estadísticas de embarcaciones */
  embarcaciones: EmbarcacionesStats;
  /** Actividad del día actual */
  actividad_hoy: ActividadHoyStats;
  /** Condiciones meteorológicas (puede ser null) */
  clima: ClimaStats | null;
  /** Estado del sistema */
  sistema: SistemaStats;
}

/**
 * Respuesta del endpoint /api/public/puerto-status
 */
export interface PuertoStatusResponse {
  puerto: PuertoStatus;
}

/**
 * Respuesta estándar de la API pública
 */
export interface PublicApiResponse<T> {
  status: "success" | "error";
  message: string;
  data: T;
  error?: string;
}

/**
 * Configuración para el hook de estadísticas
 */
export interface HomepageStatsConfig {
  /** Intervalo de actualización en milisegundos (default: 1 hora = 3600000) */
  updateInterval: number;
  /** Habilitar actualización automática */
  autoRefresh: boolean;
  /** Intentos de reintento en caso de error */
  maxRetries: number;
}

/**
 * Estado del hook useHomepageStats
 */
export interface HomepageStatsHookState {
  /** Datos de estadísticas (null si no se han cargado) */
  stats: HomepageStats | null;
  /** Estado de carga */
  loading: boolean;
  /** Mensaje de error (empty string si no hay error) */
  error: string;
  /** Función para refrescar manualmente los datos */
  refresh: () => Promise<void>;
  /** Última actualización exitosa (timestamp) */
  lastUpdate: number | null;
}