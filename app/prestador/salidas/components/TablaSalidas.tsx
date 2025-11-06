"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Calendar,
  Ship,
  Users,
  Eye,
  Ticket,
  CheckCircle,
  XCircle,
  Clock,
} from "lucide-react";
import Link from "next/link";
import { Salida } from "@/lib/types/salida";
import {
  BrazaletesPrestador,
  UsoBrazaleteFormData,
} from "@/lib/types/brazaletes";
import {
  formatearFechaRegional,
  extraerFechaLocalYYYYMMDD,
  normalizarFechaDelBackend,
} from "@/lib/utils";
import { UsoBrazaletesForm } from "@/components/brazaletes/UsoBrazaletesForm";

interface TablaSalidasProps {
  salidas: Salida[];
  brazaletesData: BrazaletesPrestador | null;
  selectedSalida: Salida | null;
  showUsoDialog: boolean;
  registrandoUso: boolean;
  usoError: string;
  onOpenUsoDialog: (salida: Salida) => void;
  onCloseUsoDialog: () => void;
  onRegistrarUso: (data: UsoBrazaleteFormData) => Promise<void>;
}

export function TablaSalidas({
  salidas,
  brazaletesData,
  selectedSalida,
  showUsoDialog,
  registrandoUso,
  usoError,
  onOpenUsoDialog,
  onCloseUsoDialog,
  onRegistrarUso,
}: TablaSalidasProps) {
  // Utilidades para estados
  const getEstadoColor = (estado: string) => {
    switch (estado) {
      case "activa":
        return "bg-green-100 text-green-800 border-green-200";
      case "completada":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "cancelada":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getEstadoIcon = (estado: string) => {
    switch (estado) {
      case "activa":
        return <CheckCircle className="w-4 h-4" />;
      case "completada":
        return <CheckCircle className="w-4 h-4" />;
      case "cancelada":
        return <XCircle className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  return (
    <>
      <div className="grid grid-cols-1 gap-4">
        {salidas.map((salida) => (
          <Card key={salida.id} className="hover:shadow-lg transition-shadow">
            <CardContent className="p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4 sm:gap-0">
              <div className="flex-1">
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-3 mb-4">
                  <Badge
                    className={`${getEstadoColor(
                      salida.estado
                    )} text-xs sm:text-sm`}
                  >
                    <span className="flex items-center gap-1">
                      {getEstadoIcon(salida.estado)}
                      {salida.estado}
                    </span>
                  </Badge>
                  <div className="text-xs sm:text-sm text-gray-600">
                    ID: {salida.id.slice(-8)}
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4 mb-4">
                  <div className="flex items-start sm:items-center gap-2">
                    <Calendar className="w-4 h-4 text-gray-500 mt-1 sm:mt-0" />
                    <div>
                      <div className="text-xs sm:text-sm text-gray-600">
                        Fecha
                      </div>
                      <div className="text-sm sm:text-base font-medium">
                        {formatearFechaRegional(
                          normalizarFechaDelBackend(salida.fecha)
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start sm:items-center gap-2">
                    <Ship className="w-4 h-4 text-gray-500 mt-1 sm:mt-0" />
                    <div>
                      <div className="text-xs sm:text-sm text-gray-600">
                        Embarcación
                      </div>
                      <div className="text-sm sm:text-base font-medium truncate">
                        {salida.embarcacion?.nombre || "Sin embarcación"}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start sm:items-center gap-2 col-span-2 sm:col-span-1">
                    <Users className="w-4 h-4 text-gray-500 mt-1 sm:mt-0" />
                    <div>
                      <div className="text-xs sm:text-sm text-gray-600">
                        Pasajeros
                      </div>
                      <div className="text-sm sm:text-base font-medium">
                        {salida.numero_pasajeros}
                      </div>
                    </div>
                  </div>
                </div>

                {salida.observaciones && (
                  <div className="mb-4">
                    <div className="text-xs sm:text-sm text-gray-600 mb-1">
                      Observaciones
                    </div>
                    <p className="text-xs sm:text-sm bg-gray-50 p-2 rounded break-words">
                      {salida.observaciones}
                    </p>
                  </div>
                )}
              </div>

              <div className="flex flex-row sm:flex-row justify-end gap-2 sm:ml-4 border-t sm:border-t-0 pt-4 sm:pt-0 mt-4 sm:mt-0">
                {(salida.estado === "programada" ||
                  salida.estado === "en_curso") && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onOpenUsoDialog(salida)}
                    className="flex-1 sm:flex-none sm:w-auto h-9 border-[var(--isla-teal)] text-[var(--isla-teal)] hover:bg-[var(--isla-teal)] hover:text-white text-xs sm:text-sm"
                  >
                    <Ticket className="w-4 h-4 mr-1.5" />
                    <span className="hidden sm:inline">Registrar </span>
                    Brazaletes
                  </Button>
                )}

                <Button
                  variant="outline"
                  size="sm"
                  asChild
                  className="flex-1 sm:flex-none sm:w-auto h-9 border-[var(--isla-teal)] text-[var(--isla-teal)] hover:bg-[var(--isla-teal)] hover:text-white text-xs sm:text-sm"
                >
                  <Link
                    href={`/prestador/salidas/${salida.id}`}
                    className="flex items-center justify-center"
                  >
                    <Eye className="w-4 h-4 mr-1.5" />
                    Ver Detalles
                  </Link>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
      </div>

      {/* Dialog compartido para registrar brazaletes */}
      {selectedSalida && (
        <Dialog open={showUsoDialog} onOpenChange={onCloseUsoDialog}>
          <DialogContent className="max-w-[95vw] sm:max-w-4xl max-h-[90vh] overflow-y-auto mx-4 sm:mx-auto">
            <DialogHeader>
              <DialogTitle className="text-lg sm:text-xl">
                Registrar Uso de Brazaletes
              </DialogTitle>
              <DialogDescription className="text-sm">
                Registra los brazaletes utilizados en esta salida
              </DialogDescription>
            </DialogHeader>
            <UsoBrazaletesForm
              onSubmit={onRegistrarUso}
              loading={registrandoUso}
              error={usoError}
              salidaId={selectedSalida.id}
              salidaFecha={extraerFechaLocalYYYYMMDD(selectedSalida.fecha)}
              brazaletesDisponibles={
                brazaletesData?.detalle?.filter(
                  (b) => b.estado === "disponible"
                ) || []
              }
            />
          </DialogContent>
        </Dialog>
      )}
    </>
  );
}
