import { Button } from "@/components/ui/button";
import { RefreshCw, TrendingUp } from "lucide-react";

interface VentasHeaderProps {
  loading: boolean;
  onRefresh: () => void;
}

export function VentasHeader({ loading, onRefresh }: VentasHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div className="min-w-0">
        <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 truncate">
          Ventas de Brazaletes
        </h1>
        <p className="text-xs sm:text-sm text-gray-600 mt-1">
          Gestiona las ventas de brazaletes a prestadores
        </p>
      </div>
      <div className="flex gap-2 flex-shrink-0">
        <Button variant="outline" asChild className="h-9 sm:h-10">
          <a href="/dashboard/brazaletes/reportes">
            <TrendingUp className="w-4 h-4 sm:mr-2" />
            <span className="hidden sm:inline">Ver Reportes</span>
          </a>
        </Button>
        <Button variant="outline" onClick={onRefresh} disabled={loading} className="h-9 sm:h-10">
          <RefreshCw
            className={`w-4 h-4 sm:mr-2 ${loading ? "animate-spin" : ""}`}
          />
          <span className="hidden sm:inline">Actualizar</span>
        </Button>
      </div>
    </div>
  );
}
