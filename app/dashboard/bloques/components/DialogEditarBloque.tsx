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
import { type CreateBloqueData, EstadoBloque } from "@/lib/types/bloques";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { formatearFechaRegional } from "@/lib/utils";

interface DialogEditarBloqueProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  formData: CreateBloqueData;
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
  // Limpiar estilos del body cuando el dialog se cierre
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
      <DialogContent className="sm:max-w-[420px] md:max-w-2xl max-h-[88vh] overflow-y-auto p-3 sm:p-5 md:p-6 gap-2.5 sm:gap-5 md:gap-6">
        <DialogHeader className="space-y-1 md:space-y-3">
          <DialogTitle className="text-base md:text-2xl font-semibold">
            Editar Bloque
          </DialogTitle>
          <DialogDescription className="text-[11px] md:text-base leading-snug">
            Modifica los datos del bloque horario. El destino, fecha y tipo
            (plantilla) no se pueden cambiar.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-2.5 md:space-y-5">
          {/* Campos de solo lectura */}
          <div className="space-y-2 p-2 bg-slate-50 rounded-md border border-slate-200">
            <p className="text-[10px] md:text-xs text-slate-600 font-medium">
              Información no modificable:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
              <div>
                <span className="text-[10px] md:text-xs text-slate-500">
                  Destino:
                </span>
                <p className="font-medium text-slate-700">{formData.destino}</p>
              </div>
              <div>
                <span className="text-[10px] md:text-xs text-slate-500">
                  Tipo:
                </span>
                <p className="font-medium text-slate-700">
                  {formData.es_plantilla ? "Plantilla" : "Específico"}
                </p>
              </div>
              <div>
                <span className="text-[10px] md:text-xs text-slate-500">
                  Fecha:
                </span>
                <p className="font-medium text-slate-700">
                  {formData.fecha
                    ? formatearFechaRegional(formData.fecha)
                    : "Sin fecha"}
                </p>
              </div>
            </div>
          </div>

          {/* Campo Nombre */}
          <div className="space-y-1">
            <Label
              htmlFor="edit-nombre"
              className="text-xs md:text-base font-medium"
            >
              Nombre *
            </Label>
            <Input
              id="edit-nombre"
              value={formData.nombre}
              onChange={(e) =>
                onFormChange({ ...formData, nombre: e.target.value })
              }
              className="w-full text-xs md:text-base h-9 md:h-12"
              placeholder="Nombre del bloque"
            />
          </div>

          {/* Horarios */}
          <div className="grid grid-cols-2 gap-2 md:gap-4">
            <div className="space-y-1">
              <Label
                htmlFor="edit-hora_inicio"
                className="text-xs md:text-base font-medium"
              >
                Inicio *
              </Label>
              <Input
                id="edit-hora_inicio"
                type="time"
                value={formData.hora_inicio}
                onChange={(e) =>
                  onFormChange({ ...formData, hora_inicio: e.target.value })
                }
                className="w-full text-xs md:text-base h-9 md:h-12"
              />
            </div>
            <div className="space-y-1">
              <Label
                htmlFor="edit-hora_fin"
                className="text-xs md:text-base font-medium"
              >
                Fin *
              </Label>
              <Input
                id="edit-hora_fin"
                type="time"
                value={formData.hora_fin}
                onChange={(e) =>
                  onFormChange({ ...formData, hora_fin: e.target.value })
                }
                className="w-full text-xs md:text-base h-9 md:h-12"
              />
            </div>
          </div>

          {/* Capacidad */}
          <div className="space-y-1">
            <Label
              htmlFor="edit-capacidad_total"
              className="text-xs md:text-base font-medium"
            >
              Capacidad *
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
              className="w-full text-xs md:text-base h-9 md:h-12"
              min="1"
              max="150"
              placeholder="Número total"
            />
          </div>

          {/* Estado */}
          <div className="space-y-1">
            <Label
              htmlFor="edit-estado"
              className="text-xs md:text-base font-medium"
            >
              Estado
            </Label>
            <Select
              value={formData.estado}
              onValueChange={(value: EstadoBloque) =>
                onFormChange({ ...formData, estado: value })
              }
            >
              <SelectTrigger className="w-full text-xs md:text-base h-9 md:h-12">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem
                  value={EstadoBloque.ACTIVO}
                  className="text-xs md:text-base py-2 md:py-3"
                >
                  ✅ Activo
                </SelectItem>
                <SelectItem
                  value={EstadoBloque.SUSPENDIDO_POR_CLIMA}
                  className="text-xs md:text-base py-2 md:py-3"
                >
                  ⛅ Suspendido por Clima
                </SelectItem>
                <SelectItem
                  value={EstadoBloque.CERRADO_CAPITARIA}
                  className="text-xs md:text-base py-2 md:py-3"
                >
                  ⛔ Cerrado por Capitaría
                </SelectItem>
                <SelectItem
                  value={EstadoBloque.INACTIVO}
                  className="text-xs md:text-base py-2 md:py-3"
                >
                  ❌ Inactivo
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <DialogFooter className="flex flex-col-reverse sm:flex-row gap-2 md:gap-3 pt-1 md:pt-2">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={submitting}
            className="text-xs md:text-base h-9 md:h-12 w-full sm:w-auto"
          >
            Cancelar
          </Button>
          <Button
            onClick={onSubmit}
            disabled={submitting}
            className="text-xs md:text-base h-9 md:h-12 w-full sm:w-auto font-medium"
          >
            {submitting ? "Guardando..." : "Guardar Cambios"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
