import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertTriangle } from "lucide-react";

interface ErrorAlertProps {
  error: string;
}

export function ErrorAlert({ error }: ErrorAlertProps) {
  if (!error) return null;

  return (
    <Alert className="border-red-200 bg-red-50">
      <AlertTriangle className="h-3 w-3 md:h-4 md:w-4 text-red-600 flex-shrink-0" />
      <AlertDescription className="text-xs md:text-sm text-red-700 break-words">
        {error}
      </AlertDescription>
    </Alert>
  );
}

