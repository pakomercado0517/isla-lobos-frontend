import { Loader2 } from "lucide-react";

export function LoadingState() {
  return (
    <div className="flex flex-col items-center justify-center py-12 md:py-20">
      <Loader2 className="h-10 w-10 md:h-12 md:w-12 animate-spin text-blue-600" />
      <p className="mt-3 md:mt-4 text-xs md:text-sm text-muted-foreground">
        Cargando condiciones meteorológicas...
      </p>
    </div>
  );
}
