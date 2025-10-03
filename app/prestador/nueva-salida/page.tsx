"use client";

import { useEffect, useState, useCallback } from "react";
import { useAuth, useRouteProtection } from "@/lib/contexts/AuthContext";
import {
  getMisEmbarcaciones,
  registrarSalida,
  getBloquesDisponibles,
} from "@/actions/prestador";
import { getMisBrazaletes, asignarBrazaletes } from "@/actions/brazaletes";
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
  CheckCircle,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Embarcacion } from "@/lib/types/embarcacion";
import { DESTINOS } from "@/lib/types/salida";
import { Badge } from "@/components/ui/badge";
import { getFechasDisponibles, esFechaValida } from "@/lib/utils";

// Función para crear el schema dinámicamente
const createSalidaSchema = (brazaletesDisponibles: number) =>
  z
    .object({
      fecha: z
        .string()
        .min(1, "La fecha es requerida")
        .refine(
          (fecha) => {
            if (!fecha) return false;
            const fechaSeleccionada = new Date(fecha);
            const hoy = new Date();
            hoy.setHours(0, 0, 0, 0); // Resetear horas para comparar solo fechas

            return fechaSeleccionada >= hoy;
          },
          {
            message: "La fecha no puede ser en el pasado",
          }
        )
        .refine(
          (fecha) => {
            if (!fecha) return false;
            return esFechaValida(fecha);
          },
          {
            message:
              "Solo se pueden programar salidas hasta 7 días desde hoy (incluyendo hoy)",
          }
        ),
      destino: z.string().min(1, "El destino es requerido"),
      bloque_id: z.string().optional(), // Solo para Isla Lobos
      hora: z.string().optional(), // Solo para otros destinos
      embarcacion_id: z.string().min(1, "Debe seleccionar una embarcación"),
      numero_pasajeros: z
        .number()
        .min(1, "Debe tener al menos 1 pasajero")
        .max(50, "Máximo 50 pasajeros"),
      numero_brazaletes: z.number().min(0, "No puede ser negativo"),
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
        message:
          "Debe seleccionar un bloque horario o una hora según el destino",
        path: ["bloque_id"], // O "hora" dependiendo del destino
      }
    )
    .refine(
      (data) => {
        // Validar que no se soliciten más brazaletes de los disponibles
        return data.numero_brazaletes <= brazaletesDisponibles;
      },
      {
        message: `No puedes solicitar más de ${brazaletesDisponibles} brazaletes (disponibles)`,
        path: ["numero_brazaletes"],
      }
    );

type SalidaFormData = z.infer<ReturnType<typeof createSalidaSchema>>;

type BloqueBackend = {
  id: string;
  nombre: string;
  hora_inicio: string;
  hora_fin: string;
  capacidad_total: number;
  capacidad_registrada: number;
  estado: string;
  fecha: string;
  embarcaciones_ocupadas: Array<{
    id: string;
    nombre: string;
    tipo: string;
    capacidad: number;
    estado: string;
    salida: {
      id: string;
      estado: string;
      numero_pasajeros: number;
      destino: string;
      observaciones?: string;
    };
  }>;
};

