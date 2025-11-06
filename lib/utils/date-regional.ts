/**
 * Utilidades para manejo de fechas sin timezone
 *
 * IMPORTANTE: El backend trabaja con fechas en formato YYYY-MM-DD (tipo DATE en BD).
 * Estas fechas NO tienen hora ni timezone - son solo fechas conceptuales (día).
 *
 * El backend NO convierte a UTC ni agrega hora. Las fechas se guardan, consultan
 * y devuelven directamente como strings YYYY-MM-DD sin conversiones.
 *
 * Estas funciones trabajan exclusivamente con strings YYYY-MM-DD para:
 * - Enviar al backend (sin conversiones)
 * - Recibir del backend (sin conversiones)
 * - Formatear para mostrar al usuario (solo visualización)
 */

import { format } from "date-fns";
import { es } from "date-fns/locale";
import { clientLogger } from "../logger-client";

/**
 * Convierte una fecha YYYY-MM-DD del backend a Date object para formateo visual
 *
 * IMPORTANTE: Esta función SOLO se usa para formatear fechas para mostrar al usuario.
 * NO se usa para enviar al backend ni para comparaciones. El backend trabaja solo
 * con strings YYYY-MM-DD sin conversiones.
 *
 * Usa mediodía local para evitar problemas de conversión de timezone al crear
 * el Date object (solo para formateo visual).
 *
 * @param fechaYYYYMMDD - Fecha YYYY-MM-DD del backend (string sin timezone)
 * @returns Date object para formateo visual (no para enviar al backend)
 *
 * @example
 * // Backend envía "2025-10-16"
 * const date = interpretarFechaDelBackend("2025-10-16");
 * // date será un Date que representa Oct 16 para formateo visual
 */
export function interpretarFechaDelBackend(fechaYYYYMMDD: string): Date {
  try {
    // Validar formato
    if (!/^\d{4}-\d{2}-\d{2}$/.test(fechaYYYYMMDD)) {
      throw new Error(`Formato de fecha inválido: ${fechaYYYYMMDD}`);
    }

    // Extraer componentes de la fecha
    const [año, mes, dia] = fechaYYYYMMDD.split("-").map(Number);

    // Crear Date object usando mediodía local para evitar problemas de timezone
    // (solo para formateo visual, NO para enviar al backend)
    const fechaLocal = new Date(año, mes - 1, dia, 12, 0, 0);

    return fechaLocal;
  } catch (error) {
    clientLogger.error(
      `Error interpretando fecha del backend: ${fechaYYYYMMDD}`,
      error
    );
    // Fallback: crear fecha local simple con mediodía
    const [año, mes, dia] = fechaYYYYMMDD.split("-").map(Number);
    return new Date(año, mes - 1, dia, 12, 0, 0);
  }
}

/**
 * Formatea una fecha YYYY-MM-DD del backend para mostrar al usuario en español
 *
 * IMPORTANTE: Esta función SOLO se usa para formatear fechas para mostrar.
 * El backend envía y recibe fechas como strings YYYY-MM-DD sin conversiones.
 *
 * @param fechaYYYYMMDD - Fecha en formato YYYY-MM-DD del backend (string sin timezone)
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
 * Obtiene la fecha actual en formato YYYY-MM-DD según el timezone local del cliente
 *
 * IMPORTANTE: El backend NO convierte fechas a UTC. Esta función obtiene la fecha
 * actual del cliente en su timezone local y la devuelve como YYYY-MM-DD para
 * enviar al backend directamente (sin conversiones).
 *
 * @returns Fecha actual en formato YYYY-MM-DD (timezone local del cliente)
 *
 * @example
 * obtenerFechaActualMexico() // "2025-10-16" (fecha local del cliente)
 */
export function obtenerFechaActualMexico(): string {
  try {
    // Obtener fecha actual en timezone local del cliente
    const hoy = new Date();
    const año = hoy.getFullYear();
    const mes = String(hoy.getMonth() + 1).padStart(2, "0");
    const dia = String(hoy.getDate()).padStart(2, "0");

    return `${año}-${mes}-${dia}`;
  } catch (error) {
    clientLogger.error("Error obteniendo fecha actual", error);
    // Fallback: usar fecha local del cliente
    const hoy = new Date();
    const año = hoy.getFullYear();
    const mes = String(hoy.getMonth() + 1).padStart(2, "0");
    const dia = String(hoy.getDate()).padStart(2, "0");
    return `${año}-${mes}-${dia}`;
  }
}

/**
 * Obtiene la fecha actual en formato YYYY-MM-DD según el timezone local del cliente
 *
 * IMPORTANTE: El backend NO convierte fechas a UTC. Esta función obtiene la fecha
 * actual del cliente en su timezone local y la devuelve como YYYY-MM-DD para
 * enviar al backend directamente (sin conversiones).
 *
 * @returns Fecha actual en formato YYYY-MM-DD (timezone local del cliente)
 *
 * @example
 * obtenerFechaLocalYYYYMMDD() // "2025-10-16"
 */
