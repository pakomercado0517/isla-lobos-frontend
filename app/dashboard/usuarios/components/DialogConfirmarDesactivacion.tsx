"use client";

import { useEffect } from "react";
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
      <AlertDialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <AlertDialogHeader>
          <div className="flex items-center gap-2 md:gap-3">
            <div className="flex-shrink-0 w-8 h-8 md:w-10 md:h-10 bg-orange-100 rounded-full flex items-center justify-center">
              <AlertTriangle className="w-4 h-4 md:w-5 md:h-5 text-orange-600" />
            </div>
            <div className="min-w-0">
              <AlertDialogTitle className="text-base md:text-lg font-semibold text-gray-900 break-words">
                Desactivar Usuario
              </AlertDialogTitle>
              <AlertDialogDescription className="text-xs md:text-sm text-gray-600">
                Esta acción desactivará el usuario temporalmente
              </AlertDialogDescription>
            </div>
          </div>
        </AlertDialogHeader>

        <div className="space-y-3 md:space-y-4">
          {/* Información del usuario */}
          <div className="bg-gray-50 rounded-lg p-3 md:p-4">
            <h4 className="font-medium text-gray-900 mb-2 text-xs md:text-sm">
              Usuario a desactivar:
            </h4>
            <div className="space-y-1 text-xs md:text-sm break-words">
              <p>
                <span className="font-medium">Nombre:</span> {usuario.nombre}
              </p>
              <p className="break-all">
                <span className="font-medium">Email:</span> {usuario.email}
              </p>
            </div>
          </div>

          {/* Información adicional */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 md:p-4">
            <div className="flex items-start gap-2 md:gap-3">
              <AlertTriangle className="w-4 h-4 md:w-5 md:h-5 text-blue-600 mt-0.5 flex-shrink-0" />
              <div className="text-xs md:text-sm text-blue-800 min-w-0">
                <p className="font-medium mb-1">¿Qué significa desactivar?</p>
                <ul className="space-y-1 text-[10px] md:text-xs">
                  <li>• El usuario no podrá iniciar sesión</li>
                  <li>• Sus datos se mantienen en el sistema</li>
                  <li>• Puede ser reactivado en cualquier momento</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <AlertDialogFooter className="flex-col gap-2 md:flex-row">
          <AlertDialogCancel
            disabled={loading}
            className="w-full md:w-auto h-9 md:h-10 text-xs md:text-sm"
          >
            Cancelar
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleConfirm}
            disabled={loading}
            className="w-full md:w-auto h-9 md:h-10 text-xs md:text-sm bg-orange-600 hover:bg-orange-700 focus:ring-orange-500"
          >
            {loading ? (
              <>
                <div className="w-3 h-3 md:w-4 md:h-4 mr-2 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span className="truncate">Desactivando...</span>
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
