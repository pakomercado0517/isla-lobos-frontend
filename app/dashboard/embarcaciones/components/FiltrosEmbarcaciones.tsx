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
      <CardHeader className="pb-3 md:pb-6">
        <CardTitle className="flex items-center text-base md:text-lg">
          <Filter className="w-4 h-4 md:w-5 md:h-5 mr-2" />
          Filtros y Búsqueda
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3 md:gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-2.5 md:top-3 h-3 w-3 md:h-4 md:w-4 text-gray-400" />
            <Input
              placeholder="Buscar embarcación..."
              value={busqueda}
              onChange={(e) => onBusquedaChange(e.target.value)}
              className="pl-9 md:pl-10 h-9 md:h-10 text-xs md:text-sm"
            />
          </div>
          <Select value={filtroEstado} onValueChange={onFiltroEstadoChange}>
            <SelectTrigger className="h-9 md:h-10 text-xs md:text-sm">
              <SelectValue placeholder="Estado" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todos" className="text-xs md:text-sm">
                Todos los estados
              </SelectItem>
              <SelectItem value="disponible" className="text-xs md:text-sm">
                Disponible
              </SelectItem>
              <SelectItem value="en_uso" className="text-xs md:text-sm">
                En uso
              </SelectItem>
              <SelectItem value="mantenimiento" className="text-xs md:text-sm">
                Mantenimiento
              </SelectItem>
              <SelectItem
                value="pendiente_autorizacion"
                className="text-xs md:text-sm"
              >
                Pendiente de Autorización
              </SelectItem>
            </SelectContent>
          </Select>
          <Select value={filtroTipo} onValueChange={onFiltroTipoChange}>
            <SelectTrigger className="h-9 md:h-10 text-xs md:text-sm">
              <SelectValue placeholder="Tipo" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todos" className="text-xs md:text-sm">
                Todos los tipos
              </SelectItem>
              <SelectItem value="menor" className="text-xs md:text-sm">
                Embarcación Menor
              </SelectItem>
              <SelectItem value="mayor" className="text-xs md:text-sm">
                Embarcación Mayor
              </SelectItem>
            </SelectContent>
          </Select>
          <div className="flex items-center justify-center md:justify-start text-xs md:text-sm text-gray-600 py-2 md:py-0">
            <span>
              {totalFiltradas} de {totalEmbarcaciones} embarcaciones
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
