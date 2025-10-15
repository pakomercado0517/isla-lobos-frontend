import { Button } from "@/components/ui/button";
import { LoteCard } from "@/components/brazaletes/LoteCard";
import { Package, Plus } from "lucide-react";
import type { LoteBrazaletes } from "@/lib/types/brazaletes";

interface ListaLotesProps {
  lotes: LoteBrazaletes[];
  filtroTipo: "isla" | "arrecife" | "todos";
  filtroEstado: "activo" | "agotado" | "vencido" | "cancelado" | "todos";
  onCrearLote: () => void;
}

export function ListaLotes({
  lotes,
  filtroTipo,
  filtroEstado,
  onCrearLote,
}: ListaLotesProps) {
  const hasActiveFilters = filtroTipo !== "todos" || filtroEstado !== "todos";

  if (lotes.length === 0) {
    return (
      <div className="text-center py-12">
        <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          No hay lotes disponibles
        </h3>
        <p className="text-gray-600 mb-4">
          {hasActiveFilters
            ? "No se encontraron lotes con los filtros aplicados"
            : "Crea tu primer lote de brazaletes para comenzar"}
        </p>
        {!hasActiveFilters && (
          <Button onClick={onCrearLote}>
            <Plus className="w-4 h-4 mr-2" />
            Crear Primer Lote
          </Button>
        )}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {lotes.map((lote) => (
        <LoteCard
          key={lote.id}
          lote={lote}
          onVerDetalles={(_lote) => {
            // TODO: Implementar vista de detalles
          }}
          onEditar={(_lote) => {
            // TODO: Implementar edición de lote
          }}
        />
      ))}
    </div>
  );
}
