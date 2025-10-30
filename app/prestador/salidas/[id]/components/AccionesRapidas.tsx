import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Zap, Edit, Play, CheckSquare, XCircle } from "lucide-react";
import type { Salida } from "@/lib/types/salida";
import {
  puedeEditarSalida,
  puedeIniciarSalida,
  puedeCompletarSalida,
  puedeCancelarSalida,
} from "./utils";

interface AccionesRapidasProps {
  salida: Salida;
  onEditar: () => void;
  onIniciar: () => void;
  onCompletar: () => void;
  onCancelar: () => void;
}

export function AccionesRapidas({
  salida,
  onEditar,
  onIniciar,
  onCompletar,
  onCancelar,
}: AccionesRapidasProps) {
  const puedeEditar = puedeEditarSalida(salida);
  const puedeIniciar = puedeIniciarSalida(salida);
  const puedeCompletar = puedeCompletarSalida(salida);
  const puedeCancelar = puedeCancelarSalida(salida);

  // Solo mostrar card si hay alguna acción disponible
  if (!puedeEditar && !puedeIniciar && !puedeCompletar && !puedeCancelar) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
          <Zap className="w-5 h-5 sm:w-6 sm:h-6 flex-shrink-0" />
          Acciones Rápidas
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2 sm:space-y-3">
        {/* Editar salida */}
        {puedeEditar && (
          <Button
            className="w-full h-11 sm:h-12 text-sm sm:text-base bg-blue-600 hover:bg-blue-700 text-white"
            onClick={onEditar}
          >
            <Edit className="w-4 h-4 sm:w-5 sm:h-5 mr-2 flex-shrink-0" />
            Editar Salida
          </Button>
        )}

        {/* Iniciar salida */}
        {puedeIniciar && (
          <Button
            className="w-full h-11 sm:h-12 text-sm sm:text-base bg-yellow-600 hover:bg-yellow-700 text-white"
            onClick={onIniciar}
          >
            <Play className="w-4 h-4 sm:w-5 sm:h-5 mr-2 flex-shrink-0" />
            Iniciar Salida
          </Button>
        )}

        {/* Completar salida */}
        {puedeCompletar && (
          <Button
            className="w-full h-11 sm:h-12 text-sm sm:text-base bg-green-600 hover:bg-green-700 text-white"
            onClick={onCompletar}
          >
            <CheckSquare className="w-4 h-4 sm:w-5 sm:h-5 mr-2 flex-shrink-0" />
            <span className="truncate">Marcar como Completada</span>
          </Button>
        )}

        {/* Cancelar salida */}
        {puedeCancelar && (
          <Button
            className="w-full h-11 sm:h-12 text-sm sm:text-base bg-red-600 hover:bg-red-700 text-white"
            onClick={onCancelar}
          >
            <XCircle className="w-4 h-4 sm:w-5 sm:h-5 mr-2 flex-shrink-0" />
            Cancelar Salida
          </Button>
        )}

        {/* Mensaje informativo según el estado */}
        <div className="mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-gray-200">
          <p className="text-xs sm:text-sm text-gray-600 text-center">
            {salida.estado === "completada" && "Esta salida ya está completada"}
            {(salida.estado === "cancelada" ||
              salida.estado === "cancelada_por_clima" ||
              salida.estado === "cancelada_capitaria") &&
              "Esta salida fue cancelada"}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
