import { Badge } from "@/components/ui/badge";
import type { EstadisticasBrazaletes } from "@/lib/types/brazaletes";

interface DistribucionTipoProps {
  estadisticas: EstadisticasBrazaletes;
}

export function DistribucionTipo({ estadisticas }: DistribucionTipoProps) {
  return (
    <div className="bg-white p-6 rounded-lg border">
      <h3 className="text-lg font-semibold mb-4">Distribución por Tipo</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-3">
          <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
            <div className="flex items-center gap-3">
              <Badge variant="outline" className="bg-blue-100 text-blue-700">
                🏝️ Isla
              </Badge>
              <span className="font-medium">Brazaletes de Isla</span>
            </div>
            <span className="text-2xl font-bold text-blue-600">
              {estadisticas.utilizacion.por_tipo.universal}
            </span>
          </div>
        </div>
        <div className="space-y-3">
          <div className="flex items-center justify-between p-4 bg-teal-50 rounded-lg">
            <div className="flex items-center gap-3">
              <Badge variant="outline" className="bg-teal-100 text-teal-700">
                🐠 Arrecife
              </Badge>
              <span className="font-medium">Brazaletes de Arrecife</span>
            </div>
            <span className="text-2xl font-bold text-teal-600">
              {estadisticas.utilizacion.por_tipo.universal}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
