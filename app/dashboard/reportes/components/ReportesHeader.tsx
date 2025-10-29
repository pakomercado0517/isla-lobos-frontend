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
    <div className="flex flex-col gap-4">
      <div className="min-w-0">
        <h1 className="text-xl md:text-2xl font-bold text-slate-900 truncate">
          Reportes y Estadísticas
        </h1>
        <p className="text-xs md:text-sm text-slate-600">
          Análisis detallado de operaciones y rendimiento
        </p>
      </div>
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:gap-4">
        <div className="grid grid-cols-2 gap-2 flex-1">
          <div className="space-y-1">
            <Label
              htmlFor="fecha-inicio"
              className="text-xs md:text-sm font-medium"
            >
              Desde:
            </Label>
            <Input
              id="fecha-inicio"
              type="date"
              value={fechaInicio}
              onChange={(e) => onFechaInicioChange(e.target.value)}
              className="h-9 md:h-10 text-xs md:text-sm"
            />
          </div>
          <div className="space-y-1">
            <Label
              htmlFor="fecha-fin"
              className="text-xs md:text-sm font-medium"
            >
              Hasta:
            </Label>
            <Input
              id="fecha-fin"
              type="date"
              value={fechaFin}
              onChange={(e) => onFechaFinChange(e.target.value)}
              className="h-9 md:h-10 text-xs md:text-sm"
            />
          </div>
        </div>
        <Button
          onClick={onRefresh}
          variant="outline"
          size="sm"
          className="h-9 md:h-10 text-xs md:text-sm w-full md:w-auto md:self-end"
        >
          <RefreshCw className="w-3 h-3 md:w-4 md:h-4 mr-2" />
          Actualizar
        </Button>
      </div>
    </div>
  );
}
