import { Alert, AlertDescription } from "@/components/ui/alert";
import { ShoppingCart } from "lucide-react";

interface SuccessAlertProps {
  show: boolean;
  message: string;
}

export function SuccessAlert({ show, message }: SuccessAlertProps) {
  if (!show || !message) return null;

  return (
    <Alert className="border-green-200 bg-green-50">
      <ShoppingCart className="h-4 w-4 text-green-600" />
      <AlertDescription className="text-green-800">{message}</AlertDescription>
    </Alert>
  );
}
