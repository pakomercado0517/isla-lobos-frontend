import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Globe, MapPin } from "lucide-react";
import type { Brazalete } from "@/lib/types/brazaletes";
import { calcularEstadisticasNacionalidad } from "./utils";

interface EstadisticasBrazaletesProps {
  brazaletes: Brazalete[];
}

export function EstadisticasBrazaletes({
  brazaletes,
}: EstadisticasBrazaletesProps) {
  // No mostrar si no hay brazaletes
  if (brazaletes.length === 0) {
    return null;
  }

  const stats = calcularEstadisticasNacionalidad(brazaletes);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="w-5 h-5" />
          Distribución de Turistas
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Total */}
        <div className="text-center pb-4 border-b border-gray-200">
          <div className="text-3xl font-bold text-[var(--isla-teal)]">
            {stats.total}
          </div>
          <div className="text-sm text-gray-600">Total de turistas</div>
        </div>

        {/* Distribución por nacionalidad */}
        <div className="space-y-3">
          {/* Locales */}
          {stats.locales > 0 && (
            <div className="space-y-1">
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-green-600" />
                  <span className="font-medium">Locales</span>
                </div>
                <span className="font-semibold text-green-600">
                  {stats.locales} ({stats.porcentajes.locales}%)
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-green-500 h-2 rounded-full transition-all"
                  style={{ width: `${stats.porcentajes.locales}%` }}
                />
              </div>
            </div>
          )}

          {/* Nacionales */}
          {stats.nacionales > 0 && (
            <div className="space-y-1">
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-blue-600" />
                  <span className="font-medium">Nacionales</span>
                </div>
                <span className="font-semibold text-blue-600">
                  {stats.nacionales} ({stats.porcentajes.nacionales}%)
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-blue-500 h-2 rounded-full transition-all"
                  style={{ width: `${stats.porcentajes.nacionales}%` }}
                />
              </div>
            </div>
          )}

          {/* Internacionales */}
          {stats.internacionales > 0 && (
            <div className="space-y-1">
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <Globe className="w-4 h-4 text-purple-600" />
                  <span className="font-medium">Internacionales</span>
                </div>
                <span className="font-semibold text-purple-600">
                  {stats.internacionales} ({stats.porcentajes.internacionales}%)
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-purple-500 h-2 rounded-full transition-all"
                  style={{ width: `${stats.porcentajes.internacionales}%` }}
                />
              </div>
            </div>
          )}

          {/* Sin datos */}
          {stats.sin_datos > 0 && (
            <div className="text-xs text-gray-500 text-center pt-2">
              {stats.sin_datos} brazaletes sin datos de nacionalidad
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
