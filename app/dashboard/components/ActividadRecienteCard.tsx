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
    <Card className="border-gray-100 shadow-sm">
      <CardHeader className="pb-4 px-4 sm:px-6 lg:px-8 pt-6 lg:pt-8">
        <CardTitle className="text-lg sm:text-xl lg:text-2xl xl:text-3xl font-bold text-gray-900 flex items-center gap-2">
          <Activity className="w-5 h-5 sm:w-6 sm:h-6 lg:w-7 lg:h-7 text-[var(--isla-teal)]" />
          Actividad Reciente
        </CardTitle>
        <CardDescription className="text-sm lg:text-base text-gray-600">
          Últimas operaciones del sistema
        </CardDescription>
      </CardHeader>
      <CardContent className="px-4 sm:px-6 lg:px-8 pb-6 lg:pb-8">
        {actividades.length > 0 ? (
          <div className="space-y-3 lg:space-y-4">
            {actividades.slice(0, 5).map((actividad) => (
              <div 
                key={actividad.id} 
                className="flex items-start gap-3 lg:gap-4 p-3 lg:p-4 rounded-lg lg:rounded-xl hover:bg-gray-50 transition-colors border border-transparent hover:border-gray-200"
              >
                <div
                  className={`w-2.5 h-2.5 lg:w-3 lg:h-3 ${getActividadColorClass(
                    actividad.color
                  )} rounded-full flex-shrink-0 mt-1.5 lg:mt-2`}
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm lg:text-base font-semibold text-gray-900 mb-0.5 lg:mb-1">
                    {actividad.titulo}
                  </p>
                  <p className="text-xs lg:text-sm text-gray-600 truncate mb-1 lg:mb-1.5">
                    {actividad.descripcion}
                  </p>
                  <p className="text-xs lg:text-sm text-gray-500">
                    {formatearTiempoRelativo(actividad.fecha)}
                  </p>
                </div>
              </div>
            ))}
            {actividades.length > 5 && (
              <div className="text-center pt-2 lg:pt-3">
                <p className="text-xs lg:text-sm text-gray-500 font-medium">
                  +{actividades.length - 5} actividades más
                </p>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-12 lg:py-16">
            <Activity className="w-12 h-12 lg:w-16 lg:h-16 text-gray-300 mx-auto mb-4 lg:mb-6" />
            <p className="text-sm lg:text-base text-gray-600">
              No hay actividad reciente
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

