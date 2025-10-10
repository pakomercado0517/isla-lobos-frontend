"use client";

import { useState } from "react";
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

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Registrar Condición Meteorológica</DialogTitle>
          <DialogDescription>
            Ingrese los datos de las condiciones meteorológicas actuales
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            {/* Fecha y Hora */}
            <div className="col-span-2">
              <Label htmlFor="fecha_hora">Fecha y Hora</Label>
              <Input
                id="fecha_hora"
                type="datetime-local"
                value={formData.fecha_hora}
                onChange={(e) =>
                  setFormData({ ...formData, fecha_hora: e.target.value })
                }
                required
              />
            </div>

            {/* Oleaje */}
            <div>
              <Label htmlFor="oleaje">Oleaje (metros)</Label>
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
              />
            </div>

            {/* Viento Velocidad */}
            <div>
              <Label htmlFor="viento_velocidad">Viento (km/h)</Label>
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
              />
            </div>

            {/* Viento Dirección */}
            <div>
              <Label htmlFor="viento_direccion">Dirección del Viento</Label>
              <Input
                id="viento_direccion"
                type="text"
                placeholder="N, NE, E, SE, S, SW, W, NW"
                value={formData.viento_direccion}
                onChange={(e) =>
                  setFormData({ ...formData, viento_direccion: e.target.value })
                }
                required
              />
            </div>

            {/* Visibilidad */}
            <div>
              <Label htmlFor="visibilidad">Visibilidad</Label>
              <Select
                value={formData.visibilidad}
                onValueChange={(value: NivelVisibilidad) =>
                  setFormData({ ...formData, visibilidad: value })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="excelente">Excelente</SelectItem>
                  <SelectItem value="buena">Buena</SelectItem>
                  <SelectItem value="regular">Regular</SelectItem>
                  <SelectItem value="baja">Baja</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Estado Puerto */}
            <div>
              <Label htmlFor="estado_puerto">Estado del Puerto</Label>
              <Select
                value={formData.estado_puerto}
                onValueChange={(value: EstadoPuerto) =>
                  setFormData({ ...formData, estado_puerto: value })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="abierto">🟢 Abierto</SelectItem>
                  <SelectItem value="restricciones">
                    🟡 Restricciones
                  </SelectItem>
                  <SelectItem value="cerrado">🔴 Cerrado</SelectItem>
                  <SelectItem value="emergencia">⚡ Emergencia</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Fuente */}
            <div>
              <Label htmlFor="fuente">Fuente</Label>
              <Select
                value={formData.fuente}
                onValueChange={(value: FuenteMeteorologica) =>
                  setFormData({ ...formData, fuente: value })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="CONAGUA">CONAGUA</SelectItem>
                  <SelectItem value="NOAA">NOAA</SelectItem>
                  <SelectItem value="Capitanía">Capitanía</SelectItem>
                  <SelectItem value="Manual">Manual</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Predicción */}
            <div className="col-span-2">
              <Label htmlFor="prediccion_5_dias">
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
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={submitting}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={submitting}>
              {submitting ? "Guardando..." : "Crear Condición"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
