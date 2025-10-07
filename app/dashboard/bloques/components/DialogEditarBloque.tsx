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

interface EditBloqueData {
  nombre: string;
  hora_inicio: string;
  hora_fin: string;
  capacidad_total: number;
  fecha: string;
  estado: "activo" | "lleno" | "suspendido_por_clima" | "cerrado_capitaria";
}

interface DialogEditarBloqueProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  formData: EditBloqueData;
  onFormChange: (data: EditBloqueData) => void;
  onSubmit: () => void;
  submitting: boolean;
}

export function DialogEditarBloque({
  open,
  onOpenChange,
  formData,
  onFormChange,
  onSubmit,
  submitting,
}: DialogEditarBloqueProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Editar Bloque</DialogTitle>
          <DialogDescription>
            Modifica los datos del bloque horario
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
            <Label htmlFor="edit-hora_inicio" className="text-right">
              Inicio
            </Label>
            <Input
              id="edit-hora_inicio"
              type="time"
              value={formData.hora_inicio}
              onChange={(e) =>
                onFormChange({ ...formData, hora_inicio: e.target.value })
              }
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="edit-hora_fin" className="text-right">
              Fin
            </Label>
            <Input
              id="edit-hora_fin"
              type="time"
              value={formData.hora_fin}
              onChange={(e) =>
                onFormChange({ ...formData, hora_fin: e.target.value })
              }
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="edit-capacidad_total" className="text-right">
              Capacidad
            </Label>
            <Input
              id="edit-capacidad_total"
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
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="edit-estado" className="text-right">
              Estado
            </Label>
            <Select
              value={formData.estado}
              onValueChange={(value: string) =>
                onFormChange({
                  ...formData,
                  estado: value as
                    | "activo"
                    | "lleno"
                    | "suspendido_por_clima"
                    | "cerrado_capitaria",
                })
              }
            >
              <SelectTrigger className="col-span-3">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="activo">Activo</SelectItem>
                <SelectItem value="lleno">Lleno</SelectItem>
                <SelectItem value="suspendido_por_clima">
                  Suspendido por clima
                </SelectItem>
                <SelectItem value="cerrado_capitaria">
                  Cerrado por capitanía
                </SelectItem>
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

