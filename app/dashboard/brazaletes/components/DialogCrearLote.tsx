import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { LoteForm } from "@/components/brazaletes/LoteForm";
import type { CreateLoteFormData } from "@/lib/types/brazaletes";

interface DialogCrearLoteProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: CreateLoteFormData) => Promise<void>;
  loading: boolean;
  error: string;
}

export function DialogCrearLote({
  open,
  onOpenChange,
  onSubmit,
  loading,
  error,
}: DialogCrearLoteProps) {
  return (
    <Dialog
      open={open}
      onOpenChange={(open) => {
        console.log("🎫 Dialog onOpenChange:", open);
        onOpenChange(open);
      }}
    >
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Crear Nuevo Lote de Brazaletes</DialogTitle>
          <DialogDescription>
            Complete la información para crear un nuevo lote de brazaletes
          </DialogDescription>
        </DialogHeader>
        <LoteForm onSubmit={onSubmit} loading={loading} error={error} />
      </DialogContent>
    </Dialog>
  );
}
