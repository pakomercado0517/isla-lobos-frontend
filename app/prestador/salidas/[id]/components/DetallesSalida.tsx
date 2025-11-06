import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Users, Ship, MapPin } from "lucide-react";
import type { Salida } from "@/lib/types/salida";
import {
  formatearFechaRegional,
  normalizarFechaDelBackend,
} from "@/lib/utils";
import { getEstadoColor } from "./utils";

interface DetallesSalidaProps {
  salida: Salida;
}

export function DetallesSalida({ salida }: DetallesSalidaProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-3">
          <span className="flex items-center gap-2 text-base sm:text-lg">
            <Ship className="w-5 h-5 sm:w-6 sm:h-6 flex-shrink-0" />
            Información de la Salida
          </span>
          <Badge
            className={`${getEstadoColor(
              salida.estado
            )} text-xs sm:text-sm w-fit`}
          >
            {salida.estado}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 sm:space-y-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
          {/* Fecha */}
          <div className="flex items-start gap-2 sm:gap-3">
            <div className="mt-0.5 sm:mt-1">
              <Calendar className="w-4 h-4 sm:w-5 sm:h-5 text-gray-500 flex-shrink-0" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-xs sm:text-sm text-gray-600">Fecha</div>
              <div className="font-medium text-sm sm:text-base truncate">
                {formatearFechaRegional(normalizarFechaDelBackend(salida.fecha))}
              </div>
            </div>
          </div>

          {/* Pasajeros */}
          <div className="flex items-start gap-2 sm:gap-3">
            <div className="mt-0.5 sm:mt-1">
              <Users className="w-4 h-4 sm:w-5 sm:h-5 text-gray-500 flex-shrink-0" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-xs sm:text-sm text-gray-600">
                Pasajeros
              </div>
              <div className="font-medium text-sm sm:text-base">
                {salida.numero_pasajeros}
              </div>
            </div>
          </div>

          {/* Embarcación */}
          <div className="flex items-start gap-2 sm:gap-3">
            <div className="mt-0.5 sm:mt-1">
              <Ship className="w-4 h-4 sm:w-5 sm:h-5 text-gray-500 flex-shrink-0" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-xs sm:text-sm text-gray-600">
                Embarcación
              </div>
              <div className="font-medium text-sm sm:text-base truncate">
                {salida.embarcacion?.nombre || "Sin embarcación"}
              </div>
            </div>
          </div>

          {/* Destino */}
          <div className="flex items-start gap-2 sm:gap-3">
            <div className="mt-0.5 sm:mt-1">
              <MapPin className="w-4 h-4 sm:w-5 sm:h-5 text-gray-500 flex-shrink-0" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-xs sm:text-sm text-gray-600">Destino</div>
              <div className="font-medium text-sm sm:text-base truncate">
                {salida.destino}
              </div>
            </div>
          </div>
        </div>

        {/* Observaciones */}
        {salida.observaciones && (
          <div>
            <div className="text-xs sm:text-sm text-gray-600 mb-2">
              Observaciones
            </div>
            <div className="bg-gray-50 p-3 sm:p-4 rounded-lg text-xs sm:text-sm break-words">
              {salida.observaciones}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
