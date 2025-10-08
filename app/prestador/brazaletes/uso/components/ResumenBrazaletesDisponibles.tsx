import { Badge } from "@/components/ui/badge";
import type { BrazaletesPrestador } from "@/lib/types/brazaletes";

interface ResumenBrazaletesDisponiblesProps {
  brazaletesData: BrazaletesPrestador;
  brazaletesDisponibles: BrazaletesPrestador["detalle"];
}

export function ResumenBrazaletesDisponibles({
  brazaletesData,
  brazaletesDisponibles,
}: ResumenBrazaletesDisponiblesProps) {
  return (
    <div className="bg-white p-6 rounded-lg border">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">
          Brazaletes Disponibles
        </h3>
        <Badge variant="outline">
          {brazaletesDisponibles.length} disponibles
        </Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="text-center">
          <div className="text-2xl font-bold text-green-600">
            {brazaletesData.brazaletes.disponibles}
          </div>
          <div className="text-sm text-gray-600">
            Total Disponibles
          </div>
        </div>
      </div>
    </div>
  );
}
