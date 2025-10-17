/**
 * Utilidades para manejo de fechas con interpretación regional
 *
 * IMPORTANTE: El backend devuelve fechas en formato YYYY-MM-DD que representan
 * fechas en la zona horaria de México (America/Mexico_City).
 *
 * Estas funciones interpretan correctamente esas fechas y las muestran
 * según la zona horaria local del cliente para mejor UX.
 */

import { format } from "date-fns";
import { es } from "date-fns/locale";
import { toZonedTime } from "date-fns-tz";
import { clientLogger } from "../logger-client";

// Zona horaria de México para el sistema
const MEXICO_TIMEZONE = "America/Mexico_City";

/**
 * Interpreta una fecha YYYY-MM-DD del backend como fecha de México
 * y la convierte a Date object local para el cliente usando date-fns-tz
 *
 * IMPORTANTE: El backend devuelve fechas que representan fechas en México.
 * Esta función interpreta correctamente esa fecha para el timezone local del cliente.
 *
 * @param fechaYYYYMMDD - Fecha YYYY-MM-DD del backend (representa México)
 * @returns Date object interpretado correctamente para el cliente
 *
 * @example
 * // Backend envía "2025-10-16" (representa Oct 16 en México)
 * const date = interpretarFechaDelBackend("2025-10-16");
 * // date será un Date que muestra Oct 16 sin importar la zona del cliente
 */
export function interpretarFechaDelBackend(fechaYYYYMMDD: string): Date {
  try {
    // Validar formato
    if (!/^\d{4}-\d{2}-\d{2}$/.test(fechaYYYYMMDD)) {
      throw new Error(`Formato de fecha inválido: ${fechaYYYYMMDD}`);
    }

    // Crear la fecha interpretándola como medianoche en México
    const [año, mes, dia] = fechaYYYYMMDD.split("-").map(Number);

    // Para fechas (sin horas específicas), crear una fecha local simple que represente el mismo día
    // Usar mediodía para evitar problemas de conversión de timezone
    const fechaLocal = new Date(año, mes - 1, dia, 12, 0, 0); // Mediodía local

    return fechaLocal;
  } catch (error) {
    clientLogger.error(
      `Error interpretando fecha del backend: ${fechaYYYYMMDD}`,
      error
    );
    // Fallback: crear fecha local simple con mediodía para evitar desfases
    const [año, mes, dia] = fechaYYYYMMDD.split("-").map(Number);
    return new Date(año, mes - 1, dia, 12, 0, 0);
  }
}

/**
 * Interpreta una fecha YYYY-MM-DD del backend (México)
 * y la formatea para mostrar al usuario en español
 *
 * @param fechaYYYYMMDD - Fecha en formato YYYY-MM-DD del backend (representa México)
 * @returns Fecha formateada legible: "jueves, 10 de octubre de 2025"
 *
 * @example
 * formatearFechaRegional("2025-10-10") // "jueves, 10 de octubre de 2025"
 */
export function formatearFechaRegional(fechaYYYYMMDD: string): string {
  try {
    // Validar formato
    if (!/^\d{4}-\d{2}-\d{2}$/.test(fechaYYYYMMDD)) {
      clientLogger.warn(`Formato de fecha inválido: ${fechaYYYYMMDD}`);
      return fechaYYYYMMDD; // Fallback: mostrar string original
    }

    // Validar valores antes de crear la fecha
    const [año, mes, dia] = fechaYYYYMMDD.split("-").map(Number);
    if (
      año < 2020 ||
      año > 2030 ||
      mes < 1 ||
      mes > 12 ||
      dia < 1 ||
      dia > 31
    ) {
      clientLogger.warn(`Fecha fuera de rango esperado: ${fechaYYYYMMDD}`);
      return fechaYYYYMMDD;
    }

    // Usar la función de interpretación del backend
    const fechaInterpretada = interpretarFechaDelBackend(fechaYYYYMMDD);

    return format(fechaInterpretada, "EEEE, d 'de' MMMM 'de' yyyy", {
      locale: es,
    });
  } catch (error) {
    clientLogger.error(
      `Error formateando fecha regional: ${fechaYYYYMMDD}`,
      error
    );
    return fechaYYYYMMDD; // Fallback seguro
  }
}

/**
 * Formatea una fecha YYYY-MM-DD de forma compacta para tablas y listas
 *
 * @param fechaYYYYMMDD - Fecha en formato YYYY-MM-DD del backend
 * @returns Fecha en formato compacto: "10 oct 2025"
 *
 * @example
 * formatearFechaCompacta("2025-10-10") // "10 oct 2025"
 */
export function formatearFechaCompacta(fechaYYYYMMDD: string): string {
  try {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(fechaYYYYMMDD)) {
      return fechaYYYYMMDD;
    }

    // Usar la función de interpretación del backend
    const fechaInterpretada = interpretarFechaDelBackend(fechaYYYYMMDD);

    return format(fechaInterpretada, "d MMM yyyy", { locale: es });
  } catch (error) {
    clientLogger.error(
      `Error formateando fecha compacta: ${fechaYYYYMMDD}`,
      error
    );
    return fechaYYYYMMDD;
  }
}

