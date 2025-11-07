"use client";

import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface ErrorStateProps {
  error: string;
  onRetry?: () => void;
}

export function ErrorState({ error, onRetry }: ErrorStateProps) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-teal-50 p-4">
      <Alert variant="destructive" className="max-w-md">
        <AlertTriangle className="h-4 w-4" />
        <AlertTitle>Error al cargar la embarcación</AlertTitle>
        <AlertDescription className="mt-2">{error}</AlertDescription>
        {onRetry && (
          <div className="mt-4">
            <Button onClick={onRetry} variant="outline" size="sm">
              Intentar de nuevo
            </Button>
          </div>
        )}
      </Alert>
    </div>
  );
}

