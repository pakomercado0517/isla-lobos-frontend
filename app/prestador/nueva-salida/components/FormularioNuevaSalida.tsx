"use client";

import { useEffect, useRef } from "react";
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
import { getFechasDisponibles, formatearFechaRegional } from "@/lib/utils";
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
  onBloqueChange?: (bloqueId: string | null) => void;
  embarcacionPreseleccionada?: string | null;
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
  onBloqueChange,
  embarcacionPreseleccionada,
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
      embarcacion_id: embarcacionPreseleccionada || "",
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

  // Referencia para rastrear la fecha anterior y limpiar bloque solo cuando cambia realmente
  const fechaAnteriorRef = useRef<string>("");

  // Notificar al componente padre cuando cambia la fecha
  useEffect(() => {
    if (onFechaChange && fechaSeleccionada) {
      onFechaChange(fechaSeleccionada);
    }

    // Al cambiar la fecha, limpiar el bloque seleccionado SOLO si la fecha realmente cambió
    // porque los bloques cambian según la fecha
    if (
      fechaSeleccionada &&
      esIslaLobos &&
      fechaSeleccionada !== fechaAnteriorRef.current
    ) {
      form.setValue("bloque_id", "");
      if (onBloqueChange) {
        onBloqueChange(null);
      }
      fechaAnteriorRef.current = fechaSeleccionada;
    } else if (!fechaSeleccionada) {
      fechaAnteriorRef.current = "";
    }
  }, [fechaSeleccionada, onFechaChange, esIslaLobos, form, onBloqueChange]);

  // Notificar al componente padre cuando cambia el bloque seleccionado
  // Usar un useEffect con una verificación para evitar ejecuciones innecesarias
  useEffect(() => {
    if (onBloqueChange) {
      const bloqueId = bloqueSeleccionado || null;
      onBloqueChange(bloqueId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bloqueSeleccionado]);

  // Establecer embarcación preseleccionada cuando esté disponible
  useEffect(() => {
    if (embarcacionPreseleccionada && embarcaciones.length > 0) {
      const embarcacionExiste = embarcaciones.some(
        (e) => e.id === embarcacionPreseleccionada
      );
      if (embarcacionExiste) {
        form.setValue("embarcacion_id", embarcacionPreseleccionada);
      }
    }
  }, [embarcacionPreseleccionada, embarcaciones, form]);

  console.log("bloques", bloques);

  return (
    <Card className="max-w-2xl">
      <CardHeader className="pb-4 md:pb-6">
        <CardTitle className="text-xl md:text-lg flex items-center gap-2">
          <Ship className="w-6 h-6 md:w-5 md:h-5" />
          Información de la Salida
        </CardTitle>
        <CardDescription className="text-base md:text-sm">
          Completa los datos de tu nueva salida turística
        </CardDescription>
      </CardHeader>

      {/* Mensaje informativo sobre fechas */}
      <div className="px-4 md:px-6 pb-4">
        <Alert>
          <Calendar className="h-5 w-5 md:h-4 md:w-4" />
          <AlertDescription className="text-base md:text-sm">
            📅 <strong>Fechas disponibles:</strong> Puedes programar salidas
            desde hoy hasta el{" "}
            <strong>{formatearFechaRegional(fechaMaxima)}</strong> (7 días en
            total, incluyendo hoy)
          </AlertDescription>
        </Alert>
      </div>

      <CardContent className="px-4 md:px-6">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-6 md:space-y-6"
          >
            {/* Destino */}
            <SelectorDestino control={form.control} name="destino" />

            {/* Fecha */}
            <FormField
              control={form.control}
              name="fecha"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2 text-base md:text-sm">
                    <Calendar className="w-5 h-5 md:w-4 md:h-4" />
                    Fecha *
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="date"
                      {...field}
                      min={fechaMinima}
                      max={fechaMaxima}
                      className="h-12 md:h-10 text-base"
                    />
                  </FormControl>
                  <FormDescription className="text-base md:text-sm">
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
                    <FormLabel className="flex items-center gap-2 text-base md:text-sm">
                      <Clock className="w-5 h-5 md:w-4 md:h-4" />
                      Hora *
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="time"
                        className="h-12 md:h-10 text-base"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription className="text-base md:text-sm">
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
                  <FormLabel className="text-base md:text-sm">
                    Observaciones
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Información adicional sobre la salida..."
                      rows={3}
                      className="text-base resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription className="text-base md:text-sm">
                    Información adicional sobre la salida (opcional)
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Botones */}
            <div className="flex flex-col md:flex-row justify-end gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
                disabled={isSubmitting || registrandoBrazaletes}
                className="h-12 md:h-10 text-base md:text-sm"
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
                className="h-12 md:h-10 text-base md:text-sm bg-[var(--isla-teal)] hover:bg-[var(--isla-teal-dark)] text-white"
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
