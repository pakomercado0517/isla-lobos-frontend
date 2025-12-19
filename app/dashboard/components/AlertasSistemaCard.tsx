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

function getSeveridadBgColor(severidad: string): string {
  switch (severidad) {
    case "critica":
      return "bg-red-50";
    case "alta":
      return "bg-orange-50";
    case "media":
      return "bg-amber-50";
    case "baja":
      return "bg-blue-50";
    default:
      return "bg-gray-50";
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
    <Card className="border-gray-100 shadow-sm">
      <CardHeader className="pb-4 px-4 sm:px-6 lg:px-8 pt-6 lg:pt-8">
        <CardTitle className="text-lg sm:text-xl lg:text-2xl xl:text-3xl font-bold text-gray-900 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bell className="w-5 h-5 sm:w-6 sm:h-6 lg:w-7 lg:h-7 text-[var(--isla-teal)]" />
            Alertas del Sistema
          </div>
          {alertas && alertas.length > 0 && (
            <Badge className="bg-red-500 hover:bg-red-600 text-white text-xs lg:text-sm font-semibold px-2.5 lg:px-3 py-1 lg:py-1.5">
              {alertas.length}
            </Badge>
          )}
        </CardTitle>
        <CardDescription className="text-sm lg:text-base text-gray-600">
          Notificaciones y acciones requeridas
        </CardDescription>
      </CardHeader>
      <CardContent className="px-4 sm:px-6 lg:px-8 pb-6 lg:pb-8">
        {alertas && alertas.length > 0 ? (
          <div className="space-y-3 lg:space-y-4">
            {alertas.slice(0, 5).map((alerta: AlertaSistema, index: number) => {
              const IconComponent = getAlertaIcon(alerta.tipo);
              return (
                <div
                  key={`alerta-${alerta.id}-${index}`}
                  className="flex items-start gap-3 lg:gap-4 p-3 lg:p-4 rounded-lg lg:rounded-xl hover:bg-gray-50 transition-colors border border-transparent hover:border-gray-200"
                >
                  <div className={`p-1.5 lg:p-2 rounded-lg lg:rounded-xl ${getSeveridadBgColor(alerta.severidad)} flex-shrink-0`}>
                    <IconComponent
                      className={`w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 ${getSeveridadIconColor(
                        alerta.severidad
                      )}`}
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm lg:text-base font-semibold text-gray-900 mb-0.5 lg:mb-1">
                      {alerta.titulo}
                    </p>
                    <p className="text-xs lg:text-sm text-gray-600 mb-1.5 lg:mb-2">
                      {alerta.mensaje}
                    </p>
                    <p className="text-xs lg:text-sm text-gray-500">
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
              <Button variant="outline" size="sm" className="w-full mt-2 border-[var(--isla-teal)] text-[var(--isla-teal)] hover:bg-[var(--isla-teal)] hover:text-white text-sm lg:text-base h-9 lg:h-10">
                <Eye className="w-4 h-4 lg:w-5 lg:h-5 mr-2" />
                Ver todas las alertas ({alertas.length})
              </Button>
            )}
          </div>
        ) : (
          <div className="text-center py-12 lg:py-16">
            <Bell className="w-12 h-12 lg:w-16 lg:h-16 text-gray-300 mx-auto mb-4 lg:mb-6" />
            <p className="text-sm lg:text-base text-gray-600">
              No hay alertas activas
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
