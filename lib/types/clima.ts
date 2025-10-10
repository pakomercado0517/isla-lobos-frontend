// ============================================================================
// TIPOS PARA EL MÓDULO DE CLIMA - ISLA LOBOS
// ============================================================================
// Tipos para la gestión de condiciones meteorológicas, predicciones,
// alertas y estadísticas del sistema.
// ============================================================================

// ============================================================================
// ENUMS Y TIPOS BASE
// ============================================================================

/**
 * Estados posibles del puerto según condiciones meteorológicas
 */
export type EstadoPuerto =
  | "abierto"
  | "restricciones"
  | "cerrado"
  | "emergencia";

/**
 * Niveles de visibilidad meteorológica
 */
export type NivelVisibilidad = "excelente" | "buena" | "regular" | "baja";

/**
 * Fuentes de datos meteorológicos
 */
export type FuenteMeteorologica = "CONAGUA" | "NOAA" | "Capitanía" | "Manual";

/**
 * Tendencias de cambio en condiciones meteorológicas
 */
export type TendenciaMeteorologica = "creciente" | "estable" | "decreciente";

/**
 * Tipos de alertas meteorológicas
 */
export type TipoAlertaMeteorologica =
  | "oleaje_alto"
  | "oleaje_moderado"
  | "viento_fuerte"
  | "viento_moderado"
  | "visibilidad_baja"
  | "puerto_cerrado"
  | "restricciones_puerto"
  | "emergencia";

/**
 * Niveles de severidad de alertas
 */
export type SeveridadAlerta = "baja" | "media" | "alta" | "critica";

// ============================================================================
// CONDICIONES METEOROLÓGICAS
// ============================================================================

/**
 * Condición meteorológica registrada en el sistema
 */
export interface CondicionMeteorologica {
  /** ID único de la condición */
  id: string;
  /** Fecha y hora de la medición (ISO8601) */
  fecha_hora: string;
  /** Altura del oleaje en metros (0-10) */
  oleaje: number;
  /** Velocidad del viento en km/h (0-100) */
  viento_velocidad: number;
  /** Dirección del viento (N, NE, E, SE, S, SW, W, NW) */
  viento_direccion: string;
  /** Nivel de visibilidad */
  visibilidad: NivelVisibilidad;
  /** Estado actual del puerto */
  estado_puerto: EstadoPuerto;
  /** Predicción para los próximos 5 días (opcional) */
  prediccion_5_dias?: string;
  /** Fuente de los datos meteorológicos */
  fuente: FuenteMeteorologica;
  /** Fecha de creación del registro */
  createdAt: string;
  /** Fecha de última actualización */
  updatedAt: string;
}

/**
 * Datos para crear una nueva condición meteorológica
 */
export interface CrearCondicionMeteorologicaData {
  /** Fecha y hora de la medición (ISO8601) */
  fecha_hora: string;
  /** Altura del oleaje en metros (0-10) */
  oleaje: number;
  /** Velocidad del viento en km/h (0-100) */
  viento_velocidad: number;
  /** Dirección del viento */
  viento_direccion: string;
  /** Nivel de visibilidad */
  visibilidad: NivelVisibilidad;
  /** Estado del puerto */
  estado_puerto: EstadoPuerto;
  /** Predicción para los próximos 5 días (opcional) */
  prediccion_5_dias?: string;
  /** Fuente de los datos */
  fuente: FuenteMeteorologica;
}

/**
 * Datos para actualizar una condición meteorológica existente
 */
export interface ActualizarCondicionMeteorologicaData {
  /** Altura del oleaje en metros (opcional) */
  oleaje?: number;
  /** Velocidad del viento en km/h (opcional) */
  viento_velocidad?: number;
  /** Dirección del viento (opcional) */
  viento_direccion?: string;
  /** Nivel de visibilidad (opcional) */
  visibilidad?: NivelVisibilidad;
  /** Estado del puerto (opcional) */
  estado_puerto?: EstadoPuerto;
  /** Predicción para los próximos 5 días (opcional) */
  prediccion_5_dias?: string;
}

// ============================================================================
// PREDICCIONES METEOROLÓGICAS
// ============================================================================

/**
 * Condición meteorológica para un día específico en la predicción
 */
export interface CondicionPorDia {
  /** Fecha de la condición */
  fecha: string;
  /** Altura del oleaje en metros */
  oleaje: number;
  /** Velocidad del viento en km/h */
  viento: number;
  /** Estado del puerto para ese día */
  estado_puerto: EstadoPuerto;
  /** Nivel de visibilidad */
  visibilidad: NivelVisibilidad;
}

