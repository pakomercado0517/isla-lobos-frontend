import { User } from "./auth";

// Estados base para las acciones
export interface ActionState<T = any> {
  success: boolean;
  message?: string;
  error?: string;
  data?: T;
}

// Estados específicos para autenticación
export interface LoginState extends ActionState<User> {
  redirectTo?: string;
  token?: string;
}

export interface RegisterState extends ActionState {
  // Datos específicos del registro si es necesario
}

export interface LogoutState extends ActionState {
  // Estado del logout
}

export interface ForgotPasswordState extends ActionState {
  // Estado de recuperación de contraseña
}

export interface ResetPasswordState extends ActionState {
  // Estado de reset de contraseña
}

export interface ChangePasswordState extends ActionState {
  // Estado de cambio de contraseña
}

export interface ValidateInvitationState
  extends ActionState<{
    valid: boolean;
    organizacion?: string;
  }> {
  // Estado de validación de invitación
}

// Tipos para los formularios
export interface LoginFormData {
  email: string;
  password: string;
}

export interface RegisterFormData {
  nombre: string;
  email: string;
  password: string;
  confirmPassword: string;
  codigoInvitacion: string;
}

export interface ForgotPasswordFormData {
  email: string;
}

export interface ResetPasswordFormData {
  token: string;
  password: string;
  confirmPassword: string;
}

export interface ChangePasswordFormData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export interface ValidateInvitationFormData {
  codigo: string;
}

// ============================================================================
// NUEVOS TIPOS PARA SERVER ACTIONS
// ============================================================================

// Estados para acciones del dashboard
export interface DashboardActionState<T = any> extends ActionState<T> {}

// Estados para acciones de usuarios
export interface UsuarioActionState<T = any> extends ActionState<T> {}

// Estados para acciones de bloques
export interface BloqueActionState<T = any> extends ActionState<T> {}

// Estados para acciones de embarcaciones
export interface EmbarcacionActionState<T = any> extends ActionState<T> {}

// Estados para acciones de salidas (prestadores)
export interface SalidaActionState<T = any> extends ActionState<T> {}

// Estados para acciones de reportes
export interface ReporteActionState<T = any> extends ActionState<T> {}

// Tipos para formularios de dashboard
export interface CreateUsuarioFormData {
  nombre: string;
  email: string;
  telefono: string;
  password: string;
  rol: "conanp" | "prestador";
  activo: boolean;
}

export interface UpdateUsuarioFormData {
  nombre?: string;
  telefono?: string;
  activo?: boolean;
}

export interface CreateBloqueFormData {
  nombre: string;
  hora_inicio: string;
  hora_fin: string;
  capacidad_total: number;
  fecha: string;
  estado: "activo" | "lleno" | "suspendido_por_clima" | "cerrado_capitaria";
}

export interface UpdateBloqueFormData {
  nombre?: string;
  hora_inicio?: string;
  hora_fin?: string;
  capacidad_total?: number;
  estado?: "activo" | "lleno" | "suspendido_por_clima" | "cerrado_capitaria";
}

export interface CreateEmbarcacionFormData {
  nombre: string;
  matricula: string;
  capacidad: number;
  tipo: "menor" | "mayor";
  estado: "disponible" | "en_uso" | "mantenimiento";
  prestador_id: string;
}

export interface UpdateEmbarcacionFormData {
  nombre?: string;
  capacidad?: number;
  estado?: "disponible" | "en_uso" | "mantenimiento";
}

// Tipos para formularios de prestadores
export interface CreateSalidaFormData {
  fecha: string;
  numero_pasajeros: number;
  observaciones?: string;
  embarcacion_id: string;
  bloque_id: string;
}

export interface UpdateSalidaFormData {
  numero_pasajeros?: number;
  observaciones?: string;
  estado?: "programada" | "en_curso" | "completada" | "cancelada";
}

export interface CreateMiEmbarcacionFormData {
  nombre: string;
  matricula: string;
  capacidad: number;
  tipo: "menor" | "mayor";
  estado?: "disponible" | "en_uso" | "mantenimiento";
}

// Tipos para filtros de reportes
export interface ReporteFiltros {
  fecha_inicio: string;
  fecha_fin: string;
  tipo_reporte?: "mensual" | "semanal" | "diario" | "personalizado";
  incluir_prestadores?: boolean;
  incluir_embarcaciones?: boolean;
  incluir_clima?: boolean;
}

// ============================================================================
// TIPOS PARA SISTEMA DE BRAZALETES
// ============================================================================

// Estados para acciones de brazaletes
export interface BrazaleteActionState<T = any> extends ActionState<T> {}

export interface LoteActionState<T = any> extends ActionState<T> {}

export interface VentaBrazaleteActionState<T = any> extends ActionState<T> {}

export interface UsoBrazaleteActionState<T = any> extends ActionState<T> {}

// Tipos para formularios de brazaletes
export interface CreateLoteBrazaleteFormData {
  numero_lote: string;
  cantidad_total: number;
  tipo: "isla" | "arrecife";
  fecha_compra: string;
  fecha_vencimiento?: string;
  costo_unitario: number;
  precio_venta: number;
  proveedor?: string;
  observaciones?: string;
}

