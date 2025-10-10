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
  EmptyState,
  LoadingState,
  ErrorAlert,
} from "./components";
import { clientLogger } from "@/lib/logger-client";

interface Bloque {
  id: string;
  nombre: string;
  hora_inicio: string;
  hora_fin: string;
  capacidad_total: number;
  capacidad_registrada: number;
  fecha: string;
  estado: "activo" | "lleno" | "suspendido_por_clima" | "cerrado_capitaria";
  createdAt: string;
  updatedAt: string;
}

interface CreateBloqueData {
  nombre: string;
  hora_inicio: string;
  hora_fin: string;
  capacidad_total: number;
  fecha: string;
  estado: "activo" | "lleno" | "suspendido_por_clima" | "cerrado_capitaria";
}

export default function BloquesPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [bloques, setBloques] = useState<Bloque[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [fechaSeleccionada, setFechaSeleccionada] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [bloqueEditando, setBloqueEditando] = useState<Bloque | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState<CreateBloqueData>({
    nombre: "",
    hora_inicio: "",
    hora_fin: "",
    capacidad_total: 50,
    fecha: fechaSeleccionada,
    estado: "activo",
  });

  const loadBloques = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const result = await getBloques({ fecha: fechaSeleccionada });

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
  }, [fechaSeleccionada]);

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
    if (!formData.nombre || !formData.hora_inicio || !formData.hora_fin) {
      setError("Por favor completa todos los campos requeridos");
      return;
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
      setError(
        error instanceof Error ? error.message : "Error al crear el bloque"
      );
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
      setError(
        error instanceof Error ? error.message : "Error al editar el bloque"
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteBloque = async (bloqueId: string) => {
    if (!confirm("¿Estás seguro de que quieres eliminar este bloque?")) return;

    try {
      const result = await deleteBloque(bloqueId);

      if (!result.success) {
        throw new Error(result.error || "Error al eliminar el bloque");
      }

      loadBloques();
    } catch (error: unknown) {
      setError(
        error instanceof Error ? error.message : "Error al eliminar el bloque"
      );
    }
  };

  const resetForm = () => {
    setFormData({
      nombre: "",
      hora_inicio: "",
      hora_fin: "",
      capacidad_total: 50,
      fecha: fechaSeleccionada,
      estado: "activo",
    });
  };

  const openEditDialog = (bloque: Bloque) => {
    setBloqueEditando(bloque);
    setFormData({
      nombre: bloque.nombre,
      hora_inicio: bloque.hora_inicio,
      hora_fin: bloque.hora_fin,
      capacidad_total: bloque.capacidad_total,
      fecha: bloque.fecha,
      estado: bloque.estado,
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
        onFechaChange={setFechaSeleccionada}
        onRefresh={loadBloques}
        onCreateClick={() => setShowCreateDialog(true)}
      />

      <ErrorAlert error={error} />

      {bloques.length > 0 ? (
        <TablaBloques
          bloques={bloques}
          fechaSeleccionada={fechaSeleccionada}
          onEdit={openEditDialog}
          onDelete={handleDeleteBloque}
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
    </div>
  );
}
