import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import type { ReporteUtilizacionBrazaletes } from "@/lib/types/brazaletes";
import { getNacionalidadDisplay } from "./utils";

interface ReporteDetalladoProps {
  reporteUtilizacion: ReporteUtilizacionBrazaletes;
}

export function ReporteDetallado({
  reporteUtilizacion,
}: ReporteDetalladoProps) {
  return (
    <div className="bg-white p-6 rounded-lg border">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Detalle de Utilización</h3>
        <Button variant="outline" size="sm">
          <Download className="w-4 h-4 mr-2" />
          Exportar
        </Button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b bg-gray-50">
              <th className="text-left p-3 font-semibold">Código</th>
              <th className="text-left p-3 font-semibold">Precio</th>
              <th className="text-left p-3 font-semibold">Fecha Uso</th>
              <th className="text-left p-3 font-semibold">Nacionalidad</th>
              <th className="text-left p-3 font-semibold">Edad</th>
              <th className="text-left p-3 font-semibold">Prestador</th>
            </tr>
          </thead>
          <tbody>
            {reporteUtilizacion.utilizacion_detalle.map((brazalete, index) => {
              return (
                <tr key={index} className="border-b hover:bg-gray-50">
                  <td className="p-3 font-mono text-blue-600">
                    {brazalete.codigo}
                  </td>
                  <td className="p-3 font-semibold">${brazalete.precio}</td>
                  <td className="p-3">
                    {brazalete.fecha_uso
                      ? new Date(brazalete.fecha_uso).toLocaleDateString(
                          "es-MX",
                          {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                          }
                        )
                      : "N/A"}
                  </td>
                  <td className="p-3">
                    <span className="inline-flex items-center">
                      {getNacionalidadDisplay(
                        brazalete.turista_nacionalidad || ""
                      )}
                    </span>
                  </td>
                  <td className="p-3">
                    {brazalete.turista_edad ? (
                      <span className="font-medium">
                        {brazalete.turista_edad} años
                      </span>
                    ) : (
                      <span className="text-gray-400">N/A</span>
                    )}
                  </td>
                  <td className="p-3">
                    <div>
                      <p className="font-medium text-gray-900">
                        {brazalete.prestador?.nombre || "N/A"}
                      </p>
                      <p className="text-xs text-gray-500">
                        {brazalete.prestador?.email || "N/A"}
                      </p>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {reporteUtilizacion.utilizacion_detalle.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            No hay brazaletes utilizados en este periodo
          </div>
        )}
      </div>
    </div>
  );
}
