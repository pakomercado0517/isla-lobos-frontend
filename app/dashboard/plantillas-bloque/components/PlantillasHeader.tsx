import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, RefreshCw } from "lucide-react";
import { DESTINOS, type DestinoType } from "@/lib/types/salida";

interface PlantillasHeaderProps {
  destinoSeleccionado: DestinoType | "todos";
  estadoSeleccionado: boolean | "todos";
  onDestinoChange: (destino: DestinoType | "todos") => void;
  onEstadoChange: (estado: boolean | "todos") => void;
  onRefresh: () => void;
  onCreateClick: () => void;
  loading: boolean;
}

export function PlantillasHeader({
  destinoSeleccionado,
  estadoSeleccionado,
  onDestinoChange,
  onEstadoChange,
  onRefresh,
  onCreateClick,
  loading,
}: PlantillasHeaderProps) {
  return (
    <div className="space-y-4">
      {/* Título */}
      <div>
        <h1 className="text-xl md:text-2xl font-bold text-slate-900">
          Plantillas de Bloques
        </h1>
        <p className="text-xs md:text-sm text-slate-600 mt-0.5">
          Administra las plantillas maestras para bloques horarios
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

          {/* Filtro Estado */}
          <div className="space-y-1">
            <Label htmlFor="estado" className="text-xs md:text-sm font-medium">
              Estado
            </Label>
            <Select
              value={
                estadoSeleccionado === "todos"
                  ? "todos"
                  : estadoSeleccionado.toString()
              }
              onValueChange={(value) =>
                onEstadoChange(value === "todos" ? "todos" : value === "true")
              }
            >
              <SelectTrigger className="w-full h-9 md:h-10 text-xs md:text-sm">
                <SelectValue placeholder="Seleccionar estado" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos" className="text-xs md:text-sm">
                  Todos
                </SelectItem>
                <SelectItem value="true" className="text-xs md:text-sm">
                  ✅ Activas
                </SelectItem>
                <SelectItem value="false" className="text-xs md:text-sm">
                  ❌ Inactivas
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Fila de botones */}
        <div className="flex flex-col sm:flex-row gap-2">
          <Button
            onClick={onRefresh}
            variant="outline"
            size="sm"
            disabled={loading}
            className="w-full sm:w-auto h-9 text-xs md:text-sm"
          >
            <RefreshCw
              className={`w-3.5 h-3.5 md:w-4 md:h-4 mr-1.5 ${
                loading ? "animate-spin" : ""
              }`}
            />
            Actualizar
          </Button>
          <Button
            onClick={onCreateClick}
            size="sm"
            className="w-full sm:w-auto h-9 text-xs md:text-sm font-medium sm:ml-auto"
          >
            <Plus className="w-3.5 h-3.5 md:w-4 md:h-4 mr-1.5" />
            Nueva Plantilla
          </Button>
        </div>
      </div>
    </div>
  );
}
