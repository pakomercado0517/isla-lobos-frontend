import { useState, useEffect } from "react";
import { clientLogger } from "@/lib/logger-client";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertTriangle, Loader2 } from "lucide-react";
import type { Salida } from "@/lib/types/salida";
import type { Embarcacion } from "@/lib/types/embarcacion";

interface DialogEditarSalidaProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  salida: Salida;
  embarcaciones: Embarcacion[];
  onConfirmar: (datos: {
    numero_pasajeros: number;
    embarcacion_id: string;
    observaciones: string;
  }) => Promise<void>;
  isLoading: boolean;
}

export function DialogEditarSalida({
  open,
  onOpenChange,
  salida,
  embarcaciones,
  onConfirmar,
  isLoading,
}: DialogEditarSalidaProps) {
  const [numeroPasajeros, setNumeroPasajeros] = useState(
    salida.numero_pasajeros
  );
  const [embarcacionId, setEmbarcacionId] = useState(
    salida.embarcacion?.id || ""
  );
  const [observaciones, setObservaciones] = useState(
    salida.observaciones || ""
  );
  const [error, setError] = useState("");

  // Actualizar valores cuando cambia la salida
  useEffect(() => {
    setNumeroPasajeros(salida.numero_pasajeros);
    setEmbarcacionId(salida.embarcacion?.id || "");
    setObservaciones(salida.observaciones || "");
    setError("");
  }, [salida]);

  const handleConfirmar = async () => {
    try {
      setError("");

      // Validaciones
      if (numeroPasajeros <= 0) {
        setError("El número de pasajeros debe ser mayor a 0");
        return;
      }

      if (!embarcacionId) {
        setError("Debes seleccionar una embarcación");
        return;
      }

      // Verificar capacidad de la embarcación seleccionada
      const embarcacionSeleccionada = embarcaciones.find(
        (e) => e.id === embarcacionId
      );

      if (
        embarcacionSeleccionada &&
        numeroPasajeros > embarcacionSeleccionada.capacidad
      ) {
        setError(
          `La embarcación seleccionada solo tiene capacidad para ${embarcacionSeleccionada.capacidad} pasajeros`
        );
        return;
      }

      await onConfirmar({
        numero_pasajeros: numeroPasajeros,
        embarcacion_id: embarcacionId,
        observaciones: observaciones.trim(),
      });

      onOpenChange(false);
    } catch (error) {
      const errorMsg =
        error instanceof Error ? error.message : "Error desconocido";
      clientLogger.error("Error en dialog de editar salida", error, {
        salidaId: salida.id,
      });
      setError(errorMsg);
    }
  };

  const embarcacionSeleccionada = embarcaciones.find(
    (e) => e.id === embarcacionId
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Editar Salida</DialogTitle>
          <DialogDescription>
            Modifica los detalles de tu salida. Solo puedes editar salidas
            programadas.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Error */}
          {error && (
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Número de pasajeros */}
          <div className="space-y-2">
            <Label htmlFor="numero_pasajeros">Número de Pasajeros</Label>
            <Input
              id="numero_pasajeros"
              type="number"
              min="1"
              value={numeroPasajeros}
              onChange={(e) =>
                setNumeroPasajeros(parseInt(e.target.value) || 0)
              }
              disabled={isLoading}
            />
          </div>

          {/* Embarcación */}
          <div className="space-y-2">
            <Label htmlFor="embarcacion">Embarcación</Label>
            <select
              id="embarcacion"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--isla-teal)]"
              value={embarcacionId}
              onChange={(e) => setEmbarcacionId(e.target.value)}
              disabled={isLoading}
            >
              <option value="">Selecciona una embarcación</option>
              {embarcaciones.map((emb) => (
                <option key={emb.id} value={emb.id}>
                  {emb.nombre} ({emb.capacidad} pasajeros) - {emb.estado}
                </option>
              ))}
            </select>
            {embarcacionSeleccionada && (
              <p className="text-xs text-gray-600">
                Capacidad: {embarcacionSeleccionada.capacidad} pasajeros • Tipo:{" "}
                {embarcacionSeleccionada.tipo} • Estado:{" "}
                {embarcacionSeleccionada.estado}
              </p>
            )}
          </div>

          {/* Observaciones */}
          <div className="space-y-2">
            <Label htmlFor="observaciones">Observaciones (opcional)</Label>
            <Textarea
              id="observaciones"
              placeholder="Agrega notas o comentarios adicionales..."
              value={observaciones}
              onChange={(e) => setObservaciones(e.target.value)}
              disabled={isLoading}
              rows={3}
            />
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isLoading}
          >
            Cancelar
          </Button>
          <Button
            onClick={handleConfirmar}
            disabled={isLoading}
            className="bg-[var(--isla-teal)] hover:bg-[var(--isla-teal-dark)]"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Guardando...
              </>
            ) : (
              "Guardar Cambios"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
