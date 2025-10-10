import { Loader2 } from "lucide-react";

export function LoadingState() {
  return (
    <div className="flex flex-col items-center justify-center py-20">
      <Loader2 className="h-12 w-12 animate-spin text-blue-600" />
      <p className="mt-4 text-sm text-muted-foreground">
        Cargando condiciones meteorológicas...
      </p>
    </div>
  );
}
