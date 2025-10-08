"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Activity } from "lucide-react";
import { formatearTiempoRelativo } from "@/lib/utils";

interface ActividadItem {
  id: string;
  tipo: string;
  titulo: string;
  descripcion: string;
  fecha: string;
  color: string;
}

interface ActividadRecienteCardProps {
  actividades: ActividadItem[];
}

function getActividadColorClass(color: string): string {
  switch (color) {
    case "blue":
      return "bg-blue-500";
    case "green":
      return "bg-green-500";
    case "purple":
      return "bg-purple-500";
    case "yellow":
      return "bg-yellow-500";
    case "red":
      return "bg-red-500";
    case "orange":
      return "bg-orange-500";
    default:
      return "bg-gray-500";
  }
}

export function ActividadRecienteCard({
  actividades,
}: ActividadRecienteCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Activity className="w-5 h-5 mr-2" />
          Actividad Reciente
        </CardTitle>
        <CardDescription>Últimas operaciones del sistema</CardDescription>
      </CardHeader>
      <CardContent>
        {actividades.length > 0 ? (
          <div className="space-y-4">
            {actividades.slice(0, 5).map((actividad) => (
              <div key={actividad.id} className="flex items-center space-x-4">
                <div
                  className={`w-2 h-2 ${getActividadColorClass(
                    actividad.color
                  )} rounded-full flex-shrink-0`}
                ></div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-900">
                    {actividad.titulo}
                  </p>
                  <p className="text-xs text-muted-foreground truncate">
                    {actividad.descripcion}
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {formatearTiempoRelativo(actividad.fecha)}
                  </p>
                </div>
              </div>
            ))}
            {actividades.length > 5 && (
              <div className="text-center pt-2">
                <p className="text-xs text-muted-foreground">
                  +{actividades.length - 5} actividades más
                </p>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-6">
            <Activity className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
            <p className="text-sm text-muted-foreground">
              No hay actividad reciente
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

