"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";

interface DialogRechazarEmbarcacionProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: (motivo: string) => Promise<void>;
  embarcacionNombre: string;
  loading?: boolean;
}

export function DialogRechazarEmbarcacion({
  open,
  onOpenChange,
  onConfirm,
  embarcacionNombre,
  loading = false,
}: DialogRechazarEmbarcacionProps) {
  const [motivo, setMotivo] = useState("");

  const handleConfirm = async () => {
    if (!motivo.trim()) {
      return;
    }
    await onConfirm(motivo.trim());
    setMotivo("");
  };

  const handleCancel = () => {
    setMotivo("");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Rechazar Embarcación</DialogTitle>
          <DialogDescription>
            ¿Estás seguro de que deseas rechazar la embarcación{" "}
            <strong>{embarcacionNombre}</strong>? Esta acción cambiará el
            estado a rechazada.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="motivo">Motivo del rechazo *</Label>
            <Textarea
              id="motivo"
              placeholder="Ingresa el motivo del rechazo (obligatorio)"
              value={motivo}
              onChange={(e) => setMotivo(e.target.value)}
              rows={4}
              className="resize-none"
            />
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={handleCancel}
            disabled={loading}
          >
            Cancelar
          </Button>
          <Button
            variant="destructive"
            onClick={handleConfirm}
            disabled={loading || !motivo.trim()}
          >
            {loading ? "Rechazando..." : "Rechazar Embarcación"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

