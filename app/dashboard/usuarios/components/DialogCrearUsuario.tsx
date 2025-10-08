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

interface CreateUsuarioData {
  nombre: string;
  email: string;
  telefono: string;
  password: string;
  rol: "conanp" | "prestador";
  activo: boolean;
}

interface DialogCrearUsuarioProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  formData: CreateUsuarioData;
  onFormChange: (data: CreateUsuarioData) => void;
  onSubmit: () => void;
  submitting: boolean;
}

export function DialogCrearUsuario({
  open,
  onOpenChange,
  formData,
  onFormChange,
  onSubmit,
  submitting,
}: DialogCrearUsuarioProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Crear Nuevo Usuario</DialogTitle>
          <DialogDescription>
            Completa la información para crear un nuevo usuario
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
              placeholder="Nombre completo"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="email" className="text-right">
              Email *
            </Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) =>
                onFormChange({ ...formData, email: e.target.value })
              }
              className="col-span-3"
              placeholder="correo@ejemplo.com"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="telefono" className="text-right">
              Teléfono
            </Label>
            <Input
              id="telefono"
              value={formData.telefono}
              onChange={(e) =>
                onFormChange({ ...formData, telefono: e.target.value })
              }
              className="col-span-3"
              placeholder="2291234567"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="password" className="text-right">
              Contraseña *
            </Label>
            <Input
              id="password"
              type="password"
              value={formData.password}
              onChange={(e) =>
                onFormChange({ ...formData, password: e.target.value })
              }
              className="col-span-3"
              placeholder="Contraseña segura"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="rol" className="text-right">
              Rol
            </Label>
            <Select
              value={formData.rol}
              onValueChange={(value: "conanp" | "prestador") =>
                onFormChange({ ...formData, rol: value })
              }
            >
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Selecciona un rol" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="prestador">Prestador</SelectItem>
                <SelectItem value="conanp">CONANP</SelectItem>
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
                Creando...
              </>
            ) : (
              "Crear Usuario"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
