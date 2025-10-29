import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, Plus } from "lucide-react";

interface EmptyStateProps {
  onCreateClick: () => void;
  customMessage?: string;
}

export function EmptyState({ onCreateClick, customMessage }: EmptyStateProps) {
  const title = customMessage
    ? "Sin bloques disponibles"
    : "No hay bloques para esta fecha";
  const description = customMessage || "Crea un nuevo bloque para comenzar";

  return (
    <Card>
      <CardContent className="text-center py-8 md:py-12 px-4">
        <Calendar className="w-10 h-10 md:w-12 md:h-12 text-gray-400 mx-auto mb-3 md:mb-4" />
        <h3 className="text-base md:text-lg font-medium text-gray-900 mb-1.5 md:mb-2">
          {title}
        </h3>
        <p className="text-xs md:text-sm text-gray-500 mb-4 max-w-md mx-auto leading-relaxed">
          {description}
        </p>
        <Button
          onClick={onCreateClick}
          size="sm"
          className="h-9 md:h-10 text-xs md:text-sm"
        >
          <Plus className="w-3.5 h-3.5 md:w-4 md:h-4 mr-1.5" />
          {customMessage ? "Crear Plantilla de Bloque" : "Crear Primer Bloque"}
        </Button>
      </CardContent>
    </Card>
  );
}
