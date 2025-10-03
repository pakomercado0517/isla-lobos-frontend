// Tipos para el sistema de gestión de brazaletes

export interface Brazalete {
  id: string;
  codigo: string;
  tipo: "universal";
  estado: "disponible" | "asignado" | "utilizado" | "perdido";
  precio: number;
  fecha_creacion: string;
  fecha_asignacion?: string;
  fecha_uso?: string;
  prestador_id?: string;
  salida_id?: string;
  turista_nacionalidad?: "local" | "nacional" | "internacional";
  turista_edad?: number;
  lote_id: string;
  created_at: string;
  updated_at: string;
  // Relaciones opcionales
  prestador?: {
    id: string;
    nombre: string;
    email: string;
  };
  lote?: {
    id: string;
    numero_lote: string;
    tipo: "universal";
  };
  salida?: {
    id: string;
    fecha: string;
    numero_pasajeros: number;
  };
}

export interface LoteBrazaletes {
  id: string;
  numero_lote: string;
  cantidad_total: number;
  cantidad_disponibles: number;
  cantidad_vendidos: number;
  cantidad_utilizados: number;
  tipo: "universal";
  fecha_compra: string;
  fecha_vencimiento?: string;
  costo_unitario: number;
  precio_venta: number;
  proveedor?: string;
  estado: "activo" | "agotado" | "vencido" | "cancelado";
  observaciones?: string;
  created_at: string;
  updated_at: string;
  // Relaciones opcionales
  brazaletes?: Array<{
    id: string;
    estado: string;
  }>;
}

export interface VentaBrazaletes {
  id: string;
  prestador_id: string;
  lote_id: string;
  cantidad: number;
  precio_unitario: number;
  total: number;
  fecha_venta: string;
  metodo_pago?: "efectivo" | "transferencia" | "credito" | "debito";
  estado_pago: "pendiente" | "pagado" | "cancelado";
  observaciones?: string;
  created_at: string;
  // Relaciones opcionales
  prestador?: {
    id: string;
    nombre: string;
    email: string;
    telefono?: string;
  };
  lote?: {
    id: string;
    numero_lote: string;
    tipo: "universal";
  };
}

// Interfaces para respuestas de API

export interface InventarioBrazaletes {
  total_disponibles: number;
  por_tipo: {
    universal: number;
  };
  stock_bajo: boolean;
  lotes_activos: number;
  valor_inventario: number;
}

export interface EstadisticasBrazaletes {
  periodo: {
    fecha_inicio: string;
    fecha_fin: string;
  };
  inventario: {
    total_comprados: number;
    total_disponibles: number;
    total_vendidos: number;
    total_utilizados: number;
  };
  ingresos: {
    ventas_totales: number;
    por_mes: Array<{
      mes: string;
      cantidad: number;
      monto: number;
    }>;
  };
  utilizacion: {
    por_tipo: {
      universal: number;
    };
    por_nacionalidad: {
      locales: number;
      nacionales: number;
      internacionales: number;
    };
  };
}

export interface AlertaBrazaletes {
  tipo: "stock_bajo" | "lote_por_vencer" | "prestador_sin_stock";
  severidad: "baja" | "media" | "alta" | "critica";
  mensaje: string;
  fecha: string;
}

export interface BrazaletesPrestador {
  prestador: {
    id: string;
    nombre: string;
    email: string;
  };
  brazaletes: {
    disponibles: number;
    asignados: number;
    utilizados: number;
    por_tipo: {
      universal: number;
    };
  };
  detalle: Brazalete[];
}

export interface UsoBrazaleteSalida {
  salida_id: string;
  brazaletes_utilizados: number;
  errores?: string[];
  message: string;
}

export interface BrazaletesUtilizadosSalida {
  salida: {
    id: string;
    fecha: string;
    numero_pasajeros: number;
  };
  brazaletes_utilizados: Brazalete[];
  estadisticas: {
    total_brazaletes: number;
    por_nacionalidad: {
      locales: number;
      nacionales: number;
      internacionales: number;
    };
  };
}

// Interfaces para formularios

export interface CreateLoteFormData {
  numero_lote: string;
  // Opción 1: Generación automática
  cantidad_total?: number;
  // Opción 2: Rango personalizado
  primer_numero?: number;
  ultimo_numero?: number;
  // Campos comunes
  tipo: "universal";
  fecha_compra: string;
  fecha_vencimiento?: string;
  costo_unitario: number;
  precio_venta: number;
  proveedor?: string;
  observaciones?: string;
}

export interface VentaBrazaletesFormData {
  prestador_id: string;
  cantidad: number;
  tipo: "universal";
  metodo_pago?: "efectivo" | "transferencia" | "credito" | "debito";
  observaciones?: string;
}

