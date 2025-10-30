import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Ship, AlertTriangle } from "lucide-react";
import type { Salida } from "@/lib/types/salida";
import {
  calcularOcupacionEmbarcacion,
  estaEmbarcacionSobrecargada,
} from "./utils";

interface DetallesEmbarcacionProps {
  salida: Salida;
}

export function DetallesEmbarcacion({ salida }: DetallesEmbarcacionProps) {
  const embarcacion = salida.embarcacion;

  if (!embarcacion) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Ship className="w-5 h-5" />
            Embarcación
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-4 text-gray-500">
            Sin embarcación asignada
          </div>
        </CardContent>
      </Card>
    );
  }

  const ocupacion = calcularOcupacionEmbarcacion(
    salida.numero_pasajeros,
    embarcacion.capacidad
  );
  const sobrecargada = estaEmbarcacionSobrecargada(
    salida.numero_pasajeros,
    embarcacion.capacidad
  );

  const getEstadoEmbarcacionColor = (estado?: string) => {
    switch (estado) {
      case "disponible":
        return "bg-green-100 text-green-800 border-green-200";
      case "en_uso":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "mantenimiento":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <span className="flex items-center gap-2 text-base sm:text-lg">
            <Ship className="w-5 h-5 sm:w-6 sm:h-6 flex-shrink-0" />
            Embarcación
          </span>
          {embarcacion.estado && (
            <Badge className={`${getEstadoEmbarcacionColor(embarcacion.estado)} text-xs`}>
              {embarcacion.estado}
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3 sm:space-y-4">
        {/* Nombre */}
        <div>
          <div className="text-xs sm:text-sm text-gray-600 mb-1">Nombre</div>
          <div className="text-base sm:text-lg font-semibold text-[var(--isla-dark-teal)] truncate">
            {embarcacion.nombre}
          </div>
        </div>

        {/* Matrícula */}
        {embarcacion.matricula && (
          <div>
            <div className="text-xs sm:text-sm text-gray-600 mb-1">Matrícula</div>
            <div className="font-medium font-mono text-xs sm:text-sm">
              {embarcacion.matricula}
            </div>
          </div>
        )}

        {/* Tipo */}
        {embarcacion.tipo && (
          <div>
            <div className="text-xs sm:text-sm text-gray-600 mb-1">Tipo</div>
            <Badge variant="secondary" className="text-xs">
              {embarcacion.tipo === "menor"
                ? "Embarcación Menor"
                : "Embarcación Mayor"}
            </Badge>
          </div>
        )}

        {/* Capacidad y ocupación */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs sm:text-sm">
            <span className="text-gray-600">Ocupación</span>
            <span
              className={`font-semibold ${sobrecargada ? "text-red-600" : ""}`}
            >
              {salida.numero_pasajeros} / {embarcacion.capacidad} ({ocupacion}%)
            </span>
          </div>

          {/* Barra de progreso */}
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className={`h-2 rounded-full transition-all ${
                sobrecargada ? "bg-red-500" : "bg-[var(--isla-teal)]"
              }`}
              style={{ width: `${Math.min(ocupacion, 100)}%` }}
            />
          </div>

          {/* Advertencia si está sobrecargada */}
          {sobrecargada && (
            <div className="flex items-start gap-2 bg-red-50 border border-red-200 rounded-lg p-2 sm:p-3">
              <AlertTriangle className="w-4 h-4 text-red-600 mt-0.5 flex-shrink-0" />
              <div className="text-xs text-red-800">
                <strong>Advertencia:</strong> La embarcación está por encima de
                su capacidad máxima
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
