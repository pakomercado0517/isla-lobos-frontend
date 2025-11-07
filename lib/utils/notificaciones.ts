/**
 * Funciones helper para el manejo de notificaciones del dashboard
 */

import {
  TipoNotificacionDashboard,
  PrioridadNotificacionDashboard,
  NotificacionDashboard,
} from "@/lib/types/dashboard-notificaciones";
import { Ship, AlertTriangle, Calendar, Package, Cloud, AlertCircle } from "lucide-react";
import { LucideIcon } from "lucide-react";
import { formatearFechaRegional } from "./date-regional";

/**
 * Obtiene el ícono correspondiente al tipo de notificación
 */
export function getIconoNotificacion(
  tipo: TipoNotificacionDashboard
): LucideIcon {
  switch (tipo) {
    case TipoNotificacionDashboard.NUEVA_EMBARCACION:
    case TipoNotificacionDashboard.EMBARCACION_AUTORIZADA:
    case TipoNotificacionDashboard.EMBARCACION_RECHAZADA:
      return Ship;
    case TipoNotificacionDashboard.PERMISO_POR_VENCER:
    case TipoNotificacionDashboard.PERMISO_VENCIDO:
      return AlertTriangle;
    case TipoNotificacionDashboard.NUEVA_SALIDA_REGISTRADA:
      return Calendar;
    case TipoNotificacionDashboard.STOCK_BRAZALETES_BAJO:
      return Package;
    case TipoNotificacionDashboard.ALERTA_CLIMA:
      return Cloud;
    default:
      return AlertCircle;
  }
}

/**
 * Obtiene el color CSS correspondiente a la prioridad de la notificación
 */
export function getColorPrioridad(
  prioridad: PrioridadNotificacionDashboard
): string {
  switch (prioridad) {
    case PrioridadNotificacionDashboard.ALTA:
      return "border-red-500 bg-red-50";
    case PrioridadNotificacionDashboard.MEDIA:
      return "border-yellow-500 bg-yellow-50";
    case PrioridadNotificacionDashboard.BAJA:
      return "border-blue-500 bg-blue-50";
    default:
      return "border-gray-500 bg-gray-50";
  }
}

/**
 * Formatea la fecha de la notificación de forma relativa
 * Ej: "hace 5 minutos", "hace 2 horas", "hace 3 días"
 */
export function formatearFechaRelativa(fechaStr: string): string {
  try {
    // Normalizar fecha recibida (formato YYYY-MM-DD del backend)
    const fecha = new Date(fechaStr + "T12:00:00"); // Mediodía para evitar problemas de timezone
    const ahora = new Date();
    const diferenciaMs = ahora.getTime() - fecha.getTime();
    const diferenciaSegundos = Math.floor(diferenciaMs / 1000);
    const diferenciaMinutos = Math.floor(diferenciaSegundos / 60);
    const diferenciaHoras = Math.floor(diferenciaMinutos / 60);
    const diferenciaDias = Math.floor(diferenciaHoras / 24);

    if (diferenciaSegundos < 60) {
      return "hace unos segundos";
    } else if (diferenciaMinutos < 60) {
      return `hace ${diferenciaMinutos} ${diferenciaMinutos === 1 ? "minuto" : "minutos"}`;
    } else if (diferenciaHoras < 24) {
      return `hace ${diferenciaHoras} ${diferenciaHoras === 1 ? "hora" : "horas"}`;
    } else if (diferenciaDias < 7) {
      return `hace ${diferenciaDias} ${diferenciaDias === 1 ? "día" : "días"}`;
    } else {
      // Si es más de una semana, mostrar fecha formateada
      return formatearFechaRegional(fechaStr);
    }
  } catch (_error) {
    // Si hay error al formatear, devolver la fecha original
    return fechaStr;
  }
}

/**
 * Obtiene el color del badge según la prioridad
 */
export function getColorBadgePrioridad(
  prioridad: PrioridadNotificacionDashboard
): string {
  switch (prioridad) {
    case PrioridadNotificacionDashboard.ALTA:
      return "bg-red-500";
    case PrioridadNotificacionDashboard.MEDIA:
      return "bg-yellow-500";
    case PrioridadNotificacionDashboard.BAJA:
      return "bg-blue-500";
    default:
      return "bg-gray-500";
  }
}

/**
 * Verifica si una notificación es reciente (menos de 5 minutos)
 */
export function esNotificacionReciente(
  notificacion: NotificacionDashboard
): boolean {
  try {
    const fecha = new Date(notificacion.created_at + "T12:00:00");
    const ahora = new Date();
    const diferenciaMs = ahora.getTime() - fecha.getTime();
    const diferenciaMinutos = Math.floor(diferenciaMs / 1000 / 60);
    return diferenciaMinutos < 5;
  } catch {
    return false;
  }
}

