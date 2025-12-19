"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Ship, Users, Clock, Settings, Calendar } from "lucide-react";
import Link from "next/link";
import type { Embarcacion } from "@/lib/types/embarcacion";
import type { Salida } from "@/lib/types/salida";
import { getEstadoColor } from "./utils";
import { normalizarFechaDelBackend, obtenerFechaLocalYYYYMMDD } from "@/lib/utils";

interface EmbarcacionesCardsProps {
  embarcaciones: Embarcacion[];
  salidas: Salida[];
}

export function EmbarcacionesCards({
  embarcaciones,
  salidas,
}: EmbarcacionesCardsProps) {
  const getSalidasHoyPorEmbarcacion = (embarcacionId: string) => {
    const hoy = obtenerFechaLocalYYYYMMDD(); // "YYYY-MM-DD"
    return salidas.filter((salida) => {
      const fechaSalida = normalizarFechaDelBackend(salida.fecha); // "YYYY-MM-DD"

      return (
        salida.embarcacion?.id === embarcacionId &&
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
      ? "bg-green-50 text-green-700 border-green-200"
      : "bg-blue-50 text-blue-700 border-blue-200";
  };

  const getEmbarcacionBadgeText = (embarcacionId: string) => {
    const salidasHoy = getSalidasHoyPorEmbarcacion(embarcacionId);
    if (salidasHoy.length === 0) return "Disponible";
    if (salidasHoy.length === 1) return "1 salida hoy";
    return `${salidasHoy.length} salidas hoy`;
  };

  if (embarcaciones.length === 0) {
    return (
      <Card className="border-gray-100 shadow-sm">
        <CardHeader className="pb-4 px-4 sm:px-6 lg:px-8 pt-6 lg:pt-8">
          <CardTitle className="text-lg sm:text-xl lg:text-2xl xl:text-3xl font-bold text-gray-900">
            Mis Embarcaciones
          </CardTitle>
        </CardHeader>
        <CardContent className="px-4 sm:px-6 lg:px-8 pb-6 lg:pb-8">
          <div className="text-center py-12 lg:py-16 xl:py-20">
            <Ship className="w-12 h-12 lg:w-16 lg:h-16 xl:w-20 xl:h-20 text-gray-300 mx-auto mb-4 lg:mb-6" />
            <p className="text-sm lg:text-base xl:text-lg text-gray-600 mb-4 lg:mb-6">
              No tienes embarcaciones registradas
            </p>
            <Button asChild size="sm" className="bg-[var(--isla-teal)] hover:bg-[var(--isla-teal-dark)] text-sm lg:text-base h-9 lg:h-10 px-4 lg:px-6">
              <Link href="/prestador/embarcaciones">
                Registrar Embarcación
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-gray-100 shadow-sm">
      <CardHeader className="pb-4 px-4 sm:px-6 lg:px-8 pt-6 lg:pt-8">
        <CardTitle className="text-lg sm:text-xl lg:text-2xl xl:text-3xl font-bold text-gray-900">
          Mis Embarcaciones
        </CardTitle>
      </CardHeader>
      <CardContent className="px-4 sm:px-6 lg:px-8 pb-6 lg:pb-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 lg:gap-6 xl:gap-8">
          {embarcaciones.map((embarcacion) => {
            const salidasHoy = getSalidasHoyPorEmbarcacion(embarcacion.id);
            return (
              <Card
                key={embarcacion.id}
                className="border-gray-200 hover:border-[var(--isla-teal)]/50 hover:shadow-lg transition-all duration-300 overflow-hidden group"
              >
                <CardContent className="p-4 sm:p-5 lg:p-6">
                  {/* Header */}
                  <div className="flex items-start justify-between mb-4 lg:mb-5">
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-base sm:text-lg lg:text-xl text-gray-900 mb-1 lg:mb-2 truncate">
                        {embarcacion.nombre}
                      </h3>
                      <p className="text-xs lg:text-sm text-gray-500 truncate">
                        {embarcacion.matricula}
                      </p>
                    </div>
                    <div className={`p-2 lg:p-2.5 rounded-lg lg:rounded-xl bg-[var(--isla-teal)]/10 group-hover:bg-[var(--isla-teal)]/20 transition-colors shrink-0`}>
                      <Ship className="w-5 h-5 lg:w-6 lg:h-6 text-[var(--isla-teal)]" />
                    </div>
                  </div>

                  {/* Badge de estado */}
                  <Badge
                    variant="outline"
                    className={`${getEmbarcacionBadgeColor(
                      embarcacion.id
                    )} text-xs font-medium mb-4`}
                  >
                    {getEmbarcacionBadgeText(embarcacion.id)}
                  </Badge>

                  {/* Información básica */}
                  <div className="grid grid-cols-2 gap-3 lg:gap-4 mb-4 lg:mb-5">
                    <div className="bg-gray-50 rounded-lg lg:rounded-xl p-3 lg:p-4 text-center">
                      <div className="flex items-center justify-center gap-1 mb-1 lg:mb-2">
                        <Users className="w-4 h-4 lg:w-5 lg:h-5 text-gray-500" />
                      </div>
                      <p className="text-xl lg:text-2xl xl:text-3xl font-bold text-gray-900 mb-0.5 lg:mb-1">
                        {embarcacion.capacidad}
                      </p>
                      <p className="text-xs lg:text-sm text-gray-500">Capacidad</p>
                    </div>
                    <div className="bg-gray-50 rounded-lg lg:rounded-xl p-3 lg:p-4 text-center">
                      <div className="flex items-center justify-center gap-1 mb-1 lg:mb-2">
                        <Ship className="w-4 h-4 lg:w-5 lg:h-5 text-gray-500" />
                      </div>
                      <p className="text-sm lg:text-base xl:text-lg font-bold text-gray-900 mb-0.5 lg:mb-1">
                        {embarcacion.tipo === "mayor" ? "Mayor" : "Menor"}
                      </p>
                      <p className="text-xs lg:text-sm text-gray-500">Tipo</p>
                    </div>
                  </div>

                  {/* Salidas de hoy - Compacto */}
                  {salidasHoy.length > 0 && (
                    <div className="mb-4 pt-4 border-t border-gray-100">
                      <p className="text-xs font-semibold text-gray-700 mb-2">
                        Salidas hoy ({salidasHoy.length})
                      </p>
                      <div className="space-y-2">
                        {salidasHoy.slice(0, 2).map((salida) => (
                          <div
                            key={salida.id}
                            className="bg-gray-50 rounded-lg p-2 border border-gray-200"
                          >
                            <div className="flex items-center justify-between mb-1 gap-2">
                              <span className="text-xs font-medium text-gray-800 truncate flex-1">
                                {salida.destino}
                              </span>
                              <Badge
                                variant="outline"
                                className={`text-xs ${getEstadoColor(
                                  salida.estado
                                )} shrink-0`}
                              >
                                {salida.estado.replace("_", " ")}
                              </Badge>
                            </div>
                            <div className="flex items-center gap-3 text-xs text-gray-600">
                              <div className="flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                <span className="truncate">
                                  {salida.bloque?.hora_inicio} - {salida.bloque?.hora_fin}
                                </span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Users className="w-3 h-3" />
                                <span>{salida.numero_pasajeros}</span>
                              </div>
                            </div>
                          </div>
                        ))}
                        {salidasHoy.length > 2 && (
                          <p className="text-xs text-gray-500 text-center py-1">
                            +{salidasHoy.length - 2} más
                          </p>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Botones de acción */}
                  <div className="flex gap-2 lg:gap-3 pt-4 lg:pt-5 border-t border-gray-100">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1 border-[var(--isla-teal)] text-[var(--isla-teal)] hover:bg-[var(--isla-teal)] hover:text-white text-xs lg:text-sm h-9 lg:h-10"
                      asChild
                    >
                      <Link
                        href={`/prestador/nueva-salida?embarcacion=${encodeURIComponent(
                          embarcacion.id
                        )}`}
                      >
                        <Calendar className="w-3.5 h-3.5 lg:w-4 lg:h-4 mr-1.5" />
                        <span className="hidden lg:inline">Programar</span>
                        <span className="lg:hidden">Prog.</span>
                      </Link>
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="shrink-0 border-gray-300 text-gray-600 hover:bg-gray-50 text-xs lg:text-sm h-9 lg:h-10 px-3 lg:px-4"
                      asChild
                    >
                      <Link
                        href={`/prestador/embarcaciones?edit=${encodeURIComponent(
                          embarcacion.id
                        )}`}
                      >
                        <Settings className="w-3.5 h-3.5 lg:w-4 lg:h-4" />
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
