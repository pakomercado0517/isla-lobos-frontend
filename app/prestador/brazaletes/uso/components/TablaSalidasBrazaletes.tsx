"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Calendar,
  Ship,
  Users,
  Eye,
  Package,
  MapPin,
  Clock,
} from "lucide-react";
import Link from "next/link";
import type { Salida } from "@/lib/types/salida";
import type { BrazaletesUtilizadosSalida } from "@/lib/types/brazaletes";
import {
  formatearFechaRegional,
  normalizarFechaDelBackend,
} from "@/lib/utils";

interface TablaSalidasBrazaletesProps {
  salidasConBrazaletes: Array<{
    salida: Salida;
    brazaletes: BrazaletesUtilizadosSalida | null;
  }>;
}

export function TablaSalidasBrazaletes({
  salidasConBrazaletes,
}: TablaSalidasBrazaletesProps) {
  if (salidasConBrazaletes.length === 0) {
    return (
      <Card>
        <CardContent className="py-8 md:py-12">
          <div className="text-center">
            <Package className="w-10 h-10 md:w-12 md:h-12 text-gray-400 mx-auto mb-3 md:mb-4" />
            <h3 className="text-base md:text-lg font-medium text-gray-900 mb-2">
              No hay registros de brazaletes utilizados
            </h3>
            <p className="text-xs md:text-sm text-gray-600 max-w-sm mx-auto px-4">
              Las salidas completadas con brazaletes asignados aparecerán aquí
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-3 md:gap-4">
      {salidasConBrazaletes.map((item) => {
        const { salida, brazaletes } = item;
        const fechaNormalizada = normalizarFechaDelBackend(salida.fecha);
        const fechaFormateada = formatearFechaRegional(fechaNormalizada);
        const totalBrazaletes =
          brazaletes?.estadisticas.total_brazaletes || 0;
        const estadisticasNacionalidad =
          brazaletes?.estadisticas.por_nacionalidad;

        return (
          <Card
            key={salida.id}
            className="hover:shadow-md transition-shadow"
          >
            <CardContent className="p-4 sm:p-6">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
                <div className="flex-1 space-y-3 md:space-y-4">
                  {/* Header */}
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
                    <Badge
                      variant="outline"
                      className="w-fit bg-green-50 text-green-700 border-green-200 text-xs sm:text-sm"
                    >
                      {salida.estado}
                    </Badge>
                    <div className="text-xs sm:text-sm text-gray-600">
                      ID: {salida.id.slice(-8)}
                    </div>
                  </div>

                  {/* Información principal */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
                    <div className="flex items-start sm:items-center gap-2">
                      <Calendar className="w-4 h-4 text-gray-500 mt-1 sm:mt-0 flex-shrink-0" />
                      <div className="min-w-0">
                        <div className="text-xs sm:text-sm text-gray-600">
                          Fecha
                        </div>
                        <div className="text-sm sm:text-base font-medium break-words">
                          {fechaFormateada}
                        </div>
                      </div>
                    </div>

                    {salida.destino && (
                      <div className="flex items-start sm:items-center gap-2">
                        <MapPin className="w-4 h-4 text-gray-500 mt-1 sm:mt-0 flex-shrink-0" />
                        <div className="min-w-0">
                          <div className="text-xs sm:text-sm text-gray-600">
                            Destino
                          </div>
                          <div className="text-sm sm:text-base font-medium truncate">
                            {salida.destino}
                          </div>
                        </div>
                      </div>
                    )}

                    {salida.embarcacion && (
                      <div className="flex items-start sm:items-center gap-2">
                        <Ship className="w-4 h-4 text-gray-500 mt-1 sm:mt-0 flex-shrink-0" />
                        <div className="min-w-0">
                          <div className="text-xs sm:text-sm text-gray-600">
                            Embarcación
                          </div>
                          <div className="text-sm sm:text-base font-medium truncate">
                            {salida.embarcacion.nombre}
                          </div>
                        </div>
                      </div>
                    )}

                    <div className="flex items-start sm:items-center gap-2">
                      <Users className="w-4 h-4 text-gray-500 mt-1 sm:mt-0 flex-shrink-0" />
                      <div className="min-w-0">
                        <div className="text-xs sm:text-sm text-gray-600">
                          Pasajeros
                        </div>
                        <div className="text-sm sm:text-base font-medium">
                          {salida.numero_pasajeros}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Información de brazaletes */}
                  {brazaletes && totalBrazaletes > 0 && (
                    <div className="pt-3 md:pt-4 border-t space-y-2 md:space-y-3">
                      <div className="flex items-center gap-2">
                        <Package className="w-4 h-4 text-[var(--isla-teal)]" />
                        <span className="text-sm sm:text-base font-semibold text-gray-900">
                          Brazaletes Utilizados: {totalBrazaletes}
                        </span>
                      </div>

                      {estadisticasNacionalidad && (
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 md:gap-3 pl-6">
                          {estadisticasNacionalidad.locales > 0 && (
                            <div className="text-xs sm:text-sm">
                              <span className="text-gray-600">Locales: </span>
                              <span className="font-medium text-purple-600">
                                {estadisticasNacionalidad.locales}
                              </span>
                            </div>
                          )}
                          {estadisticasNacionalidad.nacionales > 0 && (
                            <div className="text-xs sm:text-sm">
                              <span className="text-gray-600">Nacionales: </span>
                              <span className="font-medium text-orange-600">
                                {estadisticasNacionalidad.nacionales}
                              </span>
                            </div>
                          )}
                          {estadisticasNacionalidad.internacionales > 0 && (
                            <div className="text-xs sm:text-sm">
                              <span className="text-gray-600">
                                Internacionales:{" "}
                              </span>
                              <span className="font-medium text-teal-600">
                                {estadisticasNacionalidad.internacionales}
                              </span>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  )}

                  {(!brazaletes || totalBrazaletes === 0) && (
                    <div className="pt-3 md:pt-4 border-t">
                      <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-500">
                        <Clock className="w-4 h-4" />
                        <span>Sin brazaletes registrados</span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Acciones */}
                <div className="flex flex-row sm:flex-col gap-2 sm:ml-4 border-t sm:border-t-0 pt-4 sm:pt-0 mt-4 sm:mt-0">
                  <Button
                    variant="outline"
                    size="sm"
                    asChild
                    className="flex-1 sm:flex-none sm:w-full h-9 border-[var(--isla-teal)] text-[var(--isla-teal)] hover:bg-[var(--isla-teal)] hover:text-white text-xs sm:text-sm"
                  >
                    <Link
                      href={`/prestador/salidas/${salida.id}`}
                      className="flex items-center justify-center"
                    >
                      <Eye className="w-4 h-4 mr-1.5" />
                      <span className="hidden sm:inline">Ver Detalles</span>
                      <span className="sm:hidden">Detalles</span>
                    </Link>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
