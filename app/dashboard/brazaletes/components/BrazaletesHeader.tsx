import { Button } from "@/components/ui/button";
import { RefreshCw, ShoppingCart } from "lucide-react";

interface BrazaletesHeaderProps {
  loading: boolean;
  onRefresh: () => void;
}

export function BrazaletesHeader({
  loading,
  onRefresh,
}: BrazaletesHeaderProps) {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">
          Gestión de Brazaletes
        </h1>
        <p className="text-gray-600 mt-1">
          Administra el inventario, lotes y ventas de brazaletes
        </p>
      </div>
      <div className="flex gap-2">
        <Button variant="outline" asChild>
          <a href="/dashboard/brazaletes/ventas">
            <ShoppingCart className="w-4 h-4 mr-2" />
            Ver Ventas
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
