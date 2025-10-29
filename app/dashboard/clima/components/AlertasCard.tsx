import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertTriangle, Info } from "lucide-react";
import type { AlertasMeteorologicas } from "@/lib/types/clima";
import { getSeveridadColor, getSeveridadIcono } from "./utils";

interface AlertasCardProps {
  alertas: AlertasMeteorologicas;
}

export function AlertasCard({ alertas }: AlertasCardProps) {
  const tieneAlertas = alertas.alertas.length > 0;

  return (
    <Card>
      <CardHeader className="pb-3 md:pb-6">
        <CardTitle className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <span className="flex items-center text-base md:text-lg">
            <AlertTriangle className="mr-2 h-4 w-4 md:h-5 md:w-5" />
            Alertas Meteorológicas
          </span>
          <Badge variant="outline" className="text-[10px] md:text-xs w-fit">
            {alertas.total_alertas}{" "}
            {alertas.total_alertas === 1 ? "Alerta" : "Alertas"}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3 md:space-y-4">
        {/* Resumen de alertas por severidad */}
        <div className="grid grid-cols-3 gap-2 pb-3 md:pb-4 border-b">
          <div className="text-center">
            <div className="text-xl md:text-2xl font-bold text-red-600">
              {alertas.alertas_criticas}
            </div>
            <p className="text-[10px] md:text-xs text-muted-foreground">
              Críticas
            </p>
          </div>
          <div className="text-center">
            <div className="text-xl md:text-2xl font-bold text-orange-600">
              {alertas.alertas_altas}
            </div>
            <p className="text-[10px] md:text-xs text-muted-foreground">
              Altas
            </p>
          </div>
          <div className="text-center">
            <div className="text-xl md:text-2xl font-bold text-yellow-600">
              {alertas.alertas_medias}
            </div>
            <p className="text-[10px] md:text-xs text-muted-foreground">
              Medias
            </p>
          </div>
        </div>

        {/* Lista de alertas */}
        {tieneAlertas ? (
          <div className="space-y-2">
            {alertas.alertas.map((alerta, index) => (
              <Alert
                key={index}
                className={
                  alerta.severidad === "critica"
                    ? "border-red-500 bg-red-50"
                    : alerta.severidad === "alta"
                    ? "border-orange-500 bg-orange-50"
                    : "border-yellow-500 bg-yellow-50"
                }
              >
                <div className="flex items-start gap-1 md:gap-2">
                  <div className="mt-0.5 flex-shrink-0">
                    {getSeveridadIcono(alerta.severidad)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-1 md:gap-2 mb-1">
                      <Badge
                        className={
                          getSeveridadColor(alerta.severidad) +
                          " text-[10px] md:text-xs"
                        }
                      >
                        {alerta.severidad.toUpperCase()}
                      </Badge>
                      <span className="text-[10px] md:text-xs text-muted-foreground truncate">
                        {alerta.tipo.replace(/_/g, " ")}
                      </span>
                    </div>
                    <AlertDescription className="text-xs md:text-sm break-words">
                      {alerta.mensaje}
                    </AlertDescription>
                    <div className="mt-1 text-[10px] md:text-xs text-muted-foreground">
                      Valor: {alerta.valor} | Umbral: {alerta.umbral}
                    </div>
                  </div>
                </div>
              </Alert>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-6 md:py-8 text-center">
            <Info className="h-10 w-10 md:h-12 md:w-12 text-green-500 mb-2 md:mb-3" />
            <p className="text-xs md:text-sm font-medium">
              No hay alertas activas
            </p>
            <p className="text-[10px] md:text-xs text-muted-foreground mt-1">
              Las condiciones meteorológicas son favorables
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
