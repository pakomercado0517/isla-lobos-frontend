"use client";

import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { RefreshCw, AlertTriangle, Ship, Plus } from "lucide-react";
import Link from "next/link";

interface EstadosSalidasProps {
  loading: boolean;
  error?: string;
  salidasLength: number;
}

export function EstadosSalidas({
  loading,
  error,
  salidasLength,
}: EstadosSalidasProps) {
  // Estado de error
  if (error) {
    return (
      <Alert variant="destructive">
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  // Estado de carga
  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-4 text-[var(--isla-teal)]" />
          <p className="text-gray-600">Cargando salidas...</p>
        </div>
      </div>
    );
  }

  // Estado vacío
  if (salidasLength === 0) {
    return (
      <div className="text-center py-12 bg-gray-50 rounded-lg">
        <Ship className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          No tienes salidas registradas
        </h3>
        <p className="text-gray-600 mb-4">
          Crea tu primera salida para comenzar a gestionar tus servicios
          turísticos
        </p>
        <Button
          className="bg-[var(--isla-teal)] hover:bg-[var(--isla-teal-dark)] text-white"
          asChild
        >
          <Link href="/prestador/nueva-salida">
            <Plus className="w-4 h-4 mr-2" />
            Crear Primera Salida
          </Link>
        </Button>
      </div>
    );
  }

  // No hay estado especial que mostrar
  return null;
}
