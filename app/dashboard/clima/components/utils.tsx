import React from "react";
import {
  AlertTriangle,
  AlertCircle,
  XCircle,
  Info,
  TrendingUp,
  TrendingDown,
  Minus,
} from "lucide-react";
import type {
  EstadoPuerto,
  NivelVisibilidad,
  SeveridadAlerta,
  TendenciaMeteorologica,
} from "@/lib/types/clima";

// ============================================================================
// FORMATEO DE FECHAS Y HORAS
// ============================================================================

/**
 * Formatea una fecha en formato ISO8601 a formato legible en español
 */
export function formatearFechaHora(fecha: string): string {
  try {
    const date = new Date(fecha);
    return date.toLocaleString("es-MX", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return fecha;
  }
}

/**
 * Formatea solo la fecha sin hora
 */
export function formatearFecha(fecha: string): string {
  try {
    const date = new Date(fecha);
    return date.toLocaleDateString("es-MX", {
      weekday: "short",
      month: "short",
      day: "numeric",
    });
  } catch {
    return fecha;
  }
}

/**
 * Calcula el tiempo transcurrido desde una fecha en formato legible
 */
export function tiempoTranscurrido(fecha: string): string {
  const ahora = new Date();
  const fechaCondicion = new Date(fecha);
  const diffMs = ahora.getTime() - fechaCondicion.getTime();
  const diffHoras = Math.floor(diffMs / (1000 * 60 * 60));
  const diffMinutos = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));

  if (diffHoras > 0) {
    return `hace ${diffHoras}h ${diffMinutos}min`;
  }
  return `hace ${diffMinutos}min`;
}

// ============================================================================
// ESTILOS Y COLORES
// ============================================================================

/**
 * Obtiene el color de badge según el estado del puerto
 */
export function getEstadoPuertoColor(estado: EstadoPuerto): string {
  const colores: Record<EstadoPuerto, string> = {
    abierto: "bg-green-100 text-green-800 hover:bg-green-100",
    restricciones: "bg-yellow-100 text-yellow-800 hover:bg-yellow-100",
    cerrado: "bg-red-100 text-red-800 hover:bg-red-100",
    emergencia: "bg-purple-100 text-purple-800 hover:bg-purple-100",
  };
  return colores[estado] || "bg-gray-100 text-gray-800";
}

/**
 * Obtiene el icono según el estado del puerto
 */
export function getEstadoPuertoIcono(estado: EstadoPuerto): string {
  const iconos: Record<EstadoPuerto, string> = {
    abierto: "🟢",
    restricciones: "🟡",
    cerrado: "🔴",
    emergencia: "⚡",
  };
  return iconos[estado] || "⚪";
}

/**
 * Obtiene el color de badge según la visibilidad
 */
export function getVisibilidadColor(visibilidad: NivelVisibilidad): string {
  const colores: Record<NivelVisibilidad, string> = {
    excelente: "bg-green-100 text-green-800 hover:bg-green-100",
    buena: "bg-blue-100 text-blue-800 hover:bg-blue-100",
    regular: "bg-yellow-100 text-yellow-800 hover:bg-yellow-100",
    baja: "bg-red-100 text-red-800 hover:bg-red-100",
  };
  return colores[visibilidad] || "bg-gray-100 text-gray-800";
}

/**
 * Obtiene el color de badge según la severidad de alerta
 */
export function getSeveridadColor(severidad: SeveridadAlerta): string {
  const colores: Record<SeveridadAlerta, string> = {
    baja: "bg-blue-100 text-blue-800 hover:bg-blue-100",
    media: "bg-yellow-100 text-yellow-800 hover:bg-yellow-100",
    alta: "bg-orange-100 text-orange-800 hover:bg-orange-100",
    critica: "bg-red-100 text-red-800 hover:bg-red-100",
  };
  return colores[severidad] || "bg-gray-100 text-gray-800";
}

/**
 * Obtiene el icono según la severidad de alerta
 */
export function getSeveridadIcono(
  severidad: SeveridadAlerta
): React.ReactElement {
  const iconos: Record<SeveridadAlerta, React.ReactElement> = {
    baja: <Info className="h-4 w-4 text-blue-600" />,
    media: <AlertCircle className="h-4 w-4 text-yellow-600" />,
    alta: <AlertTriangle className="h-4 w-4 text-orange-600" />,
    critica: <XCircle className="h-4 w-4 text-red-600" />,
  };
  return iconos[severidad] || <Info className="h-4 w-4" />;
}

/**
 * Obtiene el color según la tendencia meteorológica
 */
