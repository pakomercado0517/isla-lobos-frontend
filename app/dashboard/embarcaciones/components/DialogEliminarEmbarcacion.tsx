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

interface DialogEliminarEmbarcacionProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  embarcacionNombre: string;
  onConfirm: () => Promise<void>;
  loading?: boolean;
}

export function DialogEliminarEmbarcacion({
  open,
  onOpenChange,
  embarcacionNombre,
  onConfirm,
  loading = false,
}: DialogEliminarEmbarcacionProps) {
  const handleConfirm = async () => {
    await onConfirm();
    onOpenChange(false);
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="max-w-md">
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2 text-base md:text-lg">
            <span className="text-red-600 text-xl md:text-2xl flex-shrink-0">
              ⚠️
            </span>
            <span className="break-words">Confirmar Eliminación</span>
          </AlertDialogTitle>
          <AlertDialogDescription className="text-xs md:text-sm break-words">
            ¿Estás seguro de que quieres eliminar la embarcación{" "}
            <strong>{embarcacionNombre}</strong>? Esta acción no se puede
            deshacer.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="flex-col gap-2 md:flex-row">
          <AlertDialogCancel
            onClick={() => onOpenChange(false)}
            disabled={loading}
            className="w-full md:w-auto h-9 md:h-10 text-xs md:text-sm"
          >
            Cancelar
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleConfirm}
            disabled={loading}
            className="w-full md:w-auto h-9 md:h-10 text-xs md:text-sm bg-red-600 hover:bg-red-700 text-white"
          >
            {loading ? (
              <>
                <div className="w-3 h-3 md:w-4 md:h-4 mr-2 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Eliminando...
              </>
            ) : (
              "Eliminar"
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

