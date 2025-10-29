import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { AlertTriangle, RefreshCw } from "lucide-react";

interface ErrorStateProps {
  error: string;
  onRetry: () => void;
}

export function ErrorState({ error, onRetry }: ErrorStateProps) {
  return (
    <div className="max-w-2xl mx-auto p-3 md:p-0">
      <Alert className="border-red-200 bg-red-50">
        <AlertTriangle className="h-3 w-3 md:h-4 md:w-4 text-red-600 flex-shrink-0" />
        <AlertDescription className="text-xs md:text-sm text-red-700 break-words">
          {error}
        </AlertDescription>
      </Alert>
      <div className="mt-4 text-center">
        <Button onClick={onRetry} className="h-9 md:h-10 text-xs md:text-sm">
          <RefreshCw className="w-3 h-3 md:w-4 md:h-4 mr-2" />
          Reintentar
        </Button>
      </div>
    </div>
  );
}
