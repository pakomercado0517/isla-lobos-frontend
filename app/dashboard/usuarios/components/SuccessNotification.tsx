"use client";

import { useEffect, useState } from "react";
import { CheckCircle, X } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface SuccessNotificationProps {
  message: string;
  show: boolean;
  onClose: () => void;
  duration?: number;
}

export function SuccessNotification({
  message,
  show,
  onClose,
  duration = 5000,
}: SuccessNotificationProps) {
  const [isVisible, setIsVisible] = useState(show);

  useEffect(() => {
    setIsVisible(show);

    if (show) {
      const timer = setTimeout(() => {
        setIsVisible(false);
        setTimeout(onClose, 300); // Esperar a que termine la animación
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [show, duration, onClose]);

  if (!show && !isVisible) return null;

  return (
    <div
      className={`fixed top-2 right-2 md:top-4 md:right-4 z-50 transition-all duration-300 max-w-[calc(100vw-1rem)] md:max-w-md ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-2"
      }`}
    >
      <Alert className="border-green-200 bg-green-50 shadow-lg">
        <CheckCircle className="h-3 w-3 md:h-4 md:w-4 text-green-600 flex-shrink-0" />
        <AlertDescription className="text-green-800 text-xs md:text-sm flex items-center justify-between gap-2">
          <span className="break-words">{message}</span>
          <button
            onClick={() => {
              setIsVisible(false);
              setTimeout(onClose, 300);
            }}
            className="flex-shrink-0 text-green-600 hover:text-green-800 transition-colors"
          >
            <X className="h-3 w-3 md:h-4 md:w-4" />
          </button>
        </AlertDescription>
      </Alert>
    </div>
  );
}
