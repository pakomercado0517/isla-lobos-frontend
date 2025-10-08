import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface CreateBloqueData {
  nombre: string;
  hora_inicio: string;
  hora_fin: string;
  capacidad_total: number;
  fecha: string;
  estado: "activo" | "lleno" | "suspendido_por_clima" | "cerrado_capitaria";
}

interface DialogCrearBloqueProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  formData: CreateBloqueData;
  onFormChange: (data: CreateBloqueData) => void;
  onSubmit: () => void;
  submitting: boolean;
}

export function DialogCrearBloque({
  open,
  onOpenChange,
  formData,
  onFormChange,
  onSubmit,
  submitting,
}: DialogCrearBloqueProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Crear Nuevo Bloque</DialogTitle>
          <DialogDescription>
            Define un nuevo bloque horario con su capacidad
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="nombre" className="text-right">
              Nombre
            </Label>
            <Input
              id="nombre"
              value={formData.nombre}
              onChange={(e) =>
                onFormChange({ ...formData, nombre: e.target.value })
              }
              className="col-span-3"
              placeholder="Bloque Matutino"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="hora_inicio" className="text-right">
              Inicio
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
              Fin
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
              Capacidad
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
              max="150"
            />
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
            {submitting ? "Creando..." : "Crear Bloque"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
