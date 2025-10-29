import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Cloud, Wind, Eye, Anchor } from "lucide-react";
import type { CondicionMeteorologica } from "@/lib/types/clima";
import { getEstadoPuertoColor, getEstadoPuertoIcono } from "./utils";

interface CondicionActualCardProps {
  condicion: CondicionMeteorologica;
}

export function CondicionActualCard({ condicion }: CondicionActualCardProps) {
  return (
    <Card>
      <CardHeader className="pb-3 md:pb-6">
        <CardTitle className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <span className="flex items-center text-base md:text-lg">
            <Cloud className="mr-2 h-4 w-4 md:h-5 md:w-5" />
            Condición Actual
          </span>
          <Badge
            className={
              getEstadoPuertoColor(condicion.estado_puerto) +
              " text-[10px] md:text-xs"
            }
          >
            {getEstadoPuertoIcono(condicion.estado_puerto)}{" "}
            {condicion.estado_puerto.toUpperCase()}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 md:space-y-6">
        {/* Grid de métricas principales */}
        <div className="grid grid-cols-2 gap-2 md:gap-4">
          <div className="flex flex-col items-center justify-center rounded-lg bg-blue-50 p-3 md:p-4">
            <Cloud className="mb-1 md:mb-2 h-6 w-6 md:h-8 md:w-8 text-blue-600" />
            <div className="text-2xl md:text-3xl font-bold text-blue-600">
              {condicion.oleaje}m
            </div>
            <p className="text-[10px] md:text-xs text-muted-foreground">
              Oleaje
            </p>
          </div>

          <div className="flex flex-col items-center justify-center rounded-lg bg-green-50 p-3 md:p-4">
            <Wind className="mb-1 md:mb-2 h-6 w-6 md:h-8 md:w-8 text-green-600" />
            <div className="text-2xl md:text-3xl font-bold text-green-600">
              {condicion.viento_velocidad}
            </div>
            <p className="text-[10px] md:text-xs text-muted-foreground">
              Viento (km/h)
            </p>
          </div>
        </div>

        {/* Detalles adicionales */}
        <div className="space-y-2 md:space-y-3 border-t pt-3 md:pt-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1 md:gap-2 text-xs md:text-sm font-medium">
              <Wind className="h-3 w-3 md:h-4 md:w-4 text-muted-foreground" />
              Dirección del viento:
            </div>
            <span className="text-xs md:text-sm font-semibold">
              {condicion.viento_direccion}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1 md:gap-2 text-xs md:text-sm font-medium">
              <Eye className="h-3 w-3 md:h-4 md:w-4 text-muted-foreground" />
              Visibilidad:
            </div>
            <span className="text-xs md:text-sm font-semibold capitalize">
              {condicion.visibilidad}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1 md:gap-2 text-xs md:text-sm font-medium">
              <Anchor className="h-3 w-3 md:h-4 md:w-4 text-muted-foreground" />
              Fuente:
            </div>
            <span className="text-xs md:text-sm font-semibold">
              {condicion.fuente}
            </span>
          </div>
        </div>

        {/* Predicción si existe */}
        {condicion.prediccion_5_dias && (
          <div className="rounded-lg bg-muted/50 p-3 md:p-4">
            <p className="text-[10px] md:text-xs font-medium text-muted-foreground mb-1 md:mb-2">
              Predicción 5 días:
            </p>
            <p className="text-xs md:text-sm">{condicion.prediccion_5_dias}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
