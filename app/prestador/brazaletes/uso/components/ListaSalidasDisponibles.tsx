import { Badge } from "@/components/ui/badge";
import { Calendar } from "lucide-react";
import type { Salida } from "@/lib/types/salida";
import { formatearFechaRegional } from "@/lib/utils";

interface ListaSalidasDisponiblesProps {
  salidasConBrazaletes: Salida[];
}

export function ListaSalidasDisponibles({
  salidasConBrazaletes,
}: ListaSalidasDisponiblesProps) {
  return (
    <div className="bg-white p-6 rounded-lg border">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Salidas Disponibles</h3>
        <Badge variant="outline">{salidasConBrazaletes.length} salidas</Badge>
      </div>

      {salidasConBrazaletes && salidasConBrazaletes.length > 0 ? (
        <div className="space-y-3">
          {salidasConBrazaletes.slice(0, 5).map((salida) => (
            <div
              key={salida.id}
              className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
            >
              <div>
                <p className="font-medium">
                  {formatearFechaRegional(typeof salida.fecha === 'string' ? salida.fecha : salida.fecha.toISOString().split('T')[0])}
                </p>
                <p className="text-sm text-gray-600">
                  {salida.numero_pasajeros} pasajeros
                  {salida.embarcacion?.nombre &&
                    ` • ${salida.embarcacion.nombre}`}
                </p>
              </div>
              <Badge variant="outline">{salida.estado}</Badge>
            </div>
          ))}
          {salidasConBrazaletes.length > 5 && (
            <div className="text-center text-sm text-gray-500">
              ... y {salidasConBrazaletes.length - 5} salidas más
            </div>
          )}
        </div>
      ) : (
        <div className="text-center py-8">
          <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No hay salidas disponibles
          </h3>
          <p className="text-gray-600">
            Registra algunas salidas (programadas, en curso o completadas) para
            poder registrar el uso de brazaletes
          </p>
        </div>
      )}
    </div>
  );
}
