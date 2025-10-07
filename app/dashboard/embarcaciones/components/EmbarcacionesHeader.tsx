import { Button } from "@/components/ui/button";
import { Plus, RefreshCw } from "lucide-react";

interface EmbarcacionesHeaderProps {
  onRefresh: () => void;
  onCreateClick: () => void;
}

export function EmbarcacionesHeader({
  onRefresh,
  onCreateClick,
}: EmbarcacionesHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">
          Gestión de Embarcaciones
        </h1>
        <p className="text-slate-600">
          Administra la flota de embarcaciones y prestadores
        </p>
      </div>
      <div className="mt-4 sm:mt-0 flex items-center space-x-4">
        <Button onClick={onRefresh} variant="outline" size="sm">
          <RefreshCw className="w-4 h-4 mr-2" />
          Actualizar
        </Button>
        <Button onClick={onCreateClick}>
          <Plus className="w-4 h-4 mr-2" />
          Nueva Embarcación
        </Button>
      </div>
    </div>
  );
}
