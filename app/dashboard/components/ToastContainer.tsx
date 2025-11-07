"use client";

import { useNotifications } from "@/lib/contexts/NotificationsContext";
import { ToastNotificacion } from "./ToastNotificacion";
import { NotificacionDashboard } from "@/lib/types/dashboard-notificaciones";
import { useEffect, useState } from "react";
import { esNotificacionReciente } from "@/lib/utils/notificaciones";

/**
 * Contenedor de toasts para notificaciones en tiempo real
 * 
 * Muestra toasts solo para notificaciones nuevas (recibidas vía WebSocket)
 * y limita el número de toasts simultáneos a 3
 */
export function ToastContainer() {
  const { notificaciones, marcarComoLeida } = useNotifications();
  const [toastsActivos, setToastsActivos] = useState<
    NotificacionDashboard[]
  >([]);

  // Detectar nuevas notificaciones y agregar a toasts
  useEffect(() => {
    // Filtrar solo notificaciones recientes (menos de 5 minutos)
    const nuevasNotificaciones = notificaciones.filter(
      (notif) =>
        esNotificacionReciente(notif) &&
        !toastsActivos.some((toast) => toast.id === notif.id)
    );

    if (nuevasNotificaciones.length > 0) {
      // Agregar nuevas notificaciones (máximo 3 simultáneos)
      setToastsActivos((prev) => {
        const combinadas = [...nuevasNotificaciones, ...prev];
        return combinadas.slice(0, 3); // Máximo 3 toasts
      });
    }
  }, [notificaciones, toastsActivos]);

  const cerrarToast = (notificacionId: string) => {
    setToastsActivos((prev) =>
      prev.filter((toast) => toast.id !== notificacionId)
    );
  };

  if (toastsActivos.length === 0) return null;

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      {toastsActivos.map((notificacion, index) => (
        <div
          key={notificacion.id}
          style={{
            animationDelay: `${index * 100}ms`,
          }}
        >
          <ToastNotificacion
            notificacion={notificacion}
            onClose={() => cerrarToast(notificacion.id)}
            onMarcarComoLeida={marcarComoLeida}
          />
        </div>
      ))}
    </div>
  );
}

