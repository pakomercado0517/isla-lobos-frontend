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
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Nueva Plantilla de Bloque</DialogTitle>
          <DialogDescription>
            Crea una plantilla maestra que se usará para generar bloques horarios automáticamente.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="nombre" className="text-right">
              Nombre *
            </Label>
            <Input
              id="nombre"
              value={formData.nombre}
              onChange={(e) =>
                onFormChange({ ...formData, nombre: e.target.value })
              }
              className="col-span-3"
              placeholder="Ej: Snorkel Mañana"
            />
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="destino" className="text-right">
              Destino *
            </Label>
            <Select
              value={formData.destino}
              onValueChange={(value: DestinoType) =>
                onFormChange({ ...formData, destino: value })
              }
            >
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Seleccionar destino" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={DESTINOS.ISLA_LOBOS}>Isla de Lobos</SelectItem>
                <SelectItem value={DESTINOS.ARRECIFE_TUXPAN}>
                  Arrecife Tuxpan
                </SelectItem>
                <SelectItem value={DESTINOS.ARRECIFE_EN_MEDIO}>
                  Arrecife de en Medio
                </SelectItem>
                <SelectItem value={DESTINOS.ARRECIFE_TANHUIJO}>
                  Arrecife Tanhuijo
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="hora_inicio" className="text-right">
              Hora Inicio *
            </Label>
            <Input
              id="hora_inicio"
              type="time"
              value={formData.hora_inicio}
              onChange={(e) =>
                onFormChange({ ...formData, hora_inicio: e.target.value })
              }
              className="col-span-3"
            />
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="hora_fin" className="text-right">
              Hora Fin *
            </Label>
            <Input
              id="hora_fin"
              type="time"
              value={formData.hora_fin}
              onChange={(e) =>
                onFormChange({ ...formData, hora_fin: e.target.value })
              }
              className="col-span-3"
            />
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="capacidad_total" className="text-right">
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
              className="col-span-3"
              min="1"
              max="50"
              placeholder="Máximo 50 personas"
            />
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="activa" className="text-right">
              Activa
            </Label>
            <div className="col-span-3 flex items-center space-x-2">
              <Switch
                id="activa"
                checked={formData.activa ?? true}
                onCheckedChange={(checked) =>
                  onFormChange({ ...formData, activa: checked })
                }
              />
              <Label htmlFor="activa" className="text-sm text-gray-600">
                {formData.activa ?? true ? "Plantilla activa" : "Plantilla inactiva"}
              </Label>
            </div>
          </div>
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
            {submitting ? "Creando..." : "Crear Plantilla"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}