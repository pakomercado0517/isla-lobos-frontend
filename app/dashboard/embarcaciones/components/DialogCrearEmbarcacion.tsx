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

interface CreateEmbarcacionData {
  nombre: string;
  matricula: string;
  capacidad: number;
  tipo: "menor" | "mayor";
  estado: "disponible" | "en_uso" | "mantenimiento";
  prestador_id: string;
}

interface DialogCrearEmbarcacionProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  formData: CreateEmbarcacionData;
  onFormChange: (data: CreateEmbarcacionData) => void;
  prestadores: Prestador[];
  onSubmit: () => void;
  submitting: boolean;
}

export function DialogCrearEmbarcacion({
  open,
  onOpenChange,
  formData,
  onFormChange,
  prestadores,
  onSubmit,
  submitting,
}: DialogCrearEmbarcacionProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Registrar Nueva Embarcación</DialogTitle>
          <DialogDescription>
            Agrega una nueva embarcación al sistema
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
              placeholder="Lobos Express"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="matricula" className="text-right">
              Matrícula
            </Label>
            <Input
              id="matricula"
              value={formData.matricula}
              onChange={(e) =>
                onFormChange({
                  ...formData,
                  matricula: e.target.value.toUpperCase(),
                })
              }
              className="col-span-3"
              placeholder="VER-001-ABC"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="capacidad" className="text-right">
              Capacidad
            </Label>
            <Input
              id="capacidad"
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
            <Label htmlFor="tipo" className="text-right">
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
            <Label htmlFor="prestador_id" className="text-right">
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
            {submitting ? "Registrando..." : "Registrar"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
