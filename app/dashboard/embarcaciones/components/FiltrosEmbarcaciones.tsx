import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Filter, Search } from "lucide-react";

interface FiltrosEmbarcacionesProps {
  busqueda: string;
  onBusquedaChange: (value: string) => void;
  filtroEstado: string;
  onFiltroEstadoChange: (value: string) => void;
  filtroTipo: string;
  onFiltroTipoChange: (value: string) => void;
  totalFiltradas: number;
  totalEmbarcaciones: number;
}

export function FiltrosEmbarcaciones({
  busqueda,
  onBusquedaChange,
  filtroEstado,
  onFiltroEstadoChange,
  filtroTipo,
  onFiltroTipoChange,
  totalFiltradas,
  totalEmbarcaciones,
}: FiltrosEmbarcacionesProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Filter className="w-5 h-5 mr-2" />
          Filtros y Búsqueda
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Buscar embarcación..."
              value={busqueda}
              onChange={(e) => onBusquedaChange(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={filtroEstado} onValueChange={onFiltroEstadoChange}>
            <SelectTrigger>
              <SelectValue placeholder="Estado" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todos">Todos los estados</SelectItem>
              <SelectItem value="disponible">Disponible</SelectItem>
              <SelectItem value="en_uso">En uso</SelectItem>
              <SelectItem value="mantenimiento">Mantenimiento</SelectItem>
            </SelectContent>
          </Select>
          <Select value={filtroTipo} onValueChange={onFiltroTipoChange}>
            <SelectTrigger>
              <SelectValue placeholder="Tipo" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todos">Todos los tipos</SelectItem>
              <SelectItem value="menor">Embarcación Menor</SelectItem>
              <SelectItem value="mayor">Embarcación Mayor</SelectItem>
            </SelectContent>
          </Select>
          <div className="flex items-center text-sm text-gray-600">
            <span>
              {totalFiltradas} de {totalEmbarcaciones} embarcaciones
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
