"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, XCircle, Zap, Edit } from "lucide-react";

interface EmbarcacionDetalle {
  id: string;
  estado: "disponible" | "en_uso" | "mantenimiento" | "pendiente_autorizacion";
}

interface AccionesRapidasProps {
  embarcacion: EmbarcacionDetalle;
  onAutorizar: () => void;
  onRechazar: () => void;
  onEditar: () => void;
  loadingAutorizar?: boolean;
  loadingRechazar?: boolean;
}

export function AccionesRapidas({
  embarcacion,
  onAutorizar,
  onRechazar,
  onEditar,
  loadingAutorizar = false,
  loadingRechazar = false,
}: AccionesRapidasProps) {
  const estaPendiente = embarcacion.estado === "pendiente_autorizacion";

  // Solo mostrar card si está pendiente de autorización
  if (!estaPendiente) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
            <Zap className="w-5 h-5 sm:w-6 sm:h-6 flex-shrink-0 text-teal-600" />
            Acciones
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Button
            variant="outline"
            className="w-full"
            onClick={onEditar}
          >
            <Edit className="w-4 h-4 mr-2" />
            Editar Embarcación
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
          <Zap className="w-5 h-5 sm:w-6 sm:h-6 flex-shrink-0 text-teal-600" />
          Acciones de Autorización
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {/* Botón Autorizar */}
        <Button
          className="w-full h-11 sm:h-12 text-sm sm:text-base bg-green-600 hover:bg-green-700 text-white"
          onClick={onAutorizar}
          disabled={loadingAutorizar || loadingRechazar}
        >
          {loadingAutorizar ? (
            <>
              <div className="w-4 h-4 mr-2 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Autorizando...
            </>
          ) : (
            <>
              <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 mr-2 flex-shrink-0" />
              Autorizar Embarcación
            </>
          )}
        </Button>

        {/* Botón Rechazar */}
        <Button
          variant="destructive"
          className="w-full h-11 sm:h-12 text-sm sm:text-base"
          onClick={onRechazar}
          disabled={loadingAutorizar || loadingRechazar}
        >
          {loadingRechazar ? (
            <>
              <div className="w-4 h-4 mr-2 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Rechazando...
            </>
          ) : (
            <>
              <XCircle className="w-4 h-4 sm:w-5 sm:h-5 mr-2 flex-shrink-0" />
              Rechazar Embarcación
            </>
          )}
        </Button>

        {/* Mensaje informativo */}
        <div className="pt-3 border-t border-slate-200">
          <p className="text-xs sm:text-sm text-slate-600 text-center">
            Esta embarcación está pendiente de autorización. Revisa la
            información antes de tomar una decisión.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

