import { Cloud } from "lucide-react";

interface EmptyStateProps {
  mensaje?: string;
}

export function EmptyState({
  mensaje = "No hay datos meteorológicos disponibles",
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 md:py-20">
      <div className="rounded-full bg-muted p-4 md:p-6 mb-3 md:mb-4">
        <Cloud className="h-10 w-10 md:h-12 md:w-12 text-muted-foreground" />
      </div>
      <p className="text-xs md:text-sm font-medium text-muted-foreground text-center px-4">
        {mensaje}
      </p>
    </div>
  );
}
