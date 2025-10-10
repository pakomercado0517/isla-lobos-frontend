import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart3, TrendingUp, Activity } from "lucide-react";
import type { EstadisticasMeteorologicas } from "@/lib/types/clima";

interface EstadisticasCardProps {
  estadisticas: EstadisticasMeteorologicas;
}

export function EstadisticasCard({ estadisticas }: EstadisticasCardProps) {
  const totalRegistros = estadisticas.periodo.total_registros;
  const porcentajeAbierto =
    totalRegistros > 0
      ? Math.round((estadisticas.estado_puerto.abierto / totalRegistros) * 100)
      : 0;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <BarChart3 className="mr-2 h-5 w-5" />
          Estadísticas del Periodo
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Periodo */}
        <div className="rounded-lg bg-muted/50 p-3">
          <p className="text-xs text-muted-foreground mb-1">
            Periodo analizado:
          </p>
          <p className="text-sm font-medium">
            {new Date(estadisticas.periodo.fecha_inicio).toLocaleDateString(
              "es-MX"
            )}{" "}
            -{" "}
            {new Date(estadisticas.periodo.fecha_fin).toLocaleDateString(
              "es-MX"
            )}
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            {estadisticas.periodo.total_registros} registros
          </p>
        </div>

        {/* Oleaje */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Activity className="h-4 w-4 text-blue-600" />
            <span className="text-sm font-medium">Oleaje</span>
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div className="text-center">
              <div className="text-lg font-bold text-blue-600">
                {estadisticas.oleaje.promedio}m
              </div>
              <p className="text-xs text-muted-foreground">Promedio</p>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-green-600">
                {estadisticas.oleaje.minimo}m
              </div>
              <p className="text-xs text-muted-foreground">Mínimo</p>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-red-600">
                {estadisticas.oleaje.maximo}m
              </div>
              <p className="text-xs text-muted-foreground">Máximo</p>
            </div>
          </div>
          <p className="text-xs text-muted-foreground mt-2 text-center">
            {estadisticas.oleaje.registros_oleaje_alto} registros con oleaje
            alto (&gt;2.5m)
          </p>
        </div>

        {/* Viento */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <TrendingUp className="h-4 w-4 text-green-600" />
            <span className="text-sm font-medium">Viento</span>
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div className="text-center">
              <div className="text-lg font-bold text-green-600">
                {estadisticas.viento.promedio}
              </div>
              <p className="text-xs text-muted-foreground">Promedio</p>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-blue-600">
                {estadisticas.viento.minimo}
              </div>
              <p className="text-xs text-muted-foreground">Mínimo</p>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-red-600">
                {estadisticas.viento.maximo}
              </div>
              <p className="text-xs text-muted-foreground">Máximo</p>
            </div>
          </div>
          <p className="text-xs text-muted-foreground mt-2 text-center">
            {estadisticas.viento.registros_viento_fuerte} registros con viento
            fuerte (&gt;30 km/h)
          </p>
        </div>

        {/* Estado del Puerto */}
        <div className="border-t pt-4">
          <p className="text-sm font-medium mb-3">
            Distribución Estado del Puerto
          </p>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs">🟢 Abierto</span>
              <span className="text-sm font-semibold">
                {estadisticas.estado_puerto.abierto} ({porcentajeAbierto}%)
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs">🟡 Restricciones</span>
              <span className="text-sm font-semibold">
                {estadisticas.estado_puerto.restricciones}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs">🔴 Cerrado</span>
              <span className="text-sm font-semibold">
                {estadisticas.estado_puerto.cerrado}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs">⚡ Emergencia</span>
              <span className="text-sm font-semibold">
                {estadisticas.estado_puerto.emergencia}
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
