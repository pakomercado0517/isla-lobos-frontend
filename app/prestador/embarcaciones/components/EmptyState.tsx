import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Ship, Plus } from "lucide-react";

interface EmptyStateProps {
  onCreateClick: () => void;
}

export function EmptyState({ onCreateClick }: EmptyStateProps) {
  return (
    <Card>
      <CardContent className="text-center py-10 md:py-12">
        <Ship className="w-10 h-10 md:w-12 md:h-12 text-gray-400 mx-auto mb-3 md:mb-4" />
        <h3 className="text-base md:text-lg font-medium text-gray-900 mb-2">
          No hay embarcaciones
        </h3>
        <p className="text-xs md:text-sm text-gray-500 mb-4">
          Registra la primera embarcación para comenzar
        </p>
        <Button
          onClick={onCreateClick}
          className="h-9 md:h-10 text-xs md:text-sm"
        >
          <Plus className="w-3 h-3 md:w-4 md:h-4 mr-2" />
          Registrar Primera Embarcación
        </Button>
      </CardContent>
    </Card>
  );
}

