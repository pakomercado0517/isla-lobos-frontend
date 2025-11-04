"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/contexts/AuthContext";
import {
  getPlantillasBloques,
  createPlantillaBloque,
  updatePlantillaBloque,
  deletePlantillaBloque,
} from "@/actions/plantillas-bloque";
import {
  PlantillasHeader,
  TablaPlantillas,
  DialogCrearPlantilla,
  DialogEditarPlantilla,
  LoadingState,
  ErrorAlert,
} from "./components";
import { clientLogger } from "@/lib/logger-client";
import {
  type PlantillaBloque,
  type CreatePlantillaBloqueData,
  type UpdatePlantillaBloqueData,
} from "@/lib/types/bloques";
import { DESTINOS, type DestinoType } from "@/lib/types/salida";

export default function PlantillasBloqePage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();

  const [plantillas, setPlantillas] = useState<PlantillaBloque[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [destinoSeleccionado, setDestinoSeleccionado] = useState<
    DestinoType | "todos"
  >("todos");
  const [estadoSeleccionado, setEstadoSeleccionado] = useState<
    boolean | "todos"
  >("todos");
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [plantillaEditando, setPlantillaEditando] =
    useState<PlantillaBloque | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const [formDataCreate, setFormDataCreate] =
    useState<CreatePlantillaBloqueData>({
      nombre: "",
      hora_inicio: "",
      hora_fin: "",
      capacidad_total: 12,
      destino: DESTINOS.ISLA_LOBOS,
      activa: true,
    });

  const [formDataEdit, setFormDataEdit] = useState<
    UpdatePlantillaBloqueData & {
      destino?: string;
      bloques_asociados?: number;
    }
  >({});

  const loadPlantillas = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const filters = {
        ...(destinoSeleccionado !== "todos" && {
          destino: destinoSeleccionado,
        }),
        ...(estadoSeleccionado !== "todos" && { activa: estadoSeleccionado }),
      };

      const result = await getPlantillasBloques(filters);

      if (result.success) {
        setPlantillas(result.data?.plantillas || []);
      } else {
        setError(result.error || "Error al cargar las plantillas");
      }
    } catch (error: unknown) {
      clientLogger.error("Error al cargar plantillas", error);
      setError("Error al cargar las plantillas");
    } finally {
      setLoading(false);
    }
  }, [destinoSeleccionado, estadoSeleccionado]);

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
      loadPlantillas();
    }
  }, [user, authLoading, router, loadPlantillas]);

  const handleCreatePlantilla = async () => {
    // Validaciones básicas
    if (
      !formDataCreate.nombre ||
      !formDataCreate.hora_inicio ||
      !formDataCreate.hora_fin ||
      !formDataCreate.destino
    ) {
      setError("Por favor completa todos los campos requeridos");
      return;
    }

    // Validación de formato de horas
    const formatoHora = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
    if (!formatoHora.test(formDataCreate.hora_inicio)) {
      setError("La hora de inicio debe tener formato HH:MM");
      return;
    }
    if (!formatoHora.test(formDataCreate.hora_fin)) {
      setError("La hora de fin debe tener formato HH:MM");
      return;
    }

    // Validación lógica de horas
    const [horaInicioH, horaInicioM] = formDataCreate.hora_inicio
      .split(":")
      .map(Number);
    const [horaFinH, horaFinM] = formDataCreate.hora_fin.split(":").map(Number);
    const minutosInicio = horaInicioH * 60 + horaInicioM;
    const minutosFin = horaFinH * 60 + horaFinM;

    if (minutosFin <= minutosInicio) {
      setError("La hora de fin debe ser mayor que la hora de inicio");
      return;
    }

    try {
      setSubmitting(true);
      setError("");

      const result = await createPlantillaBloque(formDataCreate);

      if (!result.success) {
        throw new Error(result.error || "Error al crear la plantilla");
      }

      setShowCreateDialog(false);
      resetCreateForm();
      loadPlantillas();
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "Error al crear la plantilla";
      setError(errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  const handleEditPlantilla = async () => {
    if (!plantillaEditando) return;

    try {
      setSubmitting(true);
      setError("");

      const result = await updatePlantillaBloque(
        plantillaEditando.id,
        formDataEdit
      );

      if (!result.success) {
        throw new Error(result.error || "Error al actualizar la plantilla");
      }

      setShowEditDialog(false);
      setPlantillaEditando(null);
      resetEditForm();
      loadPlantillas();
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "Error al editar la plantilla";
      setError(errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeletePlantilla = async (plantillaId: number) => {
    if (!confirm("¿Estás seguro de que quieres eliminar esta plantilla?"))
      return;

    try {
      const result = await deletePlantillaBloque(plantillaId);

      if (!result.success) {
        throw new Error(result.error || "Error al eliminar la plantilla");
      }

      loadPlantillas();
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Error al eliminar la plantilla";
      setError(errorMessage);
    }
  };

  const openEditDialog = (plantilla: PlantillaBloque) => {
    setPlantillaEditando(plantilla);
    setFormDataEdit({
      nombre: plantilla.nombre,
      hora_inicio: plantilla.hora_inicio,
      hora_fin: plantilla.hora_fin,
      capacidad_total: plantilla.capacidad_total,
      activa: plantilla.activa,
      destino: plantilla.destino,
      bloques_asociados: plantilla.bloques_asociados,
    });
    setShowEditDialog(true);
  };

  const resetCreateForm = () => {
    setFormDataCreate({
      nombre: "",
      hora_inicio: "",
      hora_fin: "",
      capacidad_total: 12,
      destino:
        destinoSeleccionado !== "todos"
          ? destinoSeleccionado
          : DESTINOS.ISLA_LOBOS,
      activa: true,
    });
  };

  const resetEditForm = () => {
    setFormDataEdit({});
  };

  const handleViewStats = (plantillaId: number) => {
    // TODO: Implementar vista de estadísticas
    clientLogger.info("Ver estadísticas de plantilla:", { plantillaId });
  };

  if (authLoading || loading) {
    return <LoadingState />;
  }

  return (
    <div className="space-y-4 md:space-y-6 min-h-screen">
      <PlantillasHeader
        destinoSeleccionado={destinoSeleccionado}
        estadoSeleccionado={estadoSeleccionado}
        onDestinoChange={setDestinoSeleccionado}
        onEstadoChange={setEstadoSeleccionado}
        onRefresh={loadPlantillas}
        onCreateClick={() => setShowCreateDialog(true)}
        loading={loading}
      />

      <ErrorAlert error={error} />

      <TablaPlantillas
        plantillas={plantillas}
        destinoSeleccionado={destinoSeleccionado}
        onEdit={openEditDialog}
        onDelete={handleDeletePlantilla}
        onViewStats={handleViewStats}
        loading={submitting}
      />

      <DialogCrearPlantilla
        open={showCreateDialog}
        onOpenChange={setShowCreateDialog}
        formData={formDataCreate}
        onFormChange={setFormDataCreate}
        onSubmit={handleCreatePlantilla}
        submitting={submitting}
      />

      <DialogEditarPlantilla
        open={showEditDialog}
        onOpenChange={setShowEditDialog}
        formData={formDataEdit}
        onFormChange={setFormDataEdit}
        onSubmit={handleEditPlantilla}
        submitting={submitting}
      />
    </div>
  );
}
