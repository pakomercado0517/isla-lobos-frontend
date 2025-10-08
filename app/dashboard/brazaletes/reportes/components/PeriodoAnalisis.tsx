import { Calendar } from "lucide-react";
import type { EstadisticasBrazaletes } from "@/lib/types/brazaletes";

interface PeriodoAnalisisProps {
  estadisticas: EstadisticasBrazaletes;
}

export function PeriodoAnalisis({ estadisticas }: PeriodoAnalisisProps) {
  return (
    <div className="bg-white p-6 rounded-lg border">
      <h3 className="text-lg font-semibold mb-4">Período de Análisis</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="flex items-center gap-3">
          <Calendar className="w-5 h-5 text-gray-500" />
          <div>
            <p className="text-sm text-gray-600">Fecha Inicio</p>
            <p className="font-semibold">
              {new Date(estadisticas.periodo.fecha_inicio).toLocaleDateString(
                "es-MX"
              )}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Calendar className="w-5 h-5 text-gray-500" />
          <div>
            <p className="text-sm text-gray-600">Fecha Fin</p>
            <p className="font-semibold">
              {new Date(estadisticas.periodo.fecha_fin).toLocaleDateString(
                "es-MX"
              )}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
