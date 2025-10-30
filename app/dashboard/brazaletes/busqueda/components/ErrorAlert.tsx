import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertTriangle } from "lucide-react";

interface ErrorAlertProps {
  error: string;
}

export function ErrorAlert({ error }: ErrorAlertProps) {
  if (!error) return null;

  return (
    <Alert variant="destructive" className="mx-2 sm:mx-0">
      <AlertTriangle className="h-4 w-4 flex-shrink-0" />
      <AlertDescription className="text-xs sm:text-sm break-words">
        {error}
      </AlertDescription>
    </Alert>
  );
}
