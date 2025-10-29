"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/contexts/AuthContext";
import {
  getBloques,
  createBloque,
  updateBloque,
  deleteBloque,
} from "@/actions/dashboard";
import { createPlantillaBloque } from "@/actions/plantillas-bloque";
import {
  BloquesHeader,
  TablaBloques,
  DialogCrearBloque,
  DialogEditarBloque,
  ConfiguracionDestinos,
  EmptyState,
  LoadingState,
  ErrorAlert,
} from "./components";
import { clientLogger } from "@/lib/logger-client";
import {
  obtenerFechaLocalYYYYMMDD,
  obtenerFechaActualMexico,
  compararFechasYYYYMMDD,
  extraerFechaLocalYYYYMMDD,
  obtenerFechaMaximaBloques,
} from "@/lib/utils";

import {
  type Bloque,
  type CreateBloqueData,
  EstadoBloque,
} from "@/lib/types/bloques";
import { DESTINOS, type DestinoType } from "@/lib/types/salida";

export default function BloquesPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [activeAlert, setActiveAlert] = useState(false);
  const [bloques, setBloques] = useState<Bloque[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [emptyMessage, setEmptyMessage] = useState<string>("");
  const [fechaSeleccionada, setFechaSeleccionada] = useState(
    obtenerFechaActualMexico() // 🇲🇽 Usar fecha de México para consistencia
  );

  // 🆕 NUEVO: Función para validar cambio de fecha
  const handleFechaChange = (nuevaFecha: string) => {
    const fechaHoy = obtenerFechaActualMexico();
    const fechaMaxima = obtenerFechaMaximaBloques();

    // Validar que la fecha esté en el rango permitido
    if (nuevaFecha < fechaHoy) {
      setError("No se puede seleccionar una fecha anterior a hoy");
      return;
    }

    if (nuevaFecha > fechaMaxima) {
      setError("No se puede seleccionar una fecha más de 15 días en el futuro");
      return;
    }

    // Si la fecha es válida, limpiar errores y actualizar
    setError("");
    setFechaSeleccionada(nuevaFecha);
  };
  const [destinoSeleccionado, setDestinoSeleccionado] = useState<
    DestinoType | "todos"
  >("todos");
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showConfigDialog, setShowConfigDialog] = useState(false);
  const [bloqueEditando, setBloqueEditando] = useState<Bloque | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState<CreateBloqueData>({
    nombre: "",
    hora_inicio: "",
    hora_fin: "",
    capacidad_total: 50,
    destino: DESTINOS.ISLA_LOBOS, // 🆕 NUEVO: Valor por defecto
    fecha: fechaSeleccionada,
    estado: EstadoBloque.ACTIVO,
    es_plantilla: false, // 🆕 NUEVO: Por defecto no es plantilla
  });

  const loadBloques = useCallback(async () => {
    try {
      setLoading(true);
      setError("");
      setEmptyMessage(""); // Limpiar mensaje anterior

      const filters = {
        fecha: fechaSeleccionada,
        ...(destinoSeleccionado !== "todos" && {
          destino: destinoSeleccionado,
        }),
      };

      const result = await getBloques(filters);

      if (result.success) {
        const bloquesData = result.data?.bloques || [];
        setBloques(bloquesData);

        // 🆕 NUEVO: Capturar mensaje personalizado del backend cuando no hay bloques
        if (bloquesData.length === 0 && result.message) {
          setEmptyMessage(result.message);
        }
      } else {
        setError(result.error || "Error al cargar los bloques");
      }
    } catch (error: unknown) {
      clientLogger.error("Error al cargar bloques", error, {
        fecha: fechaSeleccionada,
      });
      setError("Error al cargar los bloques");
    } finally {
      setLoading(false);
    }
  }, [fechaSeleccionada, destinoSeleccionado]);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login");
      return;
    }

    if (user && user.rol !== "conanp") {
      router.push("/prestador");
      return;
    }

    if (user) {
      loadBloques();
    }
  }, [user, authLoading, router, loadBloques]);

  const handleCreateBloque = async () => {
    // Validación básica
    if (
      !formData.nombre ||
      !formData.hora_inicio ||
      !formData.hora_fin ||
      !formData.destino
    ) {
      setError("Por favor completa todos los campos requeridos");
      return;
    }

    // Validación específica para bloques con fecha (no plantillas)
    if (!formData.es_plantilla && !formData.fecha) {
      setError("La fecha es requerida para bloques específicos");
      return;
    }

    // 📅 VALIDACIÓN: No permitir fechas pasadas (solo para bloques específicos)
    // Usar fecha de México para consistencia con el backend
    if (!formData.es_plantilla && formData.fecha) {
      const fechaHoyMexico = obtenerFechaActualMexico();
      const comparacion = compararFechasYYYYMMDD(
        formData.fecha,
        fechaHoyMexico
      );

      // 📝 DEBUG: Log para debugging de fechas
      if (process.env.NODE_ENV === "development") {
        clientLogger.info("📅 Validación de fecha en creación:", {
          fechaFormulario: formData.fecha,
          fechaHoyMexico,
          fechaHoyLocal: obtenerFechaLocalYYYYMMDD(),
          comparacion,
          timestamp: new Date().toISOString(),
        });
      }

      if (comparacion < 0) {
        setError(
          `No se puede crear un bloque para una fecha pasada. Fecha seleccionada: ${formData.fecha}, Hoy en México: ${fechaHoyMexico}`
        );
        return;
      }
    }

    try {
      setSubmitting(true);
      setError("");

      let result;

      // 🆕 NUEVO: Usar endpoint correcto según el tipo
      if (formData.es_plantilla) {
        // Crear plantilla usando el endpoint de plantillas
        result = await createPlantillaBloque({
          nombre: formData.nombre,
          hora_inicio: formData.hora_inicio,
          hora_fin: formData.hora_fin,
          capacidad_total: formData.capacidad_total,
          destino: formData.destino,
          activa: true, // Las plantillas se crean activas por defecto
        });
      } else {
        // Crear bloque normal usando el endpoint de bloques
        result = await createBloque(formData);
      }

      if (!result.success) {
        throw new Error(result.error || "Error al crear el bloque");
      }

      setShowCreateDialog(false);
      resetForm();
      loadBloques();
    } catch (error: unknown) {
      let errorMessage = "Error al crear el bloque";

      if (error instanceof Error) {
        errorMessage = error.message;

        // Log adicional para debugging en desarrollo
        if (process.env.NODE_ENV === "development") {
          clientLogger.error("Error detallado al crear bloque:", {
            message: error.message,
            stack: error.stack,
            formData,
            timestamp: new Date().toISOString(),
          });
        }
      }

      setError(errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  const handleEditBloque = async () => {
    if (!bloqueEditando) return;

    // Validación básica
    if (!formData.nombre || !formData.hora_inicio || !formData.hora_fin) {
      setError("Por favor completa todos los campos requeridos");
      return;
    }

    // 🕰️ Validación de formato de horas HH:MM
    const formatoHora = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
    if (!formatoHora.test(formData.hora_inicio)) {
      setError("La hora de inicio debe tener formato HH:MM (ejemplo: 08:00)");
      return;
    }
    if (!formatoHora.test(formData.hora_fin)) {
      setError("La hora de fin debe tener formato HH:MM (ejemplo: 10:00)");
      return;
    }

    // Validación de lógica: hora fin debe ser mayor que hora inicio
    const [horaInicioH, horaInicioM] = formData.hora_inicio
      .split(":")
      .map(Number);
    const [horaFinH, horaFinM] = formData.hora_fin.split(":").map(Number);
    const minutosInicio = horaInicioH * 60 + horaInicioM;
    const minutosFin = horaFinH * 60 + horaFinM;

    if (minutosFin <= minutosInicio) {
      setError("La hora de fin debe ser mayor que la hora de inicio");
      return;
    }

    try {
      setSubmitting(true);
      setError("");

      // 🔧 CORRECCIÓN: Preparar datos según formato requerido por el backend
      const updateData = {
        nombre: formData.nombre,
        hora_inicio: formData.hora_inicio,
        hora_fin: formData.hora_fin,
        capacidad_total: formData.capacidad_total,
        destino: formData.destino, // ✅ Incluir destino (requerido por backend)
        estado: formData.estado,
        // NO enviar: fecha, es_plantilla (no son editables)
      };

      const result = await updateBloque(bloqueEditando.id, updateData);

      if (!result.success) {
        throw new Error(result.error || "Error al actualizar el bloque");
      }

      setShowEditDialog(false);
      resetForm();
      setBloqueEditando(null);
      loadBloques();
    } catch (error: unknown) {
      let errorMessage = "Error al editar el bloque";

      if (error instanceof Error) {
        errorMessage = error.message;

        // Log adicional para debugging
        if (process.env.NODE_ENV === "development") {
          clientLogger.error("Error detallado al editar bloque:", {
            message: error.message,
            bloqueId: bloqueEditando?.id,
            formData,
            timestamp: new Date().toISOString(),
          });
        }
      }

      setError(errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteBloque = async (bloqueId: string) => {
    // if (!confirm("¿Estás seguro de que quieres eliminar este bloque?")) return;
    setActiveAlert(true);

    try {
      // 📝 DEBUG: Agregar logs para investigar problema de fechas
      if (process.env.NODE_ENV === "development") {
        const bloqueParaEliminar = bloques.find((b) => b.id === bloqueId);
        clientLogger.info("Intentando eliminar bloque:", {
          bloqueId,
          fechaBloque: bloqueParaEliminar?.fecha,
          fechaSeleccionada,
          fechaHoyLocal: obtenerFechaLocalYYYYMMDD(),
          fechaHoyMexico: obtenerFechaActualMexico(),
          timestamp: new Date().toISOString(),
        });
      }

      const result = await deleteBloque(bloqueId, {
        fechaBloque: bloques.find((b) => b.id === bloqueId)?.fecha,
        fechaSeleccionada,
      });

      if (!result.success) {
        throw new Error(result.error || "Error al eliminar el bloque");
      }

      loadBloques();
    } catch (error: unknown) {
      let errorMessage = "Error al eliminar el bloque";

      if (error instanceof Error) {
        errorMessage = error.message;

        // Log adicional para debugging
        if (process.env.NODE_ENV === "development") {
          clientLogger.error("Error detallado al eliminar bloque:", {
            message: error.message,
            bloqueId,
            fechaSeleccionada,
            fechaHoyLocal: obtenerFechaLocalYYYYMMDD(),
            fechaHoyMexico: obtenerFechaActualMexico(),
            timestamp: new Date().toISOString(),
          });
        }
      }

      setError(errorMessage);
    }
  };

  const resetForm = () => {
    setFormData({
      nombre: "",
      hora_inicio: "",
      hora_fin: "",
      capacidad_total: 50,
      destino:
        destinoSeleccionado !== "todos"
          ? destinoSeleccionado
          : DESTINOS.ISLA_LOBOS,
      fecha: fechaSeleccionada || obtenerFechaActualMexico(), // 🇲🇽 Asegurar fecha de México
      estado: EstadoBloque.ACTIVO,
      es_plantilla: false,
    });
  };

  const openEditDialog = (bloque: Bloque) => {
    setBloqueEditando(bloque);

    // 🔧 CORRECCIÓN: Formatear correctamente los datos para el formulario
    setFormData({
      nombre: bloque.nombre || "",
      // Asegurar formato HH:MM para los inputs tipo time
      hora_inicio:
        (bloque.hora_inicio || "").length === 5
          ? bloque.hora_inicio || ""
          : (bloque.hora_inicio || "").substring(0, 5),
      hora_fin:
        (bloque.hora_fin || "").length === 5
          ? bloque.hora_fin || ""
          : (bloque.hora_fin || "").substring(0, 5),
      capacidad_total: bloque.capacidad_total || 0,
      destino: bloque.destino || DESTINOS.ISLA_LOBOS,
      // Convertir fecha a string YYYY-MM-DD si existe
      fecha: bloque.fecha
        ? bloque.fecha instanceof Date
          ? extraerFechaLocalYYYYMMDD(bloque.fecha)
          : bloque.fecha.toString().split("T")[0]
        : undefined,
      estado: bloque.estado,
      es_plantilla: bloque.es_plantilla,
    });
    setShowEditDialog(true);
  };

  if (authLoading || loading) {
    return <LoadingState />;
  }

  return (
    <div className="space-y-6 min-h-screen">
      <BloquesHeader
        fechaSeleccionada={fechaSeleccionada}
        destinoSeleccionado={destinoSeleccionado}
        onFechaChange={handleFechaChange}
        onDestinoChange={setDestinoSeleccionado}
        onRefresh={loadBloques}
        onCreateClick={() => setShowCreateDialog(true)}
        onConfigClick={() => setShowConfigDialog(true)}
      />

      <ErrorAlert error={error} />

      {bloques.length > 0 ? (
        <TablaBloques
          bloques={bloques}
          fechaSeleccionada={fechaSeleccionada}
          destinoSeleccionado={destinoSeleccionado}
          onEdit={openEditDialog}
          onDelete={handleDeleteBloque}
          activeAlert={activeAlert}
          setActiveAlert={setActiveAlert}
        />
      ) : (
        <EmptyState
          onCreateClick={() => setShowCreateDialog(true)}
          customMessage={emptyMessage}
        />
      )}

      <DialogCrearBloque
        open={showCreateDialog}
        onOpenChange={setShowCreateDialog}
        formData={formData}
        onFormChange={setFormData}
        onSubmit={handleCreateBloque}
        submitting={submitting}
      />

      <DialogEditarBloque
        open={showEditDialog}
        onOpenChange={setShowEditDialog}
        formData={formData}
        onFormChange={setFormData}
        onSubmit={handleEditBloque}
        submitting={submitting}
      />

      <ConfiguracionDestinos
        open={showConfigDialog}
        onOpenChange={setShowConfigDialog}
      />
    </div>
  );
}
