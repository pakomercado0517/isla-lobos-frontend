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
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-[var(--isla-dark-teal)]">
          Mis Salidas
        </h2>
        <Button
          size="sm"
          className="bg-[var(--isla-teal)] hover:bg-[var(--isla-teal-dark)] text-white"
          asChild
        >
          <Link href="/prestador/nueva-salida">
            <Plus className="w-4 h-4 mr-2" />
            Nueva Salida
          </Link>
        </Button>
      </div>

      {salidas.length > 0 ? (
        <div className="space-y-4">
          {salidas.map((salida) => (
            <Card key={salida.id}>
              <CardContent className="p-4">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <Calendar className="w-5 h-5 text-[var(--isla-teal)]" />
                      <div>
                        <p className="font-medium">
                          {formatearFechaSalida(salida.fecha)}
                        </p>
                        <p className="text-sm text-gray-600">
                          {salida.bloque?.hora_inicio} -{" "}
                          {salida.bloque?.hora_fin}
                        </p>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
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
                  <div className="flex flex-col items-end space-y-2">
                    <Button
                      variant="outline"
                      size="sm"
                      asChild
                      className="border-[var(--isla-teal)] text-[var(--isla-teal)] hover:bg-[var(--isla-teal)] hover:text-white"
                    >
                      <Link href={`/prestador/salidas/${salida.id}`}>
                        <Eye className="w-4 h-4 mr-2" />
                        Ver Detalles
                      </Link>
                    </Button>
                    <div className="flex items-center space-x-2">
                      {getEstadoIcon(salida.estado)}
                      <Badge
                        className={`${getEstadoColor(
                          salida.estado
                        )} text-xs px-3 py-1 h-8 flex items-center`}
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
              className="bg-[var(--isla-teal)] hover:bg-[var(--isla-teal-dark)] text-white"
            >
              <Link href="/prestador/nueva-salida">
                <Plus className="w-4 h-4 mr-2" />
                Registrar Primera Salida
              </Link>
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
