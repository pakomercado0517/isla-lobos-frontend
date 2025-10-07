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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface Prestador {
  id: string;
  nombre: string;
  email: string;
  telefono: string;
  rol: string;
  activo: boolean;
}

interface EditEmbarcacionData {
  nombre: string;
  matricula: string;
  capacidad: number;
  tipo: "menor" | "mayor";
  estado: "disponible" | "en_uso" | "mantenimiento";
  prestador_id: string;
}

interface DialogEditarEmbarcacionProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  formData: EditEmbarcacionData;
  onFormChange: (data: EditEmbarcacionData) => void;
  prestadores: Prestador[];
  onSubmit: () => void;
  submitting: boolean;
}

export function DialogEditarEmbarcacion({
  open,
  onOpenChange,
  formData,
  onFormChange,
  prestadores,
  onSubmit,
  submitting,
}: DialogEditarEmbarcacionProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Editar Embarcación</DialogTitle>
          <DialogDescription>
            Modifica los datos de la embarcación
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="edit-nombre" className="text-right">
              Nombre
            </Label>
            <Input
              id="edit-nombre"
              value={formData.nombre}
              onChange={(e) =>
                onFormChange({ ...formData, nombre: e.target.value })
              }
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="edit-matricula" className="text-right">
              Matrícula
            </Label>
            <Input
              id="edit-matricula"
              value={formData.matricula}
              onChange={(e) =>
                onFormChange({
                  ...formData,
                  matricula: e.target.value.toUpperCase(),
                })
              }
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="edit-capacidad" className="text-right">
              Capacidad
            </Label>
            <Input
              id="edit-capacidad"
              type="number"
              value={formData.capacidad}
              onChange={(e) =>
                onFormChange({
                  ...formData,
                  capacidad: parseInt(e.target.value) || 0,
                })
              }
              className="col-span-3"
              min="1"
              max="150"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="edit-tipo" className="text-right">
              Tipo
            </Label>
            <Select
              value={formData.tipo}
              onValueChange={(value: "menor" | "mayor") =>
                onFormChange({ ...formData, tipo: value })
              }
            >
              <SelectTrigger className="col-span-3">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="menor">Embarcación Menor</SelectItem>
                <SelectItem value="mayor">Embarcación Mayor</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="edit-estado" className="text-right">
              Estado
            </Label>
            <Select
              value={formData.estado}
              onValueChange={(
                value: "disponible" | "en_uso" | "mantenimiento"
              ) => onFormChange({ ...formData, estado: value })}
            >
              <SelectTrigger className="col-span-3">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="disponible">Disponible</SelectItem>
                <SelectItem value="en_uso">En uso</SelectItem>
                <SelectItem value="mantenimiento">Mantenimiento</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="edit-prestador_id" className="text-right">
              Prestador
            </Label>
            <Select
              value={formData.prestador_id}
              onValueChange={(value) =>
                onFormChange({ ...formData, prestador_id: value })
              }
            >
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Seleccionar prestador" />
              </SelectTrigger>
              <SelectContent>
                {prestadores.map((prestador) => (
                  <SelectItem key={prestador.id} value={prestador.id}>
                    {prestador.nombre}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
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
            {submitting ? "Guardando..." : "Guardar Cambios"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
