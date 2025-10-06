// Tipos generales para la API
export interface ApiResponse<T = unknown> {
  status: "success" | "error";
  message: string;
  data?: T;
  error?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface ApiError {
  status: "error";
  message: string;
  error: string;
  data?: {
    errors?: string[];
  };
}

// Tipos para embarcaciones
export interface Embarcacion {
  id: string;
  nombre: string;
  matricula: string;
  capacidad: number;
  tipo: "menor" | "mayor";
  estado: "disponible" | "en_uso" | "mantenimiento";
  prestador_id: string;
  created_at: string;
  updated_at: string;
}

// Tipos para bloques
export interface Bloque {
  id: string;
  nombre: string;
  hora_inicio: string;
  hora_fin: string;
  capacidad_total: number;
  capacidad_registrada: number;
  capacidad_disponible: number;
  fecha: string;
  estado: "activo" | "lleno" | "suspendido_por_clima" | "cerrado_capitaria";
  created_at: string;
  updated_at: string;
}

// Tipos para salidas
export interface Salida {
  id: string;
  fecha: string;
  hora_salida: string;
  hora_regreso: string;
  pasajeros: number;
  observaciones?: string;
  estado:
    | "programada"
    | "en_curso"
    | "completada"
    | "cancelada"
    | "cancelada_por_clima"
    | "cancelada_capitaria";
  embarcacion_id: string;
  bloque_id: string;
  prestador_id: string;
  embarcacion?: Embarcacion;
  bloque?: Bloque;
  created_at: string;
  updated_at: string;
}

// Tipos para clima
export interface CondicionMeteorologica {
  id: string;
  fecha_hora: string;
  oleaje: number;
  viento_velocidad: number;
  viento_direccion: string;
  visibilidad: "excelente" | "buena" | "regular" | "mala";
  estado_puerto: "abierto" | "restricciones" | "cerrado" | "emergencia";
  prediccion_5_dias?: string;
  fuente: "CONAGUA" | "NOAA" | "Capitanía";
  created_at: string;
  updated_at: string;
}
