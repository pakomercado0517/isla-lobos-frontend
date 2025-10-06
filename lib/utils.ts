import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Calcula las fechas disponibles para programar salidas
 * @returns Objeto con fecha mínima (hoy) y máxima (hoy + 6 días = 7 días total)
 */
export function getFechasDisponibles() {
  const hoy = new Date();
  const fechaMaxima = new Date();
  fechaMaxima.setDate(hoy.getDate() + 6); // 6 días desde hoy = 7 días total (incluyendo hoy)

  return {
    fechaMinima: hoy.toISOString().split("T")[0], // YYYY-MM-DD
    fechaMaxima: fechaMaxima.toISOString().split("T")[0], // YYYY-MM-DD
    fechaMinimaDate: hoy,
    fechaMaximaDate: fechaMaxima,
  };
}

/**
 * Valida si una fecha está dentro del rango permitido (hoy + 6 días = 7 días total)
 * @param fecha - Fecha a validar en formato YYYY-MM-DD
 * @returns true si la fecha es válida, false si no
 */
export function esFechaValida(fecha: string): boolean {
  const fechaSeleccionada = new Date(fecha);
  const { fechaMinimaDate, fechaMaximaDate } = getFechasDisponibles();

  return (
    fechaSeleccionada >= fechaMinimaDate && fechaSeleccionada <= fechaMaximaDate
  );
}

/**
 * Formatea una fecha para mostrar al usuario
 * @param fecha - Fecha en formato YYYY-MM-DD
 * @returns Fecha formateada en español
 */
export function formatearFecha(fecha: string): string {
  const fechaObj = new Date(fecha);
  return fechaObj.toLocaleDateString("es-MX", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

/**
 * Formatea una fecha de salida para mostrar en el dashboard
 * Maneja correctamente el timezone para evitar mostrar fechas incorrectas
 * @param fecha - Fecha de la salida (puede ser Date, YYYY-MM-DD o YYYY-MM-DDTHH:MM:SS)
 * @returns Fecha formateada en español
 */
export function formatearFechaSalida(fecha: Date | string): string {
  let fechaObj: Date;

  if (fecha instanceof Date) {
    // Si ya es un Date, usar directamente pero crear uno nuevo para evitar problemas de timezone
    fechaObj = new Date(fecha.getFullYear(), fecha.getMonth(), fecha.getDate());
  } else {
    // Si es string, extraer solo la parte de la fecha
    const fechaSolo = fecha.split("T")[0];

    // Crear la fecha usando solo la parte de la fecha para evitar problemas de timezone
    const [year, month, day] = fechaSolo.split("-").map(Number);
    fechaObj = new Date(year, month - 1, day); // month - 1 porque Date usa 0-indexed months
  }

  return fechaObj.toLocaleDateString("es-MX", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

/**
 * Formatea una fecha en formato YYYY-MM-DD para mostrar sin problemas de zona horaria
 * @param fecha - Fecha en formato YYYY-MM-DD
 * @returns Fecha formateada en español (ej: "lunes, 28 de enero de 2025")
 */
export function formatearFechaSinTimezone(fecha: string): string {
  // Extraer solo la parte de la fecha
  const fechaSolo = fecha.split("T")[0];

  // Crear la fecha usando solo la parte de la fecha para evitar problemas de timezone
  const [year, month, day] = fechaSolo.split("-").map(Number);
  const fechaObj = new Date(year, month - 1, day); // month - 1 porque Date usa 0-indexed months

  return fechaObj.toLocaleDateString("es-MX", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

/**
 * Obtiene una fecha en formato YYYY-MM-DD usando componentes locales (sin desfase UTC)
 * @param date - Fecha a formatear; por defecto, hoy
 */
export function formatearYYYYMMDDLocal(date: Date = new Date()): string {
  console.log("🔧 formatearYYYYMMDDLocal: Input date:", date);

  // Usar toLocaleDateString para obtener fecha en formato local
  const fechaLocal = date.toLocaleDateString("es-MX");
  console.log("🔧 formatearYYYYMMDDLocal: fechaLocal:", fechaLocal);

  // Convertir de DD/MM/YYYY a YYYY-MM-DD
  const [day, month, year] = fechaLocal.split("/");
  const result = `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;

  console.log("🔧 formatearYYYYMMDDLocal: Result:", result);
  return result;
}

export const formatearAFechaLocal = (fecha: string) => {
  return new Date(fecha).toLocaleDateString("es-MX");
};
