import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "lucide-react";
import type { PrediccionMeteorologica } from "@/lib/types/clima";
import {
  getTendenciaIcono,
  getTendenciaColor,
  getEstadoPuertoColor,
  formatearFecha,
} from "./utils";

interface PrediccionCardProps {
  prediccion: PrediccionMeteorologica;
}

export function PrediccionCard({ prediccion }: PrediccionCardProps) {
  return (
    <Card>
      <CardHeader className="pb-3 md:pb-6">
        <CardTitle className="flex items-center justify-between text-base md:text-lg">
          <span className="flex items-center">
            <Calendar className="mr-2 h-4 w-4 md:h-5 md:w-5" />
            Predicción {prediccion.periodo_dias} Días
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 md:space-y-6">
        {/* Promedios */}
        <div className="grid grid-cols-2 gap-2 md:gap-4">
          <div className="rounded-lg bg-blue-50 p-3 md:p-4">
            <div className="flex flex-col gap-1 md:flex-row md:items-center md:justify-between mb-2">
              <span className="text-[10px] md:text-xs text-muted-foreground">
                Oleaje Promedio
              </span>
              <Badge
                className={
                  getTendenciaColor(prediccion.tendencia_oleaje) +
                  " text-[9px] md:text-xs w-fit"
                }
              >
                {getTendenciaIcono(prediccion.tendencia_oleaje)}{" "}
                {prediccion.tendencia_oleaje}
              </Badge>
            </div>
            <div className="text-xl md:text-2xl font-bold text-blue-600">
              {prediccion.promedio_oleaje}m
            </div>
          </div>

          <div className="rounded-lg bg-green-50 p-3 md:p-4">
            <div className="flex flex-col gap-1 md:flex-row md:items-center md:justify-between mb-2">
              <span className="text-[10px] md:text-xs text-muted-foreground">
                Viento Promedio
              </span>
              <Badge
                className={
                  getTendenciaColor(prediccion.tendencia_viento) +
                  " text-[9px] md:text-xs w-fit"
                }
              >
                {getTendenciaIcono(prediccion.tendencia_viento)}{" "}
                {prediccion.tendencia_viento}
              </Badge>
            </div>
            <div className="text-xl md:text-2xl font-bold text-green-600">
              {prediccion.promedio_viento} km/h
            </div>
          </div>
        </div>

        {/* Recomendación */}
        <div className="rounded-lg bg-gradient-to-r from-cyan-50 to-blue-50 p-3 md:p-4 border border-cyan-200">
          <p className="text-[10px] md:text-xs font-medium text-muted-foreground mb-1 md:mb-2">
            Recomendación:
          </p>
          <p className="text-xs md:text-sm font-medium">
            {prediccion.recomendacion}
          </p>
        </div>

        {/* Condiciones por día */}
        {prediccion.condiciones_por_dia.length > 0 && (
          <div className="space-y-2">
            <p className="text-[10px] md:text-xs font-medium text-muted-foreground">
              Pronóstico por día:
            </p>
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {prediccion.condiciones_por_dia.map((dia, index) => (
                <div
                  key={index}
                  className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 rounded-lg border p-2 md:p-3 hover:bg-muted/50"
                >
                  <span className="text-xs md:text-sm font-medium">
                    {formatearFecha(dia.fecha)}
                  </span>
                  <div className="flex items-center gap-2 md:gap-3">
                    <span className="text-[10px] md:text-xs text-blue-600 font-semibold">
                      {dia.oleaje}m
                    </span>
                    <span className="text-[10px] md:text-xs text-green-600 font-semibold">
                      {dia.viento} km/h
                    </span>
                    <Badge
                      className={
                        getEstadoPuertoColor(dia.estado_puerto) +
                        " text-[9px] md:text-xs"
                      }
                    >
                      {dia.estado_puerto}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