export interface UpdateLoteBrazaleteFormData {
  numero_lote?: string;
  fecha_vencimiento?: string;
  precio_venta?: number;
  proveedor?: string;
  observaciones?: string;
  estado?: "activo" | "agotado" | "vencido" | "cancelado";
}

export interface VentaBrazaletesFormData {
  prestador_id: string;
  cantidad: number;
  tipo: "isla" | "arrecife";
  metodo_pago?: "efectivo" | "transferencia" | "credito" | "debito";
  observaciones?: string;
}

export interface UsoBrazaleteFormData {
  salida_id: string;
  brazaletes: Array<{
    codigo: string;
    turista_nacionalidad?: "local" | "nacional" | "internacional";
    turista_edad?: number;
  }>;
}

// Tipos para filtros de brazaletes
export interface FiltrosLotesBrazaletes {
  tipo?: "isla" | "arrecife";
  estado?: "activo" | "agotado" | "vencido" | "cancelado";
  page?: number;
  limit?: number;
}

export interface FiltrosBrazaletes {
  codigo?: string;
  tipo?: "isla" | "arrecife";
  estado?: "disponible" | "asignado" | "utilizado" | "perdido";
  prestador_id?: string;
  lote_id?: string;
  fecha_inicio?: string;
  fecha_fin?: string;
  page?: number;
  limit?: number;
}

export interface FiltrosEstadisticasBrazaletes {
  fecha_inicio?: string;
  fecha_fin?: string;
  tipo?: "isla" | "arrecife";
  prestador_id?: string;
}

// Tipos para respuestas de brazaletes
export interface RespuestaInventarioBrazaletes {
  inventario: {
    total_disponibles: number;
    por_tipo: {
      isla: number;
      arrecife: number;
    };
    stock_bajo: boolean;
    lotes_activos: number;
    valor_inventario: number;
  };
}

export interface RespuestaEstadisticasBrazaletes {
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
      isla: number;
      arrecife: number;
    };
    por_nacionalidad: {
      locales: number;
      nacionales: number;
      internacionales: number;
    };
  };
}

export interface RespuestaAlertasBrazaletes {
  alertas: Array<{
    tipo: "stock_bajo" | "lote_por_vencer" | "prestador_sin_stock";
    severidad: "baja" | "media" | "alta" | "critica";
    mensaje: string;
    fecha: string;
  }>;
}

export interface RespuestaBrazaletesPrestador {
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
      isla: number;
      arrecife: number;
    };
  };
  detalle: Array<{
    id: string;
    codigo: string;
    tipo: "isla" | "arrecife";
    estado: "disponible" | "asignado" | "utilizado" | "perdido";
    precio: number;
    fecha_creacion: string;
    fecha_asignacion?: string;
    fecha_uso?: string;
    turista_nacionalidad?: "local" | "nacional" | "internacional";
    turista_edad?: number;
    lote: {
      numero_lote: string;
      tipo: "isla" | "arrecife";
    };
    salida?: {
      id: string;
      fecha: string;
      numero_pasajeros: number;
    };
  }>;
}

export interface RespuestaUsoBrazaletes {
  salida_id: string;
  brazaletes_utilizados: number;
  errores?: string[];
  message: string;
}

export interface RespuestaReporteVentasBrazaletes {
  periodo: {
    fecha_inicio: string;
    fecha_fin: string;
  };
  resumen: {
    total_ventas: number;
    total_brazaletes: number;
    total_ingresos: number;
  };
  ventas_detalle: Array<{
    id: string;
    prestador_id: string;
    lote_id: string;
    cantidad: number;
    precio_unitario: number;
    total: number;
    fecha_venta: string;
    metodo_pago: string;
    estado_pago: string;
    prestador: {
      nombre: string;
      email: string;
      telefono?: string;
    };
    lote: {
      numero_lote: string;
      tipo: "isla" | "arrecife";
    };
  }>;
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

export interface RespuestaReporteUtilizacionBrazaletes {
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
      isla: number;
      arrecife: number;
    };
    estadisticas_edad: {
      promedio: number;
      minima: number;
      maxima: number;
      total_con_edad: number;
    };
  };
  utilizacion_detalle: Array<{
    id: string;
    codigo: string;
    tipo: "isla" | "arrecife";
    estado: "utilizado";
    precio: number;
    fecha_uso: string;
    turista_nacionalidad: "local" | "nacional" | "internacional";
    turista_edad?: number;
    prestador: {
      nombre: string;
      email: string;
    };
    lote: {
      numero_lote: string;
      tipo: "isla" | "arrecife";
    };
  }>;
}

export interface RespuestaDashboardBrazaletes {
  inventario: {
    total_disponibles: number;
    por_tipo: {
      isla: number;
      arrecife: number;
    };
    stock_bajo: boolean;
    lotes_activos: number;
    valor_inventario: number;
  };
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
      tipo: "isla" | "arrecife";
      cantidad: number;
    }>;
  };
  alertas: Array<{
    tipo: "stock_bajo" | "lote_por_vencer" | "prestador_sin_stock";
    severidad: "baja" | "media" | "alta" | "critica";
    mensaje: string;
    fecha: string;
  }>;
}
