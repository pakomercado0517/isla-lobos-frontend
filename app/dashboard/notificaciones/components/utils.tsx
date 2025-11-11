/**
 * Funciones utilitarias para el módulo de notificaciones
 * @module notificaciones/components/utils
 */

import {
  TipoNotificacion,
  PrioridadNotificacion,
  EstadoNotificacion,
  ValidacionMensaje,
  NotificacionMasivaResponse,
} from "@/lib/types/notificaciones";
import {
  Bell,
  Cloud,
  AlertCircle,
  CheckCircle,
  XCircle,
  FileText,
  Users,
  Package,
} from "lucide-react";

export const TEMPLATE_IDS = {
  copy_wheater_alert: "HXc70362f7fe1a81e41395ca20205621ee",
  copy_permission_expired: "HX11d1286ac902e630988662ac637bb480",
  copy_confirmacion_salida: "HX8341791ae370ae43cf6dea263399d016",
  copy_recordatorio: "HX4713e79217e333e844caea7bf55aa037",
} as const;

/**
 * Valida formato de teléfono mexicano (10 dígitos)
 */
export function validarTelefono(telefono: string): boolean {
  const telefonoLimpio = telefono.replace(/\D/g, "");
  return telefonoLimpio.length === 10;
}

/**
 * Valida formato de email
 */
export function validarEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Formatea número de teléfono para visualización
 * Ej: 2291234567 → (229) 123-4567
 */
export function formatearTelefono(telefono: string): string {
  const limpio = telefono.replace(/\D/g, "");

  if (limpio.length !== 10) {
    return telefono;
  }

  return `(${limpio.slice(0, 3)}) ${limpio.slice(3, 6)}-${limpio.slice(6)}`;
}

/**
 * Cuenta caracteres de un mensaje
 */
export function contarCaracteres(mensaje: string): number {
  return mensaje.length;
}

/**
 * Valida longitud del mensaje (10-1600 caracteres)
 */
export function validarMensajeLength(mensaje: string): ValidacionMensaje {
  const caracteres = mensaje.length;

  if (caracteres < 10) {
    return {
      valid: false,
      message: `El mensaje debe tener al menos 10 caracteres (actual: ${caracteres})`,
      caracteres,
    };
  }

  if (caracteres > 1600) {
    return {
      valid: false,
      message: `El mensaje no puede exceder 1600 caracteres (actual: ${caracteres})`,
      caracteres,
    };
  }

  return {
    valid: true,
    message: `Mensaje válido (${caracteres}/1600 caracteres)`,
    caracteres,
  };
}

/**
 * Obtiene el icono correspondiente según tipo de notificación
 */
export function getIconoTipoNotificacion(
  tipo: TipoNotificacion
): React.ReactElement {
  const iconos: Record<
    TipoNotificacion,
    React.ComponentType<{ className?: string }>
  > = {
    alerta_clima: Cloud,
    permiso_por_vencer: AlertCircle,
    permiso_vencido: XCircle,
    confirmacion_salida: CheckCircle,
    cancelacion_salida: XCircle,
    stock_brazaletes_bajo: Package,
    resumen_diario: FileText,
    bienvenida: Users,
    recordatorio_generico: Bell,
  };

  const Icono = iconos[tipo];
  return <Icono className="h-4 w-4" />;
}

/**
 * Obtiene clases CSS para el color de prioridad
 */
export function getColorPrioridad(prioridad: PrioridadNotificacion): string {
  const colores: Record<PrioridadNotificacion, string> = {
    urgente: "bg-red-100 text-red-800 border-red-300",
    alta: "bg-orange-100 text-orange-800 border-orange-300",
    media: "bg-yellow-100 text-yellow-800 border-yellow-300",
    baja: "bg-blue-100 text-blue-800 border-blue-300",
  };

  return colores[prioridad];
}

/**
 * Obtiene clases CSS para el color de estado
 */
export function getEstadoColor(estado: EstadoNotificacion): string {
  const colores: Record<EstadoNotificacion, string> = {
    pendiente: "bg-gray-100 text-gray-800",
    enviado: "bg-blue-100 text-blue-800",
    entregado: "bg-green-100 text-green-800",
    leido: "bg-green-200 text-green-900",
    fallido: "bg-red-100 text-red-800",
    reintentando: "bg-yellow-100 text-yellow-800",
  };

  return colores[estado];
}

/**
 * Obtiene etiqueta legible del estado
 */
export function getEstadoLabel(estado: EstadoNotificacion): string {
  const labels: Record<EstadoNotificacion, string> = {
    pendiente: "Pendiente",
    enviado: "Enviado",
    entregado: "Entregado",
    leido: "Leído",
    fallido: "Fallido",
    reintentando: "Reintentando",
  };

  return labels[estado];
}

/**
 * Formatea resultado de envío masivo para mostrar
 * Ej: "3/5 enviados, 2 fallidos"
 */
