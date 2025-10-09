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
import { Loader2 } from "lucide-react";
import type { Salida } from "@/lib/types/salida";

interface DialogIniciarSalidaProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  salida: Salida; // Mantener para consistencia de interfaz
  onConfirmar: () => Promise<void>;
  isLoading: boolean;
}

export function DialogIniciarSalida({
  open,
  onOpenChange,
  onConfirmar,
  isLoading,
}: DialogIniciarSalidaProps) {
  const handleConfirmar = async () => {
    await onConfirmar();
    onOpenChange(false);
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>¿Iniciar salida?</AlertDialogTitle>
          <AlertDialogDescription className="space-y-2">
            <p>
              Estás por marcar esta salida como <strong>en curso</strong>.
            </p>
            <p className="text-sm">
              Esto indica que la salida ya ha comenzado y está en progreso.
            </p>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isLoading}>Cancelar</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleConfirmar}
            disabled={isLoading}
            className="bg-yellow-600 hover:bg-yellow-700"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Iniciando...
              </>
            ) : (
              "Iniciar Salida"
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
