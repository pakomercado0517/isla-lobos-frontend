"use server";

import { cookies } from "next/headers";
import { config } from "@/lib/config/env";
import {
  LoteBrazaletes,
  InventarioBrazaletes,
  EstadisticasBrazaletes,
  AlertaBrazaletes,
  BrazaletesPrestador,
  BrazaletesUtilizadosSalida,
  CreateLoteFormData,
  VentaBrazaletesFormData,
  VentaBrazaletesResponse,
  FiltrosLotes,
  FiltrosBrazaletes,
  FiltrosEstadisticas,
  RespuestaLotes,
  RespuestaBusquedaBrazaletes,
  ReporteVentasBrazaletes,
  ReporteUtilizacionBrazaletes,
  DashboardBrazaletes,
  AsignarBrazaletesRequest,
  AsignarBrazaletesResponse,
} from "@/lib/types/brazaletes";

/**
 * Intenta renovar el accessToken usando el refreshToken
 */
async function tryRefreshToken(): Promise<boolean> {
  try {
    const cookieStore = await cookies();
    const refreshToken = cookieStore.get(config.storage.refreshTokenKey)?.value;
    
    if (!refreshToken) {
      return false;
    }

    const refreshUrl = `${config.api.baseUrl}/auth/refresh`;

    const response = await fetch(refreshUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Cookie': `${config.storage.refreshTokenKey}=${refreshToken}`,
      },
    });

    if (!response.ok) {
      return false;
    }

    const setCookieHeaders = response.headers.getSetCookie?.() || [];

    for (const cookieHeader of setCookieHeaders) {
      const [cookiePart] = cookieHeader.split(';');
      const [name, value] = cookiePart.split('=');
      
      if (name === config.storage.tokenKey) {
        cookieStore.set(config.storage.tokenKey, value, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax',
          path: '/',
          maxAge: 60 * 15, // 15 minutos
        });
      }
    }

    return true;
  } catch (error) {
    return false;
  }
}

/**
 * Helper function para hacer requests al backend con auto-renovación de tokens
 */
async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {},
  retryCount = 0
): Promise<T> {
  const url = `${config.api.baseUrl}${endpoint}`;

  const defaultHeaders: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string>),
  };

  const cookieStore = await cookies();
  let accessToken = cookieStore.get(config.storage.tokenKey)?.value;
  const refreshToken = cookieStore.get(config.storage.refreshTokenKey)?.value;

  // Si no hay accessToken pero sí refreshToken, intentar renovar
  if (!accessToken && refreshToken && retryCount === 0) {
    const renewed = await tryRefreshToken();
    
    if (renewed) {
      const updatedCookieStore = await cookies();
      accessToken = updatedCookieStore.get(config.storage.tokenKey)?.value;
    } else {
      throw new Error('Sesión expirada. Por favor, inicia sesión nuevamente.');
    }
  }

  // Construir el header Cookie manualmente
  const cookieHeader: string[] = [];
  if (accessToken) cookieHeader.push(`${config.storage.tokenKey}=${accessToken}`);
  if (refreshToken) cookieHeader.push(`${config.storage.refreshTokenKey}=${refreshToken}`);
  
  if (cookieHeader.length > 0) {
    defaultHeaders["Cookie"] = cookieHeader.join("; ");
  }

  const response = await fetch(url, {
    ...options,
    headers: defaultHeaders,
  });

  const data = await response.json().catch(() => ({}));

  // Si recibimos 401 y es el primer intento, renovar token y reintentar
  if (response.status === 401 && retryCount === 0 && refreshToken) {
    const renewed = await tryRefreshToken();
    
    if (renewed) {
      return apiRequest<T>(endpoint, options, retryCount + 1);
    }
  }

  if (!response.ok) {
    throw new Error(
      data.message || `Error ${response.status}: ${response.statusText}`
    );
  }

  return data as T;
}

// ==================== GESTIÓN DE INVENTARIO ====================

/**
 * Obtener inventario actual de brazaletes
 */
