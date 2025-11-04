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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Embarcacion } from "@/lib/types/embarcacion";
import {
  HeaderEmbarcaciones,
  TablaEmbarcaciones,
  DialogCrearEmbarcacion,
  DialogEditarEmbarcacion,
  FiltrosEmbarcaciones,
  EmptyState,
  LoadingState,
  ErrorAlert,
} from "./components";

interface EmbarcacionFormData {
  nombre: string;
  matricula: string;
  capacidad: number;
  tipo: "menor" | "mayor";
  estado: "disponible" | "en_uso" | "mantenimiento" | "pendiente_autorizacion";
}

export default function EmbarcacionesPage() {
  const { isLoading, isAuthorized } = useRouteProtection("prestador");
  const { user } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();

  const [embarcaciones, setEmbarcaciones] = useState<Embarcacion[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filtroEstado, setFiltroEstado] = useState("todos");
  const [filtroTipo, setFiltroTipo] = useState("todos");
  const [busqueda, setBusqueda] = useState("");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isSuccessDialogOpen, setIsSuccessDialogOpen] = useState(false);
  const [editingEmbarcacion, setEditingEmbarcacion] =
    useState<Embarcacion | null>(null);
  const [formData, setFormData] = useState<EmbarcacionFormData>({
    nombre: "",
    matricula: "",
    capacidad: 0,
    tipo: "menor",
    estado: "pendiente_autorizacion",
  });
  const [submitting, setSubmitting] = useState(false);

  // Función para limpiar parámetros URL
  const clearUrlParams = () => {
    router.replace("/prestador/embarcaciones");
  };

  useEffect(() => {
    if (!isLoading && isAuthorized && user) {
      loadEmbarcaciones();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoading, isAuthorized, user]);

  // Efecto para abrir diálogo de edición automáticamente desde URL
  useEffect(() => {
    const editId = searchParams.get("edit");
    if (editId && embarcaciones.length > 0 && !isEditDialogOpen) {
      const embarcacionParaEditar = embarcaciones.find((e) => e.id === editId);
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

    if (!user?.id) {
      setError("No se pudo obtener el ID del usuario");
      return;
    }

    try {
      setSubmitting(true);
      setError("");

      const result = await crearMiEmbarcacion(formData, user.id);

      if (result.success) {
        setIsCreateDialogOpen(false);
        setFormData({
          nombre: "",
          matricula: "",
          capacidad: 0,
          tipo: "menor",
          estado: "pendiente_autorizacion",
        });
        await loadEmbarcaciones();
        // Mostrar AlertDialog de éxito
        setIsSuccessDialogOpen(true);
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

  const embarcacionesFiltradas = embarcaciones.filter((embarcacion) => {
    const estadoMatch =
      filtroEstado === "todos" || embarcacion.estado === filtroEstado;
    const tipoMatch = filtroTipo === "todos" || embarcacion.tipo === filtroTipo;
    const busquedaMatch =
      busqueda === "" ||
      embarcacion.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
      embarcacion.matricula.toLowerCase().includes(busqueda.toLowerCase());
    return estadoMatch && tipoMatch && busquedaMatch;
  });

  if (isLoading) {
    return <LoadingState />;
  }

  if (!isAuthorized) {
    return null;
  }

  return (
    <div className="min-h-screen space-y-4 md:space-y-6">
      <HeaderEmbarcaciones
        onRefresh={loadEmbarcaciones}
        onCreateClick={() => setIsCreateDialogOpen(true)}
        loading={loading}
      />

      <ErrorAlert error={error} />

      <FiltrosEmbarcaciones
        busqueda={busqueda}
        onBusquedaChange={setBusqueda}
        filtroEstado={filtroEstado}
        onFiltroEstadoChange={setFiltroEstado}
        filtroTipo={filtroTipo}
        onFiltroTipoChange={setFiltroTipo}
        totalFiltradas={embarcacionesFiltradas.length}
        totalEmbarcaciones={embarcaciones.length}
      />

      {embarcacionesFiltradas.length > 0 ? (
        <TablaEmbarcaciones
          embarcaciones={embarcacionesFiltradas}
          onEditEmbarcacion={handleOpenEditDialog}
        />
      ) : (
        <EmptyState onCreateClick={() => setIsCreateDialogOpen(true)} />
      )}

      {/* Dialog Crear */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Nueva Embarcación</DialogTitle>
            <DialogDescription>
              Registra una nueva embarcación en tu flota.
            </DialogDescription>
          </DialogHeader>
          <DialogCrearEmbarcacion
            formData={formData}
            submitting={submitting}
            onFormDataChange={handleFormDataChange}
            onSubmit={handleCreateEmbarcacion}
            onCancel={() => setIsCreateDialogOpen(false)}
          />
        </DialogContent>
      </Dialog>

      {/* Dialog Editar */}
      <Dialog
        open={isEditDialogOpen}
        onOpenChange={(open) => {
          if (!open) {
            handleCloseEditDialog();
          }
        }}
      >
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

      {/* AlertDialog de éxito al crear embarcación */}
      <AlertDialog
        open={isSuccessDialogOpen}
        onOpenChange={setIsSuccessDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="text-green-600">
              ¡Embarcación creada exitosamente!
            </AlertDialogTitle>
            <AlertDialogDescription className="space-y-2 pt-2">
              <p>
                Tu embarcación ha sido registrada en el sistema correctamente.
              </p>
              <p className="font-medium text-amber-700">
                Un administrador de CONANP autorizará la embarcación en cuanto
                verifique la información.
              </p>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction onClick={() => setIsSuccessDialogOpen(false)}>
              Entendido
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
