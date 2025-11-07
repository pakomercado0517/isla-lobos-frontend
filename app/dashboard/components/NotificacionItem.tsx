"use client";

import { NotificacionDashboard } from "@/lib/types/dashboard-notificaciones";
import { getIconoNotificacion, getColorPrioridad, formatearFechaRelativa } from "@/lib/utils/notificaciones";
import { cn } from "@/lib/utils";

interface NotificacionItemProps {
  notificacion: NotificacionDashboard;
  onClick: (notificacionId: string) => void;
}

export function NotificacionItem({
  notificacion,
  onClick,
}: NotificacionItemProps) {
  const Icono = getIconoNotificacion(notificacion.tipo);
  const colorPrioridad = getColorPrioridad(notificacion.prioridad);
  const fechaRelativa = formatearFechaRelativa(notificacion.created_at);

  return (
    <div
      onClick={() => onClick(notificacion.id)}
      className={cn(
        "p-4 border-l-4 cursor-pointer transition-colors hover:bg-slate-50",
        !notificacion.leida && "bg-slate-50 border-teal-500",
        notificacion.leida && "bg-white border-transparent opacity-75",
        notificacion.prioridad === "alta" && !notificacion.leida && colorPrioridad
      )}
    >
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0 mt-0.5">
          <Icono
            className={cn(
              "w-5 h-5",
              !notificacion.leida
                ? "text-teal-600"
                : "text-slate-400"
            )}
          />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <h4
              className={cn(
                "text-sm font-semibold",
                !notificacion.leida
                  ? "text-slate-900"
                  : "text-slate-600"
              )}
            >
              {notificacion.titulo}
            </h4>
            {notificacion.prioridad === "alta" && !notificacion.leida && (
              <span className="flex-shrink-0 px-2 py-0.5 text-xs font-medium bg-red-100 text-red-800 rounded">
                Alta
              </span>
            )}
          </div>
          <p
            className={cn(
              "mt-1 text-sm",
              !notificacion.leida
                ? "text-slate-700"
                : "text-slate-500"
            )}
          >
            {notificacion.mensaje}
          </p>
          <p className="mt-2 text-xs text-slate-500">{fechaRelativa}</p>
        </div>
      </div>
    </div>
  );
}

