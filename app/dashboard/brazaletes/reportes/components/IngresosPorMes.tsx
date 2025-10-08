import type { EstadisticasBrazaletes } from "@/lib/types/brazaletes";
import { formatCurrency } from "./utils";

interface IngresosPorMesProps {
  estadisticas: EstadisticasBrazaletes;
}

export function IngresosPorMes({ estadisticas }: IngresosPorMesProps) {
  return (
    <div className="bg-white p-6 rounded-lg border">
      <h3 className="text-lg font-semibold mb-4">Ingresos por Mes</h3>
      <div className="space-y-3">
        {estadisticas.ingresos.por_mes.map((mes, index) => (
          <div
            key={index}
            className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
          >
            <div>
              <p className="font-medium">{mes.mes}</p>
              <p className="text-sm text-gray-600">{mes.cantidad} brazaletes</p>
            </div>
            <div className="text-right">
              <p className="font-bold text-green-600">
                ${formatCurrency(mes.monto)}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