export async function getInventarioBrazaletes(): Promise<{
  success: boolean;
  data?: InventarioBrazaletes;
  message?: string;
}> {
  try {
    const response = await apiRequest<{
      success: boolean;
      data: InventarioBrazaletes;
    }>("/brazaletes/inventario");

    return {
      success: true,
      data: response.data,
    };
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : "Error desconocido",
    };
  }
}

/**
 * Crear nuevo lote de brazaletes
 */
export async function createLoteBrazaletes(
  formData: CreateLoteFormData
): Promise<{
  success: boolean;
  data?: { lote: LoteBrazaletes; brazaletes_generados: number };
  message?: string;
}> {
  try {
    const response = await apiRequest<{
      success: boolean;
      data: { lote: LoteBrazaletes; brazaletes_generados: number };
    }>("/brazaletes/lotes", {
      method: "POST",
      body: JSON.stringify(formData),
    });

    return {
      success: true,
      data: response.data,
      message: "Lote creado exitosamente",
    };
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : "Error desconocido",
    };
  }
}

/**
 * Listar lotes con filtros
 */
export async function getLotesBrazaletes(filtros: FiltrosLotes = {}): Promise<{
  success: boolean;
  data?: RespuestaLotes;
  message?: string;
}> {
  try {
    const params = new URLSearchParams();
    if (filtros.tipo) params.append("tipo", filtros.tipo);
    if (filtros.estado) params.append("estado", filtros.estado);
    if (filtros.page) params.append("page", filtros.page.toString());
    if (filtros.limit) params.append("limit", filtros.limit.toString());

    const response = await apiRequest<{
      success: boolean;
      data: RespuestaLotes;
    }>(`/brazaletes/lotes?${params.toString()}`);

    return {
      success: true,
      data: response.data,
    };
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : "Error desconocido",
    };
  }
}

// ==================== VENTA A PRESTADORES ====================

/**
 * Vender brazaletes a un prestador
 */
export async function venderBrazaletes(
  formData: VentaBrazaletesFormData
): Promise<VentaBrazaletesResponse> {
  try {
    const response = await apiRequest<VentaBrazaletesResponse>(
      "/brazaletes/venta",
      {
        method: "POST",
        body: JSON.stringify(formData),
      }
    );

    return response;
  } catch (error) {
    throw error;
  }
}

/**
 * Obtener brazaletes de un prestador específico
 */
export async function getBrazaletesPrestador(prestadorId: string): Promise<{
  success: boolean;
  data?: BrazaletesPrestador;
  message?: string;
}> {
  try {
    const response = await apiRequest<{
      success: boolean;
      data: BrazaletesPrestador;
    }>(`/brazaletes/prestador/${prestadorId}`);

    return {
      success: true,
      data: response.data,
    };
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : "Error desconocido",
    };
  }
}

/**
 * Obtener mis brazaletes (para prestador autenticado)
 */
export async function getMisBrazaletes(): Promise<{
  success: boolean;
  data?: BrazaletesPrestador;
  message?: string;
}> {
  try {
    const response = await apiRequest<{
      success: boolean;
      data: BrazaletesPrestador;
    }>("/brazaletes/mis-brazaletes");

    return {
      success: true,
      data: response.data,
    };
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : "Error desconocido",
    };
  }
}

// ==================== USO EN SALIDAS ====================

/**
 * Asignar brazaletes a una salida (cambiar de disponible a asignado)
 */
export async function asignarBrazaletes(
  formData: AsignarBrazaletesRequest
): Promise<AsignarBrazaletesResponse> {
  try {
    const response = await apiRequest<{
      success: boolean;
      data: { brazaletes_asignados: number; message: string };
    }>("/brazaletes/asignar", {
      method: "POST",
      body: JSON.stringify(formData),
    });

    return {
      success: true,
      data: response.data,
      message: "Brazaletes asignados exitosamente",
    };
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : "Error desconocido",
    };
  }
}

/**
 * Marcar brazaletes como utilizados (cambiar de asignado a utilizado)
 */
