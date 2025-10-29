import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { type CreatePlantillaBloqueData } from "@/lib/types/bloques";
import { DESTINOS, type DestinoType } from "@/lib/types/salida";

interface DialogCrearPlantillaProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  formData: CreatePlantillaBloqueData;
  onFormChange: (data: CreatePlantillaBloqueData) => void;
  onSubmit: () => void;
  submitting: boolean;
}

export function DialogCrearPlantilla({
  open,
  onOpenChange,
  formData,
  onFormChange,
  onSubmit,
  submitting,
}: DialogCrearPlantillaProps) {
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
            Nueva Plantilla de Bloque
          </DialogTitle>
          <DialogDescription className="text-[11px] md:text-base leading-snug">
            Crea una plantilla maestra que se usará para generar bloques
            horarios automáticamente.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-2.5 md:space-y-5">
          {/* Nombre */}
          <div className="space-y-1">
            <Label
              htmlFor="nombre"
              className="text-xs md:text-base font-medium"
            >
              Nombre *
            </Label>
            <Input
              id="nombre"
              value={formData.nombre}
              onChange={(e) =>
                onFormChange({ ...formData, nombre: e.target.value })
              }
              className="w-full text-xs md:text-base h-9 md:h-12"
              placeholder="Ej: Snorkel Mañana"
            />
          </div>

          {/* Destino */}
          <div className="space-y-1">
            <Label
              htmlFor="destino"
              className="text-xs md:text-base font-medium"
            >
              Destino *
            </Label>
            <Select
              value={formData.destino}
              onValueChange={(value: DestinoType) =>
                onFormChange({ ...formData, destino: value })
              }
            >
              <SelectTrigger className="w-full text-xs md:text-base h-9 md:h-12">
                <SelectValue placeholder="Seleccionar destino" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem
                  value={DESTINOS.ISLA_LOBOS}
                  className="text-xs md:text-base py-2 md:py-3"
                >
                  Isla de Lobos
                </SelectItem>
                <SelectItem
                  value={DESTINOS.ARRECIFE_TUXPAN}
                  className="text-xs md:text-base py-2 md:py-3"
                >
                  Arrecife Tuxpan
                </SelectItem>
                <SelectItem
                  value={DESTINOS.ARRECIFE_EN_MEDIO}
                  className="text-xs md:text-base py-2 md:py-3"
                >
                  Arrecife de en Medio
                </SelectItem>
                <SelectItem
                  value={DESTINOS.ARRECIFE_TANHUIJO}
                  className="text-xs md:text-base py-2 md:py-3"
                >
                  Arrecife Tanhuijo
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Horarios */}
          <div className="grid grid-cols-2 gap-2 md:gap-4">
            <div className="space-y-1">
              <Label
                htmlFor="hora_inicio"
                className="text-xs md:text-base font-medium"
              >
                Hora Inicio *
              </Label>
              <Input
                id="hora_inicio"
                type="time"
                value={formData.hora_inicio}
                onChange={(e) =>
                  onFormChange({ ...formData, hora_inicio: e.target.value })
                }
                className="w-full text-xs md:text-base h-9 md:h-12"
              />
            </div>
            <div className="space-y-1">
              <Label
                htmlFor="hora_fin"
                className="text-xs md:text-base font-medium"
              >
                Hora Fin *
              </Label>
              <Input
                id="hora_fin"
                type="time"
                value={formData.hora_fin}
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
              htmlFor="capacidad_total"
              className="text-xs md:text-base font-medium"
            >
              Capacidad *
            </Label>
            <Input
              id="capacidad_total"
              type="number"
              value={formData.capacidad_total}
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

          {/* Estado Activa */}
          <div className="space-y-1">
            <Label className="text-xs md:text-base font-medium">Estado</Label>
            <div className="flex items-center space-x-2 py-2 px-3 bg-slate-50 rounded-md border border-slate-200">
              <Switch
                id="activa"
                checked={formData.activa ?? true}
                onCheckedChange={(checked) =>
                  onFormChange({ ...formData, activa: checked })
                }
              />
              <Label
                htmlFor="activa"
                className="text-xs md:text-sm text-gray-600 cursor-pointer"
              >
                {formData.activa ?? true
                  ? "✅ Plantilla activa"
                  : "❌ Plantilla inactiva"}
              </Label>
            </div>
          </div>
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
            {submitting ? "Creando..." : "Crear Plantilla"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
