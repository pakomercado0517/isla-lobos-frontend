import { Card, CardContent } from "@/components/ui/card";
import { Ship } from "lucide-react";
import { EmbarcacionesStats } from "@/lib/types/public";

interface EmbarcacionesCardProps {
  embarcaciones: EmbarcacionesStats | null;
  loading: boolean;
}

export function EmbarcacionesCard({ embarcaciones, loading }: EmbarcacionesCardProps) {
  // Estado de loading
  if (loading) {
    return (
      <Card className="border-0 shadow-lg bg-gradient-to-r from-[var(--isla-teal)] to-[var(--isla-teal-dark)]">
        <CardContent className="p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-90">Embarcaciones</p>
              <p className="text-2xl font-bold animate-pulse">--</p>
            </div>
            <Ship className="w-8 h-8 animate-pulse" />
          </div>
        </CardContent>
      </Card>
    );
  }

  // Estado de error o datos no disponibles
  if (!embarcaciones) {
    return (
      <Card className="border-0 shadow-lg bg-gradient-to-r from-gray-500 to-gray-600">
        <CardContent className="p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-90">Embarcaciones</p>
              <p className="text-2xl font-bold">N/A</p>
            </div>
            <Ship className="w-8 h-8" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-0 shadow-lg bg-gradient-to-r from-[var(--isla-teal)] to-[var(--isla-teal-dark)]">
      <CardContent className="p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm opacity-90">Embarcaciones</p>
            <p className="text-2xl font-bold">{embarcaciones.total_registradas}</p>
            <p className="text-xs opacity-75 mt-1">Registradas en el sistema</p>
          </div>
          <Ship className="w-8 h-8" />
        </div>
      </CardContent>
    </Card>
  );
}