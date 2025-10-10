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
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span className="flex items-center">
            <Cloud className="mr-2 h-5 w-5" />
            Condición Actual
          </span>
          <Badge className={getEstadoPuertoColor(condicion.estado_puerto)}>
            {getEstadoPuertoIcono(condicion.estado_puerto)}{" "}
            {condicion.estado_puerto.toUpperCase()}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Grid de métricas principales */}
        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col items-center justify-center rounded-lg bg-blue-50 p-4">
            <Cloud className="mb-2 h-8 w-8 text-blue-600" />
            <div className="text-3xl font-bold text-blue-600">
              {condicion.oleaje}m
            </div>
            <p className="text-xs text-muted-foreground">Oleaje</p>
          </div>

          <div className="flex flex-col items-center justify-center rounded-lg bg-green-50 p-4">
            <Wind className="mb-2 h-8 w-8 text-green-600" />
            <div className="text-3xl font-bold text-green-600">
              {condicion.viento_velocidad}
            </div>
            <p className="text-xs text-muted-foreground">Viento (km/h)</p>
          </div>
        </div>

        {/* Detalles adicionales */}
        <div className="space-y-3 border-t pt-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm font-medium">
              <Wind className="h-4 w-4 text-muted-foreground" />
              Dirección del viento:
            </div>
            <span className="text-sm font-semibold">
              {condicion.viento_direccion}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm font-medium">
              <Eye className="h-4 w-4 text-muted-foreground" />
              Visibilidad:
            </div>
            <span className="text-sm font-semibold capitalize">
              {condicion.visibilidad}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm font-medium">
              <Anchor className="h-4 w-4 text-muted-foreground" />
              Fuente:
            </div>
            <span className="text-sm font-semibold">{condicion.fuente}</span>
          </div>
        </div>

        {/* Predicción si existe */}
        {condicion.prediccion_5_dias && (
          <div className="rounded-lg bg-muted/50 p-4">
            <p className="text-xs font-medium text-muted-foreground mb-2">
              Predicción 5 días:
            </p>
            <p className="text-sm">{condicion.prediccion_5_dias}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
