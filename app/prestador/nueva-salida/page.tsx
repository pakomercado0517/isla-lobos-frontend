"use client";

import { useEffect, useState } from "react";
import { useAuth, useRouteProtection } from "@/lib/contexts/AuthContext";
import {
  getMisEmbarcaciones,
  registrarSalida,
  getBloquesDisponibles,
} from "@/actions/prestador";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { PageHeader } from "@/components/ui/page-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
import {
  Calendar,
  Clock,
  Ship,
  Users,
  Save,
  RefreshCw,
  AlertTriangle,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Embarcacion } from "@/lib/types/embarcacion";
import { DESTINOS, BLOQUES_PREDEFINIDOS } from "@/lib/types/salida";
import { Badge } from "@/components/ui/badge";

const salidaSchema = z
  .object({
    fecha: z.string().min(1, "La fecha es requerida"),
    destino: z.string().min(1, "El destino es requerido"),
    bloque_id: z.string().optional(), // Solo para Isla Lobos
    hora: z.string().optional(), // Solo para otros destinos
    embarcacion_id: z.string().min(1, "Debe seleccionar una embarcación"),
    numero_pasajeros: z
      .number()
      .min(1, "Debe tener al menos 1 pasajero")
      .max(50, "Máximo 50 pasajeros"),
    observaciones: z.string().optional(),
  })
  .refine(
    (data) => {
      // Si es Isla Lobos, bloque_id es requerido
      if (data.destino === DESTINOS.ISLA_LOBOS) {
        return !!data.bloque_id;
      }
      // Si es otro destino, hora es requerida
      return !!data.hora;
    },
    {
      message: "Debe seleccionar un bloque horario o una hora según el destino",
      path: ["bloque_id"], // O "hora" dependiendo del destino
    }
  );

type SalidaFormData = z.infer<typeof salidaSchema>;

type BloqueBackend = {
  id: string;
  nombre: string;
  hora_inicio: string;
  hora_fin: string;
  capacidad_total: number;
  capacidad_registrada: number;
  estado: string;
  fecha: string;
};

