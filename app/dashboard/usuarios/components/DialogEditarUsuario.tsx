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
import { RefreshCw } from "lucide-react";

interface DialogEditarUsuarioProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  nombre: string;
  telefono: string;
  activo: boolean;
  onNombreChange: (nombre: string) => void;
  onTelefonoChange: (telefono: string) => void;
  onActivoChange: (activo: boolean) => void;
  onSubmit: () => void;
  submitting: boolean;
}

export function DialogEditarUsuario({
  open,
  onOpenChange,
  nombre,
  telefono,
  activo,
  onNombreChange,
  onTelefonoChange,
  onActivoChange,
  onSubmit,
  submitting,
}: DialogEditarUsuarioProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Editar Usuario</DialogTitle>
          <DialogDescription>
            Modifica la información del usuario
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="edit-nombre" className="text-right">
              Nombre
            </Label>
            <Input
              id="edit-nombre"
              value={nombre}
              onChange={(e) => onNombreChange(e.target.value)}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="edit-telefono" className="text-right">
              Teléfono
            </Label>
            <Input
              id="edit-telefono"
              value={telefono}
              onChange={(e) => onTelefonoChange(e.target.value)}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="edit-activo" className="text-right">
              Estado
            </Label>
            <Select
              value={activo ? "true" : "false"}
              onValueChange={(value) => onActivoChange(value === "true")}
            >
              <SelectTrigger className="col-span-3">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="true">Activo</SelectItem>
                <SelectItem value="false">Inactivo</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
          >
            Cancelar
          </Button>
          <Button
            type="button"
            onClick={onSubmit}
            disabled={submitting}
            className="bg-[var(--isla-teal)] hover:bg-[var(--isla-teal-dark)]"
          >
            {submitting ? (
              <>
                <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                Guardando...
              </>
            ) : (
              "Guardar Cambios"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

