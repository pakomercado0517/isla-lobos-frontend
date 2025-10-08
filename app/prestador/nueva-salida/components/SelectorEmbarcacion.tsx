"use client";

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
import { Ship } from "lucide-react";
import Link from "next/link";
import { Control, FieldPath } from "react-hook-form";
import { Embarcacion } from "@/lib/types/embarcacion";
import { SalidaFormData, tieneSalidaEnBloque } from "./utils";

interface SelectorEmbarcacionProps {
  control: Control<SalidaFormData>;
  name: FieldPath<SalidaFormData>;
  embarcaciones: Embarcacion[];
  bloqueSeleccionado?: string;
  embarcacionesConSalidasPorBloque: Map<string, Set<string>>;
  esIslaLobos: boolean;
}

export function SelectorEmbarcacion({
  control,
  name,
  embarcaciones,
  bloqueSeleccionado,
  embarcacionesConSalidasPorBloque,
  esIslaLobos,
}: SelectorEmbarcacionProps) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel className="flex items-center gap-2">
            <Ship className="w-4 h-4" />
            Embarcación *
          </FormLabel>
          <Select
            onValueChange={field.onChange}
            value={String(field.value || "")}
          >
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder="Seleccionar embarcación" />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {embarcaciones.map((embarcacion) => {
                // Verificar si esta embarcación del prestador aparece en el bloque seleccionado
                const tieneSalidaEnEsteBloque = bloqueSeleccionado
                  ? tieneSalidaEnBloque(
                      embarcacion.id,
                      bloqueSeleccionado,
                      embarcacionesConSalidasPorBloque
                    )
                  : false;

                return (
                  <SelectItem
                    key={embarcacion.id}
                    value={embarcacion.id}
                    disabled={tieneSalidaEnEsteBloque}
                  >
                    <div className="flex items-center justify-between w-full gap-4">
                      <div className="flex flex-col">
                        <span className="font-medium">
                          {embarcacion.nombre}
                        </span>
                        <span className="text-xs text-gray-500">
                          {embarcacion.tipo} - {embarcacion.capacidad} pasajeros
                        </span>
                      </div>
                      {tieneSalidaEnEsteBloque && (
                        <Badge variant="destructive" className="text-xs">
                          Ya tiene salida en este bloque
                        </Badge>
                      )}
                    </div>
                  </SelectItem>
                );
              })}
            </SelectContent>
          </Select>
          <FormDescription>
            {embarcaciones.length === 0 ? (
              <span className="text-orange-600">
                No tienes embarcaciones registradas.
                <Link
                  href="/prestador/embarcaciones"
                  className="underline ml-1"
                >
                  Registrar embarcación
                </Link>
              </span>
            ) : (
              <span>
                {esIslaLobos &&
                  bloqueSeleccionado &&
                  (embarcacionesConSalidasPorBloque.get(bloqueSeleccionado)
                    ?.size || 0) > 0 && (
                    <span className="text-amber-600">
                      ℹ️ Algunas embarcaciones están deshabilitadas porque ya
                      tienen salidas programadas en este bloque
                    </span>
                  )}
              </span>
            )}
          </FormDescription>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
