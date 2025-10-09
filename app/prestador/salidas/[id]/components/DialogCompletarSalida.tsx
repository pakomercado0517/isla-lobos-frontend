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
import { Loader2, CheckCircle } from "lucide-react";
import type { Salida } from "@/lib/types/salida";

interface DialogCompletarSalidaProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  salida: Salida; // Mantener para consistencia de interfaz
  onConfirmar: () => Promise<void>;
  isLoading: boolean;
}

export function DialogCompletarSalida({
  open,
  onOpenChange,
  onConfirmar,
  isLoading,
}: DialogCompletarSalidaProps) {
  const handleConfirmar = async () => {
    await onConfirmar();
    onOpenChange(false);
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-green-600" />
            ¿Marcar como completada?
          </AlertDialogTitle>
          <AlertDialogDescription className="space-y-3">
            <p>
              Estás por marcar este servicio como <strong>completado</strong>.
            </p>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-sm text-blue-900">
              <strong>Esta acción actualizará:</strong>
              <ul className="list-disc list-inside mt-1 space-y-1">
                <li>El estado de la salida a &quot;completada&quot;</li>
                <li>Los brazaletes asociados como &quot;utilizados&quot;</li>
                <li>La embarcación quedará disponible</li>
              </ul>
            </div>
            <p className="text-sm text-amber-700">
              Una vez completada, no podrás modificar esta salida.
            </p>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isLoading}>Cancelar</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleConfirmar}
            disabled={isLoading}
            className="bg-green-600 hover:bg-green-700"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Completando...
              </>
            ) : (
              "Marcar como Completada"
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
