import { Badge } from "@/components/ui/badge";
import type { BrazaletesPrestador } from "@/lib/types/brazaletes";

interface DistribucionTipoProps {
  brazaletesData: BrazaletesPrestador;
}

export function DistribucionTipo({ brazaletesData }: DistribucionTipoProps) {
  return (
    <div className="bg-white p-6 rounded-lg border">
      <h3 className="text-lg font-semibold mb-4">
        Distribución por Tipo
      </h3>
      <div className="grid grid-cols-1 gap-6">
        <div className="space-y-3">
          <div className="flex items-center justify-between p-4 bg-purple-50 rounded-lg">
            <div className="flex items-center gap-3">
              <Badge
                variant="outline"
                className="bg-purple-100 text-purple-700"
              >
                🎫 Universal
              </Badge>
              <span className="font-medium">
                Brazaletes Universales
              </span>
            </div>
            <span className="text-2xl font-bold text-purple-600">
              {brazaletesData.brazaletes.por_tipo.universal}
            </span>
          </div>
        </div>
      </div>
      <div className="mt-4 p-3 bg-gray-50 rounded-lg">
        <p className="text-sm text-gray-600">
          Los brazaletes universales son válidos para todas las áreas
          naturales protegidas disponibles.
        </p>
      </div>
    </div>
  );
}
