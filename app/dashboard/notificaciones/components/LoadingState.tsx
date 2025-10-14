import { Loader2 } from "lucide-react";

export function LoadingState() {
  return (
    <div className="flex items-center justify-center min-h-[400px]">
      <div className="text-center space-y-4">
        <Loader2 className="h-8 w-8 animate-spin text-teal-600 mx-auto" />
        <p className="text-gray-600">Cargando notificaciones...</p>
      </div>
    </div>
  );
}