export default function NuevaSalidaPage() {
  const { isLoading, isAuthorized } = useRouteProtection("prestador");
  const { user } = useAuth();
  const router = useRouter();

  const [embarcaciones, setEmbarcaciones] = useState<Embarcacion[]>([]);
  const [bloques, setBloques] = useState<
    {
      id: string;
      nombre: string;
      hora_inicio: string;
      hora_fin: string;
      capacidad_total: number;
      capacidad_registrada: number;
      capacidad_disponible: number;
      estado: string;
      fecha: string;
    }[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [loadingBloques, setLoadingBloques] = useState(false);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<SalidaFormData>({
    resolver: zodResolver(salidaSchema),
    defaultValues: {
      fecha: "",
      destino: "",
      bloque_id: "",
      hora: "",
      embarcacion_id: "",
      numero_pasajeros: 1,
      observaciones: "",
    },
  });

  // Observar cambios en fecha y destino para cargar bloques
  const destinoSeleccionado = form.watch("destino");
  const fechaSeleccionada = form.watch("fecha");
  const esIslaLobos = destinoSeleccionado === DESTINOS.ISLA_LOBOS;

  useEffect(() => {
    if (!isLoading && isAuthorized && user) {
      loadData();
    }
  }, [isLoading, isAuthorized, user]);

  // Cargar bloques cuando selecciona Isla Lobos y tiene fecha
  useEffect(() => {
    if (esIslaLobos && fechaSeleccionada) {
      loadBloquesConCapacidad(fechaSeleccionada);
    } else {
      setBloques([]);
    }
  }, [esIslaLobos, fechaSeleccionada]);

  const loadData = async () => {
    try {
      setLoading(true);
      setError("");

      console.log("🚢 Nueva Salida: Cargando embarcaciones...");

      const embarcacionesResult = await getMisEmbarcaciones();

      if (embarcacionesResult.success && embarcacionesResult.data) {
        setEmbarcaciones(embarcacionesResult.data.embarcaciones || []);
        console.log(
          "🚢 Nueva Salida: Embarcaciones cargadas:",
          embarcacionesResult.data.embarcaciones?.length
        );
      } else {
        throw new Error("Error al cargar embarcaciones");
      }
    } catch (error) {
      console.error("🚢 Nueva Salida: Error al cargar datos:", error);
      setError(error instanceof Error ? error.message : "Error desconocido");
    } finally {
      setLoading(false);
    }
  };

  const loadBloquesConCapacidad = async (fecha: string) => {
    try {
      setLoadingBloques(true);
      console.log(
        "⏰ Nueva Salida: Cargando capacidad de bloques para fecha:",
        fecha
      );

      // Intentar obtener bloques del backend para la fecha seleccionada
      const bloquesResult = await getBloquesDisponibles(fecha);

      // Siempre mostrar los bloques predefinidos
      const bloquesConCapacidad = BLOQUES_PREDEFINIDOS.map(
        (bloquePredefinido) => {
          // Buscar si existe información de capacidad del backend para este bloque
          const bloqueBackend =
            bloquesResult.success && bloquesResult.data?.bloques
              ? (bloquesResult.data.bloques as BloqueBackend[]).find(
                  (b) => b.nombre === bloquePredefinido.nombre
                )
              : null;

          return {
            id: bloqueBackend?.id || bloquePredefinido.id,
            nombre: bloquePredefinido.nombre,
            hora_inicio: bloquePredefinido.hora_inicio,
            hora_fin: bloquePredefinido.hora_fin,
            capacidad_total: bloquePredefinido.capacidad_total,
            capacidad_registrada: bloqueBackend?.capacidad_registrada || 0,
            capacidad_disponible: bloqueBackend
              ? bloquePredefinido.capacidad_total -
                (bloqueBackend.capacidad_registrada || 0)
              : bloquePredefinido.capacidad_total,
            estado: bloqueBackend?.estado || "activo",
            fecha: fecha,
          };
        }
      );

      setBloques(bloquesConCapacidad);
      console.log(
        "⏰ Nueva Salida: Bloques preparados:",
        bloquesConCapacidad.length
      );
    } catch (error) {
      console.error("⏰ Nueva Salida: Error al cargar bloques:", error);
      // Aún en caso de error, mostrar los bloques predefinidos
      const bloquesPorDefecto = BLOQUES_PREDEFINIDOS.map((bloque) => ({
        ...bloque,
        capacidad_registrada: 0,
        capacidad_disponible: bloque.capacidad_total,
        estado: "activo",
        fecha: fecha,
      }));
      setBloques(bloquesPorDefecto);
    } finally {
      setLoadingBloques(false);
    }
  };

  const onSubmit = async (data: SalidaFormData) => {
    try {
      setIsSubmitting(true);
      setError("");

      // Si es Isla Lobos, usar el bloque; si no, combinar fecha y hora
      let fechaCompleta;
      if (esIslaLobos && data.bloque_id) {
        // Para Isla Lobos, la fecha la maneja el bloque
        fechaCompleta = data.fecha;
      } else if (data.hora) {
        // Para otros destinos, combinar fecha y hora
        fechaCompleta = `${data.fecha}T${data.hora}:00`;
      } else {
        throw new Error("Debe proporcionar un bloque horario o una hora");
      }

      const salidaData = {
        fecha: fechaCompleta,
        embarcacion_id: data.embarcacion_id,
        numero_pasajeros: data.numero_pasajeros,
        destino: data.destino,
        observaciones: data.observaciones || "",
        bloque_id: esIslaLobos ? data.bloque_id : undefined,
      };

      console.log("🚢 Nueva Salida: Registrando salida:", salidaData);
      const result = await registrarSalida(salidaData);

      if (result.success) {
        console.log("🚢 Nueva Salida: Salida registrada exitosamente");
        router.push("/prestador/salidas");
      } else {
        throw new Error(result.message || "Error al registrar la salida");
      }
    } catch (error) {
      console.error("🚢 Nueva Salida: Error al registrar salida:", error);
      setError(error instanceof Error ? error.message : "Error desconocido");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-4 text-[var(--isla-teal)]" />
          <p className="text-gray-600">Verificando autenticación...</p>
        </div>
      </div>
    );
  }

  if (!isAuthorized) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50/50">
      <PageHeader
        title="Nueva Salida"
        description="Registra una nueva salida turística"
        breadcrumbs={[
          { label: "Dashboard", href: "/prestador" },
          { label: "Salidas", href: "/prestador/salidas" },
          { label: "Nueva Salida" },
        ]}
        backHref="/prestador/salidas"
        backLabel="Volver a Salidas"
        badge={
          embarcaciones.length > 0
            ? {
                text: `${embarcaciones.length} embarcaciones disponibles`,
                variant: "secondary",
              }
            : {
                text: "Sin embarcaciones",
                variant: "destructive",
              }
        }
      />

      <div className="px-6 py-6 space-y-6">
        {/* Error general */}
        {error && (
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Formulario */}
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
          <CardContent>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6"
              >
                {/* Destino */}
                <FormField
                  control={form.control}
                  name="destino"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Destino *</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Seleccionar destino" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
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
                      <FormDescription>
                        Selecciona primero el destino de tu salida turística
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

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
                          min={new Date().toISOString().split("T")[0]}
                        />
                      </FormControl>
                      <FormDescription>
                        Selecciona la fecha de la salida turística
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Bloque Horario (solo para Isla Lobos) */}
                {esIslaLobos && (
                  <FormField
                    control={form.control}
                    name="bloque_id"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-2">
                          <Clock className="w-4 h-4" />
                          Bloque Horario *
                        </FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          value={field.value}
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
                            {bloques.map((bloque) => {
                              const estaLleno =
                                bloque.capacidad_disponible <= 0;
                              const estaCasiLleno =
                                bloque.capacidad_disponible > 0 &&
                                bloque.capacidad_disponible <= 10;

                              return (
                                <SelectItem
                                  key={bloque.id}
                                  value={bloque.id}
                                  disabled={
                                    estaLleno || bloque.estado !== "activo"
                                  }
                                >
                                  <div className="flex items-center justify-between w-full gap-4">
                                    <div className="flex flex-col">
                                      <span className="font-medium">
                                        {bloque.nombre}
                                      </span>
                                      <span className="text-xs text-gray-500">
                                        {bloque.hora_inicio} - {bloque.hora_fin}
                                      </span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                      <Badge
                                        variant={
                                          estaLleno
                                            ? "destructive"
                                            : estaCasiLleno
                                            ? "secondary"
                                            : "outline"
                                        }
                                        className="text-xs"
                                      >
                                        {bloque.capacidad_disponible}/
                                        {bloque.capacidad_total}
                                      </Badge>
                                      {bloque.estado !== "activo" && (
                                        <Badge
                                          variant="destructive"
                                          className="text-xs"
                                        >
                                          {bloque.estado}
                                        </Badge>
                                      )}
                                    </div>
                                  </div>
                                </SelectItem>
                              );
                            })}
                          </SelectContent>
                        </Select>
                        <FormDescription>
                          Bloques horarios disponibles con capacidad restante
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
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
                          Hora de salida (no se requiere bloque horario para
                          este destino)
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}

                {/* Embarcación */}
                <FormField
                  control={form.control}
                  name="embarcacion_id"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2">
                        <Ship className="w-4 h-4" />
                        Embarcación *
                      </FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Seleccionar embarcación" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {embarcaciones.map((embarcacion) => (
                            <SelectItem
                              key={embarcacion.id}
                              value={embarcacion.id}
                            >
                              {embarcacion.nombre} - {embarcacion.tipo}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormDescription>
                        {embarcaciones.length === 0 && (
                          <span className="text-orange-600">
                            No tienes embarcaciones registradas.
                            <Link
                              href="/prestador/embarcaciones"
                              className="underline ml-1"
                            >
                              Registrar embarcación
                            </Link>
                          </span>
                        )}
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Número de pasajeros */}
                <FormField
                  control={form.control}
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
                          onChange={(e) =>
                            field.onChange(parseInt(e.target.value))
                          }
                        />
                      </FormControl>
                      <FormDescription>
                        Número de turistas que participarán en esta salida
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
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
                    disabled={isSubmitting}
                  >
                    Cancelar
                  </Button>
                  <Button
                    type="submit"
                    disabled={
                      isSubmitting || loading || embarcaciones.length === 0
                    }
                    className="bg-[var(--isla-teal)] hover:bg-[var(--isla-teal-dark)] text-white"
                  >
                    {isSubmitting ? (
                      <>
                        <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                        Registrando...
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
      </div>
    </div>
  );
}
