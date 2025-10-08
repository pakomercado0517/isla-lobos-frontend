"use client";

import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { RefreshCw, AlertTriangle, Calendar } from "lucide-react";

interface EstadosHistorialProps {
  loading: boolean;
  error?: string;
  salidasLength: number;
  onLimpiarFiltros: () => void;
}

export function EstadosHistorial({
  loading,
  error,
  salidasLength,
  onLimpiarFiltros,
}: EstadosHistorialProps) {
  // Estado de error
  if (error) {
    return (
      <Alert variant="destructive">
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  // Estado de carga
  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-4 text-[var(--isla-teal)]" />
          <p className="text-gray-600">Cargando historial...</p>
        </div>
      </div>
    );
  }

  // Estado vacío
  if (salidasLength === 0) {
    return (
      <div className="text-center py-12 bg-gray-50 rounded-lg">
        <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          No se encontraron salidas
        </h3>
        <p className="text-gray-600 mb-4">
          No hay salidas que coincidan con los filtros seleccionados
        </p>
        <Button variant="outline" onClick={onLimpiarFiltros}>
          Limpiar Filtros
        </Button>
      </div>
    );
  }

  // No hay estado especial que mostrar
  return null;
}
