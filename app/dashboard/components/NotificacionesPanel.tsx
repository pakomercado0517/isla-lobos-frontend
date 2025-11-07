"use client";

import { useNotifications } from "@/lib/contexts/NotificationsContext";
import { NotificacionItem } from "./NotificacionItem";
import { Button } from "@/components/ui/button";
import { RefreshCw, BellOff } from "lucide-react";
import { cn } from "@/lib/utils";

interface NotificacionesPanelProps {
  onClose?: () => void;
}

export function NotificacionesPanel({
  onClose: _onClose,
}: NotificacionesPanelProps) {
  const {
    notificaciones,
    noLeidas,
    loading,
    recargarNotificaciones,
    marcarComoLeida,
  } = useNotifications();

  const notificacionesNoLeidas = notificaciones.filter((n) => !n.leida);
  const notificacionesLeidas = notificaciones.filter((n) => n.leida);

  return (
    <div className="w-full sm:w-96 max-h-[600px] flex flex-col bg-white rounded-lg shadow-lg border border-slate-200">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-slate-200">
        <div>
          <h3 className="text-lg font-semibold text-slate-900">
            Notificaciones
          </h3>
          {noLeidas > 0 && (
            <p className="text-sm text-slate-600">
              {noLeidas} {noLeidas === 1 ? "no leída" : "no leídas"}
            </p>
          )}
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => recargarNotificaciones()}
          disabled={loading}
        >
          <RefreshCw className={cn("w-4 h-4", loading && "animate-spin")} />
        </Button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        {loading && notificaciones.length === 0 ? (
          <div className="p-8 text-center text-slate-500">
            <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2" />
            <p>Cargando notificaciones...</p>
          </div>
        ) : notificaciones.length === 0 ? (
          <div className="p-8 text-center text-slate-500">
            <BellOff className="w-12 h-12 mx-auto mb-3 text-slate-300" />
            <p className="font-medium text-slate-700">No hay notificaciones</p>
            <p className="text-sm text-slate-500 mt-1">
              Las notificaciones aparecerán aquí
            </p>
          </div>
        ) : (
          <div>
            {/* Notificaciones no leídas */}
            {notificacionesNoLeidas.length > 0 && (
              <div>
                <div className="px-4 py-2 bg-slate-50 border-b border-slate-200">
                  <p className="text-xs font-semibold text-slate-600 uppercase">
                    No Leídas
                  </p>
                </div>
                {notificacionesNoLeidas.map((notificacion) => (
                  <NotificacionItem
                    key={notificacion.id}
                    notificacion={notificacion}
                    onClick={marcarComoLeida}
                  />
                ))}
              </div>
            )}

            {/* Notificaciones leídas */}
            {notificacionesLeidas.length > 0 && (
              <div>
                {notificacionesNoLeidas.length > 0 && (
                  <div className="px-4 py-2 bg-slate-50 border-b border-slate-200 border-t">
                    <p className="text-xs font-semibold text-slate-600 uppercase">
                      Leídas
                    </p>
                  </div>
                )}
                {notificacionesLeidas.map((notificacion) => (
                  <NotificacionItem
                    key={notificacion.id}
                    notificacion={notificacion}
                    onClick={marcarComoLeida}
                  />
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
