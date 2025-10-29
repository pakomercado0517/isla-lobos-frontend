"use client";

import { useEffect, useState } from "react";
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

  // Limpieza de estilos del body al cerrar el diálogo
  useEffect(() => {
    if (!open) {
      const timeoutId = setTimeout(() => {
        document.body.style.overflow = "";
        document.body.style.pointerEvents = "";
        document.body.style.paddingRight = "";
      }, 200);
      return () => clearTimeout(timeoutId);
    }
  }, [open]);

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
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-2 md:gap-3">
            <div className="flex-shrink-0 w-8 h-8 md:w-10 md:h-10 bg-red-100 rounded-full flex items-center justify-center">
              <Trash2 className="w-4 h-4 md:w-5 md:h-5 text-red-600" />
            </div>
            <div className="min-w-0">
              <DialogTitle className="text-base md:text-lg font-semibold text-gray-900 break-words">
                Eliminar Usuario Permanentemente
              </DialogTitle>
              <DialogDescription className="text-xs md:text-sm text-gray-600">
                Esta acción no se puede deshacer
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-3 md:space-y-4">
          {/* Información del usuario */}
          <div className="bg-gray-50 rounded-lg p-3 md:p-4">
            <h4 className="font-medium text-gray-900 mb-2 text-xs md:text-sm">
              Usuario a eliminar:
            </h4>
            <div className="space-y-1 text-xs md:text-sm break-words">
              <p>
                <span className="font-medium">Nombre:</span> {usuario.nombre}
              </p>
              <p className="break-all">
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
            <AlertTriangle className="h-3 w-3 md:h-4 md:w-4 text-red-600 flex-shrink-0" />
            <AlertDescription className="text-red-800 text-[10px] md:text-xs break-words">
              <strong>Advertencia:</strong> Esta acción eliminará
              permanentemente el usuario y todos sus datos asociados. No podrás
              recuperar esta información.
            </AlertDescription>
          </Alert>

          {/* Campo de confirmación */}
          <div className="space-y-2">
            <Label
              htmlFor="confirmation"
              className="text-xs md:text-sm font-medium"
            >
              Para confirmar, escribe exactamente:
            </Label>
            <div className="bg-yellow-50 border border-yellow-200 rounded-md p-2 md:p-3 mb-2">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                <code className="text-yellow-800 font-mono text-[10px] md:text-xs font-bold break-all">
                  {requiredText}
                </code>
                <button
                  type="button"
                  onClick={() => setConfirmationText(requiredText)}
                  className="text-[10px] md:text-xs text-yellow-600 hover:text-yellow-800 underline flex-shrink-0"
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
              className={`h-9 md:h-10 text-xs md:text-sm ${
                confirmationText && !isConfirmationValid
                  ? "border-red-300 focus:border-red-500 focus:ring-red-500"
                  : isConfirmationValid
                  ? "border-green-300 focus:border-green-500 focus:ring-green-500"
                  : ""
              }`}
              disabled={loading}
            />
            {confirmationText && !isConfirmationValid && (
              <p className="text-[10px] md:text-xs text-red-600">
                El texto no coincide exactamente
              </p>
            )}
            {isConfirmationValid && (
              <p className="text-[10px] md:text-xs text-green-600 font-medium">
                ✓ Confirmación válida
              </p>
            )}
          </div>

          {/* Error message */}
          {error && (
            <Alert className="border-red-200 bg-red-50">
              <AlertTriangle className="h-3 w-3 md:h-4 md:w-4 text-red-600 flex-shrink-0" />
              <AlertDescription className="text-red-800 text-[10px] md:text-xs break-words">
                {error}
              </AlertDescription>
            </Alert>
          )}
        </div>

        <DialogFooter className="flex-col gap-2 md:flex-row md:gap-2">
          <Button
            variant="outline"
            onClick={handleClose}
            disabled={loading}
            className="w-full md:flex-1 h-9 md:h-10 text-xs md:text-sm"
          >
            <X className="w-3 h-3 md:w-4 md:h-4 mr-2" />
            Cancelar
          </Button>
          <Button
            variant="destructive"
            onClick={handleConfirm}
            disabled={!isConfirmationValid || loading}
            className="w-full md:flex-1 h-9 md:h-10 text-xs md:text-sm"
          >
            {loading ? (
              <>
                <div className="w-3 h-3 md:w-4 md:h-4 mr-2 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span className="truncate">Eliminando...</span>
              </>
            ) : (
              <>
                <Trash2 className="w-3 h-3 md:w-4 md:h-4 mr-2 flex-shrink-0" />
                <span className="hidden sm:inline">
                  Eliminar Permanentemente
                </span>
                <span className="sm:hidden">Eliminar</span>
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
