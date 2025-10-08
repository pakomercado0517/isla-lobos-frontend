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

interface EmbarcacionFormData {
  nombre: string;
  matricula: string;
  capacidad: number;
  tipo: "menor" | "mayor";
  estado: "disponible" | "en_uso" | "mantenimiento";
}

interface DialogCrearEmbarcacionProps {
  formData: EmbarcacionFormData;
  submitting: boolean;
  onFormDataChange: (data: EmbarcacionFormData) => void;
  onSubmit: (e: React.FormEvent) => void;
  onCancel: () => void;
}

export function DialogCrearEmbarcacion({
  formData,
  submitting,
  onFormDataChange,
  onSubmit,
  onCancel,
}: DialogCrearEmbarcacionProps) {
  const handleInputChange = (
    field: keyof EmbarcacionFormData,
    value: string | number
  ) => {
    onFormDataChange({ ...formData, [field]: value });
  };

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="nombre">Nombre de la Embarcación</Label>
        <Input
          id="nombre"
          value={formData.nombre}
          onChange={(e) => handleInputChange("nombre", e.target.value)}
          placeholder="Ej: Lancha María"
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="matricula">Matrícula</Label>
        <Input
          id="matricula"
          value={formData.matricula}
          onChange={(e) => handleInputChange("matricula", e.target.value)}
          placeholder="Ej: VER-001-ABC"
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="capacidad">Capacidad de Pasajeros</Label>
        <Input
          id="capacidad"
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
        <Label htmlFor="tipo">Tipo de Embarcación</Label>
        <Select
          value={formData.tipo}
          onValueChange={(value: "menor" | "mayor") =>
            handleInputChange("tipo", value)
          }
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="menor">Menor</SelectItem>
            <SelectItem value="mayor">Mayor</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="flex justify-end space-x-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancelar
        </Button>
        <Button type="submit" disabled={submitting}>
          {submitting ? "Creando..." : "Crear Embarcación"}
        </Button>
      </div>
    </form>
  );
}
