"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Calendar,
  Plus,
  Eye,
  Clock,
  Users,
  MapPin,
  Anchor,
} from "lucide-react";
import Link from "next/link";
import type { Salida } from "@/lib/types/salida";
import {
  formatearFechaRegional,
  normalizarFechaDelBackend,
} from "@/lib/utils";
import { getEstadoColor, getEstadoIcon } from "./utils";

interface SalidasListProps {
  salidas: Salida[];
}

export function SalidasList({ salidas }: SalidasListProps) {
  return (
    <Card className="border-gray-100 shadow-sm">
      <CardHeader className="pb-4 px-4 sm:px-6 lg:px-8 pt-6 lg:pt-8">
        <div className="flex flex-col sm:flex-row justify-between items-start gap-4 lg:gap-6">
          <div className="flex-1">
            <CardTitle className="text-lg sm:text-xl lg:text-2xl xl:text-3xl font-bold text-gray-900 mb-1 lg:mb-2">
              Registro de Salidas
            </CardTitle>
            <p className="text-sm lg:text-base text-gray-600">
              Historial de tus salidas programadas y realizadas
            </p>
          </div>
          <Button
            className="bg-[var(--isla-teal)] hover:bg-[var(--isla-teal-dark)] text-white text-sm lg:text-base shrink-0 w-full sm:w-auto px-4 lg:px-6 h-9 lg:h-10"
            asChild
            size="sm"
          >
            <Link href="/prestador/nueva-salida" className="inline-flex items-center justify-center">
              <Plus className="w-4 h-4 lg:w-5 lg:h-5 mr-2" />
              Nueva Salida
            </Link>
          </Button>
        </div>
      </CardHeader>
      <CardContent className="px-4 sm:px-6 lg:px-8 pb-6 lg:pb-8">
        {salidas.length > 0 ? (
          <div className="space-y-3 lg:space-y-4">
            {salidas.map((salida) => (
              <Card
                key={salida.id}
                className="border border-gray-200 hover:border-[var(--isla-teal)]/50 hover:shadow-md transition-all duration-300 group"
              >
                <CardContent className="p-4 sm:p-5 lg:p-6">
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 lg:gap-6">
                    {/* Información principal */}
                    <div className="flex-1 min-w-0 space-y-4">
                      {/* Header con fecha y estado */}
                      <div className="flex items-start justify-between gap-3 lg:gap-4">
                        <div className="flex items-center gap-3 min-w-0 flex-1">
                          <div className="p-2 lg:p-2.5 rounded-lg bg-[var(--isla-teal)]/10 group-hover:bg-[var(--isla-teal)]/20 transition-colors shrink-0">
                            <Calendar className="w-5 h-5 lg:w-6 lg:h-6 text-[var(--isla-teal)]" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <h3 className="font-bold text-base sm:text-lg lg:text-xl text-gray-900 mb-1">
                              {formatearFechaRegional(
                                normalizarFechaDelBackend(salida.fecha)
                              )}
                            </h3>
                            <div className="flex items-center gap-2 mt-1">
                              <Clock className="w-4 h-4 lg:w-5 lg:h-5 text-gray-400 shrink-0" />
                              <span className="text-sm lg:text-base text-gray-600">
                                {salida.bloque?.hora_inicio} - {salida.bloque?.hora_fin}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          {getEstadoIcon(salida.estado)}
                          <Badge
                            variant="outline"
                            className={`${getEstadoColor(
                              salida.estado
                            )} text-xs lg:text-sm font-medium`}
                          >
                            {salida.estado.replace("_", " ")}
                          </Badge>
                        </div>
                      </div>

                      {/* Información de la salida - Layout mejorado para desktop */}
                      <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-3 gap-3 lg:gap-4">
                        <div className="flex items-center gap-3 min-w-0">
                          <Anchor className="w-4 h-4 lg:w-5 lg:h-5 text-gray-400 shrink-0" />
                          <div className="min-w-0 flex-1">
                            <p className="text-xs lg:text-sm text-gray-500 mb-0.5 lg:mb-1 font-medium">Embarcación</p>
                            <p className="text-sm lg:text-base font-semibold text-gray-900 truncate">
                              {salida.embarcacion?.nombre || "Sin embarcación"}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <Users className="w-4 h-4 lg:w-5 lg:h-5 text-gray-400 shrink-0" />
                          <div>
                            <p className="text-xs lg:text-sm text-gray-500 mb-0.5 lg:mb-1 font-medium">Pasajeros</p>
                            <p className="text-sm lg:text-base font-semibold text-gray-900">
                              {salida.numero_pasajeros}
                              {salida.embarcacion?.capacidad &&
                                ` / ${salida.embarcacion.capacidad}`}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3 min-w-0">
                          <MapPin className="w-4 h-4 lg:w-5 lg:h-5 text-gray-400 shrink-0" />
                          <div className="min-w-0 flex-1">
                            <p className="text-xs lg:text-sm text-gray-500 mb-0.5 lg:mb-1 font-medium">Destino</p>
                            <p className="text-sm lg:text-base font-semibold text-gray-900 truncate">
                              {salida.destino}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Observaciones si existen */}
                      {salida.observaciones && (
                        <div className="bg-gray-50 rounded-lg lg:rounded-xl p-3 lg:p-4 border border-gray-200">
                          <p className="text-xs lg:text-sm font-semibold text-gray-600 mb-1 lg:mb-2">
                            Observaciones
                          </p>
                          <p className="text-sm lg:text-base text-gray-700">
                            {salida.observaciones}
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Botón de acción - Mejor posicionado en desktop */}
                    <div className="lg:pt-0 pt-2 lg:border-l lg:pl-6 border-t lg:border-t-0 border-gray-100">
                      <Button
                        variant="outline"
                        size="sm"
                        asChild
                        className="w-full lg:w-auto border-[var(--isla-teal)] text-[var(--isla-teal)] hover:bg-[var(--isla-teal)] hover:text-white text-sm lg:text-base h-9 lg:h-10"
                      >
                        <Link href={`/prestador/salidas/${salida.id}`}>
                          <Eye className="w-4 h-4 lg:w-5 lg:h-5 mr-2" />
                          Ver Detalles
                        </Link>
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 lg:py-16 xl:py-20 px-4">
            <Calendar className="w-16 h-16 lg:w-20 lg:h-20 xl:w-24 xl:h-24 text-gray-300 mx-auto mb-4 lg:mb-6" />
            <h3 className="text-lg lg:text-xl xl:text-2xl font-semibold text-gray-900 mb-2 lg:mb-3">
              No tienes salidas registradas
            </h3>
            <p className="text-sm lg:text-base text-gray-600 mb-6 lg:mb-8 max-w-sm lg:max-w-md mx-auto">
              Comienza registrando tu primera salida al mar
            </p>
            <Button
              asChild
              size="sm"
              className="bg-[var(--isla-teal)] hover:bg-[var(--isla-teal-dark)] text-white text-sm lg:text-base h-9 lg:h-10 px-4 lg:px-6"
            >
              <Link
                href="/prestador/nueva-salida"
                className="inline-flex items-center justify-center"
              >
                <Plus className="w-4 h-4 lg:w-5 lg:h-5 mr-2" />
                Registrar Primera Salida
              </Link>
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
