"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Calendar, X } from "lucide-react";

interface FiltrosFechaProps {
  fechaInicio: string;
  fechaFin: string;
  onFechaInicioChange: (fecha: string) => void;
  onFechaFinChange: (fecha: string) => void;
  onLimpiar: () => void;
}

export function FiltrosFecha({
  fechaInicio,
  fechaFin,
  onFechaInicioChange,
  onFechaFinChange,
  onLimpiar,
}: FiltrosFechaProps) {
  const tieneFiltros = fechaInicio !== "" || fechaFin !== "";

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base sm:text-lg flex items-center gap-2">
          <Calendar className="w-4 h-4 sm:w-5 sm:h-5" />
          Filtrar por Fecha
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
          <div className="space-y-2">
            <Label htmlFor="fecha-inicio" className="text-xs sm:text-sm">
              Fecha Inicio
            </Label>
            <Input
              id="fecha-inicio"
              type="date"
              value={fechaInicio}
              onChange={(e) => onFechaInicioChange(e.target.value)}
              className="text-xs sm:text-sm"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="fecha-fin" className="text-xs sm:text-sm">
              Fecha Fin
            </Label>
            <Input
              id="fecha-fin"
              type="date"
              value={fechaFin}
              onChange={(e) => onFechaFinChange(e.target.value)}
              className="text-xs sm:text-sm"
            />
          </div>
        </div>
        {tieneFiltros && (
          <div className="mt-3 md:mt-4 pt-3 md:pt-4 border-t">
            <Button
              variant="outline"
              size="sm"
              onClick={onLimpiar}
              className="w-full sm:w-auto text-xs sm:text-sm"
            >
              <X className="w-3 h-3 sm:w-4 sm:h-4 mr-1.5" />
              Limpiar Filtros
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
