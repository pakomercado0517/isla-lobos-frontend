import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { RefreshCw } from "lucide-react";
import type { BrazaletesPrestador } from "@/lib/types/brazaletes";

interface UsoBrazaletesHeaderProps {
  brazaletesDisponibles: BrazaletesPrestador["detalle"];
  loading: boolean;
  onRefresh: () => void;
}

export function UsoBrazaletesHeader({
  brazaletesDisponibles,
  loading,
  onRefresh,
}: UsoBrazaletesHeaderProps) {
  return (
    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 md:gap-0">
      <div className="text-center md:text-left">
        <h1 className="text-2xl md:text-3xl font-bold text-[var(--isla-dark-teal)]">
          Registro de Uso de Brazaletes
        </h1>
        <p className="text-sm md:text-base text-gray-600 mt-2">
          Registra el uso de brazaletes en tus salidas turísticas
        </p>
      </div>
      <div className="flex flex-col sm:flex-row items-center justify-center md:justify-end gap-2 sm:gap-3">
        <Badge
          variant={
            brazaletesDisponibles.length > 0 ? "secondary" : "destructive"
          }
          className="text-xs md:text-sm whitespace-nowrap"
        >
          {brazaletesDisponibles.length} disponibles
        </Badge>
        <Button
          variant="outline"
          size="sm"
          onClick={onRefresh}
          disabled={loading}
          className="border-[var(--isla-teal)] text-[var(--isla-teal)] hover:bg-[var(--isla-teal)] hover:text-white whitespace-nowrap"
        >
          <RefreshCw
            className={`w-4 h-4 mr-2 ${loading ? "animate-spin" : ""}`}
          />
          <span className="hidden sm:inline">Actualizar</span>
          <span className="sm:hidden">Actualizar</span>
        </Button>
      </div>
    </div>
  );
}
