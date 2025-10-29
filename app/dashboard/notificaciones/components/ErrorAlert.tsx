import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";

interface ErrorAlertProps {
  error: string;
  onRetry?: () => void;
}

export function ErrorAlert({ error, onRetry }: ErrorAlertProps) {
  return (
    <Alert variant="destructive">
      <AlertCircle className="h-3 w-3 md:h-4 md:w-4 flex-shrink-0" />
      <AlertTitle className="text-xs md:text-sm">Error</AlertTitle>
      <AlertDescription className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between text-xs md:text-sm break-words">
        <span className="break-words">{error}</span>
        {onRetry && (
          <Button
            variant="outline"
            size="sm"
            onClick={onRetry}
            className="w-full md:w-auto h-8 md:h-9 text-xs shrink-0"
          >
            Reintentar
          </Button>
        )}
      </AlertDescription>
    </Alert>
  );
}
