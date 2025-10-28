import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";

interface BusquedaHeaderProps {
  loading: boolean;
  onBuscarTodos: () => void;
}

export function BusquedaHeader({
  loading,
  onBuscarTodos,
}: BusquedaHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row items-center sm:items-start justify-between gap-4 sm:gap-0">
      <div className="text-center sm:text-left">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
          Búsqueda Avanzada
        </h1>
        <p className="text-sm sm:text-base text-gray-600 mt-1">
          Busca y filtra brazaletes con criterios específicos
        </p>
      </div>
      <div className="w-full sm:w-auto">
        <Button
          variant="outline"
          onClick={onBuscarTodos}
          disabled={loading}
          className="w-full sm:w-auto h-10 sm:h-11 text-sm sm:text-base"
        >
          <Search className="w-4 h-4 mr-1.5 sm:mr-2" />
          Buscar Todos
        </Button>
      </div>
    </div>
  );
}