export function formatearResultadoEnvio(
  resultado: NotificacionMasivaResponse
): string {
  const { total, enviados, fallidos } = resultado.resumen;

  if (fallidos === 0) {
    return `✅ ${enviados}/${total} mensajes enviados exitosamente`;
  }

  return `⚠️ ${enviados}/${total} enviados, ${fallidos} fallidos`;
}

/**
 * Genera preview del mensaje según tipo y datos
 */
export function generarPreviewMensaje(
  tipo: TipoNotificacion,
  datos: Record<string, string | number>
): string {
  const plantillas: Record<TipoNotificacion, string> = {
    alerta_clima: `🌊 *ALERTA METEOROLÓGICA - CONANP*\n\nEstado del puerto: *${
      datos.estado_puerto || "N/A"
    }*\nOleaje: ${datos.oleaje || 0}m\nViento: ${datos.viento || 0} km/h${
      datos.viento_direccion ? ` ${datos.viento_direccion}` : ""
    }\n\n${
      datos.mensaje_adicional ||
      "⚠️ Por favor, tome las precauciones necesarias."
    }`,

    permiso_por_vencer: `⚠️ *IMPORTANTE - CONANP - APFF*${
      datos.nombre ? `\n\nHola ${datos.nombre},` : ""
    }\n\nTu permiso de operación vence en *${
      datos.dias || 30
    } días*.\nFecha de vencimiento: ${
      datos.fecha_vencimiento || "N/A"
    }\n\nPor favor, renueva tu permiso a la brevedad para continuar operando.\n\n_Para más información, contacta a CONANP._`,

    permiso_vencido: `🔴 *URGENTE - CONANP*\n\nTu permiso ha vencido.\n\nContacta a CONANP inmediatamente para renovación.`,

    confirmacion_salida: `✅ *Confirmación de Salida*\n\nDestino: ${
      datos.destino || "N/A"
    }\nFecha: ${datos.fecha || "N/A"}\nPasajeros: ${
      datos.pasajeros || 0
    }\n\n¡Buen viaje!`,

    cancelacion_salida: `❌ *Salida Cancelada*\n\nLa salida programada ha sido cancelada.\n\nContacta a CONANP para más información.`,

    stock_brazaletes_bajo: `📦 *Alerta de Inventario - CONANP*${
      datos.nombre ? `\n\nHola ${datos.nombre},` : ""
    }\n\nTu stock de brazaletes está bajo: *${
      datos.cantidad || 0
    } brazaletes disponibles*.\n\nTe recomendamos solicitar reabastecimiento pronto para continuar con tus operaciones.\n\n_Contacta a CONANP para realizar tu pedido._`,

    resumen_diario: `📊 *Resumen del Día*\n\nSalidas: ${
      datos.salidas || 0
    }\nPasajeros: ${datos.pasajeros || 0}\nIngresos: $${
      datos.ingresos || 0
    }\n\n¡Buen trabajo!`,

    bienvenida: `👋 *Bienvenido a APFF Sistema Arrecifal Lobos-Tuxpan*\n\n${
      datos.nombre || "Prestador"
    },\n\nTu cuenta ha sido activada exitosamente.`,

    recordatorio_generico: `🔔 *Recordatorio*\n\n${
      datos.mensaje || "Tienes una notificación pendiente."
    }`,
  };

  return plantillas[tipo] || "Mensaje personalizado";
}

/**
 * Obtiene título descriptivo del tipo de notificación
 */
export function getTituloTipoNotificacion(tipo: TipoNotificacion): string {
  const titulos: Record<TipoNotificacion, string> = {
    alerta_clima: "Alerta Meteorológica",
    permiso_por_vencer: "Permiso por Vencer",
    permiso_vencido: "Permiso Vencido",
    confirmacion_salida: "Confirmación de Salida",
    cancelacion_salida: "Cancelación de Salida",
    stock_brazaletes_bajo: "Stock Bajo de Brazaletes",
    resumen_diario: "Resumen Diario",
    bienvenida: "Mensaje de Bienvenida",
    recordatorio_generico: "Recordatorio",
  };

  return titulos[tipo];
}

/**
 * Obtiene descripción del tipo de notificación
 */
export function getDescripcionTipoNotificacion(tipo: TipoNotificacion): string {
  const descripciones: Record<TipoNotificacion, string> = {
    alerta_clima: "Notifica cambios en condiciones meteorológicas",
    permiso_por_vencer: "Aviso de vencimiento próximo de permisos",
    permiso_vencido: "Notificación de permiso vencido",
    confirmacion_salida: "Confirma registro de salida exitoso",
    cancelacion_salida: "Notifica cancelación de salida",
    stock_brazaletes_bajo: "Alerta de inventario bajo",
    resumen_diario: "Reporte de actividades del día",
    bienvenida: "Mensaje de bienvenida a nuevos usuarios",
    recordatorio_generico: "Recordatorio personalizado",
  };

  return descripciones[tipo];
}
