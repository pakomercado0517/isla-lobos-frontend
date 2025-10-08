import { Button } from "@/components/ui/button";
import { Package, Plus } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { UsoBrazaletesForm } from "@/components/brazaletes/UsoBrazaletesForm";
import type {
  BrazaletesPrestador,
  UsoBrazaleteFormData,
} from "@/lib/types/brazaletes";

interface FormularioRegistroProps {
  showUsoForm: boolean;
  onShowUsoFormChange: (show: boolean) => void;
  onRegistrarUso: (data: UsoBrazaleteFormData) => Promise<void>;
  registrandoUso: boolean;
  usoError: string;
  brazaletesDisponibles: BrazaletesPrestador["detalle"];
}

export function FormularioRegistro({
  showUsoForm,
  onShowUsoFormChange,
  onRegistrarUso,
  registrandoUso,
  usoError,
  brazaletesDisponibles,
}: FormularioRegistroProps) {
  return (
    <div className="bg-white p-6 rounded-lg border">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold">Registrar Uso de Brazaletes</h3>
        <Dialog open={showUsoForm} onOpenChange={onShowUsoFormChange}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Nuevo Registro
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Registrar Uso de Brazaletes</DialogTitle>
              <DialogDescription>
                Registra los brazaletes utilizados en una salida turística
              </DialogDescription>
            </DialogHeader>
            <UsoBrazaletesForm
              onSubmit={onRegistrarUso}
              loading={registrandoUso}
              error={usoError}
              salidaId=""
              salidaFecha=""
              brazaletesDisponibles={brazaletesDisponibles}
            />
          </DialogContent>
        </Dialog>
      </div>

      <div className="text-center py-8">
        <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          ¿Listo para registrar brazaletes?
        </h3>
        <p className="text-gray-600 mb-4">
          Haz clic en &quot;Nuevo Registro&quot; para comenzar a registrar el
          uso de brazaletes
        </p>
      </div>
    </div>
  );
}
