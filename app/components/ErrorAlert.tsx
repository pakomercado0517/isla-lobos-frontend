import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { AlertTriangle, RefreshCw } from "lucide-react";

interface ErrorAlertProps {
  error: string;
  onRetry?: () => void;
  className?: string;
}

export function ErrorAlert({ error, onRetry, className = "" }: ErrorAlertProps) {
  if (!error) return null;

  return (
    <Alert className={`border-red-200 bg-red-50 ${className}`} variant="destructive">
      <AlertTriangle className="h-4 w-4" />
      <AlertDescription className="flex items-center justify-between">
        <div>
          <p className="font-medium">Error al cargar datos</p>
          <p className="text-sm text-red-600 mt-1">{error}</p>
        </div>
        {onRetry && (
          <Button
            variant="outline"
            size="sm"
            onClick={onRetry}
            className="ml-4 border-red-300 text-red-700 hover:bg-red-100"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Reintentar
          </Button>
        )}
      </AlertDescription>
    </Alert>
  );
}