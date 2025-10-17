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
      <AlertDialogContent className="max-w-2xl">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-2xl flex items-center gap-2">
            <Ship className="w-6 h-6 text-[var(--isla-teal)]" />
            Confirmar Registro de Salida
          </AlertDialogTitle>
          <AlertDialogDescription>
            Por favor revisa los detalles de tu salida antes de confirmar el
            registro.
          </AlertDialogDescription>
        </AlertDialogHeader>

        {/* Preview de la información */}
        <div className="space-y-4 py-4">
          {/* Fecha y Destino */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
              <Calendar className="w-5 h-5 text-[var(--isla-teal)] mt-0.5" />
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-500">Fecha</p>
                <p className="text-base font-semibold text-gray-900">
                  {formatearFechaRegional(datos.fecha)}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
              <MapPin className="w-5 h-5 text-[var(--isla-teal)] mt-0.5" />
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-500">Destino</p>
                <p className="text-base font-semibold text-gray-900">
                  {datos.destino}
                </p>
              </div>
            </div>
          </div>

          {/* Bloque u Hora */}
          {esIslaLobos && datos.bloque ? (
            <div className="flex items-start gap-3 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <Clock className="w-5 h-5 text-blue-600 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm font-medium text-blue-700">
                  Bloque Horario
                </p>
                <p className="text-base font-semibold text-blue-900">
                  {datos.bloque.nombre}
                </p>
                <p className="text-sm text-blue-600">
                  {datos.bloque.hora_inicio} - {datos.bloque.hora_fin}
                </p>
                <div className="mt-2">
                  <Badge variant="outline" className="text-xs">
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
              <div className="flex items-start gap-3 p-4 bg-blue-50 rounded-lg border border-blue-200">
                <Clock className="w-5 h-5 text-blue-600 mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-blue-700">
                    Hora de Salida
                  </p>
                  <p className="text-base font-semibold text-blue-900">
                    {datos.hora}
                  </p>
                </div>
              </div>
            )
          )}

          {/* Embarcación */}
          <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
            <Ship className="w-5 h-5 text-[var(--isla-teal)] mt-0.5" />
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-500">Embarcación</p>
              <p className="text-base font-semibold text-gray-900">
                {datos.embarcacion.nombre}
              </p>
              <div className="flex gap-2 mt-1">
                <Badge variant="secondary" className="text-xs">
                  {datos.embarcacion.matricula}
                </Badge>
                <Badge variant="outline" className="text-xs">
                  {datos.embarcacion.tipo}
                </Badge>
                <Badge variant="outline" className="text-xs">
                  Capacidad: {datos.embarcacion.capacidad} pasajeros
                </Badge>
              </div>
            </div>
          </div>

          {/* Pasajeros y Brazaletes */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-start gap-3 p-4 bg-green-50 rounded-lg border border-green-200">
              <Users className="w-5 h-5 text-green-600 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm font-medium text-green-700">Pasajeros</p>
                <p className="text-2xl font-bold text-green-900">
                  {datos.numero_pasajeros}
                </p>
                <p className="text-xs text-green-600 mt-1">
                  {Math.round(
                    (datos.numero_pasajeros / datos.embarcacion.capacidad) * 100
                  )}
                  % de la capacidad
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-4 bg-purple-50 rounded-lg border border-purple-200">
              <Ticket className="w-5 h-5 text-purple-600 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm font-medium text-purple-700">
                  Brazaletes
                </p>
                <p className="text-2xl font-bold text-purple-900">
                  {datos.numero_brazaletes}
                </p>
                {datos.numero_brazaletes === 0 && (
                  <p className="text-xs text-purple-600 mt-1">
                    Sin brazaletes solicitados
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Observaciones */}
          {datos.observaciones && (
            <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
              <FileText className="w-5 h-5 text-gray-600 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-500">
                  Observaciones
                </p>
                <p className="text-sm text-gray-700 mt-1">
                  {datos.observaciones}
                </p>
              </div>
            </div>
          )}

          {/* Advertencia de capacidad si está cerca del límite */}
          {datos.numero_pasajeros > datos.embarcacion.capacidad * 0.9 && (
            <div className="flex items-start gap-3 p-3 bg-amber-50 rounded-lg border border-amber-200">
              <AlertTriangle className="w-5 h-5 text-amber-600 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm font-medium text-amber-800">
                  ⚠️ Estás cerca del límite de capacidad
                </p>
                <p className="text-xs text-amber-700">
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

        <AlertDialogFooter>
          <AlertDialogCancel disabled={isLoading}>Cancelar</AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirmar}
            disabled={isLoading}
            className="bg-[var(--isla-teal)] hover:bg-[var(--isla-teal-dark)] text-white"
          >
            {isLoading ? "Registrando..." : "Confirmar y Registrar"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
