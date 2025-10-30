import { Button } from "@/components/ui/button";
import { Search, FileSpreadsheet, FileText } from "lucide-react";

interface EstadoInicialProps {
  loading: boolean;
  onVerDisponibles: () => void;
  onVerUtilizados: () => void;
}

export function EstadoInicial({ loading, onVerDisponibles, onVerUtilizados }: EstadoInicialProps) {
  return (
    <div className="text-center py-8 sm:py-12 bg-gray-50 rounded-lg px-4">
      <Search className="w-12 h-12 sm:w-16 sm:h-16 text-gray-400 mx-auto mb-3 sm:mb-4" />
      <h3 className="text-lg sm:text-xl font-medium text-gray-900 mb-2">
        Búsqueda Avanzada de Brazaletes
      </h3>
      <p className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6 max-w-2xl mx-auto">
        Utiliza los filtros de búsqueda para encontrar brazaletes
        específicos. Puedes buscar por código, tipo, estado, prestador,
        lote, fechas y más.
      </p>
      <div className="flex flex-col sm:flex-row justify-center gap-2 sm:gap-4">
        <Button
          variant="outline"
          onClick={onVerDisponibles}
          disabled={loading}
          className="w-full sm:w-auto h-10 text-sm"
        >
          <FileSpreadsheet className="w-4 h-4 mr-2 flex-shrink-0" />
          Ver Disponibles
        </Button>
        <Button
          variant="outline"
          onClick={onVerUtilizados}
          disabled={loading}
          className="w-full sm:w-auto h-10 text-sm"
        >
          <FileText className="w-4 h-4 mr-2 flex-shrink-0" />
          Ver Utilizados
        </Button>
      </div>
    </div>
  );
}
