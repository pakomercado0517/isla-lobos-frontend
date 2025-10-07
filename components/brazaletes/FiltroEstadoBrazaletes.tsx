"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Filter, X } from "lucide-react";

export type EstadoBrazaleteFiltro =
  | "todos"
  | "disponible"
  | "asignado"
  | "utilizado"
  | "perdido";

interface FiltroEstadoBrazaletesProps {
  estadoSeleccionado: EstadoBrazaleteFiltro;
  onEstadoChange: (estado: EstadoBrazaleteFiltro) => void;
  conteos: {
    todos: number;
    disponible: number;
    asignado: number;
    utilizado: number;
    perdido: number;
  };
}

const opcionesFiltro = [
  {
    valor: "todos" as const,
    etiqueta: "Todos",
    color: "bg-gray-100 text-gray-800",
    colorActivo: "bg-gray-200 text-gray-900",
  },
  {
    valor: "disponible" as const,
    etiqueta: "Disponibles",
    color: "bg-green-100 text-green-800",
    colorActivo: "bg-green-200 text-green-900",
  },
  {
    valor: "asignado" as const,
    etiqueta: "Asignados",
    color: "bg-yellow-100 text-yellow-800",
    colorActivo: "bg-yellow-200 text-yellow-900",
  },
  {
    valor: "utilizado" as const,
    etiqueta: "Utilizados",
    color: "bg-purple-100 text-purple-800",
    colorActivo: "bg-purple-200 text-purple-900",
  },
  {
    valor: "perdido" as const,
    etiqueta: "Perdidos",
    color: "bg-red-100 text-red-800",
    colorActivo: "bg-red-200 text-red-900",
  },
];

export function FiltroEstadoBrazaletes({
  estadoSeleccionado,
  onEstadoChange,
  conteos,
}: FiltroEstadoBrazaletesProps) {
  const [mostrarTodos, setMostrarTodos] = useState(false);

  const opcionesVisibles = mostrarTodos
    ? opcionesFiltro
    : opcionesFiltro.slice(0, 4); // Mostrar solo los primeros 4 por defecto

  return (
    <div className="bg-white p-4 rounded-lg border">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-gray-600" />
          <h3 className="text-sm font-medium text-gray-900">
            Filtrar por estado
          </h3>
        </div>

        {estadoSeleccionado !== "todos" && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onEstadoChange("todos")}
            className="text-gray-500 hover:text-gray-700"
          >
            <X className="w-3 h-3 mr-1" />
            Limpiar filtro
          </Button>
        )}
      </div>

      <div className="flex flex-wrap gap-2">
        {opcionesVisibles.map((opcion) => {
          const esActivo = estadoSeleccionado === opcion.valor;
          const conteo = conteos[opcion.valor];

          return (
            <Button
              key={opcion.valor}
              variant={esActivo ? "default" : "outline"}
              size="sm"
              onClick={() => onEstadoChange(opcion.valor)}
              className={`
                transition-all duration-200
                ${
                  esActivo
                    ? `${opcion.colorActivo} border-2 border-current`
                    : `${opcion.color} hover:${opcion.colorActivo}`
                }
                ${conteo === 0 ? "opacity-50 cursor-not-allowed" : ""}
              `}
              disabled={conteo === 0}
            >
              {opcion.etiqueta}
              <Badge
                variant="secondary"
                className={`
                  ml-2 text-xs
                  ${
                    esActivo
                      ? "bg-white/20 text-current"
                      : "bg-white/50 text-gray-600"
                  }
                `}
              >
                {conteo}
              </Badge>
            </Button>
          );
        })}

        {!mostrarTodos && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setMostrarTodos(true)}
            className="text-gray-500 hover:text-gray-700"
          >
            +{opcionesFiltro.length - 4} más
          </Button>
        )}
      </div>

      {estadoSeleccionado !== "todos" && (
        <div className="mt-3 p-2 bg-blue-50 rounded-lg">
          <p className="text-xs text-blue-700">
            Mostrando {conteos[estadoSeleccionado]} brazaletes con estado
            &ldquo;
            {opcionesFiltro
              .find((o) => o.valor === estadoSeleccionado)
              ?.etiqueta.toLowerCase()}
            &rdquo;
          </p>
        </div>
      )}
    </div>
  );
}
