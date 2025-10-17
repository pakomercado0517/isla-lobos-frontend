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
  const [fechaSeleccionada, setFechaSeleccionada] = useState(
    obtenerFechaLocalYYYYMMDD()
  );
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

      const filters = {
        fecha: fechaSeleccionada,
        ...(destinoSeleccionado !== "todos" && {
          destino: destinoSeleccionado,
        }),
      };

      const result = await getBloques(filters);

      if (result.success) {
        setBloques(result.data?.bloques || []);
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

      if (comparacion < 0) {
        setError(
          "No se puede crear un bloque para una fecha pasada. Por favor selecciona una fecha actual o futura."
        );
        return;
      }
    }

    try {
      setSubmitting(true);
      setError("");

      const result = await createBloque(formData);

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

    try {
      setSubmitting(true);
      setError("");

      const result = await updateBloque(bloqueEditando.id, formData);

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
      const result = await deleteBloque(bloqueId);

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
      fecha: fechaSeleccionada,
      estado: EstadoBloque.ACTIVO,
      es_plantilla: false,
    });
  };

  const openEditDialog = (bloque: Bloque) => {
    setBloqueEditando(bloque);
    setFormData({
      nombre: bloque.nombre,
      hora_inicio: bloque.hora_inicio,
      hora_fin: bloque.hora_fin,
      capacidad_total: bloque.capacidad_total,
      destino: bloque.destino,
      fecha: bloque.fecha?.toString(),
      estado: bloque.estado,
      es_plantilla: bloque.es_plantilla,
    });
    setShowEditDialog(true);
  };

  if (authLoading || loading) {
    return <LoadingState />;
  }

  return (
    <div className="space-y-6">
      <BloquesHeader
        fechaSeleccionada={fechaSeleccionada}
        destinoSeleccionado={destinoSeleccionado}
        onFechaChange={setFechaSeleccionada}
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
        <EmptyState onCreateClick={() => setShowCreateDialog(true)} />
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
