import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Ship, Users, Anchor, Clock } from "lucide-react";
import type { Embarcacion } from "@/lib/types/embarcacion";
import type { Salida } from "@/lib/types/salida";
import { getEstadoColor } from "./utils";

interface EmbarcacionesCardsProps {
  embarcaciones: Embarcacion[];
  salidas: Salida[];
}

export function EmbarcacionesCards({
  embarcaciones,
  salidas,
}: EmbarcacionesCardsProps) {
  const getSalidasHoyPorEmbarcacion = (embarcacionId: string) => {
    const hoy = new Date().toLocaleDateString("es-MX");
    return salidas.filter((salida) => {
      const fechaSalida =
        salida.fecha instanceof Date
          ? salida.fecha.toLocaleDateString("es-MX")
          : salida.fecha;

      return (
        salida.embarcacion?.nombre ===
          embarcaciones.find((e) => e.id === embarcacionId)?.nombre &&
        fechaSalida === hoy &&
        salida.estado !== "cancelada" &&
        salida.estado !== "completada" &&
        salida.estado !== "cancelada_por_clima" &&
        salida.estado !== "cancelada_capitaria"
      );
    });
  };

  const getEmbarcacionBadgeColor = (embarcacionId: string) => {
    const salidasHoy = getSalidasHoyPorEmbarcacion(embarcacionId);
    return salidasHoy.length === 0
      ? "bg-green-100 text-green-800 border-green-200"
      : "bg-blue-100 text-blue-800 border-blue-200";
  };

  const getEmbarcacionBadgeText = (embarcacionId: string) => {
    const salidasHoy = getSalidasHoyPorEmbarcacion(embarcacionId);
    if (salidasHoy.length === 0) return "Sin salidas hoy";
    if (salidasHoy.length === 1) return "1 salida hoy";
    return `${salidasHoy.length} salidas hoy`;
  };

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Ship className="w-5 h-5 text-[var(--isla-teal)]" />
          <span>Mis Embarcaciones</span>
        </CardTitle>
        <CardDescription>
          Administra tu flota de embarcaciones y supervisa las salidas programadas
        </CardDescription>
      </CardHeader>
      <CardContent>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-4">
        {embarcaciones.map((embarcacion) => {
          const salidasHoy = getSalidasHoyPorEmbarcacion(embarcacion.id);
          return (
            <Card key={embarcacion.id}>
              <CardHeader className="pb-4 md:pb-6">
                <div className="flex justify-between items-start gap-3">
                  <div className="flex-1 min-w-0">
                    <CardTitle className="text-lg md:text-base truncate">
                      {embarcacion.nombre}
                    </CardTitle>
                    <CardDescription className="text-base md:text-sm">
                      {embarcacion.matricula}
                    </CardDescription>
                  </div>
                  <Badge
                    className={`${getEmbarcacionBadgeColor(
                      embarcacion.id
                    )} text-sm md:text-xs whitespace-nowrap`}
                  >
                    {getEmbarcacionBadgeText(embarcacion.id)}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 md:space-y-2">
                  <div className="flex justify-between">
                    <span className="text-base md:text-sm text-gray-600">
                      Capacidad:
                    </span>
                    <span className="font-medium text-base md:text-sm">
                      {embarcacion.capacidad} personas
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-base md:text-sm text-gray-600">
                      Tipo:
                    </span>
                    <span className="font-medium text-base md:text-sm capitalize">
                      {embarcacion.tipo === "mayor"
                        ? "Embarcación Mayor"
                        : "Embarcación Menor"}
                    </span>
                  </div>

                  {/* Información de salidas de hoy */}
                  {salidasHoy.length > 0 && (
                    <div className="mt-4 md:mt-3 pt-3 md:pt-2 border-t border-gray-200">
                      <div className="text-sm md:text-xs text-gray-600 mb-2 md:mb-1">
                        Salidas programadas hoy:
                      </div>
                      {salidasHoy.map((salida) => (
                        <div
                          key={salida.id}
                          className="text-sm md:text-xs text-gray-700 bg-blue-50 p-3 md:p-2 rounded mb-2 md:mb-1"
                        >
                          <div className="flex justify-between items-center gap-2">
                            <span className="font-medium truncate">
                              {salida.destino}
                            </span>
                            <Badge
                              variant="outline"
                              className={`text-xs whitespace-nowrap ${getEstadoColor(
                                salida.estado
                              )}`}
                            >
                              {salida.estado.replace("_", " ")}
                            </Badge>
                          </div>
                          <div className="text-gray-600 mt-1 text-sm md:text-xs">
                            {salida.bloque?.hora_inicio} -{" "}
                            {salida.bloque?.hora_fin} •{" "}
                            {salida.numero_pasajeros} pasajeros
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
      </CardContent>
    </Card>
  );
}
