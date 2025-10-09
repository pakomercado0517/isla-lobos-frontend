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
import { Loader2, XCircle } from "lucide-react";
import type { Salida } from "@/lib/types/salida";

interface DialogCancelarSalidaProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  salida: Salida; // Mantener para consistencia de interfaz
  onConfirmar: () => Promise<void>;
  isLoading: boolean;
}

export function DialogCancelarSalida({
  open,
  onOpenChange,
  onConfirmar,
  isLoading,
}: DialogCancelarSalidaProps) {
  const handleConfirmar = async () => {
    await onConfirmar();
    onOpenChange(false);
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2">
            <XCircle className="w-5 h-5 text-red-600" />
            ¿Cancelar salida?
          </AlertDialogTitle>
          <AlertDialogDescription className="space-y-3">
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
            disabled={isLoading}
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
