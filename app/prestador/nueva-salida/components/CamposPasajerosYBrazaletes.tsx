"use client";

import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Users } from "lucide-react";
import { Control } from "react-hook-form";
import { SalidaFormData } from "./utils";

interface CamposPasajerosYBrazaletesProps {
  control: Control<SalidaFormData>;
  brazaletesDisponibles: number;
}

export function CamposPasajerosYBrazaletes({
  control,
  brazaletesDisponibles,
}: CamposPasajerosYBrazaletesProps) {
  return (
    <>
      {/* Número de pasajeros */}
      <FormField
        control={control}
        name="numero_pasajeros"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              Número de Pasajeros *
            </FormLabel>
            <FormControl>
              <Input
                type="number"
                min="1"
                max="50"
                {...field}
                value={field.value || ""}
                onChange={(e) => {
                  const value = e.target.value;
                  if (value === "") {
                    field.onChange(1); // Valor por defecto
                  } else {
                    const numValue = parseInt(value);
                    if (!isNaN(numValue)) {
                      field.onChange(numValue);
                    }
                  }
                }}
              />
            </FormControl>
            <FormDescription>
              Número de turistas que participarán en esta salida
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Número de brazaletes */}
      <FormField
        control={control}
        name="numero_brazaletes"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="flex items-center gap-2">
              <span className="text-lg">🎫</span>
              Número de Brazaletes
            </FormLabel>
            <FormControl>
              <Input
                type="number"
                min="0"
                max={
                  brazaletesDisponibles > 0 ? brazaletesDisponibles : undefined
                }
                {...field}
                value={field.value || ""}
                onChange={(e) => {
                  const value = e.target.value;
                  if (value === "") {
                    field.onChange(0);
                  } else {
                    const numValue = parseInt(value);
                    if (!isNaN(numValue)) {
                      field.onChange(numValue);
                    }
                  }
                }}
              />
            </FormControl>
            <FormDescription>
              Brazaletes disponibles: {brazaletesDisponibles}
              {brazaletesDisponibles === 0 && (
                <span className="text-amber-600 font-medium">
                  {" "}
                  - No tienes brazaletes disponibles. Contacta a conanp para
                  adquirir más.
                </span>
              )}
              {brazaletesDisponibles > 0 && (
                <span className="text-green-600 font-medium">
                  {" "}
                  - Puedes solicitar hasta {brazaletesDisponibles} brazaletes
                  para esta salida.
                </span>
              )}
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
}
