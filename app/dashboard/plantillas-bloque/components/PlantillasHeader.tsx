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
    <div className="bg-white p-3 md:p-6 rounded-lg shadow-sm border space-y-3 md:space-y-4">
      {/* Título y botón crear */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-gray-900">
            Plantillas de Bloques
          </h1>
          <p className="text-xs md:text-sm text-gray-600 mt-0.5">
            Administra las plantillas maestras para bloques horarios
          </p>
        </div>
        <Button
          onClick={onCreateClick}
          className="w-full sm:w-auto h-9 md:h-10 text-xs md:text-sm font-medium flex-shrink-0"
        >
          <Plus className="h-3.5 w-3.5 md:h-4 md:w-4 mr-1.5" />
          Nueva Plantilla
        </Button>
      </div>

      {/* Filtros */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        <div className="space-y-1">
          <Label htmlFor="destino-filter" className="text-xs md:text-sm">
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
              <SelectItem
                value={DESTINOS.ISLA_LOBOS}
                className="text-xs md:text-sm"
              >
                Isla de Lobos
              </SelectItem>
              <SelectItem
                value={DESTINOS.ARRECIFE_TUXPAN}
                className="text-xs md:text-sm"
              >
                Arrecife Tuxpan
              </SelectItem>
              <SelectItem
                value={DESTINOS.ARRECIFE_EN_MEDIO}
                className="text-xs md:text-sm"
              >
                Arrecife de en Medio
              </SelectItem>
              <SelectItem
                value={DESTINOS.ARRECIFE_TANHUIJO}
                className="text-xs md:text-sm"
              >
                Arrecife Tanhuijo
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-1">
          <Label htmlFor="estado-filter" className="text-xs md:text-sm">
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

        <Button
          variant="outline"
          onClick={onRefresh}
          disabled={loading}
          className="h-9 md:h-10 text-xs md:text-sm sm:col-span-2 lg:col-span-1 lg:self-end"
        >
          <RefreshCw
            className={`h-3.5 w-3.5 md:h-4 md:w-4 mr-1.5 ${
              loading ? "animate-spin" : ""
            }`}
          />
          Actualizar
        </Button>
      </div>
    </div>
  );
}
