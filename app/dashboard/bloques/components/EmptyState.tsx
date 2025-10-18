import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, Plus } from "lucide-react";

interface EmptyStateProps {
  onCreateClick: () => void;
  customMessage?: string; // 🆕 NUEVO: Mensaje personalizado del backend
}

export function EmptyState({ onCreateClick, customMessage }: EmptyStateProps) {
  // 🆕 NUEVO: Usar mensaje personalizado si está disponible
  const title = customMessage
    ? "Sin bloques disponibles"
    : "No hay bloques para esta fecha";
  const description = customMessage || "Crea un nuevo bloque para comenzar";

  return (
    <Card>
      <CardContent className="text-center py-12">
        <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">{title}</h3>
        <p className="text-gray-500 mb-4 max-w-md mx-auto">{description}</p>
        <Button onClick={onCreateClick}>
          <Plus className="w-4 h-4 mr-2" />
          {customMessage ? "Crear Plantilla de Bloque" : "Crear Primer Bloque"}
        </Button>
      </CardContent>
    </Card>
  );
}
