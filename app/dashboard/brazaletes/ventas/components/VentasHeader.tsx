import { Button } from "@/components/ui/button";
import { RefreshCw, TrendingUp } from "lucide-react";

interface VentasHeaderProps {
  loading: boolean;
  onRefresh: () => void;
}

export function VentasHeader({ loading, onRefresh }: VentasHeaderProps) {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">
          Ventas de Brazaletes
        </h1>
        <p className="text-gray-600 mt-1">
          Gestiona las ventas de brazaletes a prestadores
        </p>
      </div>
      <div className="flex gap-2">
        <Button variant="outline" asChild>
          <a href="/dashboard/brazaletes/reportes">
            <TrendingUp className="w-4 h-4 mr-2" />
            Ver Reportes
          </a>
        </Button>
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
