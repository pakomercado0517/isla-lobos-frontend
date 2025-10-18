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
    <div className="bg-white p-6 rounded-lg shadow-sm border">
      <div className="flex flex-col gap-4">
        {/* Título y botón crear */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Plantillas de Bloques
            </h1>
            <p className="text-gray-600">
              Administra las plantillas maestras para bloques horarios
            </p>
          </div>
          <Button onClick={onCreateClick} className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Nueva Plantilla
          </Button>
        </div>

        {/* Filtros */}
        <div className="flex gap-4 items-end">
          <div className="grid w-full max-w-sm items-center gap-1.5">
            <Label htmlFor="destino-filter">Destino</Label>
            <Select
              value={destinoSeleccionado}
              onValueChange={onDestinoChange}
            >
              <SelectTrigger>
                <SelectValue placeholder="Seleccionar destino" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos los destinos</SelectItem>
                <SelectItem value={DESTINOS.ISLA_LOBOS}>Isla de Lobos</SelectItem>
                <SelectItem value={DESTINOS.ARRECIFE_TUXPAN}>
                  Arrecife Tuxpan
                </SelectItem>
                <SelectItem value={DESTINOS.ARRECIFE_EN_MEDIO}>
                  Arrecife de en Medio
                </SelectItem>
                <SelectItem value={DESTINOS.ARRECIFE_TANHUIJO}>
                  Arrecife Tanhuijo
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid w-full max-w-sm items-center gap-1.5">
            <Label htmlFor="estado-filter">Estado</Label>
            <Select
              value={
                estadoSeleccionado === "todos"
                  ? "todos"
                  : estadoSeleccionado.toString()
              }
              onValueChange={(value) =>
                onEstadoChange(
                  value === "todos" ? "todos" : value === "true"
                )
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Seleccionar estado" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos</SelectItem>
                <SelectItem value="true">✅ Activas</SelectItem>
                <SelectItem value="false">❌ Inactivas</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button
            variant="outline"
            onClick={onRefresh}
            disabled={loading}
            className="flex items-center gap-2"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
            Actualizar
          </Button>
        </div>
      </div>
    </div>
  );
}