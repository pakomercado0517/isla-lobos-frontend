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
import { type CreateBloqueData, EstadoBloque } from "@/lib/types/bloques";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface DialogEditarBloqueProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  formData: CreateBloqueData; // 🆕 Usar tipo unificado
  onFormChange: (data: CreateBloqueData) => void;
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
            Modifica los datos del bloque horario. El destino y tipo (plantilla) no se pueden cambiar.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          {/* Mostrar destino como solo lectura */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right">
              Destino
            </Label>
            <div className="col-span-3 flex items-center gap-2">
              <div className="px-3 py-2 bg-gray-50 text-gray-700 rounded-md text-sm">
                {formData.destino}
              </div>
              <span className="text-xs text-gray-500">(No modificable)</span>
            </div>
          </div>

          {/* Mostrar tipo de bloque como solo lectura */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right">
              Tipo
            </Label>
            <div className="col-span-3 flex items-center gap-2">
              <div className="px-3 py-2 bg-gray-50 text-gray-700 rounded-md text-sm">
                {formData.es_plantilla ? 'Plantilla Reutilizable' : 'Bloque Específico'}
              </div>
              <span className="text-xs text-gray-500">(No modificable)</span>
            </div>
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="edit-nombre" className="text-right">
              Nombre *
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
              onValueChange={(value: EstadoBloque) =>
                onFormChange({ ...formData, estado: value })
              }
            >
              <SelectTrigger className="col-span-3">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={EstadoBloque.ACTIVO}>✅ Activo</SelectItem>
                <SelectItem value={EstadoBloque.SUSPENDIDO_POR_CLIMA}>⛅ Suspendido por Clima</SelectItem>
                <SelectItem value={EstadoBloque.CERRADO_CAPITARIA}>⛔ Cerrado por Capitaría</SelectItem>
                <SelectItem value={EstadoBloque.INACTIVO}>❌ Inactivo</SelectItem>
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
