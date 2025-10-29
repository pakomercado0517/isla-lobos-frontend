"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
import { Textarea } from "@/components/ui/textarea";
import type {
  CrearCondicionMeteorologicaData,
  EstadoPuerto,
  NivelVisibilidad,
  FuenteMeteorologica,
} from "@/lib/types/clima";

interface DialogCrearCondicionProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCrear: (data: CrearCondicionMeteorologicaData) => Promise<void>;
  submitting: boolean;
}

export function DialogCrearCondicion({
  open,
  onOpenChange,
  onCrear,
  submitting,
}: DialogCrearCondicionProps) {
  const [formData, setFormData] = useState<CrearCondicionMeteorologicaData>({
    fecha_hora: new Date().toISOString().slice(0, 16),
    oleaje: 1.0,
    viento_velocidad: 15,
    viento_direccion: "NE",
    visibilidad: "buena",
    estado_puerto: "abierto",
    prediccion_5_dias: "",
    fuente: "CONAGUA",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onCrear(formData);
  };

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
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-base md:text-lg">
            Registrar Condición Meteorológica
          </DialogTitle>
          <DialogDescription className="text-xs md:text-sm">
            Ingrese los datos de las condiciones meteorológicas actuales
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-3 md:space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
            {/* Fecha y Hora */}
            <div className="md:col-span-2">
              <Label htmlFor="fecha_hora" className="text-xs md:text-sm">
                Fecha y Hora
              </Label>
              <Input
                id="fecha_hora"
                type="datetime-local"
                value={formData.fecha_hora}
                onChange={(e) =>
                  setFormData({ ...formData, fecha_hora: e.target.value })
                }
                required
                className="h-9 md:h-10 text-xs md:text-sm"
              />
            </div>

            {/* Oleaje */}
            <div>
              <Label htmlFor="oleaje" className="text-xs md:text-sm">
                Oleaje (metros)
              </Label>
              <Input
                id="oleaje"
                type="number"
                step="0.1"
                min="0"
                max="10"
                value={formData.oleaje}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    oleaje: parseFloat(e.target.value),
                  })
                }
                required
                className="h-9 md:h-10 text-xs md:text-sm"
              />
            </div>

            {/* Viento Velocidad */}
            <div>
              <Label htmlFor="viento_velocidad" className="text-xs md:text-sm">
                Viento (km/h)
              </Label>
              <Input
                id="viento_velocidad"
                type="number"
                min="0"
                max="100"
                value={formData.viento_velocidad}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    viento_velocidad: parseFloat(e.target.value),
                  })
                }
                required
                className="h-9 md:h-10 text-xs md:text-sm"
              />
            </div>

            {/* Viento Dirección */}
            <div>
              <Label htmlFor="viento_direccion" className="text-xs md:text-sm">
                Dirección del Viento
              </Label>
              <Input
                id="viento_direccion"
                type="text"
                placeholder="N, NE, E, SE, S, SW, W, NW"
                value={formData.viento_direccion}
                onChange={(e) =>
                  setFormData({ ...formData, viento_direccion: e.target.value })
                }
                required
                className="h-9 md:h-10 text-xs md:text-sm"
              />
            </div>

            {/* Visibilidad */}
            <div>
              <Label htmlFor="visibilidad" className="text-xs md:text-sm">
                Visibilidad
              </Label>
              <Select
                value={formData.visibilidad}
                onValueChange={(value: NivelVisibilidad) =>
                  setFormData({ ...formData, visibilidad: value })
                }
              >
                <SelectTrigger className="h-9 md:h-10 text-xs md:text-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="excelente" className="text-xs md:text-sm">
                    Excelente
                  </SelectItem>
                  <SelectItem value="buena" className="text-xs md:text-sm">
                    Buena
                  </SelectItem>
                  <SelectItem value="regular" className="text-xs md:text-sm">
                    Regular
                  </SelectItem>
                  <SelectItem value="baja" className="text-xs md:text-sm">
                    Baja
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Estado Puerto */}
            <div>
              <Label htmlFor="estado_puerto" className="text-xs md:text-sm">
                Estado del Puerto
              </Label>
              <Select
                value={formData.estado_puerto}
                onValueChange={(value: EstadoPuerto) =>
                  setFormData({ ...formData, estado_puerto: value })
                }
              >
                <SelectTrigger className="h-9 md:h-10 text-xs md:text-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="abierto" className="text-xs md:text-sm">
                    🟢 Abierto
                  </SelectItem>
                  <SelectItem
                    value="restricciones"
                    className="text-xs md:text-sm"
                  >
                    🟡 Restricciones
                  </SelectItem>
                  <SelectItem value="cerrado" className="text-xs md:text-sm">
                    🔴 Cerrado
                  </SelectItem>
                  <SelectItem value="emergencia" className="text-xs md:text-sm">
                    ⚡ Emergencia
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Fuente */}
            <div>
              <Label htmlFor="fuente" className="text-xs md:text-sm">
                Fuente
              </Label>
              <Select
                value={formData.fuente}
                onValueChange={(value: FuenteMeteorologica) =>
                  setFormData({ ...formData, fuente: value })
                }
              >
                <SelectTrigger className="h-9 md:h-10 text-xs md:text-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="CONAGUA" className="text-xs md:text-sm">
                    CONAGUA
                  </SelectItem>
                  <SelectItem value="NOAA" className="text-xs md:text-sm">
                    NOAA
                  </SelectItem>
                  <SelectItem value="Capitanía" className="text-xs md:text-sm">
                    Capitanía
                  </SelectItem>
                  <SelectItem value="Manual" className="text-xs md:text-sm">
                    Manual
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Predicción */}
            <div className="md:col-span-2">
              <Label htmlFor="prediccion_5_dias" className="text-xs md:text-sm">
                Predicción 5 días (opcional)
              </Label>
              <Textarea
                id="prediccion_5_dias"
                value={formData.prediccion_5_dias}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    prediccion_5_dias: e.target.value,
                  })
                }
                placeholder="Descripción de las condiciones esperadas..."
                rows={3}
                className="text-xs md:text-sm"
              />
            </div>
          </div>

          <DialogFooter className="flex-col gap-2 md:flex-row">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={submitting}
              className="w-full md:w-auto h-9 md:h-10 text-xs md:text-sm"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={submitting}
              className="w-full md:w-auto h-9 md:h-10 text-xs md:text-sm"
            >
              {submitting ? "Guardando..." : "Crear Condición"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
