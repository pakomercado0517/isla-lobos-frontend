import { DestinoType } from "./salida";

/**
 * Estados posibles de un bloque horario
 * NOTA: Se removió el estado "plantilla" - ahora se usa el campo es_plantilla
 */
export enum EstadoBloque {
  ACTIVO = "activo",
  LLENO = "lleno", 
  SUSPENDIDO_POR_CLIMA = "suspendido_por_clima",
  CERRADO_CAPITARIA = "cerrado_capitaria",
  INACTIVO = "inactivo"
}

// REMOVIDO: TipoBloque enum - Ahora se usa directamente el campo booleano es_plantilla
// es_plantilla: true  = Plantilla reutilizable sin fecha
// es_plantilla: false = Bloque para fecha específica

/**
 * 🆕 NUEVO: Interfaz para PlantillaBloque (tabla maestra)
 */
export interface PlantillaBloque {
  id: number;
  nombre: string;
  hora_inicio: string; // Formato HH:MM
  hora_fin: string; // Formato HH:MM
  capacidad_total: number;
  destino: DestinoType;
  activa: boolean;
  bloques_asociados?: number; // Contador de bloques que usan esta plantilla
  created_at: string | Date;
  updated_at: string | Date;
}

/**
 * Interfaz completa del bloque con soporte para sistema híbrido
 */
export interface Bloque {
  id: string;
  nombre?: string; // Opcional si es_plantilla=true
  hora_inicio?: string; // Opcional si es_plantilla=true
  hora_fin?: string; // Opcional si es_plantilla=true
  capacidad_total?: number; // Opcional si es_plantilla=true
  destino?: DestinoType; // Opcional si es_plantilla=true
  capacidad_registrada: number;
  capacidad_disponible?: number; // Calculado: capacidad_total - capacidad_registrada
  estado: EstadoBloque;
  fecha?: string | Date; // null para plantillas
  es_plantilla: boolean;
  plantilla_id?: number; // FK a PlantillaBloque cuando es_plantilla=true
  plantilla_datos?: PlantillaBloque; // Datos de la plantilla cuando es_plantilla=true
  created_at: string | Date;
  updated_at: string | Date;
}

/**
 * Datos para crear un nuevo bloque
 */
export interface CreateBloqueData {
  nombre: string;
  hora_inicio: string;
  hora_fin: string;
  capacidad_total: number;
  destino: DestinoType; // 🆕 NUEVO: Campo requerido
  fecha?: string; // Opcional para crear plantillas
  estado: EstadoBloque;
  es_plantilla?: boolean; // Si no se especifica fecha, se asume plantilla
}

/**
 * Datos para actualizar un bloque existente
 */
export interface UpdateBloqueData {
  nombre?: string;
  hora_inicio?: string;
  hora_fin?: string;
  capacidad_total?: number;
  estado?: EstadoBloque;
  // Destino y fecha no se pueden modificar después de la creación
}

/**
 * Configuración de bloques para un destino específico
 */
export interface ConfiguracionBloquesDestino {
  destino: DestinoType;
  tiene_bloques_configurados: boolean;
  plantillas_disponibles: Bloque[];
  bloques_fecha?: Bloque[]; // Bloques específicos para una fecha
}

/**
 * Filtros para consultar bloques
 */
export interface BloquesFilters {
  fecha?: string; // YYYY-MM-DD
  destino?: DestinoType;
  estado?: EstadoBloque;
  es_plantilla?: boolean;
}

/**
 * Respuesta de la API para obtener bloques
 */
export interface BloquesResponse {
  success: boolean;
  data?: {
    bloques: Bloque[];
    total?: number;
    configuracion_por_destino?: ConfiguracionBloquesDestino[];
  };
  error?: string;
}

/**
 * Información de capacidad de un bloque
 */
export interface CapacidadBloque {
  capacidad_total: number;
  capacidad_registrada: number;
  capacidad_disponible: number;
  porcentaje_ocupacion: number;
  esta_lleno: boolean;
}

/**
 * Resumen de configuración de bloques por destino para dashboard
 */
export interface ResumenBloquesDestinos {
  [destino: string]: {
    destino: DestinoType;
    plantillas_configuradas: number;
    bloques_hoy: number;
    capacidad_total_hoy: number;
    ocupacion_promedio: number;
    estado_configuracion: 'configurado' | 'sin_configurar' | 'parcial';
    ultimo_uso: string | null;
  };
}

/**
 * Validaciones para creación de bloques
 */
export interface ValidacionBloque {
  campo: keyof CreateBloqueData;
  mensaje: string;
  valor_actual?: string | number | boolean;
  valor_esperado?: string | number | boolean;
}

/**
 * Configuración global del sistema de bloques
 */
export interface ConfiguracionSistemaBloque {
  destinos_con_bloques_obligatorios: DestinoType[]; // ["Isla de Lobos"]
  destinos_con_bloques_opcionales: DestinoType[];
  horario_minimo_bloque: number; // Duración mínima en minutos
  horario_maximo_bloque: number; // Duración máxima en minutos
  capacidad_minima_bloque: number;
  capacidad_maxima_bloque: number;
  permite_solapamiento_horarios: boolean;
}

// ============================================================================
// 🆕 NUEVOS TIPOS PARA PLANTILLAS DE BLOQUES
// ============================================================================

/**
 * Datos para crear una nueva plantilla de bloque
 */
export interface CreatePlantillaBloqueData {
  nombre: string;
  hora_inicio: string; // Formato HH:MM
  hora_fin: string; // Formato HH:MM
  capacidad_total: number;
  destino: DestinoType;
  activa?: boolean; // Default: true
}

/**
 * Datos para actualizar una plantilla de bloque existente
 */
export interface UpdatePlantillaBloqueData {
  nombre?: string;
  hora_inicio?: string; // Formato HH:MM
  hora_fin?: string; // Formato HH:MM
  capacidad_total?: number;
  activa?: boolean;
  // destino no se puede modificar después de la creación
}

/**
 * Filtros para consultar plantillas de bloques
 */
export interface PlantillasBloqueFilters {
  activa?: boolean;
  destino?: DestinoType;
  page?: number;
  limit?: number;
}

/**
 * Respuesta de la API para obtener plantillas de bloques
 */
export interface PlantillasBloqueResponse {
  success: boolean;
  data?: {
    plantillas?: PlantillaBloque[];
    plantilla?: PlantillaBloque;
    total?: number;
    pagination?: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
  };
  error?: string;
  message?: string;
}

/**
 * Estadísticas de uso de una plantilla de bloque
 */
export interface EstadisticasPlantillaBloque {
  plantilla_id: number;
  nombre: string;
  total_bloques: number;
  bloques_activos: number;
  bloques_inactivos: number;
  total_salidas: number;
  pasajeros_transportados: number;
  capacidad_promedio_utilizada: string; // Porcentaje como string "78.5%"
  ultimo_uso: string | null; // ISO string
}

/**
 * Respuesta para estadísticas de plantilla
 */
export interface EstadisticasPlantillaResponse {
  success: boolean;
  data?: EstadisticasPlantillaBloque;
  error?: string;
  message?: string;
}
