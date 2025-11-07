"use client";

import { useEffect, useState } from "react";
import { NotificacionDashboard, TipoNotificacionDashboard } from "@/lib/types/dashboard-notificaciones";
import { getIconoNotificacion, formatearFechaRelativa } from "@/lib/utils/notificaciones";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { clientLogger } from "@/lib/logger-client";

interface ToastNotificacionProps {
  notificacion: NotificacionDashboard;
  onClose: () => void;
  onMarcarComoLeida?: (notificacionId: string) => Promise<void>;
  duration?: number;
}

export function ToastNotificacion({
  notificacion,
  onClose,
  onMarcarComoLeida,
  duration = 7000,
}: ToastNotificacionProps) {
  const router = useRouter();
  const [visible, setVisible] = useState(true);
  const Icono = getIconoNotificacion(notificacion.tipo);
  const fechaRelativa = formatearFechaRelativa(notificacion.created_at);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
      setTimeout(onClose, 300); // Esperar animación de salida
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const handleClick = () => {
    // Convertir tipo a string para comparación segura
    const tipoNotificacion = String(notificacion.tipo).toLowerCase();
    
    // Obtener embarcacion_id del metadata
    // El metadata puede tener embarcacion_id o embarcacionId (camelCase)
    const embarcacionId = 
      notificacion.metadata?.embarcacion_id || 
      notificacion.metadata?.embarcacionId ||
      null;
    
    clientLogger.info("Click en ToastNotificacion", {
      notificacionId: notificacion.id,
      tipo: notificacion.tipo,
      tipoNormalizado: tipoNotificacion,
      enlace: notificacion.enlace,
      metadata: notificacion.metadata,
      embarcacionId: embarcacionId,
    });

    // Verificar si es un tipo de notificación de embarcación
    const esNotificacionEmbarcacion = 
      tipoNotificacion === TipoNotificacionDashboard.NUEVA_EMBARCACION.toLowerCase() ||
      tipoNotificacion === TipoNotificacionDashboard.EMBARCACION_AUTORIZADA.toLowerCase() ||
      tipoNotificacion === TipoNotificacionDashboard.EMBARCACION_RECHAZADA.toLowerCase() ||
      tipoNotificacion === "nueva_embarcacion" ||
      tipoNotificacion === "embarcacion_autorizada" ||
      tipoNotificacion === "embarcacion_rechazada";

    // Determinar ruta de navegación
    let rutaNavegacion: string | null = null;
    
    // Para notificaciones de embarcaciones, navegar al detalle si hay embarcacion_id
    if (esNotificacionEmbarcacion) {
      // Si hay embarcacion_id en el metadata, navegar al detalle
      if (embarcacionId) {
        rutaNavegacion = `/dashboard/embarcaciones/${embarcacionId}`;
        clientLogger.info("Navegando al detalle de embarcación desde toast", {
          embarcacionId,
          ruta: rutaNavegacion,
        });
      } else {
        // Si no hay ID, navegar a la lista de embarcaciones
        rutaNavegacion = "/dashboard/embarcaciones";
        clientLogger.warn("No hay embarcacion_id en metadata, navegando a lista desde toast", {
          metadata: notificacion.metadata,
        });
      }
    } else if (notificacion.enlace && notificacion.enlace !== "/dashboard") {
      // Para otros tipos, usar el enlace del backend si existe y no es /dashboard
      rutaNavegacion = notificacion.enlace;
    } else {
      clientLogger.warn("No hay ruta de navegación definida para esta notificación", {
        notificacionId: notificacion.id,
        tipo: notificacion.tipo,
        enlace: notificacion.enlace,
        embarcacionId: embarcacionId,
      });
    }
    
    // Marcar como leída si hay función disponible
    if (onMarcarComoLeida && rutaNavegacion) {
      onMarcarComoLeida(notificacion.id).then(() => {
        // Navegar después de marcar como leída
        if (rutaNavegacion) {
          router.replace(rutaNavegacion);
        }
        onClose();
      }).catch((error) => {
        clientLogger.error("Error al marcar notificación como leída desde toast", error);
        // Navegar de todos modos
        if (rutaNavegacion) {
          router.replace(rutaNavegacion);
        }
        onClose();
      });
    } else {
      // Si no hay función para marcar como leída, solo navegar
      if (rutaNavegacion) {
        router.replace(rutaNavegacion);
      }
      onClose();
    }
  };

  if (!visible) return null;

  return (
    <div
      className={cn(
        "fixed top-4 right-4 z-50 w-full max-w-sm bg-white rounded-lg shadow-lg border border-slate-200",
        "transform transition-all duration-300 ease-in-out",
        visible ? "translate-x-0 opacity-100" : "translate-x-full opacity-0"
      )}
      role="alert"
    >
      <div className="p-4">
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0 mt-0.5">
            <Icono className="w-5 h-5 text-teal-600" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <h4 className="text-sm font-semibold text-slate-900">
                {notificacion.titulo}
              </h4>
              <button
                onClick={onClose}
                className="flex-shrink-0 text-slate-400 hover:text-slate-600 transition-colors"
                aria-label="Cerrar notificación"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <p className="mt-1 text-sm text-slate-700 line-clamp-2">
              {notificacion.mensaje}
            </p>
            <p className="mt-2 text-xs text-slate-500">{fechaRelativa}</p>
            {(notificacion.enlace ||
              notificacion.tipo === TipoNotificacionDashboard.NUEVA_EMBARCACION ||
              notificacion.tipo === TipoNotificacionDashboard.EMBARCACION_AUTORIZADA ||
              notificacion.tipo === TipoNotificacionDashboard.EMBARCACION_RECHAZADA) && (
              <button
                onClick={handleClick}
                className="mt-2 text-sm font-medium text-teal-600 hover:text-teal-700"
              >
                Ver detalles →
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

