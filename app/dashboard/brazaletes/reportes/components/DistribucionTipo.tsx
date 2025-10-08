import { Badge } from "@/components/ui/badge";
import { Package, ShoppingCart, CheckCircle } from "lucide-react";
import type { EstadisticasBrazaletes } from "@/lib/types/brazaletes";

interface DistribucionTipoProps {
  estadisticas: EstadisticasBrazaletes;
}

export function DistribucionTipo({ estadisticas }: DistribucionTipoProps) {
  // Calcular totales
  const totalComprados = estadisticas.inventario.total_comprados;
  const totalDisponibles = estadisticas.inventario.total_disponibles;
  const totalVendidos = estadisticas.inventario.total_vendidos;
  const totalUtilizados = estadisticas.inventario.total_utilizados;

  // Calcular porcentajes
  const porcentajeDisponibles =
    totalComprados > 0
      ? ((totalDisponibles / totalComprados) * 100).toFixed(1)
      : 0;
  const porcentajeVendidos =
    totalComprados > 0
      ? ((totalVendidos / totalComprados) * 100).toFixed(1)
      : 0;
  const porcentajeUtilizados =
    totalComprados > 0
      ? ((totalUtilizados / totalComprados) * 100).toFixed(1)
      : 0;

  return (
    <div className="bg-white p-6 rounded-lg border">
      <div className="mb-4">
        <h3 className="text-lg font-semibold">Estado del Inventario</h3>
        <p className="text-sm text-gray-600 mt-1">
          Todos los brazaletes son de tipo{" "}
          <Badge className="ml-1">Universal</Badge>
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Disponibles */}
        <div className="p-4 bg-green-50 rounded-lg border-2 border-green-200">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-green-100 rounded-lg">
              <Package className="w-5 h-5 text-green-600" />
            </div>
            <Badge variant="outline" className="bg-green-100 text-green-700">
              Disponibles
            </Badge>
          </div>
          <div className="mt-3">
            <div className="text-3xl font-bold text-green-700">
              {totalDisponibles.toLocaleString()}
            </div>
            <div className="text-sm text-green-600 mt-1">
              {porcentajeDisponibles}% del total
            </div>
          </div>
        </div>

        {/* Vendidos */}
        <div className="p-4 bg-blue-50 rounded-lg border-2 border-blue-200">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-blue-100 rounded-lg">
              <ShoppingCart className="w-5 h-5 text-blue-600" />
            </div>
            <Badge variant="outline" className="bg-blue-100 text-blue-700">
              Vendidos
            </Badge>
          </div>
          <div className="mt-3">
            <div className="text-3xl font-bold text-blue-700">
              {totalVendidos.toLocaleString()}
            </div>
            <div className="text-sm text-blue-600 mt-1">
              {porcentajeVendidos}% del total
            </div>
          </div>
        </div>

        {/* Utilizados */}
        <div className="p-4 bg-purple-50 rounded-lg border-2 border-purple-200">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-purple-100 rounded-lg">
              <CheckCircle className="w-5 h-5 text-purple-600" />
            </div>
            <Badge variant="outline" className="bg-purple-100 text-purple-700">
              Utilizados
            </Badge>
          </div>
          <div className="mt-3">
            <div className="text-3xl font-bold text-purple-700">
              {totalUtilizados.toLocaleString()}
            </div>
            <div className="text-sm text-purple-600 mt-1">
              {porcentajeUtilizados}% del total
            </div>
          </div>
        </div>
      </div>

      {/* Barra de progreso visual */}
      <div className="mt-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-700">
            Distribución Total
          </span>
          <span className="text-sm text-gray-600">
            {totalComprados.toLocaleString()} brazaletes
          </span>
        </div>
        <div className="w-full h-4 bg-gray-200 rounded-full overflow-hidden flex">
          <div
            className="bg-green-500 h-full transition-all"
            style={{ width: `${porcentajeDisponibles}%` }}
            title={`${porcentajeDisponibles}% Disponibles`}
          />
          <div
            className="bg-blue-500 h-full transition-all"
            style={{ width: `${porcentajeVendidos}%` }}
            title={`${porcentajeVendidos}% Vendidos`}
          />
          <div
            className="bg-purple-500 h-full transition-all"
            style={{ width: `${porcentajeUtilizados}%` }}
            title={`${porcentajeUtilizados}% Utilizados`}
          />
        </div>
        <div className="flex items-center gap-4 mt-2 text-xs text-gray-600">
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-green-500 rounded-sm" />
            <span>Disponibles</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-blue-500 rounded-sm" />
            <span>Vendidos</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-purple-500 rounded-sm" />
            <span>Utilizados</span>
          </div>
        </div>
      </div>
    </div>
  );
}
