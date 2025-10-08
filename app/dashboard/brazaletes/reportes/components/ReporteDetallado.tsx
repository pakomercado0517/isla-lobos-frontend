import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Download } from "lucide-react";
import type { ReporteUtilizacionBrazaletes } from "@/lib/types/brazaletes";
import { getTipoBadgeProps, getNacionalidadDisplay } from "./utils";

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
            <tr className="border-b">
              <th className="text-left p-2">Código</th>
              <th className="text-left p-2">Tipo</th>
              <th className="text-left p-2">Precio</th>
              <th className="text-left p-2">Fecha Uso</th>
              <th className="text-left p-2">Nacionalidad</th>
              <th className="text-left p-2">Edad</th>
              <th className="text-left p-2">Prestador</th>
            </tr>
          </thead>
          <tbody>
            {reporteUtilizacion.utilizacion_detalle.map((brazalete, index) => {
              const tipoBadge = getTipoBadgeProps(brazalete.tipo);
              return (
                <tr key={index} className="border-b hover:bg-gray-50">
                  <td className="p-2 font-mono">{brazalete.codigo}</td>
                  <td className="p-2">
                    <Badge variant="outline" className={tipoBadge.className}>
                      {tipoBadge.label}
                    </Badge>
                  </td>
                  <td className="p-2">${brazalete.precio}</td>
                  <td className="p-2">
                    {brazalete.fecha_uso
                      ? new Date(brazalete.fecha_uso).toLocaleDateString("es-MX")
                      : "N/A"}
                  </td>
                  <td className="p-2">
                    {getNacionalidadDisplay(brazalete.turista_nacionalidad || "")}
                  </td>
                  <td className="p-2">{brazalete.turista_edad || "N/A"}</td>
                  <td className="p-2">
                    <div>
                      <p className="font-medium">
                        {brazalete.prestador?.nombre || "N/A"}
                      </p>
                      <p className="text-xs text-gray-600">
                        {brazalete.prestador?.email || "N/A"}
                      </p>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
