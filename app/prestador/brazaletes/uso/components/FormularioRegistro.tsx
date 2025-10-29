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
    <div className="bg-white p-4 md:p-6 rounded-lg border">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 md:gap-6 mb-4 md:mb-6">
        <h3 className="text-base md:text-lg font-semibold">
          Registrar Uso de Brazaletes
        </h3>
        <Dialog open={showUsoForm} onOpenChange={onShowUsoFormChange}>
          <DialogTrigger asChild>
            <Button className="w-full sm:w-auto text-xs md:text-sm">
              <Plus className="w-4 h-4 mr-2" />
              Nuevo Registro
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-xl sm:max-w-2xl md:max-w-6xl max-h-[90vh] overflow-y-auto p-4 md:p-6">
            <DialogHeader className="space-y-2">
              <DialogTitle className="text-lg md:text-xl">
                Registrar Uso de Brazaletes
              </DialogTitle>
              <DialogDescription className="text-xs md:text-sm">
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

      <div className="text-center py-6 md:py-8">
        <Package className="w-10 h-10 md:w-12 md:h-12 text-gray-400 mx-auto mb-3 md:mb-4" />
        <h3 className="text-base md:text-lg font-medium text-gray-900 mb-2">
          ¿Listo para registrar brazaletes?
        </h3>
        <p className="text-xs md:text-sm text-gray-600">
          Haz clic en &quot;Nuevo Registro&quot; para comenzar a registrar el
          uso de brazaletes
        </p>
      </div>
    </div>
  );
}
