import { Loader2 } from "lucide-react";

export function LoadingState() {
  return (
    <div className="flex items-center justify-center min-h-[300px] md:min-h-[400px] p-4">
      <div className="text-center space-y-3 md:space-y-4">
        <Loader2 className="h-6 w-6 md:h-8 md:w-8 animate-spin text-teal-600 mx-auto" />
        <p className="text-sm md:text-base text-gray-600">
          Cargando notificaciones...
        </p>
      </div>
    </div>
  );
}