/**
 * Predicción meteorológica basada en datos históricos
 */
export interface PrediccionMeteorologica {
  /** Número de días de la predicción */
  periodo_dias: number;
  /** Promedio de oleaje en el periodo */
  promedio_oleaje: number;
  /** Promedio de viento en el periodo */
  promedio_viento: number;
  /** Tendencia del oleaje */
  tendencia_oleaje: TendenciaMeteorologica;
  /** Tendencia del viento */
  tendencia_viento: TendenciaMeteorologica;
  /** Recomendación basada en las condiciones */
  recomendacion: string;
  /** Condiciones por día */
  condiciones_por_dia: CondicionPorDia[];
}

// ============================================================================
// ALERTAS METEOROLÓGICAS
// ============================================================================

/**
 * Alerta meteorológica generada automáticamente
 */
export interface AlertaMeteorologica {
  /** Tipo de alerta */
  tipo: TipoAlertaMeteorologica;
  /** Severidad de la alerta */
  severidad: SeveridadAlerta;
  /** Mensaje descriptivo de la alerta */
  mensaje: string;
  /** Valor que generó la alerta */
  valor: number;
  /** Umbral que se superó */
  umbral: number;
}

/**
 * Conjunto de alertas meteorológicas con resumen
 */
export interface AlertasMeteorologicas {
  /** Lista de alertas activas */
  alertas: AlertaMeteorologica[];
  /** Total de alertas */
  total_alertas: number;
  /** Número de alertas críticas */
  alertas_criticas: number;
  /** Número de alertas de severidad alta */
  alertas_altas: number;
  /** Número de alertas de severidad media */
  alertas_medias: number;
  /** Condición meteorológica actual que generó las alertas */
  condicion_actual: {
    fecha_hora: string;
    oleaje: number;
    viento_velocidad: number;
    visibilidad: NivelVisibilidad;
    estado_puerto: EstadoPuerto;
  };
}

// ============================================================================
// ESTADÍSTICAS METEOROLÓGICAS
// ============================================================================

/**
 * Estadísticas de oleaje
 */
export interface EstadisticasOleaje {
  /** Promedio de oleaje en metros */
  promedio: number;
  /** Oleaje mínimo registrado */
  minimo: number;
  /** Oleaje máximo registrado */
  maximo: number;
  /** Número de registros con oleaje alto (>2.5m) */
  registros_oleaje_alto: number;
}

/**
 * Estadísticas de viento
 */
export interface EstadisticasViento {
  /** Promedio de velocidad del viento en km/h */
  promedio: number;
  /** Velocidad mínima registrada */
  minimo: number;
  /** Velocidad máxima registrada */
  maximo: number;
  /** Número de registros con viento fuerte (>30 km/h) */
  registros_viento_fuerte: number;
}

/**
 * Distribución de estados del puerto
 */
export interface DistribucionEstadoPuerto {
  /** Número de registros con puerto abierto */
  abierto: number;
  /** Número de registros con restricciones */
  restricciones: number;
  /** Número de registros con puerto cerrado */
  cerrado: number;
  /** Número de registros en emergencia */
  emergencia: number;
}

/**
 * Distribución de niveles de visibilidad
 */
export interface DistribucionVisibilidad {
  /** Número de registros con visibilidad excelente */
  excelente: number;
  /** Número de registros con visibilidad buena */
  buena: number;
  /** Número de registros con visibilidad regular */
  regular: number;
  /** Número de registros con visibilidad baja */
  baja: number;
}

/**
 * Estadísticas meteorológicas completas
 */
export interface EstadisticasMeteorologicas {
  /** Periodo de análisis */
  periodo: {
    fecha_inicio: string;
    fecha_fin: string;
    total_registros: number;
  };
  /** Estadísticas de oleaje */
  oleaje: EstadisticasOleaje;
  /** Estadísticas de viento */
  viento: EstadisticasViento;
  /** Distribución de estados del puerto */
  estado_puerto: DistribucionEstadoPuerto;
  /** Distribución de niveles de visibilidad */
  visibilidad: DistribucionVisibilidad;
}

// ============================================================================
// SINCRONIZACIÓN SMN
// ============================================================================

/**
 * Resultado de la sincronización con SMN-CONAGUA
 */
export interface ResultadoSincronizacionSMN {
  /** Total de registros procesados */
  total_procesados: number;
  /** Condiciones nuevas creadas */
  condiciones_creadas: number;
  /** Condiciones actualizadas */
  condiciones_actualizadas: number;
  /** Lista de condiciones sincronizadas */
  condiciones: CondicionMeteorologica[];
  /** Lista de errores (si los hubo) */
  errores: string[];
}

