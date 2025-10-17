import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
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
  destino: DestinoType; // 🆕 NUEVO: Campo requerido
  fecha?: string; // 🆕 OPCIONAL: Para plantillas
  estado: EstadoBloque;
  es_plantilla?: boolean; // 🆕 NUEVO: Indica si es plantilla
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
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Crear Nuevo Bloque</DialogTitle>
          <DialogDescription>
            Define un bloque horario para un destino específico. Puedes crear plantillas reutilizables o bloques para fechas específicas.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          {/* Campo Destino */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="destino" className="text-right">
              Destino *
            </Label>
            <Select value={formData.destino} onValueChange={(value: DestinoType) => 
              onFormChange({ ...formData, destino: value })
            }>
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Seleccionar destino" />
              </SelectTrigger>
              <SelectContent>
                {Object.values(DESTINOS).map((destino) => (
                  <SelectItem key={destino} value={destino}>
                    {destino}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Checkbox Plantilla */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right">
              Tipo
            </Label>
            <div className="col-span-3 flex items-center space-x-2">
              <Checkbox
                id="es_plantilla"
                checked={formData.es_plantilla || false}
                onCheckedChange={(checked) => {
                  const newFormData = { 
                    ...formData, 
                    es_plantilla: !!checked
                  };
                  
                  // Si se marca como plantilla, limpiar fecha y mantener estado actual
                  // Si se desmarca, poner fecha actual y asegurar estado activo
                  if (checked) {
                    newFormData.fecha = undefined;
                    // Mantener el estado seleccionado (por defecto ACTIVO)
                  } else {
                    if (!newFormData.fecha) {
                      newFormData.fecha = obtenerFechaLocalYYYYMMDD();
                    }
                    newFormData.estado = EstadoBloque.ACTIVO;
                  }
                  
                  onFormChange(newFormData);
                }
                }
              />
              <Label htmlFor="es_plantilla" className="text-sm">
                Crear como plantilla reutilizable
              </Label>
              <div className="ml-2">
                <Info className="w-4 h-4 text-slate-500" />
              </div>
            </div>
          </div>

          {/* Info sobre plantillas */}
          {formData.es_plantilla && (
            <div className="bg-blue-50 border border-blue-200 rounded-md p-3">
              <p className="text-sm text-blue-700">
                💡 <strong>Plantilla Reutilizable:</strong> Se creará un bloque modelo sin fecha específica. 
                Los prestadores podrán usar este bloque para cualquier día que necesiten.
              </p>
              <p className="text-xs text-blue-600 mt-1">
                ✨ No necesitas especificar fecha - el sistema la manejará automáticamente
              </p>
            </div>
          )}

          {/* Campo Nombre */}
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
              placeholder={formData.es_plantilla ? "Matutino" : "Bloque Matutino - Fecha Específica"}
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="hora_inicio" className="text-right">
              Inicio
            </Label>
            <Input
              id="hora_inicio"
              type="time"
              value={formData.hora_inicio}
              onChange={(e) =>
                onFormChange({ ...formData, hora_inicio: e.target.value })
              }
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="hora_fin" className="text-right">
              Fin
            </Label>
            <Input
              id="hora_fin"
              type="time"
              value={formData.hora_fin}
              onChange={(e) =>
                onFormChange({ ...formData, hora_fin: e.target.value })
              }
              className="col-span-3"
            />
          </div>
          {/* Campo Capacidad */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="capacidad_total" className="text-right">
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
              className="col-span-3"
              min="1"
              max="150"
              placeholder="Número total de pasajeros"
            />
          </div>

          {/* Campo Fecha - Solo si NO es plantilla */}
          {!formData.es_plantilla && (
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="fecha" className="text-right">
                Fecha *
              </Label>
              <div className="col-span-3">
                <Input
                  id="fecha"
                  type="date"
                  value={formData.fecha || ""}
                  onChange={(e) =>
                    onFormChange({ ...formData, fecha: e.target.value })
                  }
                  className="w-full"
                  min={obtenerFechaLocalYYYYMMDD()}
                />
                <p className="text-xs text-slate-500 mt-1">
                  Solo se permiten fechas actuales o futuras
                </p>
              </div>
            </div>
          )}

          {/* Campo Estado */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="estado" className="text-right">
              Estado
            </Label>
            <Select value={formData.estado} onValueChange={(value: EstadoBloque) => 
              onFormChange({ ...formData, estado: value })
            }>
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
            {formData.es_plantilla && (
              <p className="col-span-3 text-xs text-blue-600 mt-1">
                📄 Plantilla: Este bloque se puede reutilizar para diferentes fechas
              </p>
            )}
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
            {submitting ? "Creando..." : "Crear Bloque"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
