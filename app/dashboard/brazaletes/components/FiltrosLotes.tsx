import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

interface FiltrosLotesProps {
  filtroTipo: "isla" | "arrecife" | "todos";
  filtroEstado: "activo" | "agotado" | "vencido" | "cancelado" | "todos";
  onFiltroTipoChange: (value: "isla" | "arrecife" | "todos") => void;
  onFiltroEstadoChange: (
    value: "activo" | "agotado" | "vencido" | "cancelado" | "todos"
  ) => void;
  onCrearLote: () => void;
}

export function FiltrosLotes({
  filtroTipo,
  filtroEstado,
  onFiltroTipoChange,
  onFiltroEstadoChange,
  onCrearLote,
}: FiltrosLotesProps) {
  return (
    <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
      <div className="flex items-center gap-2">
        <label className="text-sm font-medium">Tipo:</label>
        <select
          value={filtroTipo}
          onChange={(e) =>
            onFiltroTipoChange(
              e.target.value as "isla" | "arrecife" | "todos"
            )
          }
          className="px-3 py-1 border border-gray-300 rounded-md text-sm"
        >
          <option value="todos">Todos</option>
          <option value="isla">🏝️ Isla</option>
          <option value="arrecife">🐠 Arrecife</option>
        </select>
      </div>

      <div className="flex items-center gap-2">
        <label className="text-sm font-medium">Estado:</label>
        <select
          value={filtroEstado}
          onChange={(e) =>
            onFiltroEstadoChange(
              e.target.value as
                | "activo"
                | "agotado"
                | "vencido"
                | "cancelado"
                | "todos"
            )
          }
          className="px-3 py-1 border border-gray-300 rounded-md text-sm"
        >
          <option value="todos">Todos</option>
          <option value="activo">Activo</option>
          <option value="agotado">Agotado</option>
          <option value="vencido">Vencido</option>
          <option value="cancelado">Cancelado</option>
        </select>
      </div>

      <div className="ml-auto">
        <Button
          onClick={() => {
            console.log("🎫 Botón Nuevo Lote clickeado directamente");
            onCrearLote();
          }}
        >
          <Plus className="w-4 h-4 mr-2" />
          Nuevo Lote
        </Button>
      </div>
    </div>
  );
}