export async function marcarBrazaletesUtilizados(formData: {
  salida_id: string;
  fecha_uso: string;
}): Promise<{
  success: boolean;
  data?: { brazaletes_utilizados: number; message: string };
  message?: string;
}> {
  try {
    const response = await apiRequest<{
      success: boolean;
      data: { brazaletes_utilizados: number; message: string };
    }>("/brazaletes/utilizar", {
      method: "POST",
      body: JSON.stringify(formData),
    });

    return {
      success: true,
      data: response.data,
      message: "Brazaletes marcados como utilizados exitosamente",
    };
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : "Error desconocido",
    };
  }
}

/**
 * Obtener brazaletes utilizados en una salida
 */
export async function getBrazaletesUtilizadosSalida(salidaId: string): Promise<{
  success: boolean;
  data?: BrazaletesUtilizadosSalida;
  message?: string;
}> {
  try {
    const response = await apiRequest<{
      success: boolean;
      data: BrazaletesUtilizadosSalida;
    }>(`/brazaletes/uso/salida/${salidaId}`);

    return {
      success: true,
      data: response.data,
    };
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : "Error desconocido",
    };
  }
}

// ==================== ESTADÍSTICAS Y REPORTES ====================

/**
 * Obtener estadísticas generales de brazaletes
 */
export async function getEstadisticasBrazaletes(
  filtros: FiltrosEstadisticas = {}
): Promise<{
  success: boolean;
  data?: EstadisticasBrazaletes;
  message?: string;
}> {
  try {
    const params = new URLSearchParams();
    if (filtros.fecha_inicio)
      params.append("fecha_inicio", filtros.fecha_inicio);
    if (filtros.fecha_fin) params.append("fecha_fin", filtros.fecha_fin);
    if (filtros.tipo) params.append("tipo", filtros.tipo);
    if (filtros.prestador_id)
      params.append("prestador_id", filtros.prestador_id);

    const response = await apiRequest<{
      success: boolean;
      data: EstadisticasBrazaletes;
    }>(`/brazaletes/estadisticas?${params.toString()}`);

    return {
      success: true,
      data: response.data,
    };
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : "Error desconocido",
    };
  }
}

/**
 * Obtener alertas del sistema de brazaletes
 */
export async function getAlertasBrazaletes(): Promise<{
  success: boolean;
  data?: AlertaBrazaletes[];
  message?: string;
}> {
  try {
    const response = await apiRequest<{
      success: boolean;
      data: { alertas: AlertaBrazaletes[] };
    }>("/brazaletes/alertas");

    return {
      success: true,
      data: response.data.alertas,
    };
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : "Error desconocido",
    };
  }
}

/**
 * Generar reporte de ventas de brazaletes
 */
export async function getReporteVentasBrazaletes(
  filtros: FiltrosEstadisticas & { prestador_id?: string } = {}
): Promise<{
  success: boolean;
  data?: ReporteVentasBrazaletes;
  message?: string;
}> {
  try {
    const params = new URLSearchParams();
    if (filtros.fecha_inicio)
      params.append("fecha_inicio", filtros.fecha_inicio);
    if (filtros.fecha_fin) params.append("fecha_fin", filtros.fecha_fin);
    if (filtros.prestador_id)
      params.append("prestador_id", filtros.prestador_id);

    const response = await apiRequest<{
      success: boolean;
      data: ReporteVentasBrazaletes;
    }>(`/brazaletes/reportes/ventas?${params.toString()}`);

    return {
      success: true,
      data: response.data,
    };
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : "Error desconocido",
    };
  }
}

/**
 * Generar reporte de utilización de brazaletes
 */
export async function getReporteUtilizacionBrazaletes(
  filtros: FiltrosEstadisticas = {}
): Promise<{
  success: boolean;
  data?: ReporteUtilizacionBrazaletes;
  message?: string;
}> {
  try {
    const params = new URLSearchParams();
    if (filtros.fecha_inicio)
      params.append("fecha_inicio", filtros.fecha_inicio);
    if (filtros.fecha_fin) params.append("fecha_fin", filtros.fecha_fin);
    if (filtros.tipo) params.append("tipo", filtros.tipo);

    const response = await apiRequest<{
      success: boolean;
      data: ReporteUtilizacionBrazaletes;
    }>(`/brazaletes/reportes/utilizacion?${params.toString()}`);

    return {
      success: true,
      data: response.data,
    };
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : "Error desconocido",
    };
  }
}

