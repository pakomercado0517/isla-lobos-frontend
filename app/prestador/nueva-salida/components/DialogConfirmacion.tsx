"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import {
  Calendar,
  Clock,
  Ship,
  Users,
  MapPin,
  FileText,
  Ticket,
  AlertTriangle,
} from "lucide-react";
import { Embarcacion } from "@/lib/types/embarcacion";
import { DESTINOS } from "@/lib/types/salida";
import { formatearFechaRegional } from "@/lib/utils";
import { BloqueBackend } from "./utils";

interface DialogConfirmacionProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirmar: () => void;
  isLoading: boolean;
  datos: {
    fecha: string;
    destino: string;
    bloque?: BloqueBackend;
    hora?: string;
    embarcacion: Embarcacion;
    numero_pasajeros: number;
    numero_brazaletes: number;
    observaciones?: string;
  };
}

export function DialogConfirmacion({
  open,
  onOpenChange,
  onConfirmar,
  isLoading,
  datos,
}: DialogConfirmacionProps) {
  const esIslaLobos = datos.destino === DESTINOS.ISLA_LOBOS;

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="max-w-[95vw] sm:max-w-2xl mx-4 sm:mx-auto max-h-[90vh] overflow-y-auto">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-lg sm:text-2xl flex flex-col sm:flex-row items-center gap-2 text-center sm:text-left">
            <Ship className="w-6 h-6 text-[var(--isla-teal)]" />
            <span>Confirmar Registro de Salida</span>
          </AlertDialogTitle>
          <AlertDialogDescription className="text-sm sm:text-base text-center sm:text-left mt-2">
            Por favor revisa los detalles de tu salida antes de confirmar el
            registro.
          </AlertDialogDescription>
        </AlertDialogHeader>

        {/* Preview de la información */}
        <div className="space-y-3 sm:space-y-4 py-2 sm:py-4">
          {/* Fecha y Destino */}
          <div className="space-y-3 sm:space-y-0 sm:grid sm:grid-cols-2 sm:gap-4">
            <div className="flex items-start gap-3 p-3 sm:p-4 bg-gray-50 rounded-lg">
              <Calendar className="w-4 sm:w-5 h-4 sm:h-5 text-[var(--isla-teal)] mt-0.5 flex-shrink-0" />
              <div className="min-w-0 flex-1">
                <p className="text-xs sm:text-sm font-medium text-gray-500">
                  Fecha
                </p>
                <p className="text-sm sm:text-base font-semibold text-gray-900 truncate">
                  {formatearFechaRegional(datos.fecha)}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 sm:p-4 bg-gray-50 rounded-lg">
              <MapPin className="w-4 sm:w-5 h-4 sm:h-5 text-[var(--isla-teal)] mt-0.5 flex-shrink-0" />
              <div className="min-w-0 flex-1">
                <p className="text-xs sm:text-sm font-medium text-gray-500">
                  Destino
                </p>
                <p className="text-sm sm:text-base font-semibold text-gray-900 truncate">
                  {datos.destino}
                </p>
              </div>
            </div>
          </div>

          {/* Bloque u Hora */}
          {esIslaLobos && datos.bloque ? (
            <div className="flex items-start gap-3 p-3 sm:p-4 bg-blue-50 rounded-lg border border-blue-200">
              <Clock className="w-4 sm:w-5 h-4 sm:h-5 text-blue-600 mt-0.5 flex-shrink-0" />
              <div className="min-w-0 flex-1">
                <p className="text-xs sm:text-sm font-medium text-blue-700">
                  Bloque Horario
                </p>
                <p className="text-sm sm:text-base font-semibold text-blue-900">
                  {datos.bloque.nombre}
                </p>
                <p className="text-xs sm:text-sm text-blue-600">
                  {datos.bloque.hora_inicio} - {datos.bloque.hora_fin}
                </p>
                <div className="mt-2">
                  <Badge variant="outline" className="text-[10px] sm:text-xs">
                    Capacidad disponible:{" "}
                    {datos.bloque.capacidad_total -
                      datos.bloque.capacidad_registrada}
                    /{datos.bloque.capacidad_total}
                  </Badge>
                </div>
              </div>
            </div>
          ) : (
            datos.hora && (
              <div className="flex items-start gap-3 p-3 sm:p-4 bg-blue-50 rounded-lg border border-blue-200">
                <Clock className="w-4 sm:w-5 h-4 sm:h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                <div className="min-w-0 flex-1">
                  <p className="text-xs sm:text-sm font-medium text-blue-700">
                    Hora de Salida
                  </p>
                  <p className="text-sm sm:text-base font-semibold text-blue-900">
                    {datos.hora}
                  </p>
                </div>
              </div>
            )
          )}

          {/* Embarcación */}
          <div className="flex items-start gap-3 p-3 sm:p-4 bg-gray-50 rounded-lg">
            <Ship className="w-4 sm:w-5 h-4 sm:h-5 text-[var(--isla-teal)] mt-0.5 flex-shrink-0" />
            <div className="min-w-0 flex-1">
              <p className="text-xs sm:text-sm font-medium text-gray-500">
                Embarcación
              </p>
              <p className="text-sm sm:text-base font-semibold text-gray-900 truncate">
                {datos.embarcacion.nombre}
              </p>
              <div className="flex flex-wrap gap-1.5 sm:gap-2 mt-1.5">
                <Badge variant="secondary" className="text-[10px] sm:text-xs">
                  {datos.embarcacion.matricula}
                </Badge>
                <Badge variant="outline" className="text-[10px] sm:text-xs">
                  {datos.embarcacion.tipo}
                </Badge>
                <Badge variant="outline" className="text-[10px] sm:text-xs">
                  Capacidad: {datos.embarcacion.capacidad} pasajeros
                </Badge>
              </div>
            </div>
          </div>

          {/* Pasajeros y Brazaletes */}
          <div className="space-y-3 sm:space-y-0 sm:grid sm:grid-cols-2 sm:gap-4">
            <div className="flex items-start gap-3 p-3 sm:p-4 bg-green-50 rounded-lg border border-green-200">
              <Users className="w-4 sm:w-5 h-4 sm:h-5 text-green-600 mt-0.5 flex-shrink-0" />
              <div className="min-w-0 flex-1">
                <p className="text-xs sm:text-sm font-medium text-green-700">
                  Pasajeros
                </p>
                <p className="text-xl sm:text-2xl font-bold text-green-900">
                  {datos.numero_pasajeros}
                </p>
                <p className="text-[10px] sm:text-xs text-green-600 mt-1">
                  {Math.round(
                    (datos.numero_pasajeros / datos.embarcacion.capacidad) * 100
                  )}
                  % de la capacidad
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 sm:p-4 bg-purple-50 rounded-lg border border-purple-200">
              <Ticket className="w-4 sm:w-5 h-4 sm:h-5 text-purple-600 mt-0.5 flex-shrink-0" />
              <div className="min-w-0 flex-1">
                <p className="text-xs sm:text-sm font-medium text-purple-700">
                  Brazaletes
                </p>
                <p className="text-xl sm:text-2xl font-bold text-purple-900">
                  {datos.numero_brazaletes}
                </p>
                {datos.numero_brazaletes === 0 && (
                  <p className="text-[10px] sm:text-xs text-purple-600 mt-1">
                    Sin brazaletes solicitados
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Observaciones */}
          {datos.observaciones && (
            <div className="flex items-start gap-3 p-3 sm:p-4 bg-gray-50 rounded-lg">
              <FileText className="w-4 sm:w-5 h-4 sm:h-5 text-gray-600 mt-0.5 flex-shrink-0" />
              <div className="min-w-0 flex-1">
                <p className="text-xs sm:text-sm font-medium text-gray-500">
                  Observaciones
                </p>
                <p className="text-xs sm:text-sm text-gray-700 mt-1 break-words">
                  {datos.observaciones}
                </p>
              </div>
            </div>
          )}

          {/* Advertencia de capacidad si está cerca del límite */}
          {datos.numero_pasajeros > datos.embarcacion.capacidad * 0.9 && (
            <div className="flex items-start gap-3 p-3 bg-amber-50 rounded-lg border border-amber-200">
              <AlertTriangle className="w-4 sm:w-5 h-4 sm:h-5 text-amber-600 mt-0.5 flex-shrink-0" />
              <div className="min-w-0 flex-1">
                <p className="text-xs sm:text-sm font-medium text-amber-800">
                  ⚠️ Estás cerca del límite de capacidad
                </p>
                <p className="text-[10px] sm:text-xs text-amber-700">
                  Esta salida utilizará{" "}
                  {Math.round(
                    (datos.numero_pasajeros / datos.embarcacion.capacidad) * 100
                  )}
                  % de la capacidad de la embarcación.
                </p>
              </div>
            </div>
          )}
        </div>

        <AlertDialogFooter className="sm:mt-2 gap-2 sm:gap-0">
          <AlertDialogCancel disabled={isLoading} className="mt-0 sm:mt-0 h-10">
            Cancelar
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirmar}
            disabled={isLoading}
            className="mt-0 sm:mt-0 h-10 bg-[var(--isla-teal)] hover:bg-[var(--isla-teal-dark)] text-white"
          >
            {isLoading ? "Registrando..." : "Confirmar y Registrar"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
