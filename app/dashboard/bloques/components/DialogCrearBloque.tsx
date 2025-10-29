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
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { DESTINOS, type DestinoType } from "@/lib/types/salida";
import { EstadoBloque } from "@/lib/types/bloques";
import { Info } from "lucide-react";
import { obtenerFechaLocalYYYYMMDD } from "@/lib/utils";

interface CreateBloqueData {
  nombre: string;
  hora_inicio: string;
  hora_fin: string;
  capacidad_total: number;
  destino: DestinoType;
  fecha?: string;
  estado: EstadoBloque;
  es_plantilla?: boolean;
}

interface DialogCrearBloqueProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  formData: CreateBloqueData;
  onFormChange: (data: CreateBloqueData) => void;
  onSubmit: () => void;
  submitting: boolean;
}

export function DialogCrearBloque({
  open,
  onOpenChange,
  formData,
  onFormChange,
  onSubmit,
  submitting,
}: DialogCrearBloqueProps) {
  // Limpiar estilos del body cuando el dialog se cierre
  useEffect(() => {
    if (!open) {
      // Pequeño delay para permitir que la animación termine
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
            Crear Nuevo Bloque
          </DialogTitle>
          <DialogDescription className="text-[11px] md:text-base leading-snug">
            Define un bloque horario para un destino específico. Puedes crear
            plantillas reutilizables o bloques para fechas específicas.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-2.5 md:space-y-5">
          {/* Campo Destino */}
          <div className="space-y-1">
            <Label
              htmlFor="destino"
              className="text-xs md:text-base font-medium"
            >
              Destino *
            </Label>
            <Select
              value={String(formData.destino ?? "")}
              onValueChange={(value: string) =>
                onFormChange({ ...formData, destino: value as DestinoType })
              }
            >
              <SelectTrigger className="w-full text-xs md:text-base h-9 md:h-12">
                <SelectValue placeholder="Seleccionar destino" />
              </SelectTrigger>
              <SelectContent>
                {Object.values(DESTINOS).map((destino) => (
                  <SelectItem
                    key={destino}
                    value={destino}
                    className="text-xs md:text-base py-2 md:py-3"
                  >
                    {destino}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Checkbox Plantilla */}
          <div className="space-y-1">
            <Label className="text-xs md:text-base font-medium">Tipo</Label>
            <div className="flex items-start space-x-2 py-1.5 px-2 bg-slate-50 rounded-md border border-slate-200">
              <Checkbox
                id="es_plantilla"
                checked={formData.es_plantilla || false}
                onCheckedChange={(checked) => {
                  const newFormData = {
                    ...formData,
                    es_plantilla: !!checked,
                  };

                  if (checked) {
                    newFormData.fecha = undefined;
                  } else {
                    if (!newFormData.fecha) {
                      newFormData.fecha = obtenerFechaLocalYYYYMMDD();
                    }
                    newFormData.estado = EstadoBloque.ACTIVO;
                  }

                  onFormChange(newFormData);
                }}
                className="mt-0.5 flex-shrink-0"
              />
              <div className="flex-1">
                <Label
                  htmlFor="es_plantilla"
                  className="text-[11px] md:text-base font-normal cursor-pointer leading-tight"
                >
                  Crear como plantilla reutilizable
                </Label>
              </div>
              <Info className="w-3.5 h-3.5 md:w-5 md:h-5 text-slate-500 flex-shrink-0 mt-0.5" />
            </div>
          </div>

          {/* Info sobre plantillas */}
          {formData.es_plantilla && (
            <div className="bg-blue-50 border border-blue-200 rounded-md p-2 md:p-4">
              <p className="text-[10px] md:text-base text-blue-700 leading-tight">
                💡 <strong>Plantilla:</strong> Sin fecha específica.
              </p>
              <p className="text-[9px] md:text-sm text-blue-600 mt-1">
                ✨ El sistema la manejará automáticamente
              </p>
            </div>
          )}

          {/* Campo Nombre */}
          <div className="space-y-1">
            <Label
              htmlFor="nombre"
              className="text-xs md:text-base font-medium"
            >
              Nombre *
            </Label>
            <Input
              id="nombre"
              value={formData.nombre}
              onChange={(e) =>
                onFormChange({ ...formData, nombre: e.target.value })
              }
              className="w-full text-xs md:text-base h-9 md:h-12"
              placeholder={
                formData.es_plantilla ? "Ej: Matutino" : "Ej: Bloque Matutino"
              }
            />
          </div>

          {/* Campos Horarios */}
          <div className="grid grid-cols-2 gap-2 md:gap-4">
            <div className="space-y-1">
              <Label
                htmlFor="hora_inicio"
                className="text-xs md:text-base font-medium"
              >
                Inicio *
              </Label>
              <Input
                id="hora_inicio"
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
                htmlFor="hora_fin"
                className="text-xs md:text-base font-medium"
              >
                Fin *
              </Label>
              <Input
                id="hora_fin"
                type="time"
                value={formData.hora_fin}
                onChange={(e) =>
                  onFormChange({ ...formData, hora_fin: e.target.value })
                }
                className="w-full text-xs md:text-base h-9 md:h-12"
              />
            </div>
          </div>

          {/* Campo Capacidad */}
          <div className="space-y-1">
            <Label
              htmlFor="capacidad_total"
              className="text-xs md:text-base font-medium"
            >
              Capacidad *
            </Label>
            <Input
              id="capacidad_total"
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

          {/* Campo Fecha - Solo si NO es plantilla */}
          {!formData.es_plantilla && (
            <div className="space-y-1">
              <Label
                htmlFor="fecha"
                className="text-xs md:text-base font-medium"
              >
                Fecha *
              </Label>
              <Input
                id="fecha"
                type="date"
                value={formData.fecha || ""}
                onChange={(e) =>
                  onFormChange({ ...formData, fecha: e.target.value })
                }
                className="w-full text-xs md:text-base h-9 md:h-12"
                min={obtenerFechaLocalYYYYMMDD()}
              />
              <p className="text-[10px] md:text-sm text-slate-500 mt-0.5">
                📅 Solo fechas actuales o futuras
              </p>
            </div>
          )}

          {/* Campo Estado */}
          <div className="space-y-1">
            <Label
              htmlFor="estado"
              className="text-xs md:text-base font-medium"
            >
              Estado
            </Label>
            <Select
              value={String(formData.estado ?? "")}
              onValueChange={(value: string) =>
                onFormChange({ ...formData, estado: value as EstadoBloque })
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
            {formData.es_plantilla && (
              <p className="text-[10px] md:text-sm text-blue-600 mt-0.5">
                📄 Plantilla: Reutilizable para diferentes fechas
              </p>
            )}
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
            {submitting ? "Creando..." : "Crear Bloque"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
