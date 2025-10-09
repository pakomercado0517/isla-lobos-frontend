"use client";

import { useState } from "react";
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
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Loader2, XCircle } from "lucide-react";
import type { Salida } from "@/lib/types/salida";

interface DialogCancelarSalidaProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  salida: Salida;
  onConfirmar: (motivo: string) => Promise<void>;
  isLoading: boolean;
}

export function DialogCancelarSalida({
  open,
  onOpenChange,
  onConfirmar,
  isLoading,
}: DialogCancelarSalidaProps) {
  const [motivo, setMotivo] = useState("");
  const [error, setError] = useState("");

  const handleConfirmar = async () => {
    // Validar que haya un motivo
    if (!motivo.trim()) {
      setError("Por favor, indica el motivo de la cancelación");
      return;
    }

    if (motivo.trim().length < 10) {
      setError("El motivo debe tener al menos 10 caracteres");
      return;
    }

    try {
      await onConfirmar(motivo.trim());
      // Limpiar al cerrar
      setMotivo("");
      setError("");
      onOpenChange(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al cancelar");
    }
  };

  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen && !isLoading) {
      // Limpiar al cerrar
      setMotivo("");
      setError("");
    }
    onOpenChange(newOpen);
  };

  return (
    <AlertDialog open={open} onOpenChange={handleOpenChange}>
      <AlertDialogContent className="max-w-lg">
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2">
            <XCircle className="w-5 h-5 text-red-600" />
            ¿Cancelar salida?
          </AlertDialogTitle>
          <AlertDialogDescription className="space-y-4">
            <p>
              Estás por <strong>cancelar</strong> esta salida.
            </p>

            <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-sm text-red-900">
              <strong>Esta acción:</strong>
              <ul className="list-disc list-inside mt-1 space-y-1">
                <li>Cancelará la salida programada</li>
                <li>Liberará la embarcación asignada</li>
                <li>Los brazaletes asignados quedarán disponibles</li>
              </ul>
            </div>

            {/* Campo de motivo */}
            <div className="space-y-2">
              <Label
                htmlFor="motivo"
                className="text-sm font-medium text-gray-900"
              >
                Motivo de cancelación <span className="text-red-500">*</span>
              </Label>
              <Textarea
                id="motivo"
                placeholder="Ej: Mal clima, problema mecánico, solicitud del cliente..."
                value={motivo}
                onChange={(e) => {
                  setMotivo(e.target.value);
                  setError(""); // Limpiar error al escribir
                }}
                disabled={isLoading}
                rows={3}
                className="resize-none"
                maxLength={200}
              />
              <div className="flex justify-between items-center">
                <p className="text-xs text-gray-500">Mínimo 10 caracteres</p>
                <p className="text-xs text-gray-500">{motivo.length}/200</p>
              </div>
              {error && <p className="text-sm text-red-600 mt-1">{error}</p>}
            </div>

            <p className="text-sm text-amber-700">
              <strong>Nota:</strong> Esta acción no se puede deshacer.
            </p>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isLoading}>
            No, conservar
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleConfirmar}
            disabled={isLoading || !motivo.trim()}
            className="bg-red-600 hover:bg-red-700"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Cancelando...
              </>
            ) : (
              "Sí, cancelar salida"
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
