import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertTriangle } from "lucide-react";

export function AdvertenciaSeguridad() {
  return (
    <Alert>
      <AlertTriangle className="h-4 w-4" />
      <AlertDescription>
        <strong>Advertencia:</strong> Las operaciones de administración pueden
        afectar múltiples registros. Asegúrate de entender las consecuencias
        antes de ejecutar cualquier operación.
      </AlertDescription>
    </Alert>
  );
}
