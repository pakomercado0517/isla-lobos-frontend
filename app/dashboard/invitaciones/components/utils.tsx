import { RolInvitacion } from "@/lib/types/invitaciones";

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
 * Formatea la fecha de expiración
 */
export function formatearFechaExpiracion(fecha: string): string {
  try {
    const date = new Date(fecha);
    return date.toLocaleDateString("es-MX", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  } catch {
    return fecha;
  }
}

/**
 * Verifica si una invitación está expirada
 */
export function estaExpirada(fechaExpiracion: string): boolean {
  try {
    const fecha = new Date(fechaExpiracion);
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);
    return fecha < hoy;
  } catch {
    return false;
  }
}

/**
 * Obtiene la fecha mínima para el campo de expiración (hoy)
 * Formateada explícitamente para zona horaria de México usando Intl.DateTimeFormat
 */
export function getFechaMinima(): string {
  const hoy = new Date();

  // Usar Intl.DateTimeFormat con formato ISO (en-CA) y timezone México
  const formatter = new Intl.DateTimeFormat("en-CA", {
    timeZone: "America/Mexico_City",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });

  // Retorna directamente en formato YYYY-MM-DD
  return formatter.format(hoy);
}

/**
 * Obtiene la fecha por defecto (30 días desde hoy)
 * Formateada explícitamente para zona horaria de México usando Intl.DateTimeFormat
 */
export function getFechaPorDefecto(): string {
  const hoy = new Date();

  // Primero obtener la fecha de hoy en México usando Intl
  const formatter = new Intl.DateTimeFormat("en-CA", {
    timeZone: "America/Mexico_City",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });

  const fechaHoyMexico = formatter.format(hoy); // "YYYY-MM-DD"

  // Crear Date desde esa fecha y agregar 30 días
  const fecha = new Date(fechaHoyMexico);
  fecha.setDate(fecha.getDate() + 30);

  const year = fecha.getFullYear();
  const month = String(fecha.getMonth() + 1).padStart(2, "0");
  const day = String(fecha.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
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
