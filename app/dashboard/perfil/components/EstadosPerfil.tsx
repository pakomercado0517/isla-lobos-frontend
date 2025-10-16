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
      <div className="min-h-screen bg-gradient-to-br from-[var(--isla-cream)] to-[var(--isla-cream-light)] flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-[var(--isla-teal)] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-[var(--isla-dark-teal)]">Cargando perfil...</p>
        </div>
      </div>
    );
  }

  // Estado de error
  if (error) {
    return (
      <Alert className="mb-6 border-red-200 bg-red-50">
        <AlertTriangle className="h-4 w-4 text-red-600" />
        <AlertDescription className="text-red-700">{error}</AlertDescription>
      </Alert>
    );
  }

  // No hay estado especial que mostrar
  return null;
}
