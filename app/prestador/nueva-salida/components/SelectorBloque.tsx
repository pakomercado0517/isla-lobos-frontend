"use client";

import { useMemo } from "react";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Clock } from "lucide-react";
import { Control, FieldPath } from "react-hook-form";
import {
  SalidaFormData,
  BloqueBackend,
  getBloqueEstado,
  getEstadoBloqueTexto,
} from "./utils";

interface SelectorBloqueProps {
  control: Control<SalidaFormData>;
  name: FieldPath<SalidaFormData>;
  bloques: BloqueBackend[];
  loadingBloques: boolean;
  fechaSeleccionada: string;
}

export function SelectorBloque({
  control,
  name,
  bloques,
  loadingBloques,
  fechaSeleccionada,
}: SelectorBloqueProps) {
  // Memoizar el array de bloques para evitar re-renders innecesarios
  const bloquesMemo = useMemo(() => bloques, [bloques]);

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => {
        // Asegurar que el valor sea una cadena válida
        const valorActual = field.value ? String(field.value) : "";
        
        // Verificar que el bloque seleccionado todavía existe en el array
        // Si el valor está vacío, permitir selección (no validar existencia)
        const bloqueExiste =
          !valorActual || bloquesMemo.some((b) => b.id === valorActual);

        // Si hay un valor pero el bloque no existe en el array actual,
        // mantener el valor temporalmente para que el Select no lo pierda
        // Esto puede pasar durante actualizaciones del array
        const valorParaSelect = valorActual;

        return (
          <FormItem>
            <FormLabel className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              Bloque Horario *
            </FormLabel>
            <Select
              onValueChange={(value) => {
                // Actualizar el valor del formulario inmediatamente
                field.onChange(value);
              }}
              value={valorParaSelect}
              disabled={!fechaSeleccionada || loadingBloques}
            >
            <FormControl>
              <SelectTrigger>
                <SelectValue
                  placeholder={
                    loadingBloques
                      ? "Cargando bloques..."
                      : !fechaSeleccionada
                      ? "Primero selecciona una fecha"
                      : "Seleccionar bloque horario"
                  }
                />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {bloquesMemo.length === 0 && !loadingBloques ? (
                <div className="p-4 text-center text-sm text-gray-500">
                  {fechaSeleccionada ? (
                    <div>
                      <p className="font-medium mb-1">
                        No hay bloques disponibles
                      </p>
                      <p className="text-xs">
                        Verifica que la fecha sea correcta o intenta con otra
                        fecha
                      </p>
                    </div>
                  ) : (
                    <p>Primero selecciona una fecha</p>
                  )}
                </div>
              ) : (
                bloquesMemo.map((bloque) => {
                  const {
                    capacidadDisponible,
                    estaLleno,
                    estaCasiLleno,
                    deshabilitado,
                  } = getBloqueEstado(bloque);

                  return (
                    <SelectItem
                      key={bloque.id}
                      value={bloque.id}
                      disabled={deshabilitado}
                    >
                      <div className="flex items-center justify-between w-full gap-4">
                        <div className="flex flex-col">
                          <span className="font-medium">{bloque.nombre}</span>
                          <span className="text-xs text-gray-500">
                            {bloque.hora_inicio} - {bloque.hora_fin}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge
                            variant={
                              deshabilitado
                                ? "destructive"
                                : estaLleno
                                ? "destructive"
                                : estaCasiLleno
                                ? "secondary"
                                : "outline"
                            }
                            className="text-xs"
                          >
                            {capacidadDisponible}/{bloque.capacidad_total}
                          </Badge>
                          {deshabilitado && (
                            <Badge variant="destructive" className="text-xs">
                              {getEstadoBloqueTexto(bloque.estado)}
                            </Badge>
                          )}
                          {!deshabilitado && bloque.estado !== "activo" && (
                            <Badge variant="destructive" className="text-xs">
                              {bloque.estado}
                            </Badge>
                          )}
                        </div>
                      </div>
                    </SelectItem>
                  );
                })
              )}
            </SelectContent>
          </Select>
            <FormDescription>
              Bloques horarios disponibles con capacidad restante
            </FormDescription>
            <FormMessage />
          </FormItem>
        );
      }}
    />
  );
}
