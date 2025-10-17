import { Card, CardContent } from "@/components/ui/card";
import { Anchor } from "lucide-react";
import { ActividadHoyStats } from "@/lib/types/public";

interface ActividadHoyCardProps {
  actividad: ActividadHoyStats | null;
  loading: boolean;
}

export function ActividadHoyCard({ actividad, loading }: ActividadHoyCardProps) {
  // Estado de loading
  if (loading) {
    return (
      <Card className="border-0 shadow-lg bg-gradient-to-r from-[var(--isla-orange)] to-[var(--isla-orange)]/80">
        <CardContent className="p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-90">Salidas Hoy</p>
              <p className="text-2xl font-bold animate-pulse">--</p>
            </div>
            <Anchor className="w-8 h-8 animate-pulse" />
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
              <p className="text-sm opacity-90">Salidas Hoy</p>
              <p className="text-2xl font-bold">N/A</p>
            </div>
            <Anchor className="w-8 h-8" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-0 shadow-lg bg-gradient-to-r from-[var(--isla-orange)] to-[var(--isla-orange)]/80">
      <CardContent className="p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm opacity-90">Salidas Hoy</p>
            <p className="text-2xl font-bold">{actividad.salidas_programadas}</p>
            <p className="text-xs opacity-75 mt-1">
              {actividad.salidas_por_estado.programadas} programadas, {actividad.salidas_por_estado.en_curso} en curso
            </p>
          </div>
          <Anchor className="w-8 h-8" />
        </div>
      </CardContent>
    </Card>
  );
}