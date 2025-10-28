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
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 sm:gap-0">
      <div className="text-center sm:text-left">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
          Gestión de Brazaletes
        </h1>
        <p className="text-sm sm:text-base text-gray-600 mt-1">
          Administra el inventario, lotes y ventas de brazaletes
        </p>
      </div>
      <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
        <Button
          variant="outline"
          asChild
          className="w-full sm:w-auto h-9 sm:h-10 text-xs sm:text-sm"
        >
          <a
            href="/dashboard/brazaletes/ventas"
            className="flex items-center justify-center"
          >
            <ShoppingCart className="w-4 h-4 mr-1.5 sm:mr-2" />
            Ver Ventas
          </a>
        </Button>
        <Button
          variant="outline"
          onClick={onRefresh}
          disabled={loading}
          className="w-full sm:w-auto h-9 sm:h-10 text-xs sm:text-sm"
        >
          <RefreshCw
            className={`w-4 h-4 mr-1.5 sm:mr-2 ${
              loading ? "animate-spin" : ""
            }`}
          />
          Actualizar
        </Button>
      </div>
    </div>
  );
}