export function getTendenciaColor(tendencia: TendenciaMeteorologica): string {
  const colores: Record<TendenciaMeteorologica, string> = {
    creciente: "bg-red-100 text-red-800 hover:bg-red-100",
    estable: "bg-blue-100 text-blue-800 hover:bg-blue-100",
    decreciente: "bg-green-100 text-green-800 hover:bg-green-100",
  };
  return colores[tendencia] || "bg-gray-100 text-gray-800";
}

/**
 * Obtiene el icono según la tendencia
 */
export function getTendenciaIcono(
  tendencia: TendenciaMeteorologica
): React.ReactElement {
  const iconos: Record<TendenciaMeteorologica, React.ReactElement> = {
    creciente: <TrendingUp className="inline h-3 w-3" />,
    estable: <Minus className="inline h-3 w-3" />,
    decreciente: <TrendingDown className="inline h-3 w-3" />,
  };
  return iconos[tendencia] || <Minus className="inline h-3 w-3" />;
}

// ============================================================================
// VALIDACIONES
// ============================================================================

/**
 * Valida si el oleaje es seguro para navegación
 */
export function esOleajeSeguro(oleaje: number): boolean {
  return oleaje < 2.5;
}

/**
 * Valida si el viento es seguro para navegación
 */
export function esVientoSeguro(velocidad: number): boolean {
  return velocidad < 30;
}

/**
 * Valida si la visibilidad es adecuada
 */
export function esVisibilidadAdecuada(visibilidad: NivelVisibilidad): boolean {
  return visibilidad === "excelente" || visibilidad === "buena";
}

// ============================================================================
// VALIDACIÓN DE SEGURIDAD
// ============================================================================

/**
 * Resultado de la validación de seguridad
 */
export interface ValidacionSeguridad {
  esSeguro: boolean;
  razones: string[];
  recomendacion: "segura" | "precaucion" | "no_recomendada" | "peligrosa";
}

/**
 * Valida si las condiciones meteorológicas son seguras para navegación
 *
 * Evalúa:
 * - Estado del puerto (debe estar abierto o con restricciones leves)
 * - Oleaje (< 2.5m)
 * - Viento (< 30 km/h)
 * - Visibilidad (buena o excelente)
 *
 * @param condicion - Condición meteorológica a evaluar
 * @returns Objeto con resultado de validación y razones
 */
export function validarCondicionesSeguras(condicion: {
  oleaje: number;
  viento_velocidad: number;
  visibilidad: NivelVisibilidad;
  estado_puerto: EstadoPuerto;
}): ValidacionSeguridad {
  const razones: string[] = [];
  let puntosPeligro = 0;

  // Evaluar estado del puerto
  if (condicion.estado_puerto === "cerrado") {
    razones.push("Puerto cerrado por autoridades");
    puntosPeligro += 4;
  } else if (condicion.estado_puerto === "emergencia") {
    razones.push("Estado de emergencia declarado");
    puntosPeligro += 5;
  } else if (condicion.estado_puerto === "restricciones") {
    razones.push("Restricciones activas en el puerto");
    puntosPeligro += 2;
  }

  // Evaluar oleaje
  if (condicion.oleaje > 2.5) {
    razones.push(`Oleaje alto: ${condicion.oleaje}m`);
    puntosPeligro += 3;
  } else if (condicion.oleaje > 1.5) {
    razones.push(`Oleaje moderado: ${condicion.oleaje}m`);
    puntosPeligro += 1;
  }

  // Evaluar viento
  if (condicion.viento_velocidad > 40) {
    razones.push(`Viento muy fuerte: ${condicion.viento_velocidad} km/h`);
    puntosPeligro += 3;
  } else if (condicion.viento_velocidad > 30) {
    razones.push(`Viento fuerte: ${condicion.viento_velocidad} km/h`);
    puntosPeligro += 2;
  } else if (condicion.viento_velocidad > 20) {
    razones.push(`Viento moderado: ${condicion.viento_velocidad} km/h`);
    puntosPeligro += 1;
  }

  // Evaluar visibilidad
  if (condicion.visibilidad === "baja") {
    razones.push("Visibilidad baja");
    puntosPeligro += 2;
  } else if (condicion.visibilidad === "regular") {
    razones.push("Visibilidad regular");
    puntosPeligro += 1;
  }

  // Determinar recomendación
  let recomendacion: "segura" | "precaucion" | "no_recomendada" | "peligrosa";
  if (puntosPeligro === 0) {
    recomendacion = "segura";
  } else if (puntosPeligro <= 2) {
    recomendacion = "precaucion";
  } else if (puntosPeligro <= 4) {
    recomendacion = "no_recomendada";
  } else {
    recomendacion = "peligrosa";
  }

  return {
    esSeguro: puntosPeligro <= 2,
    razones,
    recomendacion,
  };
}
