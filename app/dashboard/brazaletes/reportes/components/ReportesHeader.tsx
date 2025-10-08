import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";

interface ReportesHeaderProps {
  loading: boolean;
  onRefresh: () => void;
}

export function ReportesHeader({ loading, onRefresh }: ReportesHeaderProps) {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">
          Reportes de Brazaletes
        </h1>
        <p className="text-gray-600 mt-1">
          Estadísticas y análisis de utilización de brazaletes
        </p>
      </div>
      <div className="flex gap-2">
        <Button variant="outline" onClick={onRefresh} disabled={loading}>
          <RefreshCw
            className={`w-4 h-4 mr-2 ${loading ? "animate-spin" : ""}`}
          />
          Actualizar
        </Button>
      </div>
    </div>
  );
}
