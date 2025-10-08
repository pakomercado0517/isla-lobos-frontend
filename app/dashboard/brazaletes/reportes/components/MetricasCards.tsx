import { Package, TrendingUp, Users, DollarSign } from "lucide-react";
import type { EstadisticasBrazaletes } from "@/lib/types/brazaletes";
import { formatCurrency } from "./utils";

interface MetricasCardsProps {
  estadisticas: EstadisticasBrazaletes;
}

export function MetricasCards({ estadisticas }: MetricasCardsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <div className="bg-blue-50 p-6 rounded-lg">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-100 rounded-lg">
            <Package className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <p className="text-sm text-blue-600 font-medium">Total Comprados</p>
            <p className="text-2xl font-bold text-blue-900">
              {estadisticas.inventario.total_comprados.toLocaleString()}
            </p>
          </div>
        </div>
      </div>

      <div className="bg-green-50 p-6 rounded-lg">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-green-100 rounded-lg">
            <TrendingUp className="w-6 h-6 text-green-600" />
          </div>
          <div>
            <p className="text-sm text-green-600 font-medium">
              Total Disponibles
            </p>
            <p className="text-2xl font-bold text-green-900">
              {estadisticas.inventario.total_disponibles.toLocaleString()}
            </p>
          </div>
        </div>
      </div>

      <div className="bg-purple-50 p-6 rounded-lg">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-purple-100 rounded-lg">
            <Users className="w-6 h-6 text-purple-600" />
          </div>
          <div>
            <p className="text-sm text-purple-600 font-medium">
              Total Utilizados
            </p>
            <p className="text-2xl font-bold text-purple-900">
              {estadisticas.inventario.total_utilizados.toLocaleString()}
            </p>
          </div>
        </div>
      </div>

      <div className="bg-orange-50 p-6 rounded-lg">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-orange-100 rounded-lg">
            <DollarSign className="w-6 h-6 text-orange-600" />
          </div>
          <div>
            <p className="text-sm text-orange-600 font-medium">
              Ingresos Totales
            </p>
            <p className="text-2xl font-bold text-orange-900">
              ${formatCurrency(estadisticas.ingresos.ventas_totales)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