// Respuesta de la API para ventas
export interface VentaBrazaletesResponse {
  success: boolean;
  data: {
    venta: {
      id: string;
      prestador_id: string;
      lote_id: string;
      cantidad: number;
      precio_unitario: number;
      total: number;
      fecha_venta: string;
      metodo_pago: string;
      estado_pago: "pendiente" | "pagado" | "cancelado";
    };
    rango_brazaletes: {
      numero_inicial: number;
      numero_final: number;
      cantidad_total: number;
      primer_codigo: string;
      ultimo_codigo: string;
    };
    brazaletes_asignados: string[];
    prestador: {
      id: string;
      nombre: string;
      email: string;
    };
    lote: {
      numero_lote: string;
      tipo: string;
    };
    message: string;
  };
}

export interface UsoBrazaleteFormData {
  salida_id: string;
  brazaletes: Array<{
    codigo: string;
    turista_nacionalidad?: "local" | "nacional" | "internacional";
    turista_edad?: number;
    fecha_uso?: string; // Fecha personalizada para el uso del brazalete
  }>;
}

// Interfaces para reportes

export interface ReporteVentasBrazaletes {
  periodo: {
    fecha_inicio: string;
    fecha_fin: string;
  };
  resumen: {
    total_ventas: number;
    total_brazaletes: number;
    total_ingresos: number;
  };
  ventas_detalle: VentaBrazaletes[];
  ventas_por_prestador: Array<{
    prestador: {
      nombre: string;
      email: string;
    };
    total_ventas: number;
    total_brazaletes: number;
    total_ingresos: number;
  }>;
}

export interface ReporteUtilizacionBrazaletes {
  periodo: {
    fecha_inicio: string;
    fecha_fin: string;
  };
  resumen: {
    total_utilizados: number;
    por_nacionalidad: {
      locales: number;
      nacionales: number;
      internacionales: number;
      sin_especificar: number;
    };
    por_tipo: {
      universal: number;
    };
    estadisticas_edad: {
      promedio: number;
      minima: number;
      maxima: number;
      total_con_edad: number;
    };
  };
  utilizacion_detalle: Brazalete[];
}

// Interfaces para filtros y búsquedas

export interface FiltrosLotes {
  tipo?: "universal";
  estado?: "activo" | "agotado" | "vencido" | "cancelado";
  page?: number;
  limit?: number;
}

export interface FiltrosBrazaletes {
  codigo?: string;
  tipo?: "universal";
  estado?: "disponible" | "asignado" | "utilizado" | "perdido";
  prestador_id?: string;
  lote_id?: string;
  fecha_inicio?: string;
  fecha_fin?: string;
  page?: number;
  limit?: number;
}

export interface FiltrosEstadisticas {
  fecha_inicio?: string;
  fecha_fin?: string;
  tipo?: "universal";
  prestador_id?: string;
}

// Interfaces para respuestas paginadas

export interface PaginacionBrazaletes {
  page: number;
  limit: number;
  total: number;
  total_pages: number;
}

export interface RespuestaLotes {
  lotes: LoteBrazaletes[];
  pagination: PaginacionBrazaletes;
}

export interface RespuestaBrazaletes {
  brazaletes: Brazalete[];
  pagination: PaginacionBrazaletes;
}

// Interfaces para dashboard

export interface DashboardBrazaletes {
  inventario: InventarioBrazaletes;
  ventas_hoy: {
    brazaletes_vendidos: number;
    ingresos: number;
    prestadores_activos: number;
  };
  utilizacion_hoy: {
    brazaletes_usados: number;
    por_nacionalidad: {
      locales: number;
      nacionales: number;
      internacionales: number;
    };
    lugares_populares: Array<{
      tipo: "universal";
      cantidad: number;
    }>;
  };
  alertas: AlertaBrazaletes[];
}

// Constantes y enumeraciones

export const TIPOS_BRAZALETES = ["universal"] as const;
export const ESTADOS_BRAZALETES = [
  "disponible",
  "asignado",
  "utilizado",
  "perdido",
] as const;
export const ESTADOS_LOTES = [
  "activo",
  "agotado",
  "vencido",
  "cancelado",
] as const;
export const METODOS_PAGO = [
  "efectivo",
  "transferencia",
  "credito",
  "debito",
] as const;
export const NACIONALIDADES = ["local", "nacional", "internacional"] as const;
export const SEVERIDADES_ALERTA = ["baja", "media", "alta", "critica"] as const;

// Utilidades de tipos

export type TipoBrazalete = (typeof TIPOS_BRAZALETES)[number];
export type EstadoBrazalete = (typeof ESTADOS_BRAZALETES)[number];
export type EstadoLote = (typeof ESTADOS_LOTES)[number];
export type MetodoPago = (typeof METODOS_PAGO)[number];
export type Nacionalidad = (typeof NACIONALIDADES)[number];
export type SeveridadAlerta = (typeof SEVERIDADES_ALERTA)[number];
