import { Button } from "@/components/ui/button";
import { VentaCard } from "@/components/brazaletes/VentaCard";
import { ShoppingCart, Plus } from "lucide-react";
import type { VentaBrazaletes } from "@/lib/types/brazaletes";

interface ListaVentasProps {
  ventas: VentaBrazaletes[];
  filtroPrestador: string;
  filtroTipo: "universal" | "todos";
  filtroEstado: "pagado" | "pendiente" | "cancelado" | "todos";
  onShowVentaForm: () => void;
}

export function ListaVentas({
  ventas,
  filtroPrestador,
  filtroTipo,
  filtroEstado,
  onShowVentaForm,
}: ListaVentasProps) {
  const hasActiveFilters =
    filtroPrestador !== "todos" ||
    filtroTipo !== "todos" ||
    filtroEstado !== "todos";

  if (ventas.length === 0) {
    return (
      <div className="text-center py-8 sm:py-12 px-4">
        <ShoppingCart className="w-10 h-10 sm:w-12 sm:h-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-2">
          No hay ventas registradas
        </h3>
        <p className="text-sm sm:text-base text-gray-600 mb-4">
          {hasActiveFilters
            ? "No se encontraron ventas con los filtros aplicados"
            : "Realiza tu primera venta de brazaletes"}
        </p>
        {!hasActiveFilters && (
          <Button onClick={onShowVentaForm} className="h-10 sm:h-10">
            <Plus className="w-4 h-4 mr-2" />
            Realizar Primera Venta
          </Button>
        )}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
      {ventas.map((venta) => (
        <VentaCard
          key={venta.id}
          venta={venta}
          onVerDetalles={(_venta) => {
            // TODO: Implementar vista de detalles
          }}
        />
      ))}
    </div>
  );
}
