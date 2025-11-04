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
import { EmbarcacionFormData } from "@/lib/types/embarcacion";
import { User } from "@/lib/types/auth";

type Prestador = Omit<User, "avatar_url" | "created_at" | "updated_at">;

interface EditEmbarcacionData extends EmbarcacionFormData {
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
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-base md:text-lg">
            Editar Embarcación
          </DialogTitle>
          <DialogDescription className="text-xs md:text-sm">
            Modifica los datos de la embarcación
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-3 md:gap-4 py-3 md:py-4">
          <div className="space-y-2">
            <Label htmlFor="edit-nombre" className="text-xs md:text-sm">
              Nombre *
            </Label>
            <Input
              id="edit-nombre"
              value={formData.nombre}
              onChange={(e) =>
                onFormChange({ ...formData, nombre: e.target.value })
              }
              className="h-9 md:h-10 text-xs md:text-sm"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="edit-matricula" className="text-xs md:text-sm">
              Matrícula *
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
              className="h-9 md:h-10 text-xs md:text-sm"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="edit-capacidad" className="text-xs md:text-sm">
              Capacidad (personas) *
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
              min="1"
              max="150"
              className="h-9 md:h-10 text-xs md:text-sm"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="edit-tipo" className="text-xs md:text-sm">
              Tipo *
            </Label>
            <Select
              value={formData.tipo}
              onValueChange={(value: "menor" | "mayor") =>
                onFormChange({ ...formData, tipo: value })
              }
            >
              <SelectTrigger className="h-9 md:h-10 text-xs md:text-sm">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="menor" className="text-xs md:text-sm">
                  Embarcación Menor
                </SelectItem>
                <SelectItem value="mayor" className="text-xs md:text-sm">
                  Embarcación Mayor
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="edit-estado" className="text-xs md:text-sm">
              Estado *
            </Label>
            <Select
              value={formData.estado}
              onValueChange={(
                value: "disponible" | "en_uso" | "mantenimiento"
              ) => onFormChange({ ...formData, estado: value })}
            >
              <SelectTrigger className="h-9 md:h-10 text-xs md:text-sm">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="disponible" className="text-xs md:text-sm">
                  Disponible
                </SelectItem>
                <SelectItem value="en_uso" className="text-xs md:text-sm">
                  En uso
                </SelectItem>
                <SelectItem
                  value="mantenimiento"
                  className="text-xs md:text-sm"
                >
                  Mantenimiento
                </SelectItem>
                <SelectItem
                  value="pendiente_autorizacion"
                  className="text-xs md:text-sm"
                >
                  Pendiente de Autorización
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="edit-prestador_id" className="text-xs md:text-sm">
              Prestador *
            </Label>
            <Select
              value={formData.prestador_id}
              onValueChange={(value) =>
                onFormChange({ ...formData, prestador_id: value })
              }
            >
              <SelectTrigger className="h-9 md:h-10 text-xs md:text-sm">
                <SelectValue placeholder="Seleccionar prestador" />
              </SelectTrigger>
              <SelectContent>
                {prestadores.map((prestador) => (
                  <SelectItem
                    key={prestador.id}
                    value={prestador.id}
                    className="text-xs md:text-sm"
                  >
                    {prestador.nombre}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter className="flex-col gap-2 md:flex-row">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={submitting}
            className="w-full md:w-auto h-9 md:h-10 text-xs md:text-sm"
          >
            Cancelar
          </Button>
          <Button
            onClick={onSubmit}
            disabled={submitting}
            className="w-full md:w-auto h-9 md:h-10 text-xs md:text-sm"
          >
            {submitting ? "Guardando..." : "Guardar Cambios"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
