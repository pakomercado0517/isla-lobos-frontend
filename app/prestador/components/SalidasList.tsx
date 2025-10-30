import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
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
import { formatearFechaRegional } from "@/lib/utils";
import { getEstadoColor, getEstadoIcon } from "./utils";

interface SalidasListProps {
  salidas: Salida[];
}

export function SalidasList({ salidas }: SalidasListProps) {
  return (
    <Card>
      <CardHeader className="p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row justify-between items-start gap-3 sm:gap-4">
          <div className="w-full sm:flex-1">
            <CardTitle className="flex items-center space-x-2 text-base sm:text-lg">
              <Calendar className="w-4 h-4 sm:w-5 sm:h-5 text-[var(--isla-teal)]" />
              <span>Registro de Salidas</span>
            </CardTitle>
            <CardDescription className="mt-1 text-xs sm:text-sm">
              Historial de tus salidas programadas y realizadas
            </CardDescription>
          </div>
          <Button
            className="w-full sm:w-auto bg-[var(--isla-teal)] hover:bg-[var(--isla-teal-dark)] text-white text-sm"
            asChild
            size="sm"
          >
            <Link
              href="/prestador/nueva-salida"
              className="inline-flex items-center justify-center"
            >
              <Plus className="w-4 h-4 mr-2" />
              Nueva Salida
            </Link>
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-4 sm:p-6">
        {salidas.length > 0 ? (
          <div className="space-y-3 sm:space-y-4">
            {salidas.map((salida) => (
              <Card
                key={salida.id}
                className="border-l-4 border-l-[var(--isla-teal)] hover:shadow-md transition-shadow"
              >
                <CardContent className="p-3 sm:p-4 md:p-6">
                  <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start gap-3 sm:gap-4 md:gap-6">
                    <div className="flex-1 space-y-2 sm:space-y-3 md:space-y-4">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-3">
                        <div className="flex items-center space-x-2 text-[var(--isla-dark-teal)] min-w-0">
                          <Calendar className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
                          <span className="font-semibold text-sm sm:text-base md:text-lg truncate">
                            {formatearFechaRegional(
                              typeof salida.fecha === "string"
                                ? salida.fecha
                                : salida.fecha.toISOString().split("T")[0]
                            )}
                          </span>
                        </div>
                        <div className="flex items-center space-x-2 self-start sm:self-center">
                          {getEstadoIcon(salida.estado)}
                          <Badge
                            className={`${getEstadoColor(
                              salida.estado
                            )} px-2 sm:px-3 py-0.5 sm:py-1 text-xs whitespace-nowrap`}
                          >
                            {salida.estado.replace("_", " ")}
                          </Badge>
                        </div>
                      </div>

                      <div className="flex items-center space-x-2 text-gray-600">
                        <Clock className="w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0" />
                        <span className="text-xs sm:text-sm">
                          {salida.bloque?.hora_inicio} - {salida.bloque?.hora_fin}
                        </span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-3 md:gap-4">
                        <div className="flex items-center space-x-2 min-w-0">
                          <Anchor className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[var(--isla-teal)] flex-shrink-0" />
                          <div className="min-w-0 flex-1">
                            <p className="text-xs sm:text-sm text-gray-600">Embarcación</p>
                            <p className="font-medium text-sm sm:text-base truncate">
                              {salida.embarcacion?.nombre || "Sin embarcación"}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Users className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[var(--isla-teal)] flex-shrink-0" />
                          <div>
                            <p className="text-xs sm:text-sm text-gray-600">Pasajeros</p>
                            <p className="font-medium text-sm sm:text-base">
                              {salida.numero_pasajeros}
                              {salida.embarcacion?.capacidad &&
                                ` / ${salida.embarcacion.capacidad}`}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2 min-w-0">
                          <MapPin className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[var(--isla-teal)] flex-shrink-0" />
                          <div className="min-w-0 flex-1">
                            <p className="text-xs sm:text-sm text-gray-600">Destino</p>
                            <p className="font-medium text-sm sm:text-base truncate">{salida.destino}</p>
                          </div>
                        </div>
                      </div>

                      {salida.observaciones && (
                        <div className="bg-gray-50 p-2 sm:p-3 rounded-lg">
                          <p className="text-xs sm:text-sm text-gray-600 mb-1">
                            Observaciones
                          </p>
                          <p className="text-xs sm:text-sm text-gray-800">
                            {salida.observaciones}
                          </p>
                        </div>
                      )}
                    </div>

                    <div className="flex w-full lg:w-auto lg:flex-col gap-2 pt-2 lg:pt-0 border-t lg:border-t-0 border-gray-100">
                      <Button
                        variant="outline"
                        size="sm"
                        asChild
                        className="flex-1 lg:flex-none border-[var(--isla-teal)] text-[var(--isla-teal)] hover:bg-[var(--isla-teal)] hover:text-white transition-colors text-xs sm:text-sm h-8 sm:h-9"
                      >
                        <Link href={`/prestador/salidas/${salida.id}`}>
                          <Eye className="w-3 h-3 sm:w-4 sm:h-4 mr-1.5 sm:mr-2" />
                          <span className="hidden xs:inline">Ver Detalles</span>
                          <span className="xs:hidden">Detalles</span>
                        </Link>
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 sm:py-12 px-4 bg-gray-50 rounded-lg">
            <Calendar className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 text-gray-300 mx-auto mb-3 sm:mb-4" />
            <div className="max-w-sm mx-auto">
              <h3 className="text-base sm:text-lg md:text-xl font-medium text-gray-900 mb-2">
                No tienes salidas registradas
              </h3>
              <p className="text-sm sm:text-base text-gray-500 mb-4 sm:mb-6">
                Comienza registrando tu primera salida al mar
              </p>
              <Button
                asChild
                size="sm"
                className="w-full sm:w-auto bg-[var(--isla-teal)] hover:bg-[var(--isla-teal-dark)] text-white"
              >
                <Link
                  href="/prestador/nueva-salida"
                  className="inline-flex items-center justify-center"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Registrar Primera Salida
                </Link>
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
