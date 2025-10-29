import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertTriangle, Bug } from "lucide-react";

interface ErrorAlertProps {
  error: string;
}

export function ErrorAlert({ error }: ErrorAlertProps) {
  if (!error) return null;

  const isValidationError =
    error.includes("validación") || error.includes("Errores de validación");
  const isDevelopment = process.env.NODE_ENV === "development";

  return (
    <Alert variant="destructive" className="mb-4">
      <AlertTriangle className="h-4 w-4 flex-shrink-0" />
      <AlertTitle className="text-sm md:text-base">
        {isValidationError ? "Error de Validación" : "Error"}
      </AlertTitle>
      <AlertDescription className="mt-2 text-xs md:text-sm">
        <p className="break-words">{error}</p>

        {isDevelopment && (
          <details className="mt-3 cursor-pointer">
            <summary className="text-xs font-medium flex items-center gap-1">
              <Bug className="w-3 h-3" />
              Información de Debug
            </summary>
            <div className="mt-2 text-[10px] md:text-xs opacity-80 space-y-1">
              <p>• Revisa la consola del navegador para más detalles</p>
              <p>• Verifica que los datos del formulario sean correctos</p>
              <p>
                • Confirma que el backend esté ejecutándose en
                http://localhost:3001
              </p>
            </div>
          </details>
        )}
      </AlertDescription>
    </Alert>
  );
}
