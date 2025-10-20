"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AlertTriangle, Trash2, X } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { clientLogger } from "@/lib/logger-client";

interface DialogEliminarPermanenteProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  usuario: {
    id: string;
    nombre: string;
    email: string;
    rol: "conanp" | "prestador";
  } | null;
  onConfirm: (usuarioId: string, confirmationText: string) => Promise<void>;
  loading?: boolean;
}

export function DialogEliminarPermanente({
  open,
  onOpenChange,
  usuario,
  onConfirm,
  loading = false,
}: DialogEliminarPermanenteProps) {
  const [confirmationText, setConfirmationText] = useState("");
  const [error, setError] = useState("");

  const requiredText = "ELIMINAR PERMANENTEMENTE";
  const isConfirmationValid = confirmationText.trim() === requiredText;

  const handleConfirm = async () => {
    if (!usuario || !isConfirmationValid) {
      setError("Debes escribir exactamente: ELIMINAR PERMANENTEMENTE");
      return;
    }

    try {
      setError("");
      await onConfirm(usuario.id, confirmationText.trim());
      handleClose();
    } catch (error) {
      clientLogger.error("Error al eliminar el usuario", error);
      setError("Error al eliminar el usuario. Inténtalo de nuevo.");
    }
  };

  const handleClose = () => {
    setConfirmationText("");
    setError("");
    onOpenChange(false);
  };

  if (!usuario) return null;

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="flex-shrink-0 w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
              <Trash2 className="w-5 h-5 text-red-600" />
            </div>
            <div>
              <DialogTitle className="text-lg font-semibold text-gray-900">
                Eliminar Usuario Permanentemente
              </DialogTitle>
              <DialogDescription className="text-sm text-gray-600">
                Esta acción no se puede deshacer
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-4">
          {/* Información del usuario */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="font-medium text-gray-900 mb-2">
              Usuario a eliminar:
            </h4>
            <div className="space-y-1 text-sm">
              <p>
                <span className="font-medium">Nombre:</span> {usuario.nombre}
              </p>
              <p>
                <span className="font-medium">Email:</span> {usuario.email}
              </p>
              <p>
                <span className="font-medium">Rol:</span>{" "}
                {usuario.rol.toUpperCase()}
              </p>
            </div>
          </div>

          {/* Alerta de advertencia */}
          <Alert className="border-red-200 bg-red-50">
            <AlertTriangle className="h-4 w-4 text-red-600" />
            <AlertDescription className="text-red-800">
              <strong>Advertencia:</strong> Esta acción eliminará
              permanentemente el usuario y todos sus datos asociados. No podrás
              recuperar esta información.
            </AlertDescription>
          </Alert>

          {/* Campo de confirmación */}
          <div className="space-y-2">
            <Label htmlFor="confirmation" className="text-sm font-medium">
              Para confirmar, escribe exactamente:
            </Label>
            <div className="bg-yellow-50 border border-yellow-200 rounded-md p-3 mb-2">
              <div className="flex items-center justify-between">
                <code className="text-yellow-800 font-mono text-sm font-bold">
                  {requiredText}
                </code>
                <button
                  type="button"
                  onClick={() => setConfirmationText(requiredText)}
                  className="text-xs text-yellow-600 hover:text-yellow-800 underline"
                >
                  Copiar
                </button>
              </div>
            </div>
            <Input
              id="confirmation"
              type="text"
              placeholder="Escribe aquí para confirmar..."
              value={confirmationText}
              onChange={(e) => {
                setConfirmationText(e.target.value);
                setError("");
              }}
              className={`${
                confirmationText && !isConfirmationValid
                  ? "border-red-300 focus:border-red-500 focus:ring-red-500"
                  : isConfirmationValid
                  ? "border-green-300 focus:border-green-500 focus:ring-green-500"
                  : ""
              }`}
              disabled={loading}
            />
            {confirmationText && !isConfirmationValid && (
              <p className="text-sm text-red-600">
                El texto no coincide exactamente
              </p>
            )}
            {isConfirmationValid && (
              <p className="text-sm text-green-600 font-medium">
                ✓ Confirmación válida
              </p>
            )}
          </div>

          {/* Error message */}
          {error && (
            <Alert className="border-red-200 bg-red-50">
              <AlertTriangle className="h-4 w-4 text-red-600" />
              <AlertDescription className="text-red-800">
                {error}
              </AlertDescription>
            </Alert>
          )}
        </div>

        <DialogFooter className="flex gap-2">
          <Button
            variant="outline"
            onClick={handleClose}
            disabled={loading}
            className="flex-1"
          >
            <X className="w-4 h-4 mr-2" />
            Cancelar
          </Button>
          <Button
            variant="destructive"
            onClick={handleConfirm}
            disabled={!isConfirmationValid || loading}
            className="flex-1"
          >
            {loading ? (
              <>
                <div className="w-4 h-4 mr-2 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Eliminando...
              </>
            ) : (
              <>
                <Trash2 className="w-4 h-4 mr-2" />
                Eliminar Permanentemente
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
