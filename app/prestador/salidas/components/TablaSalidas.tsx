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
  DialogTrigger,
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
import { formatearFechaSalida, extraerFechaYYYYMMDD } from "@/lib/utils";
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
    <div className="grid grid-cols-1 gap-4">
      {salidas.map((salida) => (
        <Card key={salida.id} className="hover:shadow-lg transition-shadow">
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-3">
                  <Badge className={getEstadoColor(salida.estado)}>
                    <span className="flex items-center gap-1">
                      {getEstadoIcon(salida.estado)}
                      {salida.estado}
                    </span>
                  </Badge>
                  <div className="text-sm text-gray-600">
                    ID: {salida.id.slice(-8)}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-gray-500" />
                    <div>
                      <div className="text-sm text-gray-600">Fecha</div>
                      <div className="font-medium">
                        {formatearFechaSalida(salida.fecha)}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Ship className="w-4 h-4 text-gray-500" />
                    <div>
                      <div className="text-sm text-gray-600">Embarcación</div>
                      <div className="font-medium">
                        {salida.embarcacion?.nombre || "Sin embarcación"}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-gray-500" />
                    <div>
                      <div className="text-sm text-gray-600">Pasajeros</div>
                      <div className="font-medium">
                        {salida.numero_pasajeros}
                      </div>
                    </div>
                  </div>
                </div>

                {salida.observaciones && (
                  <div className="mb-4">
                    <div className="text-sm text-gray-600 mb-1">
                      Observaciones
                    </div>
                    <p className="text-sm bg-gray-50 p-2 rounded">
                      {salida.observaciones}
                    </p>
                  </div>
                )}
              </div>

              <div className="flex flex-col gap-2 ml-4">
                {(salida.estado === "programada" ||
                  salida.estado === "en_curso") && (
                  <Dialog
                    open={showUsoDialog && selectedSalida?.id === salida.id}
                    onOpenChange={onCloseUsoDialog}
                  >
                    <DialogTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onOpenUsoDialog(salida)}
                        className="border-[var(--isla-teal)] text-[var(--isla-teal)] hover:bg-[var(--isla-teal)] hover:text-white"
                      >
                        <Ticket className="w-4 h-4 mr-2" />
                        Registrar Brazaletes
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                      <DialogHeader>
                        <DialogTitle>Registrar Uso de Brazaletes</DialogTitle>
                        <DialogDescription>
                          Registra los brazaletes utilizados en esta salida
                        </DialogDescription>
                      </DialogHeader>
                      <UsoBrazaletesForm
                        onSubmit={onRegistrarUso}
                        loading={registrandoUso}
                        error={usoError}
                        salidaId={salida.id}
                        salidaFecha={extraerFechaYYYYMMDD(salida.fecha)}
                        brazaletesDisponibles={
                          brazaletesData?.detalle?.filter(
                            (b) => b.estado === "disponible"
                          ) || []
                        }
                      />
                    </DialogContent>
                  </Dialog>
                )}

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
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
