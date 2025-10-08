import { DollarSign, Package, TrendingUp } from "lucide-react";
import type { ReporteVentasBrazaletes } from "@/lib/types/brazaletes";
import { formatCurrency } from "./utils";

interface EstadisticasVentasProps {
  reporte: ReporteVentasBrazaletes;
}

export function EstadisticasVentas({ reporte }: EstadisticasVentasProps) {
  return (
    <div className="space-y-6">
      {/* Resumen general */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-blue-50 p-6 rounded-lg">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <DollarSign className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-blue-600 font-medium">Total Ventas</p>
              <p className="text-2xl font-bold text-blue-900">
                {reporte.resumen.total_ventas}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-green-50 p-6 rounded-lg">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <Package className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-green-600 font-medium">
                Brazaletes Vendidos
              </p>
              <p className="text-2xl font-bold text-green-900">
                {reporte.resumen.total_brazaletes}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-purple-50 p-6 rounded-lg">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-100 rounded-lg">
              <TrendingUp className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-purple-600 font-medium">
                Ingresos Totales
              </p>
              <p className="text-2xl font-bold text-purple-900">
                ${formatCurrency(reporte.resumen.total_ingresos)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Ventas por prestador */}
      <div className="bg-white p-6 rounded-lg border">
        <h3 className="text-lg font-semibold mb-4">Ventas por Prestador</h3>
        <div className="space-y-3">
          {reporte.ventas_por_prestador.map((prestador, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
            >
              <div>
                <p className="font-medium">{prestador.prestador.nombre}</p>
                <p className="text-sm text-gray-600">
                  {prestador.total_ventas} ventas
                </p>
              </div>
              <div className="text-right">
                <p className="font-bold text-green-600">
                  ${formatCurrency(prestador.total_ingresos)}
                </p>
                <p className="text-sm text-gray-600">
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
