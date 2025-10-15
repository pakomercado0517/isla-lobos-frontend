import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Plus, Eye } from "lucide-react";
import Link from "next/link";
import type { Salida } from "@/lib/types/salida";
import { formatearFechaSalida } from "@/lib/utils";
import { getEstadoColor, getEstadoIcon } from "./utils";

interface SalidasListProps {
  salidas: Salida[];
}

export function SalidasList({ salidas }: SalidasListProps) {
  return (
    <div className="mb-8">
      <div className="flex justify-between items-center mb-6 md:mb-4">
        <h2 className="text-xl md:text-xl font-semibold text-[var(--isla-dark-teal)]">
          Mis Salidas
        </h2>
        <Button
          className="h-11 md:h-9 text-base md:text-sm bg-[var(--isla-teal)] hover:bg-[var(--isla-teal-dark)] text-white"
          asChild
        >
          <Link href="/prestador/nueva-salida">
            <Plus className="w-5 h-5 md:w-4 md:h-4 mr-2" />
            Nueva Salida
          </Link>
        </Button>
      </div>

      {salidas.length > 0 ? (
        <div className="space-y-6 md:space-y-4">
          {salidas.map((salida) => (
            <Card key={salida.id}>
              <CardContent className="p-6 md:p-4">
                <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-3 md:mb-2">
                      <Calendar className="w-6 h-6 md:w-5 md:h-5 text-[var(--isla-teal)]" />
                      <div>
                        <p className="font-medium text-base md:text-sm">
                          {formatearFechaSalida(salida.fecha)}
                        </p>
                        <p className="text-base md:text-sm text-gray-600">
                          {salida.bloque?.hora_inicio} -{" "}
                          {salida.bloque?.hora_fin}
                        </p>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-base md:text-sm">
                      <div>
                        <span className="text-gray-600">Embarcación:</span>
                        <p className="font-medium">
                          {salida.embarcacion?.nombre || "Sin embarcación"}
                        </p>
                      </div>
                      <div>
                        <span className="text-gray-600">Pasajeros:</span>
                        <p className="font-medium">
                          {salida.numero_pasajeros}
                          {salida.embarcacion?.capacidad &&
                            ` / ${salida.embarcacion.capacidad}`}
                        </p>
                      </div>
                      <div>
                        <span className="text-gray-600">Destino:</span>
                        <p className="font-medium">{salida.destino}</p>
                      </div>
                      <div>
                        <span className="text-gray-600">Bloque:</span>
                        <p className="font-medium">
                          {salida.bloque?.nombre || "Sin bloque"}
                        </p>
                      </div>
                    </div>
                    {salida.observaciones && (
                      <div className="mt-2">
                        <span className="text-gray-600 text-sm">
                          Observaciones:
                        </span>
                        <p className="text-sm">{salida.observaciones}</p>
                      </div>
                    )}
                  </div>
                  <div className="flex flex-row md:flex-col items-stretch md:items-end gap-3 md:gap-2 w-full md:w-auto">
                    <Button
                      variant="outline"
                      asChild
                      className="h-11 md:h-9 text-base md:text-sm flex-1 md:flex-initial border-[var(--isla-teal)] text-[var(--isla-teal)] hover:bg-[var(--isla-teal)] hover:text-white"
                    >
                      <Link href={`/prestador/salidas/${salida.id}`}>
                        <Eye className="w-5 h-5 md:w-4 md:h-4 mr-2" />
                        Ver Detalles
                      </Link>
                    </Button>
                    <div className="flex items-center justify-center md:justify-start space-x-2">
                      {getEstadoIcon(salida.estado)}
                      <Badge
                        className={`${getEstadoColor(
                          salida.estado
                        )} text-sm md:text-xs px-3 py-1 h-9 md:h-8 flex items-center`}
                      >
                        {salida.estado.replace("_", " ")}
                      </Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="text-center py-12">
            <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No tienes salidas registradas
            </h3>
            <p className="text-gray-500 mb-4">
              Registra tu primera salida para comenzar
            </p>
            <Button
              asChild
              className="h-11 md:h-10 text-base md:text-sm bg-[var(--isla-teal)] hover:bg-[var(--isla-teal-dark)] text-white"
            >
              <Link href="/prestador/nueva-salida">
                <Plus className="w-5 h-5 md:w-4 md:h-4 mr-2" />
                Registrar Primera Salida
              </Link>
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
