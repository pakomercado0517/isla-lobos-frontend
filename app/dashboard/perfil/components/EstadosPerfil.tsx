"use client";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertTriangle } from "lucide-react";

interface EstadosPerfilProps {
  loading: boolean;
  error?: string;
}

export function EstadosPerfil({ loading, error }: EstadosPerfilProps) {
  // Estado de carga
  if (loading) {
    return (
      <div className="min-h-[300px] md:min-h-screen bg-gradient-to-br from-[var(--isla-cream)] to-[var(--isla-cream-light)] flex items-center justify-center p-4">
        <div className="text-center">
          <div className="w-6 h-6 md:w-8 md:h-8 border-4 border-[var(--isla-teal)] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-[var(--isla-dark-teal)] text-xs md:text-sm">
            Cargando perfil...
          </p>
        </div>
      </div>
    );
  }

  // Estado de error
  if (error) {
    return (
      <Alert className="mb-4 md:mb-6 border-red-200 bg-red-50">
        <AlertTriangle className="h-3.5 w-3.5 md:h-4 md:w-4 text-red-600 flex-shrink-0" />
        <AlertDescription className="text-red-700 text-xs md:text-sm break-words">
          {error}
        </AlertDescription>
      </Alert>
    );
  }

  // No hay estado especial que mostrar
  return null;
}