/**
 * Obtiene la fecha actual en México usando date-fns-tz
 * Esto asegura consistencia con el backend que también usa timezone de México
 *
 * @returns Fecha actual en México en formato YYYY-MM-DD
 *
 * @example
 * obtenerFechaActualMexico() // "2025-10-16" (fecha en México)
 */
export function obtenerFechaActualMexico(): string {
  try {
    const ahora = new Date();
    // Convertir a zona horaria de México
    const ahoraEnMexico = toZonedTime(ahora, MEXICO_TIMEZONE);

    const año = ahoraEnMexico.getFullYear();
    const mes = String(ahoraEnMexico.getMonth() + 1).padStart(2, "0");
    const dia = String(ahoraEnMexico.getDate()).padStart(2, "0");

    return `${año}-${mes}-${dia}`;
  } catch (error) {
    clientLogger.error("Error obteniendo fecha actual de México", error);
    // Fallback: usar fecha local del cliente
    const hoy = new Date();
    const año = hoy.getFullYear();
    const mes = String(hoy.getMonth() + 1).padStart(2, "0");
    const dia = String(hoy.getDate()).padStart(2, "0");
    return `${año}-${mes}-${dia}`;
  }
}

/**
 * Obtiene la fecha actual en formato YYYY-MM-DD según el timezone local
 * para enviar al backend o usar como valor por defecto
 *
 * @returns Fecha actual en formato YYYY-MM-DD
 *
 * @example
 * obtenerFechaLocalYYYYMMDD() // "2025-10-16"
 */
export function obtenerFechaLocalYYYYMMDD(): string {
  try {
    const hoy = new Date();
    const año = hoy.getFullYear();
    const mes = String(hoy.getMonth() + 1).padStart(2, "0");
    const dia = String(hoy.getDate()).padStart(2, "0");

    return `${año}-${mes}-${dia}`;
  } catch (error) {
    clientLogger.error("Error obteniendo fecha local actual", error);
    return new Date().toISOString().split("T")[0]; // Fallback
  }
}

/**
 * Convierte fecha local del usuario a YYYY-MM-DD para enviar al backend
 * Maneja diferentes formatos de entrada de manera segura
 *
 * @param fecha - Date object, string YYYY-MM-DD, o string de fecha
 * @returns Fecha en formato YYYY-MM-DD para el backend
 *
 * @example
 * extraerFechaLocalYYYYMMDD(new Date()) // "2025-10-16"
 * extraerFechaLocalYYYYMMDD("2025-10-10") // "2025-10-10"
 */
export function extraerFechaLocalYYYYMMDD(fecha: Date | string): string {
  try {
    if (typeof fecha === "string") {
      // Si ya es YYYY-MM-DD, validar y retornar
      if (/^\d{4}-\d{2}-\d{2}$/.test(fecha)) {
        return fecha;
      }
      // Si es otro formato, parsear como fecha local
      fecha = new Date(fecha);
    }

    // Si no es una fecha válida, usar fecha actual
    if (!fecha || isNaN(fecha.getTime())) {
      clientLogger.warn("Fecha inválida recibida, usando fecha actual");
      return obtenerFechaLocalYYYYMMDD();
    }

    const año = fecha.getFullYear();
    const mes = String(fecha.getMonth() + 1).padStart(2, "0");
    const dia = String(fecha.getDate()).padStart(2, "0");

    return `${año}-${mes}-${dia}`;
  } catch (error) {
    clientLogger.error("Error extrayendo fecha local YYYY-MM-DD", error);
    return obtenerFechaLocalYYYYMMDD(); // Fallback seguro
  }
}

/**
 * Verifica si una fecha YYYY-MM-DD es válida
 *
 * @param fechaYYYYMMDD - Fecha en formato YYYY-MM-DD
 * @returns true si la fecha es válida
 */
export function esFechaValidaYYYYMMDD(fechaYYYYMMDD: string): boolean {
  if (typeof fechaYYYYMMDD !== "string") return false;
  if (!/^\d{4}-\d{2}-\d{2}$/.test(fechaYYYYMMDD)) return false;

  try {
    const [año, mes, dia] = fechaYYYYMMDD.split("-").map(Number);
    const fecha = new Date(año, mes - 1, dia);

    return (
      fecha.getFullYear() === año &&
      fecha.getMonth() === mes - 1 &&
      fecha.getDate() === dia
    );
  } catch {
    return false;
  }
}

/**
 * Compara dos fechas YYYY-MM-DD
 *
 * @param fecha1 - Primera fecha YYYY-MM-DD
 * @param fecha2 - Segunda fecha YYYY-MM-DD
 * @returns -1 si fecha1 < fecha2, 0 si son iguales, 1 si fecha1 > fecha2
 */
export function compararFechasYYYYMMDD(fecha1: string, fecha2: string): number {
  if (!esFechaValidaYYYYMMDD(fecha1) || !esFechaValidaYYYYMMDD(fecha2)) {
    clientLogger.warn("Fechas inválidas en comparación:", { fecha1, fecha2 });
    return 0;
  }

  if (fecha1 < fecha2) return -1;
  if (fecha1 > fecha2) return 1;
  return 0;
}
