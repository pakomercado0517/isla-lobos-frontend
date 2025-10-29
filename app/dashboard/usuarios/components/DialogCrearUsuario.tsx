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
  // Limpieza de estilos del body al cerrar el diálogo
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
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-base md:text-lg">
            Crear Nuevo Usuario
          </DialogTitle>
          <DialogDescription className="text-xs md:text-sm">
            Completa la información para crear un nuevo usuario
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-3 md:gap-4 py-3 md:py-4">
          <div className="space-y-2">
            <Label htmlFor="nombre" className="text-xs md:text-sm">
              Nombre *
            </Label>
            <Input
              id="nombre"
              value={formData.nombre}
              onChange={(e) =>
                onFormChange({ ...formData, nombre: e.target.value })
              }
              placeholder="Nombre completo"
              className="h-9 md:h-10 text-xs md:text-sm"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email" className="text-xs md:text-sm">
              Email *
            </Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) =>
                onFormChange({ ...formData, email: e.target.value })
              }
              placeholder="correo@ejemplo.com"
              className="h-9 md:h-10 text-xs md:text-sm"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="telefono" className="text-xs md:text-sm">
              Teléfono
            </Label>
            <Input
              id="telefono"
              value={formData.telefono}
              onChange={(e) =>
                onFormChange({ ...formData, telefono: e.target.value })
              }
              placeholder="2291234567"
              className="h-9 md:h-10 text-xs md:text-sm"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password" className="text-xs md:text-sm">
              Contraseña *
            </Label>
            <Input
              id="password"
              type="password"
              value={formData.password}
              onChange={(e) =>
                onFormChange({ ...formData, password: e.target.value })
              }
              placeholder="Contraseña segura"
              className="h-9 md:h-10 text-xs md:text-sm"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="rol" className="text-xs md:text-sm">
              Rol
            </Label>
            <Select
              value={formData.rol}
              onValueChange={(value: "conanp" | "prestador") =>
                onFormChange({ ...formData, rol: value })
              }
            >
              <SelectTrigger className="h-9 md:h-10 text-xs md:text-sm">
                <SelectValue placeholder="Selecciona un rol" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="prestador" className="text-xs md:text-sm">
                  Prestador
                </SelectItem>
                <SelectItem value="conanp" className="text-xs md:text-sm">
                  CONANP
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter className="flex-col gap-2 md:flex-row">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="w-full md:w-auto h-9 md:h-10 text-xs md:text-sm"
          >
            Cancelar
          </Button>
          <Button
            type="button"
            onClick={onSubmit}
            disabled={submitting}
            className="w-full md:w-auto h-9 md:h-10 text-xs md:text-sm bg-[var(--isla-teal)] hover:bg-[var(--isla-teal-dark)]"
          >
            {submitting ? (
              <>
                <RefreshCw className="w-3 h-3 md:w-4 md:h-4 mr-2 animate-spin" />
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
