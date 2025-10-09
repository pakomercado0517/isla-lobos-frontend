import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock } from "lucide-react";
import type { Salida } from "@/lib/types/salida";

interface InformacionBloqueProps {
  salida: Salida;
}

export function InformacionBloque({ salida }: InformacionBloqueProps) {
  // Solo mostrar si tiene bloque
  if (!salida.bloque) return null;

  const bloque = salida.bloque;
  const capacidadDisponible = bloque.capacidad_disponible || 0;
  const capacidadRegistrada = bloque.capacidad_registrada || 0;
  const capacidadTotal = bloque.capacidad_total || 65;
  const porcentajeOcupacion = Math.round(
    (capacidadRegistrada / capacidadTotal) * 100
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="w-5 h-5" />
          Bloque Horario
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Nombre del bloque */}
        <div>
          <div className="text-sm text-gray-600 mb-1">Bloque</div>
          <div className="text-lg font-semibold text-[var(--isla-dark-teal)]">
            {bloque.nombre}
          </div>
        </div>

        {/* Horario */}
        <div>
          <div className="text-sm text-gray-600 mb-1">Horario</div>
          <div className="font-medium">
            {bloque.hora_inicio} - {bloque.hora_fin}
          </div>
        </div>

        {/* Ocupación del bloque */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">Ocupación del bloque</span>
            <span className="font-semibold">{porcentajeOcupacion}%</span>
          </div>

          {/* Barra de progreso */}
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-[var(--isla-teal)] h-2 rounded-full transition-all"
              style={{ width: `${porcentajeOcupacion}%` }}
            />
          </div>

          {/* Estadísticas */}
          <div className="grid grid-cols-3 gap-2 text-xs">
            <div className="text-center">
              <div className="font-semibold text-gray-900">
                {capacidadRegistrada}
              </div>
              <div className="text-gray-600">Registrados</div>
            </div>
            <div className="text-center">
              <div className="font-semibold text-green-600">
                {capacidadDisponible}
              </div>
              <div className="text-gray-600">Disponibles</div>
            </div>
            <div className="text-center">
              <div className="font-semibold text-gray-900">
                {capacidadTotal}
              </div>
              <div className="text-gray-600">Total</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
