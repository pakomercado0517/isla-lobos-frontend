import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { VentaForm } from "@/components/brazaletes/VentaForm";
import type { User } from "@/lib/types/auth";
import type { VentaBrazaletesFormData } from "@/lib/types/brazaletes";

interface FiltrosVentasProps {
  filtroPrestador: string;
  filtroTipo: "universal" | "todos";
  filtroEstado: "pagado" | "pendiente" | "cancelado" | "todos";
  prestadores: User[];
  showVentaForm: boolean;
  realizandoVenta: boolean;
  ventaError: string;
  inventarioDisponible: { universal: number };
  onFiltroPrestadorChange: (value: string) => void;
  onFiltroTipoChange: (value: "universal" | "todos") => void;
  onFiltroEstadoChange: (
    value: "pagado" | "pendiente" | "cancelado" | "todos"
  ) => void;
  onShowVentaFormChange: (show: boolean) => void;
  onVentaSubmit: (data: VentaBrazaletesFormData) => Promise<void>;
}

export function FiltrosVentas({
  filtroPrestador,
  filtroTipo,
  filtroEstado,
  prestadores,
  showVentaForm,
  realizandoVenta,
  ventaError,
  inventarioDisponible,
  onFiltroPrestadorChange,
  onFiltroTipoChange,
  onFiltroEstadoChange,
  onShowVentaFormChange,
  onVentaSubmit,
}: FiltrosVentasProps) {
  return (
    <div className="flex flex-col gap-4 p-3 sm:p-4 bg-gray-50 rounded-lg">
      {/* Filtros */}
      <div className="flex flex-col sm:flex-row sm:flex-wrap gap-3 sm:gap-4">
        <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 flex-1 min-w-0">
          <label className="text-xs sm:text-sm font-medium whitespace-nowrap">Prestador:</label>
          <select
            value={filtroPrestador}
            onChange={(e) => onFiltroPrestadorChange(e.target.value)}
            className="px-2 sm:px-3 py-1.5 sm:py-1 border border-gray-300 rounded-md text-xs sm:text-sm w-full sm:w-auto"
          >
            <option value="todos">Todos</option>
            {prestadores.map((prestador) => (
              <option key={prestador.id} value={prestador.id}>
                {prestador.nombre}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 flex-1 min-w-0">
          <label className="text-xs sm:text-sm font-medium whitespace-nowrap">Tipo:</label>
          <select
            value={filtroTipo}
            onChange={(e) =>
              onFiltroTipoChange(e.target.value as "universal" | "todos")
            }
            className="px-2 sm:px-3 py-1.5 sm:py-1 border border-gray-300 rounded-md text-xs sm:text-sm w-full sm:w-auto"
          >
            <option value="todos">Todos</option>
            <option value="universal">🎫 Universal</option>
          </select>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 flex-1 min-w-0">
          <label className="text-xs sm:text-sm font-medium whitespace-nowrap">Estado:</label>
          <select
            value={filtroEstado}
            onChange={(e) =>
              onFiltroEstadoChange(
                e.target.value as "pagado" | "pendiente" | "cancelado" | "todos"
              )
            }
            className="px-2 sm:px-3 py-1.5 sm:py-1 border border-gray-300 rounded-md text-xs sm:text-sm w-full sm:w-auto"
          >
            <option value="todos">Todos</option>
            <option value="pagado">Pagado</option>
            <option value="pendiente">Pendiente</option>
            <option value="cancelado">Cancelado</option>
          </select>
        </div>
      </div>

      {/* Botón Nueva Venta */}
      <div className="w-full sm:w-auto">
        <Dialog open={showVentaForm} onOpenChange={onShowVentaFormChange}>
          <DialogTrigger asChild>
            <Button className="w-full sm:w-auto h-10 sm:h-10">
              <Plus className="w-4 h-4 sm:mr-2" />
              <span className="sm:inline">Nueva Venta</span>
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-[95vw] sm:max-w-4xl max-h-[90vh] overflow-y-auto mx-2 sm:mx-auto">
            <DialogHeader>
              <DialogTitle className="text-base sm:text-lg">Nueva Venta de Brazaletes</DialogTitle>
              <DialogDescription className="text-xs sm:text-sm">
                Complete la información para realizar una venta de brazaletes
              </DialogDescription>
            </DialogHeader>
            <VentaForm
              onSubmit={onVentaSubmit}
              loading={realizandoVenta}
              error={ventaError}
              prestadores={prestadores}
              inventarioDisponible={inventarioDisponible}
            />
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
