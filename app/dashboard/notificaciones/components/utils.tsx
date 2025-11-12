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
  copy_wheater_alert: "HX9bc0ec7245e518ccaeecd5aeb77dab19",
  copy_permission_expired: "HX2f9d540a26ece6a066938aaa3d88b640",
  copy_confirmacion_salida: "HX5767e7adab64f9c288fa15dc447db0a0",
  copy_recordatorio: "HX9dd16f5d1084209c27003ebbdfb48723",
  autorizacion_embarcacion: "HXc6b8af7095c19cb0c13411a4af40cb02",
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
 * Los previews coinciden con las plantillas aprobadas en Twilio
 */
export function generarPreviewMensaje(
  tipo: TipoNotificacion,
  datos: Record<string, string | number>
): string {
  const plantillas: Record<TipoNotificacion, string> = {
    alerta_clima: `Hola prestador autorizado. ⚠️ Emitimos una alerta meteorológica para Isla Lobos.\nEl estado oficial del puerto es ${
      datos.estado || datos.estado_puerto || "RESTRINGIDO"
    }.\nSe pronostica oleaje de hasta ${datos.oleaje || 0} metros.\nEl viento se mantendrá aproximado a ${
      datos.viento || datos.viento_velocidad || 0
    } km/h.\nPor favor refuerza la seguridad, informa a tu tripulación y confirma la recepción de este aviso.`,

    permiso_por_vencer: `Hola ${datos.nombre || "prestador autorizado"}. 📄 Te recordamos que tu permiso de operación está por vencer.\nQuedan aproximadamente ${
      datos.dias || "30"
    } días para la fecha límite.\nLa fecha de vencimiento registrada es ${
      datos.fecha || datos.fecha_vencimiento || "N/A"
    }.\nMantener tu documentación al día te permite seguir operando sin contratiempos. Si ya realizaste la renovación, ignora este mensaje y muchas gracias por tu cooperación.`,

    permiso_vencido: `Hola prestador autorizado. 🔴 Tu permiso de operación ha vencido.\nContacta a CONANP inmediatamente para renovar tu documentación y evitar interrupciones en tus operaciones.\nGracias por tu atención.`,

    confirmacion_salida: `Hola prestador autorizado. ✅ Hemos confirmado tu salida turística.\nEl destino programado es ${
      datos.destino || "Isla Lobos"
    }.\nLa embarcación tiene registro para la fecha ${
      datos.fecha || "N/A"
    }.\nSe han aprobado ${datos.pasajeros || 0} pasajeros para este servicio.\nTe pedimos llegar con la anticipación habitual, cumplir las medidas de seguridad y responder a este mensaje si necesitas asistencia adicional. ¡Buen viaje!`,

    cancelacion_salida: `Hola prestador autorizado. ❌ Lamentamos informarte que la salida programada ha sido cancelada.\nPor favor contacta a CONANP para más información sobre el motivo de la cancelación y posibles alternativas.\nGracias por tu comprensión.`,

    stock_brazaletes_bajo: `Hola prestador autorizado. 📦 Te informamos que tu stock de brazaletes está bajo.\nDispones de ${
      datos.cantidad || 0
    } brazaletes disponibles.\nTe recomendamos solicitar reabastecimiento pronto para continuar con tus operaciones sin contratiempos.\nContacta a CONANP para realizar tu pedido.`,

    resumen_diario: `Hola prestador autorizado. 📊 Te compartimos el resumen del día:\nSalidas realizadas: ${
      datos.salidas || 0
    }\nTotal de pasajeros: ${datos.pasajeros || 0}\nIngresos registrados: $${
      datos.ingresos || 0
    }\n¡Gracias por tu operación responsable!`,

    bienvenida: `Hola ${
      datos.nombre || "prestador autorizado"
    }. 👋 Te damos la bienvenida al Sistema de Gestión de Isla Lobos - CONANP.\nTu cuenta ha sido activada exitosamente y ya puedes comenzar a utilizar todos los servicios disponibles.\nSi tienes alguna duda, no dudes en contactarnos. ¡Bienvenido!`,

    recordatorio_generico: `Hola prestador autorizado. 🔔 Queremos compartir un recordatorio importante del sistema CONANP.\n${
      datos.mensaje || "Tienes una notificación pendiente."
    }\nGracias por mantener una operación responsable y por confirmar la recepción de este mensaje cuando sea posible.`,
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