// ============================================================================
// RESPUESTAS DE API
// ============================================================================

/**
 * Respuesta al obtener lista de condiciones meteorológicas
 */
export interface ObtenerCondicionesResponse {
  status: "success" | "error";
  message: string;
  data: {
    condiciones: CondicionMeteorologica[];
    condicion_actual: CondicionMeteorologica;
    estadisticas: {
      total: number;
      abierto: number;
      restricciones: number;
      cerrado: number;
      emergencia: number;
    };
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
  };
  error?: string;
}

/**
 * Respuesta al obtener una condición meteorológica por ID
 */
export interface ObtenerCondicionResponse {
  status: "success" | "error";
  message: string;
  data: {
    condicion: CondicionMeteorologica;
  };
  error?: string;
}

/**
 * Respuesta al obtener la condición actual
 */
export interface ObtenerCondicionActualResponse {
  status: "success" | "error";
  message: string;
  data: {
    condicion: CondicionMeteorologica;
    tiempo_transcurrido_horas: number;
    necesita_actualizacion: boolean;
  };
  error?: string;
}

/**
 * Respuesta al obtener predicción meteorológica
 */
export interface ObtenerPrediccionResponse {
  status: "success" | "error";
  message: string;
  data: {
    prediccion: PrediccionMeteorologica;
  };
  error?: string;
}

/**
 * Respuesta al obtener alertas meteorológicas
 */
export interface ObtenerAlertasResponse {
  status: "success" | "error";
  message: string;
  data: AlertasMeteorologicas;
  error?: string;
}

/**
 * Respuesta al obtener estadísticas meteorológicas
 */
export interface ObtenerEstadisticasResponse {
  status: "success" | "error";
  message: string;
  data: {
    estadisticas: EstadisticasMeteorologicas;
  };
  error?: string;
}

/**
 * Respuesta al sincronizar datos del SMN
 */
export interface SincronizarSMNResponse {
  status: "success" | "error";
  message: string;
  data: ResultadoSincronizacionSMN;
  error?: string;
}

/**
 * Respuesta al crear/actualizar/eliminar condición
 */
export interface MutacionCondicionResponse {
  status: "success" | "error";
  message: string;
  data?: {
    condicion: CondicionMeteorologica;
  };
  error?: string;
}

// ============================================================================
// PARÁMETROS DE CONSULTA
// ============================================================================

/**
 * Parámetros para consultar condiciones meteorológicas
 */
export interface ConsultarCondicionesParams {
  /** Número de página */
  page?: number;
  /** Elementos por página */
  limit?: number;
  /** Fecha de inicio (YYYY-MM-DD) */
  fecha_inicio?: string;
  /** Fecha de fin (YYYY-MM-DD) */
  fecha_fin?: string;
  /** Filtrar por estado del puerto */
  estado_puerto?: EstadoPuerto;
  /** Filtrar por fuente de datos */
  fuente?: FuenteMeteorologica;
}

/**
 * Parámetros para obtener predicción meteorológica
 */
export interface ObtenerPrediccionParams {
  /** Número de días para la predicción (default: 5, max: 30) */
  dias?: number;
}

/**
 * Parámetros para obtener estadísticas meteorológicas
 */
export interface ObtenerEstadisticasParams {
  /** Fecha de inicio (YYYY-MM-DD) */
  fecha_inicio?: string;
  /** Fecha de fin (YYYY-MM-DD) */
  fecha_fin?: string;
}

/**
 * Parámetros para sincronizar datos del SMN
 */
export interface SincronizarSMNParams {
  /** Número de horas a procesar (default: 24, max: 48) */
  horas_limite?: number;
  /** Filtrar solo datos de la región (default: true) */
  solo_isla_lobos?: boolean;
}

// ============================================================================
// TIPOS PARA UI
// ============================================================================

/**
 * Información resumida de clima para widgets y cards
 */
export interface ResumenClima {
  /** Condición meteorológica actual */
  condicion: CondicionMeteorologica;
  /** Alertas activas */
  alertas: AlertaMeteorologica[];
  /** Tiempo desde la última actualización en horas */
  tiempo_actualizacion_horas: number;
  /** Indica si necesita actualización */
  necesita_actualizacion: boolean;
}

/**
 * Props comunes para componentes de clima
 */
export interface ClimaComponentProps {
  /** Condición meteorológica a mostrar */
  condicion: CondicionMeteorologica;
  /** Callback cuando se necesita recargar datos */
  onRecargar?: () => void;
  /** Indica si está en modo de carga */
  loading?: boolean;
}
