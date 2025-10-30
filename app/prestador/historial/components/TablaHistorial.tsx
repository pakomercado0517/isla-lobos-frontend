"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Calendar,
  Ship,
  Users,
  MapPin,
  Eye,
  Clock,
  CheckCircle,
  XCircle,
  AlertTriangle,
} from "lucide-react";
import Link from "next/link";
import { Salida } from "@/lib/types/salida";
import { formatearFechaRegional } from "@/lib/utils";
// Utilidades para estados
const getEstadoColor = (estado: string): string => {
  switch (estado) {
    case "programada":
      return "bg-blue-100 text-blue-800 border-blue-200";
    case "en_curso":
      return "bg-yellow-100 text-yellow-800 border-yellow-200";
    case "completada":
      return "bg-green-100 text-green-800 border-green-200";
    case "cancelada":
      return "bg-red-100 text-red-800 border-red-200";
    case "cancelada_por_clima":
      return "bg-orange-100 text-orange-800 border-orange-200";
    case "cancelada_capitaria":
      return "bg-purple-100 text-purple-800 border-purple-200";
    default:
      return "bg-gray-100 text-gray-800 border-gray-200";
  }
};

const getEstadoLabel = (estado: string): string => {
  switch (estado) {
    case "programada":
      return "Programada";
    case "en_curso":
      return "En Curso";
    case "completada":
      return "Completada";
    case "cancelada":
      return "Cancelada";
    case "cancelada_por_clima":
      return "Cancelada por Clima";
    case "cancelada_capitaria":
      return "Cancelada por Capitanía";
    default:
      return estado;
  }
};

interface TablaHistorialProps {
  salidas: Salida[];
}

export function TablaHistorial({ salidas }: TablaHistorialProps) {
  return (
    <div className="grid grid-cols-1 gap-4">
      {salidas.map((salida) => (
        <Card key={salida.id} className="hover:shadow-lg transition-shadow">
          <CardContent className="p-4 sm:p-6">
            <div className="space-y-4">
              {/* Header con estado e ID */}
              <div className="flex flex-wrap items-center justify-between gap-2">
                <Badge className={getEstadoColor(salida.estado)}>
                  <span className="flex items-center gap-1">
                    {(() => {
                      switch (salida.estado) {
                        case "programada":
                          return <Clock className="w-4 h-4 text-blue-500" />;
                        case "en_curso":
                          return (
                            <Clock className="w-4 h-4 text-yellow-500" />
                          );
                        case "completada":
                          return (
                            <CheckCircle className="w-4 h-4 text-green-500" />
                          );
                        case "cancelada":
                          return <XCircle className="w-4 h-4 text-red-500" />;
                        case "cancelada_por_clima":
                          return (
                            <AlertTriangle className="w-4 h-4 text-orange-500" />
                          );
                        case "cancelada_capitaria":
                          return (
                            <AlertTriangle className="w-4 h-4 text-purple-500" />
                          );
                        default:
                          return null;
                      }
                    })()}
                    {getEstadoLabel(salida.estado)}
                  </span>
                </Badge>
                <div className="text-xs sm:text-sm text-gray-600">
                  ID: {salida.id.slice(-8)}
                </div>
              </div>

              {/* Información principal en grid responsive */}
              <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
                <div className="flex items-start gap-2">
                  <Calendar className="w-4 h-4 text-gray-500 mt-0.5 flex-shrink-0" />
                  <div className="min-w-0">
                    <div className="text-xs sm:text-sm text-gray-600">Fecha</div>
                    <div className="font-medium text-sm sm:text-base truncate">
                      {formatearFechaRegional(typeof salida.fecha === 'string' ? salida.fecha : salida.fecha.toISOString().split('T')[0])}
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-2">
                  <Ship className="w-4 h-4 text-gray-500 mt-0.5 flex-shrink-0" />
                  <div className="min-w-0">
                    <div className="text-xs sm:text-sm text-gray-600">Embarcación</div>
                    <div className="font-medium text-sm sm:text-base truncate">
                      {salida.embarcacion?.nombre || "Sin embarcación"}
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-2">
                  <Users className="w-4 h-4 text-gray-500 mt-0.5 flex-shrink-0" />
                  <div className="min-w-0">
                    <div className="text-xs sm:text-sm text-gray-600">Pasajeros</div>
                    <div className="font-medium text-sm sm:text-base">
                      {salida.numero_pasajeros}
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-2">
                  <MapPin className="w-4 h-4 text-gray-500 mt-0.5 flex-shrink-0" />
                  <div className="min-w-0">
                    <div className="text-xs sm:text-sm text-gray-600">Destino</div>
                    <div className="font-medium text-sm sm:text-base truncate">
                      {salida.destino || "Sin destino"}
                    </div>
                  </div>
                </div>
              </div>

              {/* Observaciones */}
              {salida.observaciones && (
                <div>
                  <div className="text-xs sm:text-sm text-gray-600 mb-1">
                    Observaciones
                  </div>
                  <p className="text-xs sm:text-sm bg-gray-50 p-2 rounded break-words">
                    {salida.observaciones}
                  </p>
                </div>
              )}

              {/* Bloque horario */}
              {salida.bloque && (
                <div>
                  <div className="text-xs sm:text-sm text-gray-600 mb-1">
                    Bloque Horario
                  </div>
                  <p className="text-xs sm:text-sm bg-blue-50 p-2 rounded">
                    {salida.bloque.nombre} ({salida.bloque.hora_inicio} -{" "}
                    {salida.bloque.hora_fin})
                  </p>
                </div>
              )}

              {/* Botón de acción */}
              <div className="pt-2 border-t border-gray-100">
                <Button
                  variant="outline"
                  size="sm"
                  asChild
                  className="w-full sm:w-auto border-[var(--isla-teal)] text-[var(--isla-teal)] hover:bg-[var(--isla-teal)] hover:text-white"
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
  );
}
