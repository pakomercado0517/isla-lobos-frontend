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
        <CardTitle className="flex items-center gap-2">
          <Zap className="w-5 h-5" />
          Acciones Rápidas
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {/* Editar salida */}
        {puedeEditar && (
          <Button
            className="w-full bg-blue-600 hover:bg-blue-700 text-white"
            onClick={onEditar}
          >
            <Edit className="w-4 h-4 mr-2" />
            Editar Salida
          </Button>
        )}

        {/* Iniciar salida */}
        {puedeIniciar && (
          <Button
            className="w-full bg-yellow-600 hover:bg-yellow-700 text-white"
            onClick={onIniciar}
          >
            <Play className="w-4 h-4 mr-2" />
            Iniciar Salida
          </Button>
        )}

        {/* Completar salida */}
        {puedeCompletar && (
          <Button
            className="w-full bg-green-600 hover:bg-green-700 text-white"
            onClick={onCompletar}
          >
            <CheckSquare className="w-4 h-4 mr-2" />
            Marcar como Completada
          </Button>
        )}

        {/* Cancelar salida */}
        {puedeCancelar && (
          <Button
            className="w-full bg-red-600 hover:bg-red-700 text-white"
            onClick={onCancelar}
          >
            <XCircle className="w-4 h-4 mr-2" />
            Cancelar Salida
          </Button>
        )}

        {/* Mensaje informativo según el estado */}
        <div className="mt-4 pt-4 border-t border-gray-200">
          <p className="text-xs text-gray-600 text-center">
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
