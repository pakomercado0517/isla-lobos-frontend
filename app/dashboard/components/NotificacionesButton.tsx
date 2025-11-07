"use client";

import { useState, useEffect, useRef } from "react";
import { useNotifications } from "@/lib/contexts/NotificationsContext";
import { NotificacionesPanel } from "./NotificacionesPanel";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Bell } from "lucide-react";
import { cn } from "@/lib/utils";

export function NotificacionesButton() {
  const { noLeidas, socketConectado } = useNotifications();
  const [panelAbierto, setPanelAbierto] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  // Cerrar panel cuando se hace click fuera
  useEffect(() => {
    if (!panelAbierto) return;

    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (
        panelRef.current &&
        !panelRef.current.contains(target) &&
        buttonRef.current &&
        !buttonRef.current.contains(target)
      ) {
        setPanelAbierto(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [panelAbierto]);

  return (
    <div className="relative">
      <Button
        ref={buttonRef}
        variant="ghost"
        size="icon"
        className="relative"
        onClick={() => setPanelAbierto(!panelAbierto)}
        aria-label="Ver notificaciones"
      >
        <Bell className="h-6 w-6" />
        {noLeidas > 0 && (
          <Badge
            className={cn(
              "absolute -top-1 -right-1 w-5 h-5 p-0 flex items-center justify-center text-xs font-bold",
              "bg-red-500 hover:bg-red-600 border-2 border-white",
              noLeidas > 99 && "px-1"
            )}
          >
            {noLeidas > 99 ? "99+" : noLeidas}
          </Badge>
        )}
        {/* Indicador de conexión WebSocket (discreto) */}
        {socketConectado && (
          <span
            className="absolute bottom-0 right-0 w-2 h-2 bg-green-500 rounded-full border-2 border-white"
            title="Conectado en tiempo real"
          />
        )}
      </Button>

      {/* Panel de notificaciones */}
      {panelAbierto && (
        <div
          ref={panelRef}
          className="absolute right-0 top-full mt-2 z-50"
          style={{ width: "calc(100vw - 2rem)", maxWidth: "384px" }}
        >
          <NotificacionesPanel onClose={() => setPanelAbierto(false)} />
        </div>
      )}
    </div>
  );
}

