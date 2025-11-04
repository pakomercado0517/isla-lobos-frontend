import { Button } from "@/components/ui/button";
import { Plus, RefreshCw } from "lucide-react";

interface HeaderEmbarcacionesProps {
  onRefresh: () => void;
  onCreateClick: () => void;
  loading?: boolean;
}

export function HeaderEmbarcaciones({
  onRefresh,
  onCreateClick,
  loading = false,
}: HeaderEmbarcacionesProps) {
  return (
    <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
      <div>
        <h1 className="text-lg md:text-2xl font-bold text-slate-900">
          Mis Embarcaciones
        </h1>
        <p className="text-xs md:text-sm text-slate-600">
          Gestiona tu flota de embarcaciones
        </p>
      </div>
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:gap-3">
        <Button
          onClick={onRefresh}
          variant="outline"
          size="sm"
          disabled={loading}
          className="h-9 text-xs md:text-sm"
        >
          <RefreshCw
            className={`w-3 h-3 md:w-4 md:h-4 mr-2 ${
              loading ? "animate-spin" : ""
            }`}
          />
          Actualizar
        </Button>
        <Button
          onClick={onCreateClick}
          className="h-9 md:h-10 text-xs md:text-sm"
        >
          <Plus className="w-3 h-3 md:w-4 md:h-4 mr-2" />
          Nueva Embarcación
        </Button>
      </div>
    </div>
  );
}
