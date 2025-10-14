"use client";

import { useEffect, useState } from "react";
import { useAuth, useRouteProtection } from "@/lib/contexts/AuthContext";
import { clientLogger } from "@/lib/logger-client";
import {
  getMisEmbarcaciones,
  registrarSalida,
  getBloquesDisponibles,
} from "@/actions/prestador";
import { asignarBrazaletes, buscarBrazaletes } from "@/actions/brazaletes";
import { useRouter } from "next/navigation";
import { RefreshCw } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Embarcacion } from "@/lib/types/embarcacion";
import { DESTINOS } from "@/lib/types/salida";
import {
  FormularioNuevaSalida,
  MensajeEstado,
  DialogExito,
  DialogConfirmacion,
  BloqueBackend,
  SalidaFormData,
} from "./components";

export default function NuevaSalidaPage() {
  const { isLoading, isAuthorized } = useRouteProtection("prestador");
  const { user } = useAuth();
  const router = useRouter();

  const [embarcaciones, setEmbarcaciones] = useState<Embarcacion[]>([]);
  const [
    embarcacionesConSalidasPorBloque,
    setEmbarcacionesConSalidasPorBloque,
  ] = useState<Map<string, Set<string>>>(new Map());
  const [bloques, setBloques] = useState<BloqueBackend[]>([]);
  const [brazaletesDisponibles, setBrazaletesDisponibles] = useState(0);
  const [loading, setLoading] = useState(true);
  const [loadingBloques, setLoadingBloques] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [registrandoBrazaletes, setRegistrandoBrazaletes] = useState(false);

  // Estados para el diálogo de éxito
  const [dialogExitoOpen, setDialogExitoOpen] = useState(false);
  const [mensajeExito, setMensajeExito] = useState("");

  // Estados para el diálogo de confirmación (preview)
  const [dialogConfirmacionOpen, setDialogConfirmacionOpen] = useState(false);
  const [datosPreview, setDatosPreview] = useState<{
    fecha: string;
    destino: string;
    bloque?: BloqueBackend;
    hora?: string;
    embarcacion: Embarcacion;
    numero_pasajeros: number;
    numero_brazaletes: number;
    observaciones?: string;
  } | null>(null);

  // Estados para detectar cambios en el formulario
  const [destinoActual, setDestinoActual] = useState("");
  const [fechaActual, setFechaActual] = useState("");

  useEffect(() => {
    if (!isLoading && isAuthorized && user) {
      loadData();
    }
  }, [isLoading, isAuthorized, user]);

  // Cargar bloques cuando cambian destino y fecha
  useEffect(() => {
    const cargarBloques = async () => {
      // Solo cargar bloques si el destino es Isla de Lobos y hay una fecha seleccionada
      if (destinoActual === DESTINOS.ISLA_LOBOS && fechaActual) {
        try {
          setLoadingBloques(true);

          const result = await getBloquesDisponibles(fechaActual);

          if (result.success && result.data?.bloques) {
            const bloquesData = result.data.bloques as BloqueBackend[];
            setBloques(bloquesData);

            // Procesar embarcaciones ocupadas por bloque
            const embarcacionesPorBloque = new Map<string, Set<string>>();
            bloquesData.forEach((bloque) => {
              if (bloque.embarcaciones_ocupadas) {
                const embarcacionIds = new Set(
                  bloque.embarcaciones_ocupadas.map((e) => e.id)
                );
                embarcacionesPorBloque.set(bloque.id, embarcacionIds);
              }
            });
            setEmbarcacionesConSalidasPorBloque(embarcacionesPorBloque);
          } else {
            setBloques([]);
            setEmbarcacionesConSalidasPorBloque(new Map());
          }
        } catch (error) {
          clientLogger.error("Error al cargar bloques disponibles", error, {
            userId: user?.id,
            fecha: fechaActual,
          });
          setBloques([]);
          setEmbarcacionesConSalidasPorBloque(new Map());
        } finally {
          setLoadingBloques(false);
        }
      } else {
        // Si no es Isla de Lobos o no hay fecha, limpiar bloques
        setBloques([]);
        setEmbarcacionesConSalidasPorBloque(new Map());
      }
    };

    cargarBloques();
  }, [destinoActual, fechaActual]);

  const loadData = async () => {
    try {
      setLoading(true);
      setError("");

      const [embarcacionesResult, brazaletesResult] = await Promise.all([
        getMisEmbarcaciones(),
        buscarBrazaletes({ estado: "disponible", limit: 1000 }),
      ]);

      if (embarcacionesResult.success && embarcacionesResult.data) {
        setEmbarcaciones(embarcacionesResult.data.embarcaciones || []);
      } else {
        throw new Error("Error al cargar embarcaciones");
      }

      if (brazaletesResult.success && brazaletesResult.data) {
        const brazaletesDisponibles =
          brazaletesResult.data.estadisticas.total_encontrados || 0;
        setBrazaletesDisponibles(brazaletesDisponibles);
      } else {
        setBrazaletesDisponibles(0);
      }
    } catch (error) {
      const errorMsg =
        error instanceof Error ? error.message : "Error desconocido";
      clientLogger.error("Error al cargar datos de nueva salida", error, {
        userId: user?.id,
      });
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Asigna brazaletes automáticamente después de crear la salida
   */
  const asignarBrazaletesAutomaticamente = async (
    salidaId: string,
    cantidadBrazaletes: number,
    fechaSalida: string
  ) => {
    try {
      setRegistrandoBrazaletes(true);

      if (!salidaId) {
        throw new Error("salida_id es requerido");
      }
      if (!fechaSalida) {
        throw new Error("fecha_asignacion es requerida");
      }
      if (cantidadBrazaletes <= 0) {
        throw new Error("La cantidad de brazaletes debe ser mayor a 0");
      }

      const asignacionData = {
        salida_id: salidaId,
        cantidad: cantidadBrazaletes,
        fecha_asignacion: fechaSalida,
      };

      const resultado = await asignarBrazaletes(asignacionData);

      if (resultado.success) {
        setMensajeExito(
          `Tu salida ha sido registrada exitosamente y se asignaron ${cantidadBrazaletes} brazaletes automáticamente.`
        );
        setDialogExitoOpen(true);
      } else {
        setMensajeExito(
          `Tu salida ha sido registrada exitosamente, pero hubo un problema al asignar los brazaletes: ${resultado.message}. Puedes asignarlos manualmente más tarde.`
        );
        setDialogExitoOpen(true);
      }
    } catch (error) {
      const errorMsg =
        error instanceof Error ? error.message : "Error desconocido";
      clientLogger.error("Error al asignar brazaletes automáticamente", error, {
        userId: user?.id,
        salidaId,
        cantidadBrazaletes,
      });
      setMensajeExito(
        `Tu salida ha sido registrada exitosamente, pero hubo un problema al asignar los brazaletes: ${errorMsg}. Puedes asignarlos manualmente más tarde.`
      );
      setDialogExitoOpen(true);
    } finally {
      setRegistrandoBrazaletes(false);
    }
  };

  /**
   * Callback cuando cambia el destino en el formulario
   */
  const handleDestinoChange = (destino: string) => {
    setDestinoActual(destino);
  };

  /**
   * Callback cuando cambia la fecha en el formulario
   */
  const handleFechaChange = (fecha: string) => {
    setFechaActual(fecha);
  };

  /**
   * Maneja el clic en "Ver Mis Salidas" del diálogo de éxito
   */
  const handleVerSalidas = () => {
    setDialogExitoOpen(false);
    router.push("/prestador/salidas");
  };

  /**
   * Maneja el submit del formulario - muestra el diálogo de confirmación
   */
  const onSubmit = async (data: SalidaFormData) => {
    try {
      setError("");
      setSuccessMessage("");

      // Buscar la embarcación seleccionada
      const embarcacionSeleccionada = embarcaciones.find(
        (e) => e.id === data.embarcacion_id
      );

      if (!embarcacionSeleccionada) {
        throw new Error("Embarcación no encontrada");
      }

      // Buscar el bloque seleccionado si es Isla de Lobos
      let bloqueSeleccionado: BloqueBackend | undefined;
      if (data.destino === DESTINOS.ISLA_LOBOS && data.bloque_id) {
        bloqueSeleccionado = bloques.find((b) => b.id === data.bloque_id);
      }

      // Preparar datos para el preview
      setDatosPreview({
        fecha: data.fecha,
        destino: data.destino,
        bloque: bloqueSeleccionado,
        hora: data.hora,
        embarcacion: embarcacionSeleccionada,
        numero_pasajeros: data.numero_pasajeros,
        numero_brazaletes: data.numero_brazaletes,
        observaciones: data.observaciones,
      });

      // Mostrar diálogo de confirmación
      setDialogConfirmacionOpen(true);
    } catch (error) {
      const errorMsg =
        error instanceof Error ? error.message : "Error desconocido";
      clientLogger.error("Error al validar formulario de nueva salida", error, {
        userId: user?.id,
        data,
      });
      setError(errorMsg);
    }
  };

  /**
   * Confirma y registra la salida después de que el usuario revisa el preview
   */
  const confirmarRegistro = async () => {
    if (!datosPreview) return;

    try {
      setIsSubmitting(true);
      setDialogConfirmacionOpen(false);
      setError("");
      setSuccessMessage("");

      // Preparar datos según el destino
      let salidaData;
      const esIslaLobos = datosPreview.destino === DESTINOS.ISLA_LOBOS;

      if (esIslaLobos && datosPreview.bloque) {
        salidaData = {
          fecha: datosPreview.fecha,
          embarcacion_id: datosPreview.embarcacion.id,
          numero_pasajeros: datosPreview.numero_pasajeros,
          numero_brazaletes: datosPreview.numero_brazaletes,
          destino: datosPreview.destino,
          observaciones: datosPreview.observaciones || "",
          bloque_id: datosPreview.bloque.id,
        };
      } else if (datosPreview.hora) {
        salidaData = {
          fecha: datosPreview.fecha,
          hora: datosPreview.hora,
          embarcacion_id: datosPreview.embarcacion.id,
          numero_pasajeros: datosPreview.numero_pasajeros,
          numero_brazaletes: datosPreview.numero_brazaletes,
          destino: datosPreview.destino,
          observaciones: datosPreview.observaciones || "",
          bloque_id: null,
        };
      } else {
        throw new Error("Debe proporcionar un bloque horario o una hora");
      }

      const result = await registrarSalida(salidaData);

      if (result.success) {
        // Si se especificaron brazaletes, asignarlos automáticamente
        if (datosPreview.numero_brazaletes > 0 && result.data?.salida?.id) {
          await asignarBrazaletesAutomaticamente(
            result.data.salida.id,
            datosPreview.numero_brazaletes,
            datosPreview.fecha
          );
        } else {
          // Si no hay brazaletes, mostrar diálogo de éxito simple
          setMensajeExito(
            "Tu salida ha sido registrada exitosamente. Puedes consultarla en 'Mis Salidas'."
          );
          setDialogExitoOpen(true);
        }
      } else {
        throw new Error(result.message || "Error al registrar la salida");
      }
    } catch (error) {
      const errorMsg =
        error instanceof Error ? error.message : "Error desconocido";
      clientLogger.error("Error al confirmar registro de salida", error, {
        userId: user?.id,
      });
      setError(errorMsg);
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
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-[var(--isla-dark-teal)]">
            Nueva Salida
          </h1>
          <p className="text-gray-600 mt-2">
            Registra una nueva salida turística
          </p>
        </div>
        <div className="flex items-center gap-3">
          {embarcaciones.length > 0 ? (
            <Badge variant="secondary" className="text-sm">
              {embarcaciones.length} embarcaciones disponibles
            </Badge>
          ) : (
            <Badge variant="destructive" className="text-sm">
              Sin embarcaciones
            </Badge>
          )}
        </div>
      </div>

      <div className="space-y-6">
        {/* Mensajes de estado */}
        <MensajeEstado
          error={error}
          successMessage={successMessage}
          onVerSalidas={() => router.push("/prestador/salidas")}
        />

        {/* Formulario */}
        <FormularioNuevaSalida
          embarcaciones={embarcaciones}
          bloques={bloques}
          brazaletesDisponibles={brazaletesDisponibles}
          loadingBloques={loadingBloques}
          embarcacionesConSalidasPorBloque={embarcacionesConSalidasPorBloque}
          isSubmitting={isSubmitting}
          registrandoBrazaletes={registrandoBrazaletes}
          loading={loading}
          onSubmit={onSubmit}
          onDestinoChange={handleDestinoChange}
          onFechaChange={handleFechaChange}
        />
      </div>

      {/* Diálogo de confirmación (Preview) */}
      {datosPreview && (
        <DialogConfirmacion
          open={dialogConfirmacionOpen}
          onOpenChange={setDialogConfirmacionOpen}
          onConfirmar={confirmarRegistro}
          isLoading={isSubmitting || registrandoBrazaletes}
          datos={datosPreview}
        />
      )}

      {/* Diálogo de éxito */}
      <DialogExito
        open={dialogExitoOpen}
        onOpenChange={setDialogExitoOpen}
        mensaje={mensajeExito}
        onVerSalidas={handleVerSalidas}
      />
    </div>
  );
}
