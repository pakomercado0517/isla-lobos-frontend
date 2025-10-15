import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Users, Ship, MapPin } from "lucide-react";
import type { Salida } from "@/lib/types/salida";
import { formatearFechaSalida } from "@/lib/utils";
import { getEstadoColor } from "./utils";

interface DetallesSalidaProps {
  salida: Salida;
}

export function DetallesSalida({ salida }: DetallesSalidaProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          <span className="flex items-center gap-2 text-lg md:text-base">
            <Ship className="w-6 h-6 md:w-5 md:h-5" />
            Información de la Salida
          </span>
          <Badge
            className={`${getEstadoColor(
              salida.estado
            )} text-sm md:text-xs w-fit`}
          >
            {salida.estado}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-5 md:space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-4">
          {/* Fecha */}
          <div className="flex items-start gap-3">
            <div className="mt-1">
              <Calendar className="w-5 h-5 md:w-4 md:h-4 text-gray-500" />
            </div>
            <div className="flex-1">
              <div className="text-base md:text-sm text-gray-600">Fecha</div>
              <div className="font-medium text-base md:text-sm">
                {formatearFechaSalida(salida.fecha)}
              </div>
            </div>
          </div>

          {/* Pasajeros */}
          <div className="flex items-start gap-3">
            <div className="mt-1">
              <Users className="w-5 h-5 md:w-4 md:h-4 text-gray-500" />
            </div>
            <div className="flex-1">
              <div className="text-base md:text-sm text-gray-600">
                Pasajeros
              </div>
              <div className="font-medium text-base md:text-sm">
                {salida.numero_pasajeros}
              </div>
            </div>
          </div>

          {/* Embarcación */}
          <div className="flex items-start gap-3">
            <div className="mt-1">
              <Ship className="w-5 h-5 md:w-4 md:h-4 text-gray-500" />
            </div>
            <div className="flex-1">
              <div className="text-base md:text-sm text-gray-600">
                Embarcación
              </div>
              <div className="font-medium text-base md:text-sm">
                {salida.embarcacion?.nombre || "Sin embarcación"}
              </div>
            </div>
          </div>

          {/* Destino */}
          <div className="flex items-start gap-3">
            <div className="mt-1">
              <MapPin className="w-5 h-5 md:w-4 md:h-4 text-gray-500" />
            </div>
            <div className="flex-1">
              <div className="text-base md:text-sm text-gray-600">Destino</div>
              <div className="font-medium text-base md:text-sm">
                {salida.destino}
              </div>
            </div>
          </div>
        </div>

        {/* Observaciones */}
        {salida.observaciones && (
          <div>
            <div className="text-base md:text-sm text-gray-600 mb-2">
              Observaciones
            </div>
            <div className="bg-gray-50 p-4 md:p-3 rounded-lg text-base md:text-sm">
              {salida.observaciones}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
