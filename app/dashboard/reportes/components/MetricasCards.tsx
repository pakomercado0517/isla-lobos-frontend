import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity, Users, BarChart3, DollarSign } from "lucide-react";
import { getTendenciaIcon, formatCurrency } from "./utils";

interface EstadisticasGenerales {
  total_usuarios: number;
  total_embarcaciones: number;
  embarcaciones_activas: number;
  total_salidas_hoy: number;
  total_pasajeros_hoy: number;
  ocupacion_promedio: number;
  ingresos_estimados: number;
  salidas_este_mes: number;
  pasajeros_este_mes: number;
  tendencia_mes_anterior: number;
}

interface MetricasCardsProps {
  estadisticas: EstadisticasGenerales;
}

export function MetricasCards({ estadisticas }: MetricasCardsProps) {
  return (
    <div className="grid grid-cols-2 gap-3 md:gap-4 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-xs md:text-sm font-medium truncate pr-2">
            Salidas
          </CardTitle>
          <Activity className="h-3 w-3 md:h-4 md:w-4 text-muted-foreground flex-shrink-0" />
        </CardHeader>
        <CardContent>
          <div className="text-xl md:text-2xl font-bold">
            {estadisticas.salidas_este_mes}
          </div>
          <div className="flex items-center text-[10px] md:text-xs text-muted-foreground">
            {getTendenciaIcon(estadisticas.tendencia_mes_anterior)}
            <span className="ml-1 truncate">
              {estadisticas.tendencia_mes_anterior > 0 ? "+" : ""}
              {estadisticas.tendencia_mes_anterior}% vs anterior
            </span>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-xs md:text-sm font-medium truncate pr-2">
            Pasajeros
          </CardTitle>
          <Users className="h-3 w-3 md:h-4 md:w-4 text-muted-foreground flex-shrink-0" />
        </CardHeader>
        <CardContent>
          <div className="text-xl md:text-2xl font-bold">
            {estadisticas.pasajeros_este_mes.toLocaleString()}
          </div>
          <p className="text-[10px] md:text-xs text-muted-foreground truncate">
            Prom.{" "}
            {Math.round(
              estadisticas.pasajeros_este_mes / estadisticas.salidas_este_mes
            )}{" "}
            por salida
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-xs md:text-sm font-medium truncate pr-2">
            Ocupación
          </CardTitle>
          <BarChart3 className="h-3 w-3 md:h-4 md:w-4 text-muted-foreground flex-shrink-0" />
        </CardHeader>
        <CardContent>
          <div className="text-xl md:text-2xl font-bold">
            {estadisticas.ocupacion_promedio}%
          </div>
          <p className="text-[10px] md:text-xs text-muted-foreground">
            Capacidad
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-xs md:text-sm font-medium truncate pr-2">
            Ingresos
          </CardTitle>
          <DollarSign className="h-3 w-3 md:h-4 md:w-4 text-muted-foreground flex-shrink-0" />
        </CardHeader>
        <CardContent>
          <div className="text-xl md:text-2xl font-bold">
            {formatCurrency(estadisticas.ingresos_estimados)}
          </div>
          <p className="text-[10px] md:text-xs text-muted-foreground">
            Este mes
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
