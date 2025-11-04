"use client";

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
import { EmbarcacionFormData } from "@/lib/types/embarcacion";

interface DialogEditarEmbarcacionProps {
  formData: EmbarcacionFormData;
  submitting: boolean;
  onFormDataChange: (data: EmbarcacionFormData) => void;
  onSubmit: (e: React.FormEvent) => void;
  onCancel: () => void;
}

export function DialogEditarEmbarcacion({
  formData,
  submitting,
  onFormDataChange,
  onSubmit,
  onCancel,
}: DialogEditarEmbarcacionProps) {
  const handleInputChange = (
    field: keyof EmbarcacionFormData,
    value: string | number
  ) => {
    onFormDataChange({ ...formData, [field]: value });
  };

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="edit-nombre">Nombre de la Embarcación</Label>
        <Input
          id="edit-nombre"
          value={formData.nombre}
          onChange={(e) => handleInputChange("nombre", e.target.value)}
          placeholder="Ej: Lancha María"
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="edit-capacidad">Capacidad de Pasajeros</Label>
        <Input
          id="edit-capacidad"
          type="number"
          min="1"
          value={formData.capacidad}
          onChange={(e) =>
            handleInputChange("capacidad", parseInt(e.target.value) || 0)
          }
          placeholder="Ej: 25"
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="edit-estado">Estado</Label>
        <Select
          value={formData.estado}
          onValueChange={(value: "disponible" | "en_uso" | "mantenimiento") =>
            handleInputChange("estado", value)
          }
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="disponible">Disponible</SelectItem>
            <SelectItem value="en_uso">En Uso</SelectItem>
            <SelectItem value="mantenimiento">Mantenimiento</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="flex justify-end space-x-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancelar
        </Button>
        <Button type="submit" disabled={submitting}>
          {submitting ? "Actualizando..." : "Actualizar Embarcación"}
        </Button>
      </div>
    </form>
  );
}
