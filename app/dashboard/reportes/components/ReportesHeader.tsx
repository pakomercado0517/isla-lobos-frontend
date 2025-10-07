import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RefreshCw } from "lucide-react";

interface ReportesHeaderProps {
  fechaInicio: string;
  fechaFin: string;
  onFechaInicioChange: (fecha: string) => void;
  onFechaFinChange: (fecha: string) => void;
  onRefresh: () => void;
}

export function ReportesHeader({
  fechaInicio,
  fechaFin,
  onFechaInicioChange,
  onFechaFinChange,
  onRefresh,
}: ReportesHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">
          Reportes y Estadísticas
        </h1>
        <p className="text-slate-600">
          Análisis detallado de operaciones y rendimiento
        </p>
      </div>
      <div className="mt-4 sm:mt-0 flex items-center space-x-4">
        <div className="flex items-center space-x-2">
          <Label htmlFor="fecha-inicio" className="text-sm font-medium">
            Desde:
          </Label>
          <Input
            id="fecha-inicio"
            type="date"
            value={fechaInicio}
            onChange={(e) => onFechaInicioChange(e.target.value)}
            className="w-auto"
          />
        </div>
        <div className="flex items-center space-x-2">
          <Label htmlFor="fecha-fin" className="text-sm font-medium">
            Hasta:
          </Label>
          <Input
            id="fecha-fin"
            type="date"
            value={fechaFin}
            onChange={(e) => onFechaFinChange(e.target.value)}
            className="w-auto"
          />
        </div>
        <Button onClick={onRefresh} variant="outline" size="sm">
          <RefreshCw className="w-4 h-4 mr-2" />
          Actualizar
        </Button>
      </div>
    </div>
  );
}

