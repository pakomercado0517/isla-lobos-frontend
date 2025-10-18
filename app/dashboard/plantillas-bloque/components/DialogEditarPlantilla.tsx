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
    destino?: string; // Solo lectura
    bloques_asociados?: number; // Solo información
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
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Editar Plantilla de Bloque</DialogTitle>
          <DialogDescription>
            Modifica la plantilla. Los cambios se aplicarán automáticamente a todos los bloques asociados.
            {formData.bloques_asociados && formData.bloques_asociados > 0 && (
              <span className="block mt-2 text-orange-600 font-medium">
                ⚠️ Esta plantilla tiene {formData.bloques_asociados} bloque(s) asociado(s)
              </span>
            )}
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          {/* Mostrar destino como solo lectura */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right">Destino</Label>
            <div className="col-span-3 flex items-center gap-2">
              <div className="px-3 py-2 bg-gray-50 text-gray-700 rounded-md text-sm">
                {formData.destino}
              </div>
              <span className="text-xs text-gray-500">(No modificable)</span>
            </div>
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="edit-nombre" className="text-right">
              Nombre *
            </Label>
            <Input
              id="edit-nombre"
              value={formData.nombre || ""}
              onChange={(e) =>
                onFormChange({ ...formData, nombre: e.target.value })
              }
              className="col-span-3"
              placeholder="Ej: Snorkel Mañana"
            />
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="edit-hora_inicio" className="text-right">
              Hora Inicio *
            </Label>
            <Input
              id="edit-hora_inicio"
              type="time"
              value={formData.hora_inicio || ""}
              onChange={(e) =>
                onFormChange({ ...formData, hora_inicio: e.target.value })
              }
              className="col-span-3"
            />
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="edit-hora_fin" className="text-right">
              Hora Fin *
            </Label>
            <Input
              id="edit-hora_fin"
              type="time"
              value={formData.hora_fin || ""}
              onChange={(e) =>
                onFormChange({ ...formData, hora_fin: e.target.value })
              }
              className="col-span-3"
            />
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="edit-capacidad_total" className="text-right">
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
              className="col-span-3"
              min="1"
              max="50"
              placeholder="Máximo 50 personas"
            />
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="edit-activa" className="text-right">
              Estado
            </Label>
            <div className="col-span-3 flex items-center space-x-2">
              <Switch
                id="edit-activa"
                checked={formData.activa ?? true}
                onCheckedChange={(checked) =>
                  onFormChange({ ...formData, activa: checked })
                }
              />
              <Label htmlFor="edit-activa" className="text-sm text-gray-600">
                {formData.activa ?? true ? "Plantilla activa" : "Plantilla inactiva"}
              </Label>
            </div>
          </div>

          {formData.bloques_asociados && formData.bloques_asociados > 0 && (
            <div className="bg-orange-50 border border-orange-200 rounded-md p-3">
              <p className="text-sm text-orange-800">
                <strong>Importante:</strong> Los cambios en esta plantilla afectarán automáticamente 
                a {formData.bloques_asociados} bloque(s) que ya están usando esta configuración.
              </p>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={submitting}
          >
            Cancelar
          </Button>
          <Button onClick={onSubmit} disabled={submitting}>
            {submitting ? "Guardando..." : "Guardar Cambios"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}