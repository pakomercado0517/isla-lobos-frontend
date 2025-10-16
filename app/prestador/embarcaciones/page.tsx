"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useAuth, useRouteProtection } from "@/lib/contexts/AuthContext";
import { clientLogger } from "@/lib/logger-client";
import {
  getMisEmbarcaciones,
  crearMiEmbarcacion,
  actualizarMiEmbarcacion,
} from "@/actions/prestador";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Embarcacion } from "@/lib/types/embarcacion";
import {
  HeaderEmbarcaciones,
  EstadosEmbarcaciones,
  TablaEmbarcaciones,
  DialogCrearEmbarcacion,
  DialogEditarEmbarcacion,
} from "./components";

interface EmbarcacionFormData {
  nombre: string;
  matricula: string;
  capacidad: number;
  tipo: "menor" | "mayor";
  estado: "disponible" | "en_uso" | "mantenimiento";
}

export default function EmbarcacionesPage() {
  const { isLoading, isAuthorized } = useRouteProtection("prestador");
  const { user } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();

  const [embarcaciones, setEmbarcaciones] = useState<Embarcacion[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingEmbarcacion, setEditingEmbarcacion] =
    useState<Embarcacion | null>(null);
  const [formData, setFormData] = useState<EmbarcacionFormData>({
    nombre: "",
    matricula: "",
    capacidad: 0,
    tipo: "menor",
    estado: "disponible",
  });
  const [submitting, setSubmitting] = useState(false);

  // Función para limpiar parámetros URL
  const clearUrlParams = () => {
    router.replace('/prestador/embarcaciones');
  };

  useEffect(() => {
    if (!isLoading && isAuthorized && user) {
      loadEmbarcaciones();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoading, isAuthorized, user]);
  
  // Efecto para abrir diálogo de edición automáticamente desde URL
  useEffect(() => {
    const editId = searchParams.get('edit');
    if (editId && embarcaciones.length > 0 && !isEditDialogOpen) {
      const embarcacionParaEditar = embarcaciones.find(e => e.id === editId);
      if (embarcacionParaEditar) {
        handleOpenEditDialog(embarcacionParaEditar);
      }
    }
  }, [searchParams, embarcaciones, isEditDialogOpen]);

  const loadEmbarcaciones = async () => {
    try {
      setLoading(true);
      setError("");

      const result = await getMisEmbarcaciones();

      if (result.success && result.data) {
        setEmbarcaciones(result.data.embarcaciones || []);
      } else {
        setError(result.error || "Error al cargar embarcaciones");
      }
    } catch (err) {
      clientLogger.error(
        "Error inesperado al cargar embarcaciones de prestador",
        err,
        { userId: user?.id }
      );
      setError("Error inesperado al cargar embarcaciones");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateEmbarcacion = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.nombre || !formData.matricula || formData.capacidad <= 0) {
      setError("Por favor completa todos los campos requeridos");
      return;
    }

    try {
      setSubmitting(true);
      setError("");

      const result = await crearMiEmbarcacion(formData);

      if (result.success) {
        setIsCreateDialogOpen(false);
        setFormData({
          nombre: "",
          matricula: "",
          capacidad: 0,
          tipo: "menor",
          estado: "disponible",
        });
        await loadEmbarcaciones();
      } else {
        setError(result.error || "Error al crear embarcación");
      }
    } catch (err) {
      clientLogger.error(
        "Error inesperado al crear embarcación de prestador",
        err,
        { userId: user?.id, formData }
      );
      setError("Error inesperado al crear embarcación");
    } finally {
      setSubmitting(false);
    }
  };

  const handleEditEmbarcacion = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!editingEmbarcacion || !formData.nombre || formData.capacidad <= 0) {
      setError("Por favor completa todos los campos requeridos");
      return;
    }

    try {
      setSubmitting(true);
      setError("");

      const result = await actualizarMiEmbarcacion(editingEmbarcacion.id, {
        nombre: formData.nombre,
        capacidad: formData.capacidad,
        estado: formData.estado,
      });

      if (result.success) {
        handleCloseEditDialog();
        await loadEmbarcaciones();
      } else {
        setError(result.error || "Error al actualizar embarcación");
      }
    } catch (err) {
      clientLogger.error(
        "Error inesperado al actualizar embarcación de prestador",
        err,
        { userId: user?.id, embarcacionId: editingEmbarcacion?.id }
      );
      setError("Error inesperado al actualizar embarcación");
    } finally {
      setSubmitting(false);
    }
  };

  const handleOpenEditDialog = (embarcacion: Embarcacion) => {
    setEditingEmbarcacion(embarcacion);
    setFormData({
      nombre: embarcacion.nombre,
      matricula: embarcacion.matricula,
      capacidad: embarcacion.capacidad,
      tipo: embarcacion.tipo,
      estado: embarcacion.estado,
    });
    setIsEditDialogOpen(true);
  };
  
  const handleCloseEditDialog = () => {
    setIsEditDialogOpen(false);
    setEditingEmbarcacion(null);
    setFormData({
      nombre: "",
      matricula: "",
      capacidad: 0,
      tipo: "menor",
      estado: "disponible",
    });
    clearUrlParams(); // Limpiar parámetros URL
  };

  const handleFormDataChange = (data: EmbarcacionFormData) => {
    setFormData(data);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[var(--isla-cream)] to-[var(--isla-cream-light)] flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-[var(--isla-teal)] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-[var(--isla-dark-teal)]">Cargando...</p>
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
      <HeaderEmbarcaciones
        totalEmbarcaciones={embarcaciones.length}
        loading={loading}
        onCreateDialogOpen={isCreateDialogOpen}
        onCreateDialogChange={setIsCreateDialogOpen}
        onActualizar={loadEmbarcaciones}
      >
        <DialogCrearEmbarcacion
          formData={formData}
          submitting={submitting}
          onFormDataChange={handleFormDataChange}
          onSubmit={handleCreateEmbarcacion}
          onCancel={() => setIsCreateDialogOpen(false)}
        />
      </HeaderEmbarcaciones>

      <div className="space-y-6">
        {/* Estados especiales */}
        <EstadosEmbarcaciones
          loading={loading}
          error={error}
          embarcacionesLength={embarcaciones.length}
          onCreateDialogOpen={() => setIsCreateDialogOpen(true)}
        />

        {/* Lista de embarcaciones */}
        {!loading && !error && embarcaciones.length > 0 && (
          <TablaEmbarcaciones
            embarcaciones={embarcaciones}
            onEditEmbarcacion={handleOpenEditDialog}
          />
        )}
      </div>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={(open) => {
        if (!open) {
          handleCloseEditDialog();
        }
      }}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Editar Embarcación</DialogTitle>
            <DialogDescription>
              Actualiza la información de tu embarcación.
            </DialogDescription>
          </DialogHeader>
          <DialogEditarEmbarcacion
            formData={formData}
            submitting={submitting}
            onFormDataChange={handleFormDataChange}
            onSubmit={handleEditEmbarcacion}
            onCancel={handleCloseEditDialog}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
