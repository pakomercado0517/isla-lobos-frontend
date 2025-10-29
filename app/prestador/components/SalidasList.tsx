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
      <CardHeader>
        <div className="flex flex-col sm:flex-row justify-between items-center sm:items-start gap-4 sm:gap-0">
          <div className="text-center sm:text-left">
            <CardTitle className="flex flex-col sm:flex-row items-center sm:space-x-2 gap-2 sm:gap-0">
              <Calendar className="w-5 h-5 text-[var(--isla-teal)]" />
              <span>Registro de Salidas</span>
            </CardTitle>
            <CardDescription className="mt-2">
              Historial completo de tus salidas programadas y realizadas
            </CardDescription>
          </div>
          <Button
            className="w-full sm:w-auto bg-[var(--isla-teal)] hover:bg-[var(--isla-teal-dark)] text-white"
            asChild
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
      <CardContent>
        {salidas.length > 0 ? (
          <div className="space-y-4">
            {salidas.map((salida) => (
              <Card
                key={salida.id}
                className="border-l-4 border-l-[var(--isla-teal)] hover:shadow-md transition-shadow"
              >
                <CardContent className="p-6">
                  <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start gap-6">
                    <div className="flex-1 space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="flex items-center space-x-2 text-[var(--isla-dark-teal)]">
                            <Calendar className="w-5 h-5" />
                            <span className="font-semibold text-lg">
                              {formatearFechaRegional(
                                typeof salida.fecha === "string"
                                  ? salida.fecha
                                  : salida.fecha.toISOString().split("T")[0]
                              )}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          {getEstadoIcon(salida.estado)}
                          <Badge
                            className={`${getEstadoColor(
                              salida.estado
                            )} px-3 py-1`}
                          >
                            {salida.estado.replace("_", " ")}
                          </Badge>
                        </div>
                      </div>

                      <div className="flex items-center space-x-2 text-gray-600">
                        <Clock className="w-4 h-4" />
                        <span className="text-sm">
                          {salida.bloque?.hora_inicio} -{" "}
                          {salida.bloque?.hora_fin}
                        </span>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="flex items-center space-x-2">
                          <Anchor className="w-4 h-4 text-[var(--isla-teal)]" />
                          <div>
                            <p className="text-sm text-gray-600">Embarcación</p>
                            <p className="font-medium">
                              {salida.embarcacion?.nombre || "Sin embarcación"}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Users className="w-4 h-4 text-[var(--isla-teal)]" />
                          <div>
                            <p className="text-sm text-gray-600">Pasajeros</p>
                            <p className="font-medium">
                              {salida.numero_pasajeros}
                              {salida.embarcacion?.capacidad &&
                                ` / ${salida.embarcacion.capacidad}`}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <MapPin className="w-4 h-4 text-[var(--isla-teal)]" />
                          <div>
                            <p className="text-sm text-gray-600">Destino</p>
                            <p className="font-medium">{salida.destino}</p>
                          </div>
                        </div>
                      </div>

                      {salida.observaciones && (
                        <div className="bg-gray-50 p-3 rounded-lg">
                          <p className="text-sm text-gray-600 mb-1">
                            Observaciones
                          </p>
                          <p className="text-sm text-gray-800">
                            {salida.observaciones}
                          </p>
                        </div>
                      )}
                    </div>

                    <div className="flex lg:flex-col gap-2">
                      <Button
                        variant="outline"
                        asChild
                        className="border-[var(--isla-teal)] text-[var(--isla-teal)] hover:bg-[var(--isla-teal)] hover:text-white transition-colors"
                      >
                        <Link href={`/prestador/salidas/${salida.id}`}>
                          <Eye className="w-4 h-4 mr-2" />
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
          <div className="text-center py-8 sm:py-12 px-4 sm:px-6 bg-gray-50 rounded-lg">
            <Calendar className="w-12 h-12 sm:w-16 sm:h-16 text-gray-300 mx-auto mb-4" />
            <div className="max-w-sm mx-auto">
              <h3 className="text-lg sm:text-xl font-medium text-gray-900 mb-2">
                No tienes salidas registradas
              </h3>
              <p className="text-sm sm:text-base text-gray-500 mb-6">
                Comienza registrando tu primera salida al mar
              </p>
              <Button
                asChild
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
