"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Calendar, Clock, Ship, Save, RefreshCw } from "lucide-react";
import { Embarcacion } from "@/lib/types/embarcacion";
import { DESTINOS } from "@/lib/types/salida";
import { getFechasDisponibles, formatearFechaSinTimezone } from "@/lib/utils";
import { SalidaFormData, BloqueBackend, createSalidaSchema } from "./utils";
import { SelectorDestino } from "./SelectorDestino";
import { SelectorBloque } from "./SelectorBloque";
import { SelectorEmbarcacion } from "./SelectorEmbarcacion";
import { CamposPasajerosYBrazaletes } from "./CamposPasajerosYBrazaletes";

interface FormularioNuevaSalidaProps {
  embarcaciones: Embarcacion[];
  bloques: BloqueBackend[];
  brazaletesDisponibles: number;
  loadingBloques: boolean;
  embarcacionesConSalidasPorBloque: Map<string, Set<string>>;
  isSubmitting: boolean;
  registrandoBrazaletes: boolean;
  loading: boolean;
  onSubmit: (data: SalidaFormData) => Promise<void>;
  onDestinoChange?: (destino: string) => void;
  onFechaChange?: (fecha: string) => void;
}

export function FormularioNuevaSalida({
  embarcaciones,
  bloques,
  brazaletesDisponibles,
  loadingBloques,
  embarcacionesConSalidasPorBloque,
  isSubmitting,
  registrandoBrazaletes,
  loading,
  onSubmit,
  onDestinoChange,
  onFechaChange,
}: FormularioNuevaSalidaProps) {
  const router = useRouter();
  const { fechaMinima, fechaMaxima } = getFechasDisponibles();

  const form = useForm<SalidaFormData>({
    resolver: zodResolver(
      createSalidaSchema(brazaletesDisponibles, embarcaciones)
    ),
    defaultValues: {
      fecha: "",
      destino: "",
      bloque_id: "",
      hora: "",
      embarcacion_id: "",
      numero_pasajeros: 1,
      numero_brazaletes: 0,
      observaciones: "",
    },
  });

  // Observar cambios en fecha y destino para validaciones
  const destinoSeleccionado = form.watch("destino");
  const fechaSeleccionada = form.watch("fecha");
  const bloqueSeleccionado = form.watch("bloque_id");
  const esIslaLobos = destinoSeleccionado === DESTINOS.ISLA_LOBOS;

  // Notificar al componente padre cuando cambia el destino
  useEffect(() => {
    if (onDestinoChange && destinoSeleccionado) {
      onDestinoChange(destinoSeleccionado);
    }

    // Limpiar bloque_id cuando se cambia de destino
    // Si cambiamos a un destino que NO es Isla de Lobos, limpiar el bloque
    if (destinoSeleccionado && destinoSeleccionado !== DESTINOS.ISLA_LOBOS) {
      form.setValue("bloque_id", "");
    }
    // Si cambiamos a Isla de Lobos, limpiar la hora
    if (destinoSeleccionado === DESTINOS.ISLA_LOBOS) {
      form.setValue("hora", "");
    }
  }, [destinoSeleccionado, onDestinoChange, form]);

  // Notificar al componente padre cuando cambia la fecha
  useEffect(() => {
    if (onFechaChange && fechaSeleccionada) {
      onFechaChange(fechaSeleccionada);
    }

    // Al cambiar la fecha, limpiar el bloque seleccionado
    // porque los bloques cambian según la fecha
    if (fechaSeleccionada && esIslaLobos) {
      form.setValue("bloque_id", "");
    }
  }, [fechaSeleccionada, onFechaChange, esIslaLobos, form]);

  return (
    <Card className="max-w-2xl">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Ship className="w-5 h-5" />
          Información de la Salida
        </CardTitle>
        <CardDescription>
          Completa los datos de tu nueva salida turística
        </CardDescription>
      </CardHeader>

      {/* Mensaje informativo sobre fechas */}
      <div className="px-6 pb-4">
        <Alert>
          <Calendar className="h-4 w-4" />
          <AlertDescription>
            📅 <strong>Fechas disponibles:</strong> Puedes programar salidas
            desde hoy hasta el{" "}
            <strong>{formatearFechaSinTimezone(fechaMaxima)}</strong> (7 días en
            total, incluyendo hoy)
          </AlertDescription>
        </Alert>
      </div>

      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Destino */}
            <SelectorDestino control={form.control} name="destino" />

            {/* Fecha */}
            <FormField
              control={form.control}
              name="fecha"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    Fecha *
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="date"
                      {...field}
                      min={fechaMinima}
                      max={fechaMaxima}
                    />
                  </FormControl>
                  <FormDescription>
                    Selecciona la fecha de la salida turística (7 días
                    disponibles, incluyendo hoy)
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Bloque Horario (solo para Isla Lobos) */}
            {esIslaLobos && (
              <SelectorBloque
                control={form.control}
                name="bloque_id"
                bloques={bloques}
                loadingBloques={loadingBloques}
                fechaSeleccionada={fechaSeleccionada}
              />
            )}

            {/* Hora (solo para otros destinos) */}
            {!esIslaLobos && destinoSeleccionado && (
              <FormField
                control={form.control}
                name="hora"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      Hora *
                    </FormLabel>
                    <FormControl>
                      <Input type="time" {...field} />
                    </FormControl>
                    <FormDescription>
                      Hora de salida (no se requiere bloque horario para este
                      destino)
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            {/* Embarcación */}
            <SelectorEmbarcacion
              control={form.control}
              name="embarcacion_id"
              embarcaciones={embarcaciones}
              bloqueSeleccionado={bloqueSeleccionado}
              embarcacionesConSalidasPorBloque={
                embarcacionesConSalidasPorBloque
              }
              esIslaLobos={esIslaLobos}
            />

            {/* Pasajeros y Brazaletes */}
            <CamposPasajerosYBrazaletes
              control={form.control}
              brazaletesDisponibles={brazaletesDisponibles}
            />

            {/* Observaciones */}
            <FormField
              control={form.control}
              name="observaciones"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Observaciones</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Información adicional sobre la salida..."
                      rows={3}
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Información adicional sobre la salida (opcional)
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Botones */}
            <div className="flex justify-end gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
                disabled={isSubmitting || registrandoBrazaletes}
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                disabled={
                  isSubmitting ||
                  registrandoBrazaletes ||
                  loading ||
                  embarcaciones.length === 0
                }
                className="bg-[var(--isla-teal)] hover:bg-[var(--isla-teal-dark)] text-white"
              >
                {isSubmitting ? (
                  <>
                    <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                    Registrando Salida...
                  </>
                ) : registrandoBrazaletes ? (
                  <>
                    <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                    Asignando Brazaletes...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    Registrar Salida
                  </>
                )}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
