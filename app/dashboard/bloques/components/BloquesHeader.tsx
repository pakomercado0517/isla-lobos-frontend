import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, RefreshCw, Settings } from "lucide-react";
import { DESTINOS, type DestinoType } from "@/lib/types/salida";

interface BloquesHeaderProps {
  fechaSeleccionada: string;
  destinoSeleccionado: DestinoType | "todos";
  onFechaChange: (fecha: string) => void;
  onDestinoChange: (destino: DestinoType | "todos") => void;
  onRefresh: () => void;
  onCreateClick: () => void;
  onConfigClick: () => void; // Nueva función para configurar bloques por destino
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
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">
          Gestión de Bloques
        </h1>
        <p className="text-slate-600">
          Administra horarios y capacidad por destino - Sistema Híbrido
        </p>
      </div>
      <div className="mt-4 sm:mt-0 flex items-center space-x-4">
        <div className="flex items-center space-x-2">
          <Label htmlFor="destino" className="text-sm font-medium">
            Destino:
          </Label>
          <Select value={destinoSeleccionado} onValueChange={onDestinoChange}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Seleccionar destino" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todos">Todos los destinos</SelectItem>
              {Object.values(DESTINOS).map((destino) => (
                <SelectItem key={destino} value={destino}>
                  {destino}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
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
        <Button onClick={onConfigClick} variant="outline">
          <Settings className="w-4 h-4 mr-2" />
          Configurar Destinos
        </Button>
        <Button onClick={onCreateClick}>
          <Plus className="w-4 h-4 mr-2" />
          Nuevo Bloque
        </Button>
      </div>
    </div>
  );
}
