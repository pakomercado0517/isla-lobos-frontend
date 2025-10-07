import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, Plus } from "lucide-react";

interface EmptyStateProps {
  onCreateClick: () => void;
}

export function EmptyState({ onCreateClick }: EmptyStateProps) {
  return (
    <Card>
      <CardContent className="text-center py-12">
        <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          No hay bloques para esta fecha
        </h3>
        <p className="text-gray-500 mb-4">Crea un nuevo bloque para comenzar</p>
        <Button onClick={onCreateClick}>
          <Plus className="w-4 h-4 mr-2" />
          Crear Primer Bloque
        </Button>
      </CardContent>
    </Card>
  );
}

