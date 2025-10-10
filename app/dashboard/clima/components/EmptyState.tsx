import { Cloud } from "lucide-react";

interface EmptyStateProps {
  mensaje?: string;
}

export function EmptyState({
  mensaje = "No hay datos meteorológicos disponibles",
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-20">
      <div className="rounded-full bg-muted p-6 mb-4">
        <Cloud className="h-12 w-12 text-muted-foreground" />
      </div>
      <p className="text-sm font-medium text-muted-foreground">{mensaje}</p>
    </div>
  );
}
