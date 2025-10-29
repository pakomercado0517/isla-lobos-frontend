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
import { Plus, RefreshCw, Settings } from "lucide-react";
import { DESTINOS, type DestinoType } from "@/lib/types/salida";
import {
  obtenerFechaActualMexico,
  obtenerFechaMaximaBloques,
} from "@/lib/utils";

interface BloquesHeaderProps {
  fechaSeleccionada: string;
  destinoSeleccionado: DestinoType | "todos";
  onFechaChange: (fecha: string) => void;
  onDestinoChange: (destino: DestinoType | "todos") => void;
  onRefresh: () => void;
  onCreateClick: () => void;
  onConfigClick: () => void;
}

export function BloquesHeader({
  fechaSeleccionada,
  destinoSeleccionado,
  onFechaChange,
  onDestinoChange,
  onRefresh,
  onCreateClick,
  onConfigClick,
}: BloquesHeaderProps) {
  return (
    <div className="space-y-4">
      {/* Título */}
      <div>
        <h1 className="text-xl md:text-2xl font-bold text-slate-900">
          Gestión de Bloques
        </h1>
        <p className="text-xs md:text-sm text-slate-600 mt-0.5">
          Administra horarios y capacidad por destino - Sistema Híbrido
        </p>
      </div>

      {/* Filtros y acciones */}
      <div className="flex flex-col gap-3">
        {/* Fila de filtros */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {/* Filtro Destino */}
          <div className="space-y-1">
            <Label htmlFor="destino" className="text-xs md:text-sm font-medium">
              Destino
            </Label>
            <Select value={destinoSeleccionado} onValueChange={onDestinoChange}>
              <SelectTrigger className="w-full h-9 md:h-10 text-xs md:text-sm">
                <SelectValue placeholder="Seleccionar destino" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos" className="text-xs md:text-sm">
                  Todos los destinos
                </SelectItem>
                {Object.values(DESTINOS).map((destino) => (
                  <SelectItem
                    key={destino}
                    value={destino}
                    className="text-xs md:text-sm"
                  >
                    {destino}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Filtro Fecha */}
          <div className="space-y-1">
            <Label htmlFor="fecha" className="text-xs md:text-sm font-medium">
              Fecha
            </Label>
            <Input
              id="fecha"
              type="date"
              value={fechaSeleccionada}
              onChange={(e) => onFechaChange(e.target.value)}
              className="w-full h-9 md:h-10 text-xs md:text-sm"
              min={obtenerFechaActualMexico()}
              max={obtenerFechaMaximaBloques()}
              title="Solo se permiten fechas desde hoy hasta 15 días en el futuro"
            />
          </div>
        </div>

        {/* Fila de botones */}
        <div className="flex flex-col sm:flex-row gap-2">
          <Button
            onClick={onRefresh}
            variant="outline"
            size="sm"
            className="w-full sm:w-auto h-9 text-xs md:text-sm"
          >
            <RefreshCw className="w-3.5 h-3.5 md:w-4 md:h-4 mr-1.5" />
            Actualizar
          </Button>
          <Button
            onClick={onConfigClick}
            variant="outline"
            size="sm"
            className="w-full sm:w-auto h-9 text-xs md:text-sm"
          >
            <Settings className="w-3.5 h-3.5 md:w-4 md:h-4 mr-1.5" />
            <span className="hidden sm:inline">Configurar Destinos</span>
            <span className="sm:hidden">Configurar</span>
          </Button>
          <Button
            onClick={onCreateClick}
            size="sm"
            className="w-full sm:w-auto h-9 text-xs md:text-sm font-medium sm:ml-auto"
          >
            <Plus className="w-3.5 h-3.5 md:w-4 md:h-4 mr-1.5" />
            Nuevo Bloque
          </Button>
        </div>
      </div>
    </div>
  );
}
