/**
 * Utilidades para la página de detalle de salida
 */

import type { Salida } from "@/lib/types/salida";
import type { Brazalete } from "@/lib/types/brazaletes";

/**
 * Obtiene la clase CSS según el estado de la salida
 */
export function getEstadoColor(estado: string): string {
  switch (estado) {
    case "programada":
      return "bg-blue-100 text-blue-800 border-blue-200";
    case "en_progreso":
    case "en_curso":
      return "bg-yellow-100 text-yellow-800 border-yellow-200";
    case "completada":
      return "bg-green-100 text-green-800 border-green-200";
    case "cancelada":
    case "cancelada_por_clima":
    case "cancelada_capitaria":
      return "bg-red-100 text-red-800 border-red-200";
    default:
      return "bg-gray-100 text-gray-800 border-gray-200";
  }
}

/**
 * Calcula estadísticas de brazaletes por nacionalidad
 */
export function calcularEstadisticasNacionalidad(brazaletes: Brazalete[]): {
  total: number;
  locales: number;
  nacionales: number;
  internacionales: number;
  sin_datos: number;
  porcentajes: {
    locales: number;
    nacionales: number;
    internacionales: number;
    sin_datos: number;
  };
} {
  const total = brazaletes.length;
  const locales = brazaletes.filter(
    (b) => b.turista_nacionalidad === "local"
  ).length;
  const nacionales = brazaletes.filter(
    (b) => b.turista_nacionalidad === "nacional"
  ).length;
  const internacionales = brazaletes.filter(
    (b) => b.turista_nacionalidad === "internacional"
  ).length;
  const sin_datos = total - (locales + nacionales + internacionales);

  return {
    total,
    locales,
    nacionales,
    internacionales,
    sin_datos,
    porcentajes: {
      locales: total > 0 ? Math.round((locales / total) * 100) : 0,
      nacionales: total > 0 ? Math.round((nacionales / total) * 100) : 0,
      internacionales:
        total > 0 ? Math.round((internacionales / total) * 100) : 0,
      sin_datos: total > 0 ? Math.round((sin_datos / total) * 100) : 0,
    },
  };
}

/**
 * Verifica si una salida puede ser editada
 */
export function puedeEditarSalida(salida: Salida): boolean {
  return salida.estado === "programada";
}

/**
 * Verifica si una salida puede ser iniciada
 */
export function puedeIniciarSalida(salida: Salida): boolean {
  return salida.estado === "programada";
}

/**
 * Verifica si una salida puede ser completada
 */
export function puedeCompletarSalida(salida: Salida): boolean {
  return salida.estado === "programada" || salida.estado === "en_curso";
}

/**
 * Verifica si una salida puede ser cancelada
 */
export function puedeCancelarSalida(salida: Salida): boolean {
  return salida.estado === "programada" || salida.estado === "en_curso";
}

/**
 * Obtiene el porcentaje de ocupación de la embarcación
 */
export function calcularOcupacionEmbarcacion(
  pasajeros: number,
  capacidad: number
): number {
  if (capacidad === 0) return 0;
  return Math.round((pasajeros / capacidad) * 100);
}

/**
 * Verifica si la embarcación está sobrecargada
 */
export function estaEmbarcacionSobrecargada(
  pasajeros: number,
  capacidad: number
): boolean {
  return pasajeros > capacidad;
}

/**
 * NOTA: Usa formatearFechaSinTimezone de @/lib/utils en su lugar
 * Esta función se mantiene solo por compatibilidad temporal
 */
