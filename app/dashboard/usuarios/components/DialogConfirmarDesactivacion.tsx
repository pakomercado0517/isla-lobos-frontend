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
import { clientLogger } from "@/lib/logger-client";
import { AlertTriangle } from "lucide-react";

interface DialogConfirmarDesactivacionProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  usuario: {
    id: string;
    nombre: string;
    email: string;
  } | null;
  onConfirm: (usuarioId: string) => Promise<void>;
  loading?: boolean;
}

export function DialogConfirmarDesactivacion({
  open,
  onOpenChange,
  usuario,
  onConfirm,
  loading = false,
}: DialogConfirmarDesactivacionProps) {
  const handleConfirm = async () => {
    if (!usuario) return;

    try {
      await onConfirm(usuario.id);
      onOpenChange(false);
    } catch (error) {
      clientLogger.error("Error al desactivar usuario", error);
      // El error se maneja en el componente padre
    }
  };

  if (!usuario) return null;

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <div className="flex items-center gap-3">
            <div className="flex-shrink-0 w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 text-orange-600" />
            </div>
            <div>
              <AlertDialogTitle className="text-lg font-semibold text-gray-900">
                Desactivar Usuario
              </AlertDialogTitle>
              <AlertDialogDescription className="text-sm text-gray-600">
                Esta acción desactivará el usuario temporalmente
              </AlertDialogDescription>
            </div>
          </div>
        </AlertDialogHeader>

        <div className="space-y-4">
          {/* Información del usuario */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="font-medium text-gray-900 mb-2">
              Usuario a desactivar:
            </h4>
            <div className="space-y-1 text-sm">
              <p>
                <span className="font-medium">Nombre:</span> {usuario.nombre}
              </p>
              <p>
                <span className="font-medium">Email:</span> {usuario.email}
              </p>
            </div>
          </div>

          {/* Información adicional */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
              <div className="text-sm text-blue-800">
                <p className="font-medium mb-1">¿Qué significa desactivar?</p>
                <ul className="space-y-1 text-xs">
                  <li>• El usuario no podrá iniciar sesión</li>
                  <li>• Sus datos se mantienen en el sistema</li>
                  <li>• Puede ser reactivado en cualquier momento</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <AlertDialogFooter>
          <AlertDialogCancel disabled={loading}>Cancelar</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleConfirm}
            disabled={loading}
            className="bg-orange-600 hover:bg-orange-700 focus:ring-orange-500"
          >
            {loading ? (
              <>
                <div className="w-4 h-4 mr-2 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Desactivando...
              </>
            ) : (
              "Desactivar Usuario"
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
