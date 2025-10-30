import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertTriangle } from "lucide-react";

export function AdvertenciaSeguridad() {
  return (
    <Alert className="mx-2 sm:mx-0">
      <AlertTriangle className="h-4 w-4 flex-shrink-0" />
      <AlertDescription className="text-xs sm:text-sm break-words">
        <strong>Advertencia:</strong> Las operaciones de administración pueden
        afectar múltiples registros. Asegúrate de entender las consecuencias
        antes de ejecutar cualquier operación.
      </AlertDescription>
    </Alert>
  );
}
