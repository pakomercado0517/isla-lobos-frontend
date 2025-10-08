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
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-3xl font-bold text-[var(--isla-dark-teal)]">
          Mis Brazaletes
        </h1>
        <p className="text-gray-600 mt-2">
          Gestiona tus brazaletes para las salidas turísticas
        </p>
      </div>
      <div className="flex items-center gap-3">
        {brazaletesData && (
          <Badge variant="secondary" className="text-sm">
            {brazaletesData.detalle.length} brazaletes
          </Badge>
        )}
        <Button
          variant="outline"
          size="sm"
          onClick={onRefresh}
          disabled={loading}
          className="border-[var(--isla-teal)] text-[var(--isla-teal)] hover:bg-[var(--isla-teal)] hover:text-white"
        >
          <RefreshCw
            className={`w-4 h-4 mr-2 ${loading ? "animate-spin" : ""}`}
          />
          Actualizar
        </Button>
      </div>
    </div>
  );
}
