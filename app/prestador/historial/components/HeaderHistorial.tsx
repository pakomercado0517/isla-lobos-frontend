"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { RefreshCw } from "lucide-react";

interface HeaderHistorialProps {
  totalSalidas: number;
  loading: boolean;
  onActualizar: () => void;
  onLimpiarFiltros: () => void;
}

export function HeaderHistorial({
  totalSalidas,
  loading,
  onActualizar,
}: HeaderHistorialProps) {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-3xl font-bold text-[var(--isla-dark-teal)]">
          Historial de Salidas
        </h1>
        <p className="text-gray-600 mt-2">
          Consulta el historial completo de tus salidas turísticas
        </p>
      </div>
      <div className="flex items-center gap-3">
        {totalSalidas > 0 && (
          <Badge variant="secondary" className="text-sm">
            {totalSalidas} salidas
          </Badge>
        )}
        <Button
          variant="outline"
          size="sm"
          onClick={onActualizar}
          disabled={loading}
          className="border-[var(--isla-teal)] text-[var(--isla-teal)] hover:bg-[var(--isla-teal)] hover:text-white"
        >
          <RefreshCw
            className={`w-4 h-4 mr-2 ${loading ? "animate-spin" : ""}`}
          />
          Actualizar
        </Button>
      </div>
    </div>
  );
}
