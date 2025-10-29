import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ErrorAlertProps {
  error: string;
  onRetry?: () => void;
}

export function ErrorAlert({ error, onRetry }: ErrorAlertProps) {
  return (
    <Alert variant="destructive">
      <AlertCircle className="h-3 w-3 md:h-4 md:w-4 flex-shrink-0" />
      <AlertDescription className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
        <span className="text-xs md:text-sm break-words">{error}</span>
        {onRetry && (
          <Button
            variant="outline"
            size="sm"
            onClick={onRetry}
            className="h-8 md:h-9 text-xs md:text-sm flex-shrink-0"
          >
            Reintentar
          </Button>
        )}
      </AlertDescription>
    </Alert>
  );
}
