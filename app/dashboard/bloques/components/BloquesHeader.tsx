import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, RefreshCw } from "lucide-react";

interface BloquesHeaderProps {
  fechaSeleccionada: string;
  onFechaChange: (fecha: string) => void;
  onRefresh: () => void;
  onCreateClick: () => void;
}

export function BloquesHeader({
  fechaSeleccionada,
  onFechaChange,
  onRefresh,
  onCreateClick,
}: BloquesHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">
          Gestión de Bloques
        </h1>
        <p className="text-slate-600">
          Administra horarios y capacidad de salidas
        </p>
      </div>
      <div className="mt-4 sm:mt-0 flex items-center space-x-4">
        <div className="flex items-center space-x-2">
          <Label htmlFor="fecha" className="text-sm font-medium">
            Fecha:
          </Label>
          <Input
            id="fecha"
            type="date"
            value={fechaSeleccionada}
            onChange={(e) => onFechaChange(e.target.value)}
            className="w-auto"
          />
        </div>
        <Button onClick={onRefresh} variant="outline" size="sm">
          <RefreshCw className="w-4 h-4 mr-2" />
          Actualizar
        </Button>
        <Button onClick={onCreateClick}>
          <Plus className="w-4 h-4 mr-2" />
          Nuevo Bloque
        </Button>
      </div>
    </div>
  );
}
