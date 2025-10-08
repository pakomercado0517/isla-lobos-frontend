import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";

interface BusquedaHeaderProps {
  loading: boolean;
  onBuscarTodos: () => void;
}

export function BusquedaHeader({ loading, onBuscarTodos }: BusquedaHeaderProps) {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">
          Búsqueda Avanzada de Brazaletes
        </h1>
        <p className="text-gray-600 mt-1">
          Busca y filtra brazaletes con criterios específicos
        </p>
      </div>
      <div className="flex gap-2">
        <Button
          variant="outline"
          onClick={onBuscarTodos}
          disabled={loading}
        >
          <Search className="w-4 h-4 mr-2" />
          Buscar Todos
        </Button>
      </div>
    </div>
  );
}
