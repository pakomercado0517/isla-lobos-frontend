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
import { DESTINOS } from "@/lib/types/salida";
import { Control, FieldPath } from "react-hook-form";
import { SalidaFormData } from "./utils";

interface SelectorDestinoProps {
  control: Control<SalidaFormData>;
  name: FieldPath<SalidaFormData>;
}

export function SelectorDestino({ control, name }: SelectorDestinoProps) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel className="text-base md:text-sm">Destino *</FormLabel>
          <Select
            onValueChange={field.onChange}
            value={String(field.value || "")}
          >
            <FormControl>
              <SelectTrigger className="h-12 md:h-10 text-base md:text-sm">
                <SelectValue placeholder="Seleccionar destino" />
              </SelectTrigger>
            </FormControl>
            <SelectContent className="text-base md:text-sm">
              <SelectItem value={DESTINOS.ISLA_LOBOS}>
                🏝️ {DESTINOS.ISLA_LOBOS}
              </SelectItem>
              <SelectItem value={DESTINOS.ARRECIFE_TUXPAN}>
                🐠 {DESTINOS.ARRECIFE_TUXPAN}
              </SelectItem>
              <SelectItem value={DESTINOS.ARRECIFE_EN_MEDIO}>
                🐠 {DESTINOS.ARRECIFE_EN_MEDIO}
              </SelectItem>
              <SelectItem value={DESTINOS.ARRECIFE_TANHUIJO}>
                🐠 {DESTINOS.ARRECIFE_TANHUIJO}
              </SelectItem>
            </SelectContent>
          </Select>
          <FormDescription className="text-base md:text-sm">
            Selecciona primero el destino de tu salida turística
          </FormDescription>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
