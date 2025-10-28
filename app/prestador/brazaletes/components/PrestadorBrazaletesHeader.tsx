import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { RefreshCw } from "lucide-react";
import type { BrazaletesPrestador } from "@/lib/types/brazaletes";

interface PrestadorBrazaletesHeaderProps {
  brazaletesData: BrazaletesPrestador | null;
  loading: boolean;
  onRefresh: () => void;
}

export function PrestadorBrazaletesHeader({
  brazaletesData,
  loading,
  onRefresh,
}: PrestadorBrazaletesHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 sm:gap-0">
      <div className="text-center sm:text-left">
        <h1 className="text-2xl sm:text-3xl font-bold text-[var(--isla-dark-teal)]">
          Mis Brazaletes
        </h1>
        <p className="text-sm sm:text-base text-gray-600 mt-1 sm:mt-2">
          Gestiona tus brazaletes para las salidas turísticas
        </p>
      </div>
      <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-3">
        {brazaletesData && (
          <Badge
            variant="secondary"
            className="text-xs sm:text-sm w-full sm:w-auto justify-center"
          >
            {brazaletesData.detalle.length} brazaletes
          </Badge>
        )}
        <Button
          variant="outline"
          size="sm"
          onClick={onRefresh}
          disabled={loading}
          className="w-full sm:w-auto h-9 border-[var(--isla-teal)] text-[var(--isla-teal)] hover:bg-[var(--isla-teal)] hover:text-white text-xs sm:text-sm"
        >
          <RefreshCw
            className={`w-4 h-4 mr-1.5 ${loading ? "animate-spin" : ""}`}
          />
          Actualizar
        </Button>
      </div>
    </div>
  );
}