// ==================== UTILIDADES ====================

/**
 * Obtener dashboard de brazaletes para CONANP
 */
export async function getDashboardBrazaletes(): Promise<{
  success: boolean;
  data?: DashboardBrazaletes;
  message?: string;
}> {
  try {
    const response = await apiRequest<{
      success: boolean;
      data: DashboardBrazaletes;
    }>("/brazaletes/dashboard");

    return {
      success: true,
      data: response.data,
    };
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : "Error desconocido",
    };
  }
}

/**
 * Buscar brazaletes con filtros avanzados
 */
export async function buscarBrazaletes(filtros: FiltrosBrazaletes): Promise<{
  success: boolean;
  data?: RespuestaBusquedaBrazaletes;
  message?: string;
}> {
  try {
    const params = new URLSearchParams();

    if (filtros.codigo) params.append("codigo", filtros.codigo);
    if (filtros.tipo) params.append("tipo", filtros.tipo);
    if (filtros.estado) params.append("estado", filtros.estado);
    if (filtros.prestador_id)
      params.append("prestador_id", filtros.prestador_id);
    if (filtros.lote_id) params.append("lote_id", filtros.lote_id);
    if (filtros.salida_id) params.append("salida_id", filtros.salida_id);
    if (filtros.fecha_inicio)
      params.append("fecha_inicio", filtros.fecha_inicio);
    if (filtros.fecha_fin) params.append("fecha_fin", filtros.fecha_fin);
    if (filtros.turista_nacionalidad)
      params.append("turista_nacionalidad", filtros.turista_nacionalidad);
    if (filtros.page) params.append("page", filtros.page.toString());
    if (filtros.limit) params.append("limit", filtros.limit.toString());

    const response = await apiRequest<{
      success: boolean;
      message: string;
      data: RespuestaBusquedaBrazaletes;
    }>(`/brazaletes/search?${params.toString()}`);

    return {
      success: true,
      data: response.data,
      message: response.message,
    };
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : "Error desconocido",
    };
  }
}

/**
 * Health check del sistema de brazaletes
 */
export async function healthCheckBrazaletes(): Promise<{
  success: boolean;
  message?: string;
}> {
  try {
    const response = await apiRequest<{
      success: boolean;
      message: string;
    }>("/brazaletes/health");

    return {
      success: true,
      message: response.message,
    };
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : "Error desconocido",
    };
  }
}

// ==================== FUNCIONES COMPUESTAS ====================

/**
 * Obtener todos los datos necesarios para el dashboard de brazaletes
 */
export async function getAllDashboardBrazaletesData(): Promise<{
  success: boolean;
  data?: {
    inventario: InventarioBrazaletes;
    estadisticas: EstadisticasBrazaletes;
    alertas: AlertaBrazaletes[];
    lotes: RespuestaLotes;
  };
  message?: string;
}> {
  try {
    const [inventarioResult, estadisticasResult, alertasResult, lotesResult] =
      await Promise.all([
        getInventarioBrazaletes(),
        getEstadisticasBrazaletes(),
        getAlertasBrazaletes(),
        getLotesBrazaletes({ limit: 5 }), // Solo los últimos 5 lotes
      ]);

    if (
      !inventarioResult.success ||
      !estadisticasResult.success ||
      !alertasResult.success ||
      !lotesResult.success
    ) {
      return {
        success: false,
        message: "Error al obtener algunos datos del dashboard",
      };
    }

    return {
      success: true,
      data: {
        inventario: inventarioResult.data!,
        estadisticas: estadisticasResult.data!,
        alertas: alertasResult.data || [],
        lotes: lotesResult.data!,
      },
    };
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : "Error desconocido",
    };
  }
}