export function obtenerFechaLocalYYYYMMDD(): string {
  try {
    // Obtener fecha actual en timezone local del cliente
    const hoy = new Date();
    const año = hoy.getFullYear();
    const mes = String(hoy.getMonth() + 1).padStart(2, "0");
    const dia = String(hoy.getDate()).padStart(2, "0");

    return `${año}-${mes}-${dia}`;
  } catch (error) {
    clientLogger.error("Error obteniendo fecha local actual", error);
    // Fallback: usar componentes locales (no toISOString para evitar UTC)
    const hoy = new Date();
    const año = hoy.getFullYear();
    const mes = String(hoy.getMonth() + 1).padStart(2, "0");
    const dia = String(hoy.getDate()).padStart(2, "0");
    return `${año}-${mes}-${dia}`;
  }
}

/**
 * Convierte fecha local del usuario a YYYY-MM-DD para enviar al backend
 *
 * IMPORTANTE: El backend espera strings YYYY-MM-DD sin conversiones a UTC.
 * Esta función extrae la fecha usando componentes locales (getFullYear, getMonth, getDate)
 * para evitar problemas de timezone.
 *
 * @param fecha - Date object, string YYYY-MM-DD, o string de fecha
 * @returns Fecha en formato YYYY-MM-DD para enviar al backend (sin conversiones)
 *
 * @example
 * extraerFechaLocalYYYYMMDD(new Date()) // "2025-10-16" (usando componentes locales)
 * extraerFechaLocalYYYYMMDD("2025-10-10") // "2025-10-10" (ya es YYYY-MM-DD)
 */
export function extraerFechaLocalYYYYMMDD(fecha: Date | string): string {
  try {
    if (typeof fecha === "string") {
      // Si ya es YYYY-MM-DD, validar y retornar directamente (sin conversiones)
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

    // Extraer componentes usando métodos locales (NO toISOString para evitar UTC)
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
 * Normaliza una fecha recibida del backend a string YYYY-MM-DD
 *
 * IMPORTANTE: El backend siempre devuelve fechas como strings YYYY-MM-DD.
 * Esta función normaliza fechas que pueden venir como Date objects o strings
 * para asegurar que siempre trabajemos con strings YYYY-MM-DD.
 *
 * @param fecha - Fecha del backend (puede ser Date object o string YYYY-MM-DD)
 * @returns Fecha normalizada como string YYYY-MM-DD
 *
 * @example
 * normalizarFechaDelBackend("2025-10-16") // "2025-10-16"
 * normalizarFechaDelBackend(new Date("2025-10-16")) // "2025-10-16"
 */
export function normalizarFechaDelBackend(fecha: Date | string): string {
  if (typeof fecha === "string") {
    // Si ya es string, validar formato y retornar
    if (/^\d{4}-\d{2}-\d{2}$/.test(fecha)) {
      return fecha;
    }
    // Si es string con timestamp, extraer solo YYYY-MM-DD
    return fecha.split("T")[0];
  }

  // Si es Date object, extraer componentes locales (NO toISOString para evitar UTC)
  if (fecha instanceof Date) {
    const año = fecha.getFullYear();
    const mes = String(fecha.getMonth() + 1).padStart(2, "0");
    const dia = String(fecha.getDate()).padStart(2, "0");
    return `${año}-${mes}-${dia}`;
  }

  // Fallback: intentar convertir a string
  return String(fecha);
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

/**
 * Obtiene la fecha máxima permitida para filtrado de bloques (hoy + 15 días)
 *
 * IMPORTANTE: Usa componentes locales (NO toISOString) para evitar conversiones a UTC.
 *
 * @returns Fecha máxima en formato YYYY-MM-DD (timezone local del cliente)
 *
 * @example
 * obtenerFechaMaximaBloques() // "2025-10-31" (si hoy es 2025-10-16)
 */
export function obtenerFechaMaximaBloques(): string {
  try {
    const hoy = new Date();
    const fechaMaxima = new Date();
    fechaMaxima.setDate(hoy.getDate() + 15);

    // Extraer componentes usando métodos locales (NO toISOString para evitar UTC)
    const año = fechaMaxima.getFullYear();
    const mes = String(fechaMaxima.getMonth() + 1).padStart(2, "0");
    const dia = String(fechaMaxima.getDate()).padStart(2, "0");

    return `${año}-${mes}-${dia}`;
  } catch (error) {
    clientLogger.error("Error obteniendo fecha máxima para bloques", error);
    // Fallback: usar componentes locales (no toISOString)
    const hoy = new Date();
    hoy.setDate(hoy.getDate() + 15);
    const año = hoy.getFullYear();
    const mes = String(hoy.getMonth() + 1).padStart(2, "0");
    const dia = String(hoy.getDate()).padStart(2, "0");
    return `${año}-${mes}-${dia}`;
  }
}
