import { Card, CardContent } from "@/components/ui/card";
import { Users } from "lucide-react";
import { ActividadHoyStats } from "@/lib/types/public";

interface PasajerosCardProps {
  actividad: ActividadHoyStats | null;
  loading: boolean;
}

export function PasajerosCard({ actividad, loading }: PasajerosCardProps) {
  // Estado de loading
  if (loading) {
    return (
      <Card className="border-0 shadow-lg bg-gradient-to-r from-[var(--isla-blue)] to-[var(--isla-blue)]/80">
        <CardContent className="p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-90">Pasajeros</p>
              <p className="text-2xl font-bold animate-pulse">--</p>
            </div>
            <Users className="w-8 h-8 animate-pulse" />
          </div>
        </CardContent>
      </Card>
    );
  }

  // Estado de error o datos no disponibles
  if (!actividad) {
    return (
      <Card className="border-0 shadow-lg bg-gradient-to-r from-gray-500 to-gray-600">
        <CardContent className="p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-90">Pasajeros</p>
              <p className="text-2xl font-bold">N/A</p>
            </div>
            <Users className="w-8 h-8" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-0 shadow-lg bg-gradient-to-r from-[var(--isla-blue)] to-[var(--isla-blue)]/80">
      <CardContent className="p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm opacity-90">Pasajeros</p>
            <p className="text-2xl font-bold">{actividad.total_pasajeros}</p>
            <p className="text-xs opacity-75 mt-1">
              Promedio: {actividad.promedio_pasajeros_por_salida} por salida
            </p>
          </div>
          <Users className="w-8 h-8" />
        </div>
      </CardContent>
    </Card>
  );
}