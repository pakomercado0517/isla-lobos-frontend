import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertTriangle } from "lucide-react";
import type { AlertaBrazaletes } from "@/lib/types/brazaletes";

interface AlertasSistemaProps {
  alertas: AlertaBrazaletes[];
}

export function AlertasSistema({ alertas }: AlertasSistemaProps) {
  if (alertas.length === 0) return null;

  return (
    <div className="space-y-2">
      {alertas.map((alerta, index) => (
        <Alert
          key={index}
          variant={alerta.severidad === "alta" ? "destructive" : "default"}
        >
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            <strong>{alerta.tipo}:</strong> {alerta.mensaje}
          </AlertDescription>
        </Alert>
      ))}
    </div>
  );
}
