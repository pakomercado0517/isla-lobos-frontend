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
    <div className="bg-white p-4 md:p-6 rounded-lg border">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4">
        <h3 className="text-base md:text-lg font-semibold">
          Brazaletes Disponibles
        </h3>
        <Badge variant="outline" className="text-xs md:text-sm">
          {brazaletesDisponibles.length} disponibles
        </Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
        <div className="text-center p-3 md:p-4 bg-green-50 rounded">
          <div className="text-xl md:text-2xl font-bold text-green-600">
            {brazaletesData.brazaletes.disponibles}
          </div>
          <div className="text-xs md:text-sm text-gray-600 mt-1">
            Total Disponibles
          </div>
        </div>
      </div>
    </div>
  );
}
