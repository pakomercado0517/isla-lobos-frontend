import { Alert, AlertDescription } from "@/components/ui/alert";
import { XCircle } from "lucide-react";

interface ErrorAlertProps {
  error: string;
}

export function ErrorAlert({ error }: ErrorAlertProps) {
  if (!error) return null;

  return (
    <Alert variant="destructive" className="mb-4 md:mb-6">
      <XCircle className="h-3 w-3 md:h-4 md:w-4 flex-shrink-0" />
      <AlertDescription className="text-xs md:text-sm break-words">
        {error}
      </AlertDescription>
    </Alert>
  );
}
