import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { type UpdatePlantillaBloqueData } from "@/lib/types/bloques";

interface DialogEditarPlantillaProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  formData: UpdatePlantillaBloqueData & {
    destino?: string;
    bloques_asociados?: number;
  };
  onFormChange: (data: UpdatePlantillaBloqueData) => void;
  onSubmit: () => void;
  submitting: boolean;
}

export function DialogEditarPlantilla({
  open,
  onOpenChange,
  formData,
  onFormChange,
  onSubmit,
  submitting,
}: DialogEditarPlantillaProps) {
  // Limpiar estilos del body cuando el dialog se cierre
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

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[420px] md:max-w-md max-h-[88vh] overflow-y-auto p-3 sm:p-5 md:p-6 gap-2.5 sm:gap-5 md:gap-6">
        <DialogHeader className="space-y-1 md:space-y-3">
          <DialogTitle className="text-base md:text-2xl font-semibold">
            Editar Plantilla de Bloque
          </DialogTitle>
          <DialogDescription className="text-[11px] md:text-base leading-snug">
            Modifica la plantilla. Los cambios se aplicarán automáticamente a
            todos los bloques asociados.
            {formData.bloques_asociados && formData.bloques_asociados > 0 && (
              <span className="block mt-2 text-orange-600 font-medium text-xs md:text-sm">
                ⚠️ Esta plantilla tiene {formData.bloques_asociados} bloque(s)
                asociado(s)
              </span>
            )}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-2.5 md:space-y-5">
          {/* Destino (solo lectura) */}
          <div className="space-y-1 p-2 bg-slate-50 rounded-md border border-slate-200">
            <p className="text-[10px] md:text-xs text-slate-600 font-medium">
              Información no modificable:
            </p>
            <div className="text-xs">
              <span className="text-[10px] md:text-xs text-slate-500">
                Destino:
              </span>
              <p className="font-medium text-slate-700">{formData.destino}</p>
            </div>
          </div>

          {/* Nombre */}
          <div className="space-y-1">
            <Label
              htmlFor="edit-nombre"
              className="text-xs md:text-base font-medium"
            >
              Nombre *
            </Label>
            <Input
              id="edit-nombre"
              value={formData.nombre || ""}
              onChange={(e) =>
                onFormChange({ ...formData, nombre: e.target.value })
              }
              className="w-full text-xs md:text-base h-9 md:h-12"
              placeholder="Ej: Snorkel Mañana"
            />
          </div>

          {/* Horarios */}
          <div className="grid grid-cols-2 gap-2 md:gap-4">
            <div className="space-y-1">
              <Label
                htmlFor="edit-hora_inicio"
                className="text-xs md:text-base font-medium"
              >
                Hora Inicio *
              </Label>
              <Input
                id="edit-hora_inicio"
                type="time"
                value={formData.hora_inicio || ""}
                onChange={(e) =>
                  onFormChange({ ...formData, hora_inicio: e.target.value })
                }
                className="w-full text-xs md:text-base h-9 md:h-12"
              />
            </div>
            <div className="space-y-1">
              <Label
                htmlFor="edit-hora_fin"
                className="text-xs md:text-base font-medium"
              >
                Hora Fin *
              </Label>
              <Input
                id="edit-hora_fin"
                type="time"
                value={formData.hora_fin || ""}
                onChange={(e) =>
                  onFormChange({ ...formData, hora_fin: e.target.value })
                }
                className="w-full text-xs md:text-base h-9 md:h-12"
              />
            </div>
          </div>

          {/* Capacidad */}
          <div className="space-y-1">
            <Label
              htmlFor="edit-capacidad_total"
              className="text-xs md:text-base font-medium"
            >
              Capacidad *
            </Label>
            <Input
              id="edit-capacidad_total"
              type="number"
              value={formData.capacidad_total || 0}
              onChange={(e) =>
                onFormChange({
                  ...formData,
                  capacidad_total: parseInt(e.target.value) || 0,
                })
              }
              className="w-full text-xs md:text-base h-9 md:h-12"
              min="1"
              max="50"
              placeholder="Máximo 50 personas"
            />
          </div>

          {/* Estado */}
          <div className="space-y-1">
            <Label className="text-xs md:text-base font-medium">Estado</Label>
            <div className="flex items-center space-x-2 py-2 px-3 bg-slate-50 rounded-md border border-slate-200">
              <Switch
                id="edit-activa"
                checked={formData.activa ?? true}
                onCheckedChange={(checked) =>
                  onFormChange({ ...formData, activa: checked })
                }
              />
              <Label
                htmlFor="edit-activa"
                className="text-xs md:text-sm text-gray-600 cursor-pointer"
              >
                {formData.activa ?? true
                  ? "✅ Plantilla activa"
                  : "❌ Plantilla inactiva"}
              </Label>
            </div>
          </div>

          {/* Advertencia de bloques asociados */}
          {formData.bloques_asociados && formData.bloques_asociados > 0 && (
            <div className="bg-orange-50 border border-orange-200 rounded-md p-2 md:p-3">
              <p className="text-[10px] md:text-sm text-orange-800 leading-snug">
                <strong>Importante:</strong> Los cambios en esta plantilla
                afectarán automáticamente a {formData.bloques_asociados}{" "}
                bloque(s) que ya están usando esta configuración.
              </p>
            </div>
          )}
        </div>

        <DialogFooter className="flex flex-col-reverse sm:flex-row gap-2 md:gap-3 pt-1 md:pt-2">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={submitting}
            className="text-xs md:text-base h-9 md:h-12 w-full sm:w-auto"
          >
            Cancelar
          </Button>
          <Button
            onClick={onSubmit}
            disabled={submitting}
            className="text-xs md:text-base h-9 md:h-12 w-full sm:w-auto font-medium"
          >
            {submitting ? "Guardando..." : "Guardar Cambios"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
