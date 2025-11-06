import { Badge } from "@/components/ui/badge";
import { Calendar } from "lucide-react";
import type { Salida } from "@/lib/types/salida";
import {
  formatearFechaRegional,
  normalizarFechaDelBackend,
} from "@/lib/utils";

interface ListaSalidasDisponiblesProps {
  salidasConBrazaletes: Salida[];
}

export function ListaSalidasDisponibles({
  salidasConBrazaletes,
}: ListaSalidasDisponiblesProps) {
  return (
    <div className="bg-white p-4 md:p-6 rounded-lg border">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4">
        <h3 className="text-base md:text-lg font-semibold">
          Salidas Disponibles
        </h3>
        <Badge variant="outline" className="text-xs md:text-sm">
          {salidasConBrazaletes.length} salidas
        </Badge>
      </div>

      {salidasConBrazaletes && salidasConBrazaletes.length > 0 ? (
        <div className="space-y-2 md:space-y-3">
          {salidasConBrazaletes.slice(0, 5).map((salida) => (
            <div
              key={salida.id}
              className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 p-3 bg-gray-50 rounded-lg"
            >
              <div className="min-w-0 flex-1">
                <p className="font-medium text-sm md:text-base truncate">
                  {formatearFechaRegional(
                    normalizarFechaDelBackend(salida.fecha)
                  )}
                </p>
                <p className="text-xs md:text-sm text-gray-600 truncate">
                  {salida.numero_pasajeros} pasajeros
                  {salida.embarcacion?.nombre &&
                    ` • ${salida.embarcacion.nombre}`}
                </p>
              </div>
              <Badge
                variant="outline"
                className="text-xs md:text-sm whitespace-nowrap w-fit sm:w-auto"
              >
                {salida.estado}
              </Badge>
            </div>
          ))}
          {salidasConBrazaletes.length > 5 && (
            <div className="text-center text-xs md:text-sm text-gray-500 py-2">
              ... y {salidasConBrazaletes.length - 5} salidas más
            </div>
          )}
        </div>
      ) : (
        <div className="text-center py-6 md:py-8">
          <Calendar className="w-10 h-10 md:w-12 md:h-12 text-gray-400 mx-auto mb-3 md:mb-4" />
          <h3 className="text-base md:text-lg font-medium text-gray-900 mb-2">
            No hay salidas disponibles
          </h3>
          <p className="text-xs md:text-sm text-gray-600 px-2">
            Registra algunas salidas (programadas, en curso o completadas) para
            poder registrar el uso de brazaletes
          </p>
        </div>
      )}
    </div>
  );
}
