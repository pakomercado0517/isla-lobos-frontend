import { Button } from "@/components/ui/button";
import { RefreshCw, AlertTriangle } from "lucide-react";

interface ErrorStateProps {
  onRetry: () => void;
}

export function ErrorState({ onRetry }: ErrorStateProps) {
  return (
    <div className="text-center py-12">
      <AlertTriangle className="w-12 h-12 text-red-400 mx-auto mb-4" />
      <h3 className="text-lg font-medium text-gray-900 mb-2">
        Error al cargar datos
      </h3>
      <p className="text-gray-600 mb-4">
        No se pudieron cargar los datos de brazaletes
      </p>
      <Button onClick={onRetry}>
        <RefreshCw className="w-4 h-4 mr-2" />
        Reintentar
      </Button>
    </div>
  );
}