export default function NuevaSalidaPage() {
  const { isLoading, isAuthorized } = useRouteProtection("prestador");
  const { user } = useAuth();
  const router = useRouter();

  // Obtener fechas disponibles para validación
  const { fechaMinima, fechaMaxima } = getFechasDisponibles();

  const [embarcaciones, setEmbarcaciones] = useState<Embarcacion[]>([]);
  const [
    embarcacionesConSalidasPorBloque,
    setEmbarcacionesConSalidasPorBloque,
  ] = useState<
    Map<string, Set<string>> // bloque_id -> Set<embarcacion_id>
  >(new Map());
  const [bloques, setBloques] = useState<BloqueBackend[]>([]);
  const [brazaletesDisponibles, setBrazaletesDisponibles] = useState(0);
  const [loading, setLoading] = useState(true);
  const [loadingBloques, setLoadingBloques] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [registrandoBrazaletes, setRegistrandoBrazaletes] = useState(false);

  const form = useForm<SalidaFormData>({
    resolver: zodResolver(createSalidaSchema(brazaletesDisponibles)),
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

  // Observar cambios en fecha y destino para cargar bloques
  const destinoSeleccionado = form.watch("destino");
  const fechaSeleccionada = form.watch("fecha");
  const bloqueSeleccionado = form.watch("bloque_id");
  const esIslaLobos = destinoSeleccionado === DESTINOS.ISLA_LOBOS;

  useEffect(() => {
    if (!isLoading && isAuthorized && user) {
      loadData();
    }
  }, [isLoading, isAuthorized, user]);

  // Actualizar el resolver cuando cambien los brazaletes disponibles
  useEffect(() => {
    form.clearErrors();
    // El resolver se actualiza automáticamente porque usa brazaletesDisponibles
  }, [brazaletesDisponibles, form]);

  const loadData = async () => {
    try {
      setLoading(true);
      setError("");

      console.log("🚢 Nueva Salida: Cargando datos...");

      const [embarcacionesResult, brazaletesResult] = await Promise.all([
        getMisEmbarcaciones(),
        getMisBrazaletes(),
      ]);

      if (embarcacionesResult.success && embarcacionesResult.data) {
        setEmbarcaciones(embarcacionesResult.data.embarcaciones || []);
        console.log(
          "🚢 Nueva Salida: Embarcaciones cargadas:",
          embarcacionesResult.data.embarcaciones?.length
        );
      } else {
        throw new Error("Error al cargar embarcaciones");
      }

      if (brazaletesResult.success && brazaletesResult.data) {
        setBrazaletesDisponibles(
          brazaletesResult.data.brazaletes.asignados || 0
        );
        console.log(
          "🎫 Nueva Salida: Brazaletes disponibles:",
          brazaletesResult.data.brazaletes.asignados
        );
      } else {
        console.warn("⚠️ Nueva Salida: No se pudieron cargar los brazaletes");
        setBrazaletesDisponibles(0);
      }
    } catch (error) {
      console.error("🚢 Nueva Salida: Error al cargar datos:", error);
      setError(error instanceof Error ? error.message : "Error desconocido");
    } finally {
      setLoading(false);
    }
  };

  /**
   * Carga bloques con capacidad SOLO para destinos "Isla de Lobos"
   * Esta función se ejecuta únicamente cuando:
   * - El destino seleccionado es "Isla de Lobos"
   * - Se ha seleccionado una fecha válida
   *
   * Para otros destinos (arrecifes), NO se ejecuta esta función
   * y NO se hacen peticiones innecesarias al backend
   */
  const loadBloquesConCapacidad = useCallback(async (fecha: string) => {
    try {
      setLoadingBloques(true);
      console.log(
        "⏰ Nueva Salida: Cargando capacidad de bloques para fecha:",
        fecha
      );

      // Intentar obtener bloques del backend para la fecha seleccionada
      const bloquesResult = await getBloquesDisponibles(fecha);

      // Obtener información de embarcaciones ocupadas por bloque desde la nueva API
      const embarcacionesDelPrestadorEnBloques = new Map<string, Set<string>>(); // bloque_id -> Set<embarcacion_id>

      let bloquesDelBackend: BloqueBackend[] = [];

      if (bloquesResult.success && bloquesResult.data?.bloques) {
        bloquesDelBackend = bloquesResult.data.bloques as BloqueBackend[];

        bloquesDelBackend.forEach((bloque) => {
          if (
            bloque.embarcaciones_ocupadas &&
            bloque.embarcaciones_ocupadas.length > 0
          ) {
            // Crear Set para este bloque
            const embarcacionesOcupadas = new Set<string>();

            // Agregar IDs de embarcaciones ocupadas
            bloque.embarcaciones_ocupadas.forEach((embarcacionOcupada) => {
              embarcacionesOcupadas.add(embarcacionOcupada.id);
            });

            // Usar el ID del bloque del backend directamente
            embarcacionesDelPrestadorEnBloques.set(
              bloque.id,
              embarcacionesOcupadas
            );
          }
        });
      }

      // Guardar el mapeo bloque -> embarcaciones del prestador para usar en el formulario
      setEmbarcacionesConSalidasPorBloque(embarcacionesDelPrestadorEnBloques);

      // Usar directamente los bloques del backend
      setBloques(bloquesDelBackend);
      console.log(
        "⏰ Nueva Salida: Bloques del backend cargados:",
        bloquesDelBackend.length
      );
    } catch (error) {
      console.error("⏰ Nueva Salida: Error al cargar bloques:", error);
      // En caso de error, no mostrar bloques
      setBloques([]);
    } finally {
      setLoadingBloques(false);
    }
  }, []);

  // Cargar bloques SOLO cuando selecciona Isla Lobos y tiene fecha
  useEffect(() => {
    if (esIslaLobos && fechaSeleccionada) {
      // Solo cargar bloques para Isla de Lobos
      console.log("🏝️ Nueva Salida: Cargando bloques para Isla de Lobos");
      loadBloquesConCapacidad(fechaSeleccionada);
    } else if (!esIslaLobos) {
      // Limpiar bloques cuando cambia a destino diferente
      console.log(
        "🌊 Nueva Salida: Destino diferente a Isla Lobos - NO cargando bloques"
      );
      setBloques([]);
      setEmbarcacionesConSalidasPorBloque(new Map()); // Limpiar mapeo embarcaciones-bloques
      // Limpiar selección de bloque en el formulario
      form.setValue("bloque_id", "");
    }
    // No hacer nada si es Isla Lobos pero no hay fecha
  }, [esIslaLobos, fechaSeleccionada, form, loadBloquesConCapacidad]);

  // Función para asignar brazaletes automáticamente después de crear la salida
  const asignarBrazaletesAutomaticamente = async (
    salidaId: string,
    cantidadBrazaletes: number,
    fechaSalida: string
  ) => {
    try {
      setRegistrandoBrazaletes(true);
      console.log("🎫 Asignando brazaletes automáticamente...", {
        salidaId,
        cantidadBrazaletes,
        fechaSalida,
      });

      // Validar datos antes de enviar
      console.log("🎫 Validando datos antes de enviar...");
      if (!salidaId) {
        throw new Error("salida_id es requerido");
      }
      if (!fechaSalida) {
        throw new Error("fecha_asignacion es requerida");
      }
      if (cantidadBrazaletes <= 0) {
        throw new Error("La cantidad de brazaletes debe ser mayor a 0");
      }

      console.log("🎫 Validación exitosa, enviando datos...");

      const asignacionData = {
        salida_id: salidaId,
        cantidad: cantidadBrazaletes,
        fecha_asignacion: fechaSalida,
      };

      console.log("🎫 Datos para asignación de brazaletes:", asignacionData);

      const resultado = await asignarBrazaletes(asignacionData);

      if (resultado.success) {
        console.log("🎫 Brazaletes asignados exitosamente:", resultado.data);
        // Mostrar mensaje de éxito
        setSuccessMessage(
          `✅ Salida creada y ${cantidadBrazaletes} brazaletes asignados exitosamente`
        );
      } else {
        console.error("🎫 Error al asignar brazaletes:", resultado.message);
        // Mostrar advertencia pero no fallar la operación
        setSuccessMessage(
          `⚠️ Salida creada exitosamente, pero hubo un problema al asignar los brazaletes: ${resultado.message}. Puedes asignarlos manualmente más tarde.`
        );
      }
    } catch (error) {
      console.error("🎫 Error al asignar brazaletes automáticamente:", error);
      // Mostrar advertencia pero no fallar la operación
      setSuccessMessage(
        `⚠️ Salida creada exitosamente, pero hubo un problema al asignar los brazaletes: ${
          error instanceof Error ? error.message : "Error desconocido"
        }. Puedes asignarlos manualmente más tarde.`
      );
    } finally {
      setRegistrandoBrazaletes(false);
    }
  };

  const onSubmit = async (data: SalidaFormData) => {
    try {
      setIsSubmitting(true);
      setError("");
      setSuccessMessage("");

      // Preparar datos según el destino
      let salidaData;
      if (esIslaLobos && data.bloque_id) {
        // Para Isla Lobos: enviar solo la fecha y el bloque_id
        // El bloque_id es el ID del bloque del backend
        salidaData = {
          fecha: data.fecha, // Solo la fecha, sin hora
          embarcacion_id: data.embarcacion_id,
          numero_pasajeros: data.numero_pasajeros,
          numero_brazaletes: data.numero_brazaletes,
          destino: data.destino,
          observaciones: data.observaciones || "",
          bloque_id: data.bloque_id, // ID del bloque del backend
        };
      } else if (data.hora) {
        // Para otros destinos: combinar fecha y hora
        const fechaCompleta = `${data.fecha}T${data.hora}:00`;
        salidaData = {
          fecha: fechaCompleta,
          embarcacion_id: data.embarcacion_id,
          numero_pasajeros: data.numero_pasajeros,
          numero_brazaletes: data.numero_brazaletes,
          destino: data.destino,
          observaciones: data.observaciones || "",
          // No enviar bloque_id para otros destinos
        };
      } else {
        throw new Error("Debe proporcionar un bloque horario o una hora");
      }

      console.log("🚢 Nueva Salida: Datos del formulario:", {
        fecha: data.fecha,
        destino: data.destino,
        bloque_id: data.bloque_id,
        hora: data.hora,
        esIslaLobos,
        embarcacion_id: data.embarcacion_id,
        numero_pasajeros: data.numero_pasajeros,
        numero_brazaletes: data.numero_brazaletes,
      });

      console.log(
        "🚢 Nueva Salida: Datos que se enviarán al backend para crear la salida:",
        JSON.stringify(salidaData, null, 2)
      );
      const result = await registrarSalida(salidaData);

      if (result.success) {
        console.log("🚢 Nueva Salida: Salida registrada exitosamente");
        console.log(
          "🚢 Nueva Salida: Respuesta completa del backend:",
          JSON.stringify(result, null, 2)
        );

        // Si se especificaron brazaletes, asignarlos automáticamente
        if (data.numero_brazaletes > 0 && result.data?.salida?.id) {
          console.log(
            "🚢 Nueva Salida: Iniciando asignación automática de brazaletes..."
          );
          await asignarBrazaletesAutomaticamente(
            result.data.salida.id,
            data.numero_brazaletes,
            data.fecha // Usar la fecha seleccionada en el formulario
          );
          // No redirigir automáticamente, mostrar mensaje de éxito
        } else {
          // Si no hay brazaletes, redirigir inmediatamente
          router.push("/prestador/salidas");
        }
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

        {/* Mensaje de éxito */}
        {successMessage && (
          <div className="space-y-3">
            <Alert className="border-green-200 bg-green-50 text-green-800">
              <CheckCircle className="h-4 w-4" />
              <AlertDescription>{successMessage}</AlertDescription>
            </Alert>
            <div className="flex justify-center">
              <Button
                onClick={() => router.push("/prestador/salidas")}
                className="bg-[var(--isla-teal)] hover:bg-[var(--isla-teal-dark)] text-white"
              >
                Ver Mis Salidas
              </Button>
            </div>
          </div>
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

          {/* Mensaje informativo sobre fechas */}
          <div className="px-6 pb-4">
            <Alert>
              <Calendar className="h-4 w-4" />
              <AlertDescription>
                📅 <strong>Fechas disponibles:</strong> Puedes programar salidas
                desde hoy hasta el{" "}
                <strong>
                  {new Date(fechaMaxima).toLocaleDateString("es-MX", {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </strong>{" "}
                (7 días en total, incluyendo hoy)
              </AlertDescription>
            </Alert>
          </div>
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
                              const capacidadDisponible =
                                bloque.capacidad_total -
                                bloque.capacidad_registrada;
                              const estaLleno = capacidadDisponible <= 0;
                              const estaCasiLleno =
                                capacidadDisponible > 0 &&
                                capacidadDisponible <= 10;
                              const deshabilitado =
                                bloque.estado === "lleno" ||
                                bloque.estado === "suspendido_por_clima" ||
                                bloque.estado === "cerrado_capitaria";

                              return (
                                <SelectItem
                                  key={bloque.id}
                                  value={bloque.id}
                                  disabled={deshabilitado}
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
                                        {capacidadDisponible}/
                                        {bloque.capacidad_total}
                                      </Badge>
                                      {deshabilitado && (
                                        <Badge
                                          variant="destructive"
                                          className="text-xs"
                                        >
                                          {bloque.estado === "lleno" && "Lleno"}
                                          {bloque.estado ===
                                            "suspendido_por_clima" &&
                                            "Suspendido por clima"}
                                          {bloque.estado ===
                                            "cerrado_capitaria" &&
                                            "Cerrado por capitanía"}
                                        </Badge>
                                      )}
                                      {!deshabilitado &&
                                        bloque.estado !== "activo" && (
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
                          {embarcaciones.map((embarcacion) => {
                            // Verificar si esta embarcación del prestador aparece en el bloque seleccionado
                            const embarcacionesEnEsteBloque =
                              embarcacionesConSalidasPorBloque.get(
                                bloqueSeleccionado || ""
                              );
                            const tieneSalidaEnEsteBloque =
                              embarcacionesEnEsteBloque?.has(embarcacion.id) ||
                              false;

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
                                      {embarcacion.tipo} -{" "}
                                      {embarcacion.capacidad} pasajeros
                                    </span>
                                  </div>
                                  {tieneSalidaEnEsteBloque && (
                                    <Badge
                                      variant="destructive"
                                      className="text-xs"
                                    >
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
                              (embarcacionesConSalidasPorBloque.get(
                                bloqueSeleccionado
                              )?.size || 0) > 0 && (
                                <span className="text-amber-600">
                                  ℹ️ Algunas embarcaciones están deshabilitadas
                                  porque ya tienen salidas programadas en este
                                  bloque
                                </span>
                              )}
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
                  control={form.control}
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
                            brazaletesDisponibles > 0
                              ? brazaletesDisponibles
                              : undefined
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
                            - No tienes brazaletes disponibles. Contacta a
                            CONANP para adquirir más.
                          </span>
                        )}
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
      </div>
    </div>
  );
}
