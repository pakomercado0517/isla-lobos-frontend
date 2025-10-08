"use client";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { AlertTriangle, CheckCircle } from "lucide-react";

interface MensajeEstadoProps {
  error?: string;
  successMessage?: string;
  onVerSalidas?: () => void;
}

export function MensajeEstado({
  error,
  successMessage,
  onVerSalidas,
}: MensajeEstadoProps) {
  if (!error && !successMessage) {
    return null;
  }

  return (
    <div className="space-y-6">
      {/* Error general */}
      {error && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Mensaje de éxito */}
      {successMessage && (
        <div className="space-y-3">
          <Alert className="border-green-200 bg-green-50 text-green-800">
            <CheckCircle className="h-4 w-4" />
            <AlertDescription>{successMessage}</AlertDescription>
          </Alert>
          {onVerSalidas && (
            <div className="flex justify-center">
              <Button
                onClick={onVerSalidas}
                className="bg-[var(--isla-teal)] hover:bg-[var(--isla-teal-dark)] text-white"
              >
                Ver Mis Salidas
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
