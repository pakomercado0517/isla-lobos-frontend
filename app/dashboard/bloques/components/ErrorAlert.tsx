import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertTriangle, Bug } from "lucide-react";

interface ErrorAlertProps {
  error: string;
}

export function ErrorAlert({ error }: ErrorAlertProps) {
  if (!error) return null;

  // Detectar si es un error de validación o general
  const isValidationError = error.includes('validación') || error.includes('Errores de validación');
  const isDevelopment = process.env.NODE_ENV === 'development';
  
  return (
    <Alert variant="destructive" className="mb-4">
      <AlertTriangle className="h-4 w-4" />
      <AlertTitle>
        {isValidationError ? 'Error de Validación' : 'Error'}
      </AlertTitle>
      <AlertDescription className="mt-2">
        {error}
        
        {/* Mostrar ayuda adicional en desarrollo */}
        {isDevelopment && (
          <details className="mt-3 cursor-pointer">
            <summary className="text-sm font-medium flex items-center gap-1">
              <Bug className="w-3 h-3" />
              Información de Debug
            </summary>
            <div className="mt-2 text-sm opacity-80">
              • Revisa la consola del navegador para más detalles<br/>
              • Verifica que los datos del formulario sean correctos<br/>
              • Confirma que el backend esté ejecutándose en http://localhost:3001
            </div>
          </details>
        )}
      </AlertDescription>
    </Alert>
  );
}
