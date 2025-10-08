import { Button } from "@/components/ui/button";
import { Search, FileSpreadsheet, FileText } from "lucide-react";

interface EstadoInicialProps {
  loading: boolean;
  onVerDisponibles: () => void;
  onVerUtilizados: () => void;
}

export function EstadoInicial({ loading, onVerDisponibles, onVerUtilizados }: EstadoInicialProps) {
  return (
    <div className="text-center py-12 bg-gray-50 rounded-lg">
      <Search className="w-16 h-16 text-gray-400 mx-auto mb-4" />
      <h3 className="text-xl font-medium text-gray-900 mb-2">
        Búsqueda Avanzada de Brazaletes
      </h3>
      <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
        Utiliza los filtros de búsqueda para encontrar brazaletes
        específicos. Puedes buscar por código, tipo, estado, prestador,
        lote, fechas y más.
      </p>
      <div className="flex justify-center gap-4">
        <Button
          variant="outline"
          onClick={onVerDisponibles}
          disabled={loading}
        >
          <FileSpreadsheet className="w-4 h-4 mr-2" />
          Ver Disponibles
        </Button>
        <Button
          variant="outline"
          onClick={onVerUtilizados}
          disabled={loading}
        >
          <FileText className="w-4 h-4 mr-2" />
          Ver Utilizados
        </Button>
      </div>
    </div>
  );
}
