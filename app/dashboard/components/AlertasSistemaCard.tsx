"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Bell,
  Eye,
  UserX,
  Waves,
  Wind,
  Anchor,
  Package,
  Wrench,
  XCircle,
  AlertCircle,
  Cloud,
  AlertTriangle,
  Info,
  LucideIcon,
} from "lucide-react";

interface AlertaSistema {
  id: string;
  tipo: string;
  severidad: string;
  titulo: string;
  mensaje: string;
  fecha: string;
}

interface AlertasSistemaCardProps {
  alertas: AlertaSistema[];
}

function getSeveridadIconColor(severidad: string): string {
  switch (severidad) {
    case "critica":
      return "text-red-600";
    case "alta":
      return "text-orange-600";
    case "media":
      return "text-amber-600";
    case "baja":
      return "text-blue-600";
    default:
      return "text-gray-600";
  }
}

function getAlertaIcon(tipo: string): LucideIcon {
  switch (tipo) {
    case "permisos_vencidos":
    case "permisos_por_vencer":
    case "permiso":
      return UserX;
    case "clima_oleaje_alto":
      return Waves;
    case "clima_viento_fuerte":
      return Wind;
    case "puerto_cerrado":
    case "puerto_restricciones":
      return Anchor;
    case "stock_bajo":
    case "lote_por_vencer":
    case "prestador_sin_stock":
      return Package;
    case "embarcacion_mantenimiento":
    case "mantenimiento":
      return Wrench;
    case "bloque_suspendido":
      return XCircle;
    case "capacidad_critica":
    case "capacidad":
      return AlertCircle;
    case "clima":
      return Cloud;
    case "seguridad":
      return AlertTriangle;
    default:
      return Info;
  }
}

export function AlertasSistemaCard({ alertas }: AlertasSistemaCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center">
            <Bell className="w-5 h-5 mr-2" />
            Alertas del Sistema
          </div>
          {alertas && alertas.length > 0 && (
            <Badge className="bg-red-500 hover:bg-red-600 text-white">
              {alertas.length}
            </Badge>
          )}
        </CardTitle>
        <CardDescription>Notificaciones y acciones requeridas</CardDescription>
      </CardHeader>
      <CardContent>
        {alertas && alertas.length > 0 ? (
          <div className="space-y-4">
            {alertas.slice(0, 5).map((alerta: AlertaSistema, index: number) => {
              const IconComponent = getAlertaIcon(alerta.tipo);
              return (
                <div
                  key={`alerta-${alerta.id}-${index}`}
                  className="flex items-start space-x-4"
                >
                  <IconComponent
                    className={`w-5 h-5 ${getSeveridadIconColor(
                      alerta.severidad
                    )} flex-shrink-0 mt-0.5`}
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-900">
                      {alerta.titulo}
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {alerta.mensaje}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {new Date(alerta.fecha).toLocaleDateString("es-MX", {
                        day: "numeric",
                        month: "short",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                </div>
              );
            })}
            {alertas.length > 5 && (
              <Button variant="outline" size="sm" className="w-full mt-2">
                <Eye className="w-4 h-4 mr-2" />
                Ver todas las alertas ({alertas.length})
              </Button>
            )}
          </div>
        ) : (
          <div className="text-center py-6">
            <Bell className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
            <p className="text-sm text-muted-foreground">
              No hay alertas activas
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
