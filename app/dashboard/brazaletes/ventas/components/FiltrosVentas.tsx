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
    <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
      <div className="flex items-center gap-2">
        <label className="text-sm font-medium">Prestador:</label>
        <select
          value={filtroPrestador}
          onChange={(e) => onFiltroPrestadorChange(e.target.value)}
          className="px-3 py-1 border border-gray-300 rounded-md text-sm"
        >
          <option value="todos">Todos</option>
          {prestadores.map((prestador) => (
            <option key={prestador.id} value={prestador.id}>
              {prestador.nombre}
            </option>
          ))}
        </select>
      </div>

      <div className="flex items-center gap-2">
        <label className="text-sm font-medium">Tipo:</label>
        <select
          value={filtroTipo}
          onChange={(e) =>
            onFiltroTipoChange(e.target.value as "universal" | "todos")
          }
          className="px-3 py-1 border border-gray-300 rounded-md text-sm"
        >
          <option value="todos">Todos</option>
          <option value="universal">🎫 Universal</option>
        </select>
      </div>

      <div className="flex items-center gap-2">
        <label className="text-sm font-medium">Estado:</label>
        <select
          value={filtroEstado}
          onChange={(e) =>
            onFiltroEstadoChange(
              e.target.value as "pagado" | "pendiente" | "cancelado" | "todos"
            )
          }
          className="px-3 py-1 border border-gray-300 rounded-md text-sm"
        >
          <option value="todos">Todos</option>
          <option value="pagado">Pagado</option>
          <option value="pendiente">Pendiente</option>
          <option value="cancelado">Cancelado</option>
        </select>
      </div>

      <div className="ml-auto">
        <Dialog open={showVentaForm} onOpenChange={onShowVentaFormChange}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Nueva Venta
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Nueva Venta de Brazaletes</DialogTitle>
              <DialogDescription>
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
