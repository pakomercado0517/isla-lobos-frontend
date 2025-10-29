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

interface DialogEditarUsuarioProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  nombre: string;
  email: string;
  telefono: string;
  activo: boolean;
  onNombreChange: (nombre: string) => void;
  onEmailChange: (email: string) => void;
  onTelefonoChange: (telefono: string) => void;
  onActivoChange: (activo: boolean) => void;
  onSubmit: () => void;
  submitting: boolean;
}

export function DialogEditarUsuario({
  open,
  onOpenChange,
  nombre,
  email,
  telefono,
  activo,
  onNombreChange,
  onEmailChange,
  onTelefonoChange,
  onActivoChange,
  onSubmit,
  submitting,
}: DialogEditarUsuarioProps) {
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
            Editar Usuario
          </DialogTitle>
          <DialogDescription className="text-xs md:text-sm">
            Modifica la información del usuario
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-3 md:gap-4 py-3 md:py-4">
          <div className="space-y-2">
            <Label htmlFor="edit-nombre" className="text-xs md:text-sm">
              Nombre
            </Label>
            <Input
              id="edit-nombre"
              value={nombre}
              onChange={(e) => onNombreChange(e.target.value)}
              className="h-9 md:h-10 text-xs md:text-sm"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="edit-email" className="text-xs md:text-sm">
              Email
            </Label>
            <Input
              id="edit-email"
              type="email"
              value={email}
              onChange={(e) => onEmailChange(e.target.value)}
              className="h-9 md:h-10 text-xs md:text-sm"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="edit-telefono" className="text-xs md:text-sm">
              Teléfono
            </Label>
            <Input
              id="edit-telefono"
              value={telefono}
              onChange={(e) => onTelefonoChange(e.target.value)}
              className="h-9 md:h-10 text-xs md:text-sm"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="edit-activo" className="text-xs md:text-sm">
              Estado
            </Label>
            <Select
              value={activo ? "true" : "false"}
              onValueChange={(value) => onActivoChange(value === "true")}
            >
              <SelectTrigger className="h-9 md:h-10 text-xs md:text-sm">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="true" className="text-xs md:text-sm">
                  Activo
                </SelectItem>
                <SelectItem value="false" className="text-xs md:text-sm">
                  Inactivo
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
