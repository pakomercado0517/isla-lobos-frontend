"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { CheckCircle2 } from "lucide-react";

interface DialogExitoProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mensaje: string;
  onVerSalidas: () => void;
}

export function DialogExito({
  open,
  onOpenChange,
  mensaje,
  onVerSalidas,
}: DialogExitoProps) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="max-w-md">
        <AlertDialogHeader>
          <div className="flex justify-center mb-4">
            <div className="rounded-full bg-green-100 p-3">
              <CheckCircle2 className="w-12 h-12 text-green-600" />
            </div>
          </div>
          <AlertDialogTitle className="text-center text-2xl">
            ¡Salida Registrada!
          </AlertDialogTitle>
          <AlertDialogDescription className="text-center text-base pt-2">
            {mensaje}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="sm:justify-center gap-2">
          <AlertDialogAction
            onClick={onVerSalidas}
            className="bg-[var(--isla-teal)] hover:bg-[var(--isla-teal-dark)] text-white w-full sm:w-auto"
          >
            Ver Mis Salidas
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
