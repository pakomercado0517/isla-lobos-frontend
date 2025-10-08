"use client";

import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Card, CardContent } from "@/components/ui/card";
import { AlertTriangle, Ship, Plus } from "lucide-react";

interface EstadosEmbarcacionesProps {
  loading: boolean;
  error?: string;
  embarcacionesLength: number;
  onCreateDialogOpen: () => void;
}

export function EstadosEmbarcaciones({
  loading,
  error,
  embarcacionesLength,
  onCreateDialogOpen,
}: EstadosEmbarcacionesProps) {
  // Estado de error
  if (error) {
    return (
      <Alert className="mb-6 border-red-200 bg-red-50">
        <AlertTriangle className="h-4 w-4 text-red-600" />
        <AlertDescription className="text-red-800">{error}</AlertDescription>
      </Alert>
    );
  }

  // Estado de carga
  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="w-8 h-8 border-4 border-[var(--isla-teal)] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-[var(--isla-dark-teal)]">
          Cargando embarcaciones...
        </p>
      </div>
    );
  }

  // Estado vacío
  if (embarcacionesLength === 0) {
    return (
      <div className="col-span-full">
        <Card className="text-center py-12">
          <CardContent>
            <Ship className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-600 mb-2">
              No tienes embarcaciones registradas
            </h3>
            <p className="text-gray-500 mb-4">
              Comienza registrando tu primera embarcación
            </p>
            <Button
              onClick={onCreateDialogOpen}
              className="bg-[var(--isla-teal)] hover:bg-[var(--isla-dark-teal)] text-white"
            >
              <Plus className="w-4 h-4 mr-2" />
              Registrar Primera Embarcación
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // No hay estado especial que mostrar
  return null;
}
