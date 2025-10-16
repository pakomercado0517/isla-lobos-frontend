import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Convierte una fecha a formato YYYY-MM-DD usando la hora local (sin conversión a UTC)
 * Esto evita problemas de zona horaria donde la fecha puede cambiar
 * @param fecha - Fecha a convertir
 * @returns String en formato YYYY-MM-DD
 */
function fechaAStringLocal(fecha: Date): string {
  const year = fecha.getFullYear();
  const month = String(fecha.getMonth() + 1).padStart(2, "0");
  const day = String(fecha.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

/**
 * Calcula las fechas disponibles para programar salidas
 * Usa la zona horaria local (México) para evitar problemas de conversión
 * @returns Objeto con fecha mínima (hoy) y máxima (hoy + 6 días = 7 días total)
 */
export function getFechasDisponibles() {
  // Obtener fecha actual en zona horaria local
  const hoy = new Date();

  // Crear fecha máxima (hoy + 6 días = 7 días total incluyendo hoy)
  const fechaMaxima = new Date();
  fechaMaxima.setDate(hoy.getDate() + 6);

  return {
    fechaMinima: fechaAStringLocal(hoy), // YYYY-MM-DD en hora local
    fechaMaxima: fechaAStringLocal(fechaMaxima), // YYYY-MM-DD en hora local
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
  // Siempre extraer la parte YYYY-MM-DD del string original sin parsear
  let fechaString: string;

  if (fecha instanceof Date) {
    // Si ya es Date, está parseado y puede tener timezone issues
    // Usar los componentes del Date en hora local
    const year = fecha.getFullYear();
    const month = String(fecha.getMonth() + 1).padStart(2, "0");
    const day = String(fecha.getDate()).padStart(2, "0");
    fechaString = `${year}-${month}-${day}`;
  } else {
    // Si es string, extraer solo YYYY-MM-DD (antes del timestamp si existe)
    fechaString = fecha.split("T")[0];
  }

  // Crear Date usando componentes para evitar timezone
  const [year, month, day] = fechaString.split("-").map(Number);
  const fechaObj = new Date(year, month - 1, day);

  return fechaObj.toLocaleDateString("es-MX", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

/**
 * Formatea una fecha en formato YYYY-MM-DD para mostrar sin problemas de zona horaria
 * SIN crear objetos Date intermedios para evitar problemas de timezone
 * @param fecha - Fecha en formato YYYY-MM-DD
 * @returns Fecha formateada en español (ej: "lunes, 14 de octubre de 2025")
 */
export function formatearFechaSinTimezone(fecha: string): string {
  // Extraer solo la parte de la fecha
  const fechaSolo = fecha.split("T")[0];

  // Extraer componentes
  const [year, month, day] = fechaSolo.split("-").map(Number);

  // Array de nombres de meses en español
  const meses = [
    "enero",
    "febrero",
    "marzo",
    "abril",
    "mayo",
    "junio",
    "julio",
    "agosto",
    "septiembre",
    "octubre",
    "noviembre",
    "diciembre",
  ];

  // Array de nombres de días en español
  const dias = [
    "domingo",
    "lunes",
    "martes",
    "miércoles",
    "jueves",
    "viernes",
    "sábado",
  ];

  // Crear Date con hora al mediodía para evitar problemas de timezone
  // Usamos 12:00:00 para estar seguro de que no hay desfase
  const fechaObj = new Date(year, month - 1, day, 12, 0, 0);
  const diaSemana = dias[fechaObj.getDay()];

  // Formatear directamente
  return `${diaSemana}, ${day} de ${meses[month - 1]} de ${year}`;
}

/**
 * Extrae la fecha en formato YYYY-MM-DD desde cualquier tipo de entrada
 * SIN conversiones de timezone - solo extracción de string
 * @param fecha - Fecha como Date, string YYYY-MM-DD, o string con timestamp
 * @returns String en formato YYYY-MM-DD
 */
export function extraerFechaYYYYMMDD(fecha: Date | string): string {
  if (fecha instanceof Date) {
    // Si es Date, extraer componentes locales SIN toISOString()
    const year = fecha.getFullYear();
    const month = String(fecha.getMonth() + 1).padStart(2, "0");
    const day = String(fecha.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  } else {
    // Si es string, extraer solo YYYY-MM-DD (antes de T si existe)
    return fecha.split("T")[0];
  }
}

/**
 * Obtiene la fecha actual en formato YYYY-MM-DD
 * SIN conversiones de timezone - usa hora local
 * @returns String en formato YYYY-MM-DD
 */
export function obtenerFechaActualYYYYMMDD(): string {
  const hoy = new Date();
  const year = hoy.getFullYear();
  const month = String(hoy.getMonth() + 1).padStart(2, "0");
  const day = String(hoy.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

/**
 * Formatea una fecha en formato corto para zona horaria de México
 * SIN crear objetos Date intermedios para evitar problemas de timezone
 * @param fecha - Fecha en formato YYYY-MM-DD
 * @returns Fecha formateada (ej: "14 de octubre de 2025")
 */
export function formatearFechaMexico(fecha: string): string {
  // Extraer solo la parte de la fecha
  const fechaSolo = fecha.split("T")[0];

  // Extraer componentes
  const [year, month, day] = fechaSolo.split("-").map(Number);

  // Array de nombres de meses en español
  const meses = [
    "enero",
    "febrero",
    "marzo",
    "abril",
    "mayo",
    "junio",
    "julio",
    "agosto",
    "septiembre",
    "octubre",
    "noviembre",
    "diciembre",
  ];

  // Formatear directamente sin crear Date
  return `${day} de ${meses[month - 1]} de ${year}`;
}

/**
 * Obtiene una fecha en formato YYYY-MM-DD usando componentes locales (sin desfase UTC)
 * @param date - Fecha a formatear; por defecto, hoy
 */
export function formatearYYYYMMDDLocal(date: Date = new Date()): string {
  // Usar toLocaleDateString para obtener fecha en formato local
  const fechaLocal = date.toLocaleDateString("es-MX");

  // Convertir de DD/MM/YYYY a YYYY-MM-DD
  const [day, month, year] = fechaLocal.split("/");
  const result = `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;

  return result;
}

export const formatearAFechaLocal = (fecha: string) => {
  return new Date(fecha).toLocaleDateString("es-MX");
};

/**
 * Formatea una fecha como tiempo relativo (hace X minutos/horas/días)
 * @param fecha - Fecha en formato ISO8601 o Date
 * @returns String con tiempo relativo en español
 */
export function formatearTiempoRelativo(fecha: string | Date): string {
  const fechaObj = typeof fecha === "string" ? new Date(fecha) : fecha;
  const ahora = new Date();
  const diferenciaMs = ahora.getTime() - fechaObj.getTime();

  // Convertir a diferentes unidades
  const segundos = Math.floor(diferenciaMs / 1000);
  const minutos = Math.floor(segundos / 60);
  const horas = Math.floor(minutos / 60);
  const dias = Math.floor(horas / 24);
  const semanas = Math.floor(dias / 7);
  const meses = Math.floor(dias / 30);
  const años = Math.floor(dias / 365);

  // Determinar el formato apropiado
  if (segundos < 60) {
    return "Hace unos segundos";
  } else if (minutos < 60) {
    return minutos === 1 ? "Hace 1 minuto" : `Hace ${minutos} minutos`;
  } else if (horas < 24) {
    return horas === 1 ? "Hace 1 hora" : `Hace ${horas} horas`;
  } else if (dias < 7) {
    return dias === 1 ? "Hace 1 día" : `Hace ${dias} días`;
  } else if (semanas < 4) {
    return semanas === 1 ? "Hace 1 semana" : `Hace ${semanas} semanas`;
  } else if (meses < 12) {
    return meses === 1 ? "Hace 1 mes" : `Hace ${meses} meses`;
  } else {
    return años === 1 ? "Hace 1 año" : `Hace ${años} años`;
  }
}
