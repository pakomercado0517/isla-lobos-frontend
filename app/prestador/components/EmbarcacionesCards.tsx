import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Ship, Users, Anchor, Clock, Settings, Calendar } from "lucide-react";
import Link from "next/link";
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
          Administra tu flota de embarcaciones y supervisa las salidas
          programadas
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
          {embarcaciones.map((embarcacion) => {
            const salidasHoy = getSalidasHoyPorEmbarcacion(embarcacion.id);
            return (
              <Card
                key={embarcacion.id}
                className="overflow-hidden border-l-4 border-l-[var(--isla-teal)] hover:shadow-lg transition-all duration-200"
              >
                {/* Header con nombre y estado */}
                <div className="bg-gradient-to-r from-[var(--isla-teal)]/10 to-blue-50 p-3 sm:p-4">
                  <div className="flex items-center space-x-3 mb-3">
                    <div className="p-2 bg-[var(--isla-teal)]/20 rounded-full">
                      <Anchor className="w-4 h-4 sm:w-5 sm:h-5 text-[var(--isla-teal)]" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-base sm:text-lg text-[var(--isla-dark-teal)] truncate leading-tight">
                        {embarcacion.nombre}
                      </h3>
                      <p className="text-xs sm:text-sm text-gray-600 mt-0.5">
                        {embarcacion.matricula}
                      </p>
                    </div>
                  </div>

                  <Badge
                    className={`${getEmbarcacionBadgeColor(
                      embarcacion.id
                    )} text-xs font-medium px-2 py-1 w-fit`}
                  >
                    {getEmbarcacionBadgeText(embarcacion.id)}
                  </Badge>
                </div>

                <CardContent className="p-3 sm:p-4">
                  {/* Información básica */}
                  <div className="grid grid-cols-2 gap-3 mb-4">
                    <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg p-3 text-center">
                      <div className="flex items-center justify-center space-x-1 mb-2">
                        <Users className="w-4 h-4 text-[var(--isla-teal)]" />
                        <span className="text-xs text-gray-600 font-semibold">
                          CAPACIDAD
                        </span>
                      </div>
                      <p className="font-bold text-xl sm:text-2xl text-[var(--isla-dark-teal)] leading-none">
                        {embarcacion.capacidad}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">personas</p>
                    </div>

                    <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg p-3 text-center">
                      <div className="flex items-center justify-center space-x-1 mb-2">
                        <Ship className="w-4 h-4 text-[var(--isla-teal)]" />
                        <span className="text-xs text-gray-600 font-semibold">
                          TIPO
                        </span>
                      </div>
                      <p className="font-bold text-sm sm:text-base text-[var(--isla-dark-teal)] leading-none">
                        {embarcacion.tipo === "mayor" ? "Mayor" : "Menor"}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">embarcación</p>
                    </div>
                  </div>

                  {/* Salidas de hoy */}
                  {salidasHoy.length > 0 && (
                    <div className="border-t border-gray-200 pt-4">
                      <div className="flex items-center space-x-2 mb-3">
                        <Calendar className="w-4 h-4 text-[var(--isla-teal)]" />
                        <span className="text-sm font-semibold text-gray-700">
                          Salidas de Hoy
                        </span>
                      </div>
                      <div className="space-y-2">
                        {salidasHoy.slice(0, 2).map((salida) => (
                          <div
                            key={salida.id}
                            className="bg-white border border-gray-200 rounded-lg p-3 hover:border-[var(--isla-teal)]/50 transition-colors"
                          >
                            <div className="flex items-center justify-between mb-1">
                              <span className="font-medium text-sm text-gray-800 truncate">
                                {salida.destino}
                              </span>
                              <Badge
                                variant="outline"
                                className={`text-xs ${getEstadoColor(
                                  salida.estado
                                )}`}
                              >
                                {salida.estado.replace("_", " ")}
                              </Badge>
                            </div>
                            <div className="flex items-center space-x-4 text-xs text-gray-600">
                              <div className="flex items-center space-x-1">
                                <Clock className="w-3 h-3" />
                                <span>
                                  {salida.bloque?.hora_inicio} -{" "}
                                  {salida.bloque?.hora_fin}
                                </span>
                              </div>
                              <div className="flex items-center space-x-1">
                                <Users className="w-3 h-3" />
                                <span>{salida.numero_pasajeros} pax</span>
                              </div>
                            </div>
                          </div>
                        ))}
                        {salidasHoy.length > 2 && (
                          <p className="text-xs text-gray-500 text-center py-1">
                            +{salidasHoy.length - 2} salidas más
                          </p>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Botones de acción */}
                  <div className="flex gap-2 mt-4 pt-3 border-t border-gray-100">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1 h-9 text-xs font-medium border-[var(--isla-teal)] text-[var(--isla-teal)] hover:bg-[var(--isla-teal)] hover:text-white transition-colors"
                      asChild
                    >
                      <Link
                        href={`/prestador/nueva-salida?embarcacion=${encodeURIComponent(
                          embarcacion.id
                        )}`}
                      >
                        <Calendar className="w-3 h-3 mr-1.5" />
                        <span className="hidden sm:inline">Programar</span>
                        <span className="sm:hidden">Plan</span>
                      </Link>
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1 h-9 text-xs font-medium border-gray-300 text-gray-600 hover:bg-gray-50 hover:border-gray-400 transition-colors"
                      asChild
                    >
                      <Link
                        href={`/prestador/embarcaciones?edit=${encodeURIComponent(
                          embarcacion.id
                        )}`}
                      >
                        <Settings className="w-3 h-3 mr-1.5" />
                        <span className="hidden sm:inline">Configurar</span>
                        <span className="sm:hidden">Config</span>
                      </Link>
                    </Button>
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
