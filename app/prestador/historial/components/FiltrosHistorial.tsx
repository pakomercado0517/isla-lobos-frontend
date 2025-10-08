"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Filter } from "lucide-react";
// Tipos para el historial
export interface HistorialFilters {
  fechaInicio: string;
  fechaFin: string;
  estado: string;
  page: number;
  limit: number;
}

interface FiltrosHistorialProps {
  filters: HistorialFilters;
  onFilterChange: (key: keyof HistorialFilters, value: string | number) => void;
}

export function FiltrosHistorial({
  filters,
  onFilterChange,
}: FiltrosHistorialProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Filter className="w-5 h-5" />
          Filtros de Búsqueda
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <Label htmlFor="fechaInicio">Fecha Inicio</Label>
            <Input
              id="fechaInicio"
              type="date"
              value={filters.fechaInicio}
              onChange={(e) => onFilterChange("fechaInicio", e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="fechaFin">Fecha Fin</Label>
            <Input
              id="fechaFin"
              type="date"
              value={filters.fechaFin}
              onChange={(e) => onFilterChange("fechaFin", e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="estado">Estado</Label>
            <Select
              value={filters.estado}
              onValueChange={(value) => onFilterChange("estado", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Todos los estados" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos los estados</SelectItem>
                <SelectItem value="programada">Programada</SelectItem>
                <SelectItem value="en_curso">En Curso</SelectItem>
                <SelectItem value="completada">Completada</SelectItem>
                <SelectItem value="cancelada">Cancelada</SelectItem>
                <SelectItem value="cancelada_por_clima">
                  Cancelada por Clima
                </SelectItem>
                <SelectItem value="cancelada_capitaria">
                  Cancelada por Capitanía
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="limit">Resultados por página</Label>
            <Select
              value={filters.limit.toString()}
              onValueChange={(value) =>
                onFilterChange("limit", parseInt(value))
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="10">10</SelectItem>
                <SelectItem value="25">25</SelectItem>
                <SelectItem value="50">50</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
