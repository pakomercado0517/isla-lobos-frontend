import { RolInvitacion } from "@/lib/types/invitaciones";
import {
  obtenerFechaLocalYYYYMMDD,
  extraerFechaLocalYYYYMMDD,
  formatearFechaMexico,
} from "@/lib/utils";

/**
 * Genera un código de invitación único
 */
export function generarCodigoInvitacion(
  rol: RolInvitacion = "prestador"
): string {
  const prefix = rol === "conanp" ? "CONANP" : "PRESTADOR";
  const timestamp = Date.now().toString().slice(-6);
  const random = Math.random().toString(36).substr(2, 3).toUpperCase();
  return `${prefix}${timestamp}${random}`;
}

/**
 * Obtiene el color del badge según el estado
 */
export function getEstadoBadgeClass(usada: boolean, expirada: boolean): string {
  if (usada) {
    return "bg-green-100 text-green-800 border-green-300";
  }
  if (expirada) {
    return "bg-red-100 text-red-800 border-red-300";
  }
  return "bg-blue-100 text-blue-800 border-blue-300";
}

/**
 * Obtiene el texto del estado
 */
export function getEstadoTexto(usada: boolean, expirada: boolean): string {
  if (usada) return "Utilizada";
  if (expirada) return "Expirada";
  return "Disponible";
}

/**
 * Formatea la fecha de expiración para mostrar al usuario
 * Usa la función helper de lib/utils.ts para evitar problemas de timezone
 */
export function formatearFechaExpiracion(fecha: string): string {
  try {
    // Usar la función helper que maneja correctamente el timezone
    return formatearFechaMexico(fecha);
  } catch {
    return fecha;
  }
}

/**
 * Verifica si una invitación está expirada
 * Compara fechas en formato YYYY-MM-DD sin conversiones de timezone
 */
export function estaExpirada(fechaExpiracion: string): boolean {
  try {
    // Extraer solo YYYY-MM-DD de ambas fechas para comparación justa
    const fechaExpiracionLimpia = extraerFechaLocalYYYYMMDD(fechaExpiracion);
    const fechaHoy = obtenerFechaLocalYYYYMMDD();

    // Comparar strings directamente (YYYY-MM-DD es comparable lexicográficamente)
    return fechaExpiracionLimpia < fechaHoy;
  } catch {
    return false;
  }
}

/**
 * Obtiene la fecha mínima para el campo de expiración (hoy)
 * SIN conversiones de timezone - usa función helper de lib/utils.ts
 */
export function getFechaMinima(): string {
  return obtenerFechaLocalYYYYMMDD();
}

/**
 * Obtiene la fecha por defecto (30 días desde hoy)
 * SIN usar objetos Date para evitar problemas de timezone
 */
export function getFechaPorDefecto(): string {
  // Obtener fecha actual sin conversiones de timezone
  const hoy = obtenerFechaLocalYYYYMMDD();
  const [year, month, day] = hoy.split("-").map(Number);

  // Calcular 30 días desde hoy SIN crear objetos Date
  let yearDef = year;
  let monthDef = month;
  let dayDef = day + 30;

  // Ajustar mes y año si el día excede los días del mes
  const diasEnMes = new Date(yearDef, monthDef, 0).getDate(); // Solo para obtener días del mes

  while (dayDef > diasEnMes) {
    dayDef -= diasEnMes;
    monthDef++;

    if (monthDef > 12) {
      monthDef = 1;
      yearDef++;
    }

    // Obtener días del nuevo mes (solo para la condición del while)
    const diasEnNuevoMes = new Date(yearDef, monthDef, 0).getDate();
    // Si aún excede, continuar el loop
    if (dayDef <= diasEnNuevoMes) {
      break;
    }
  }

  return `${yearDef}-${String(monthDef).padStart(2, "0")}-${String(
    dayDef
  ).padStart(2, "0")}`;
}

/**
 * Genera la URL completa del registro con el código
 */
export function generarUrlRegistro(codigo: string): string {
  const baseUrl = window.location.origin;
  return `${baseUrl}/registro?codigo=${codigo}`;
}

/**
 * Copia un texto al portapapeles
 */
export async function copiarAlPortapapeles(texto: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(texto);
    return true;
  } catch {
    return false;
  }
}
