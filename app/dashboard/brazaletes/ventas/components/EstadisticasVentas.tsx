import { DollarSign, Package, TrendingUp } from "lucide-react";
import type { ReporteVentasBrazaletes } from "@/lib/types/brazaletes";
import { formatCurrency } from "./utils";

interface EstadisticasVentasProps {
  reporte: ReporteVentasBrazaletes;
}

export function EstadisticasVentas({ reporte }: EstadisticasVentasProps) {
  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Resumen general */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4 md:gap-6">
        <div className="bg-blue-50 p-4 sm:p-6 rounded-lg">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="p-1.5 sm:p-2 bg-blue-100 rounded-lg flex-shrink-0">
              <DollarSign className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
            </div>
            <div className="min-w-0">
              <p className="text-xs sm:text-sm text-blue-600 font-medium">Total Ventas</p>
              <p className="text-xl sm:text-2xl font-bold text-blue-900">
                {reporte.resumen.total_ventas}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-green-50 p-4 sm:p-6 rounded-lg">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="p-1.5 sm:p-2 bg-green-100 rounded-lg flex-shrink-0">
              <Package className="w-5 h-5 sm:w-6 sm:h-6 text-green-600" />
            </div>
            <div className="min-w-0">
              <p className="text-xs sm:text-sm text-green-600 font-medium">
                Brazaletes Vendidos
              </p>
              <p className="text-xl sm:text-2xl font-bold text-green-900">
                {reporte.resumen.total_brazaletes}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-purple-50 p-4 sm:p-6 rounded-lg">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="p-1.5 sm:p-2 bg-purple-100 rounded-lg flex-shrink-0">
              <TrendingUp className="w-5 h-5 sm:w-6 sm:h-6 text-purple-600" />
            </div>
            <div className="min-w-0">
              <p className="text-xs sm:text-sm text-purple-600 font-medium">
                Ingresos Totales
              </p>
              <p className="text-xl sm:text-2xl font-bold text-purple-900 truncate">
                ${formatCurrency(reporte.resumen.total_ingresos)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Ventas por prestador */}
      <div className="bg-white p-4 sm:p-6 rounded-lg border">
        <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">Ventas por Prestador</h3>
        <div className="space-y-2 sm:space-y-3">
          {reporte.ventas_por_prestador.map((prestador, index) => (
            <div
              key={index}
              className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-0 p-3 bg-gray-50 rounded-lg"
            >
              <div className="min-w-0">
                <p className="font-medium text-sm sm:text-base truncate">{prestador.prestador.nombre}</p>
                <p className="text-xs sm:text-sm text-gray-600">
                  {prestador.total_ventas} ventas
                </p>
              </div>
              <div className="text-left sm:text-right flex-shrink-0">
                <p className="font-bold text-green-600 text-sm sm:text-base">
                  ${formatCurrency(prestador.total_ingresos)}
                </p>
                <p className="text-xs sm:text-sm text-gray-600">
                  {prestador.total_brazaletes} brazaletes
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Ventas por mes - Comentado hasta que se defina el tipo correcto */}
      {/* <div className="bg-white p-6 rounded-lg border">
        <h3 className="text-lg font-semibold mb-4">Ventas por Mes</h3>
        <div className="space-y-3">
          {reporte.ventas_por_mes?.map((mes, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
            >
              <div>
                <p className="font-medium">{mes.mes}</p>
                <p className="text-sm text-gray-600">
                  {mes.total_ventas} ventas
                </p>
              </div>
              <div className="text-right">
                <p className="font-bold text-green-600">
                  ${formatCurrency(mes.total_ingresos)}
                </p>
                <p className="text-sm text-gray-600">
                  {mes.total_brazaletes} brazaletes
                </p>
              </div>
            </div>
          ))}
        </div>
      </div> */}
    </div>
  );
}
