/**
 * @deprecated Este archivo está deprecated. Usar funciones de @/lib/utils date-regional en su lugar.
 * Utilidades para manejo de fechas sin problemas de timezone
 * Usamos solo formato YYYY-MM-DD para evitar conversiones regionales
 */

import { clientLogger } from "../logger-client";
import { obtenerFechaLocalYYYYMMDD } from "../utils";

/**
 * Convierte una fecha a formato YYYY-MM-DD sin consideraciones de timezone
 * @param date - Fecha a formatear
 * @returns String en formato YYYY-MM-DD
 */
export function formatearFechaSinTimezone(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

/**
 * @deprecated Usar obtenerFechaLocalYYYYMMDD desde @/lib/utils
 * Obtiene la fecha actual en formato YYYY-MM-DD sin timezone
 * @returns String en formato YYYY-MM-DD
 */
export function obtenerFechaHoySinTimezone(): string {
  clientLogger.warn(
    "⚠️ obtenerFechaHoySinTimezone está deprecated. Usar obtenerFechaLocalYYYYMMDD desde @/lib/utils"
  );
  return obtenerFechaLocalYYYYMMDD();
}

/**
 * Crea un objeto Date desde un string YYYY-MM-DD sin conversión de timezone
 * @param dateString - Fecha en formato YYYY-MM-DD
 * @returns Date object normalizado a medianoche
 */
export function crearFechaSinTimezone(dateString: string): Date {
  const [year, month, day] = dateString.split("-").map(Number);
  return new Date(year, month - 1, day);
}

/**
 * Compara si una fecha es menor que otra (solo considera día, mes, año)
 * @param fecha1 - Primera fecha en formato YYYY-MM-DD
 * @param fecha2 - Segunda fecha en formato YYYY-MM-DD
 * @returns true si fecha1 < fecha2
 */
export function esFechaMenor(fecha1: string, fecha2: string): boolean {
  const date1 = crearFechaSinTimezone(fecha1);
  const date2 = crearFechaSinTimezone(fecha2);
  return date1 < date2;
}

/**
 * Verifica si una fecha está en el pasado (anterior a hoy)
 * @param fechaString - Fecha en formato YYYY-MM-DD
 * @returns true si la fecha es anterior a hoy
 */
export function esFechaPasada(fechaString: string): boolean {
  const fechaHoy = obtenerFechaHoySinTimezone();
  return esFechaMenor(fechaString, fechaHoy);
}

/**
 * Formatea una fecha para mostrar en la UI (sin timezone)
 * @param fechaString - Fecha en formato YYYY-MM-DD
 * @returns String formateado para mostrar
 */
export function formatearFechaParaMostrar(fechaString: string): string {
  const fecha = crearFechaSinTimezone(fechaString);

  return fecha.toLocaleDateString("es-MX", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC", // Evitar conversión de timezone
  });
}
