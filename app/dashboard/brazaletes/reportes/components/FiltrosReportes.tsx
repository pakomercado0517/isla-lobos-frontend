import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Filter, RefreshCw, TrendingUp } from "lucide-react";

interface FiltrosReportesProps {
  fechaInicio: string;
  fechaFin: string;
  prestadorFiltro: string;
  generandoReporte: boolean;
  onFechaInicioChange: (value: string) => void;
  onFechaFinChange: (value: string) => void;
  onPrestadorFiltroChange: (value: string) => void;
  onGenerarReporte: () => void;
}

export function FiltrosReportes({
  fechaInicio,
  fechaFin,
  prestadorFiltro,
  generandoReporte,
  onFechaInicioChange,
  onFechaFinChange,
  onPrestadorFiltroChange,
  onGenerarReporte,
}: FiltrosReportesProps) {
  return (
    <div className="bg-white p-6 rounded-lg border">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Filter className="w-5 h-5" />
          <h3 className="text-lg font-semibold">Filtros de Reporte</h3>
        </div>
        <Badge variant="outline" className="bg-blue-50 text-blue-700">
          Brazaletes Universales
        </Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor="fecha_inicio">Fecha Inicio</Label>
          <Input
            id="fecha_inicio"
            type="date"
            value={fechaInicio}
            onChange={(e) => onFechaInicioChange(e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="fecha_fin">Fecha Fin</Label>
          <Input
            id="fecha_fin"
            type="date"
            value={fechaFin}
            onChange={(e) => onFechaFinChange(e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="prestador">Prestador</Label>
          <select
            id="prestador"
            value={prestadorFiltro}
            onChange={(e) => onPrestadorFiltroChange(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
          >
            <option value="todos">Todos los Prestadores</option>
            {/* Aquí se cargarían los prestadores disponibles */}
          </select>
        </div>
      </div>

      <div className="flex justify-end mt-4">
        <Button onClick={onGenerarReporte} disabled={generandoReporte}>
          {generandoReporte ? (
            <>
              <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
              Generando...
            </>
          ) : (
            <>
              <TrendingUp className="w-4 h-4 mr-2" />
              Generar Reporte
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
