"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/contexts/AuthContext";
import { clientLogger } from "@/lib/logger-client";
import {
  getEmbarcaciones,
  createEmbarcacion,
  updateEmbarcacion,
  deleteEmbarcacion,
  getUsuarios,
} from "@/actions/dashboard";
import {
  EmbarcacionesHeader,
  FiltrosEmbarcaciones,
  TablaEmbarcaciones,
  DialogCrearEmbarcacion,
  DialogEditarEmbarcacion,
  EmptyState,
  LoadingState,
  ErrorAlert,
} from "./components";

interface Embarcacion {
  id: string;
  nombre: string;
  matricula: string;
  capacidad: number;
  tipo: "menor" | "mayor";
  estado: "disponible" | "en_uso" | "mantenimiento";
  prestador_id: string;
  prestador?: {
    id: string;
    nombre: string;
    email: string;
    telefono: string;
  };
  createdAt: string;
  updatedAt: string;
}

interface Prestador {
  id: string;
  nombre: string;
  email: string;
  telefono: string;
  rol: string;
  activo: boolean;
}

interface CreateEmbarcacionData {
  nombre: string;
  matricula: string;
  capacidad: number;
  tipo: "menor" | "mayor";
  estado: "disponible" | "en_uso" | "mantenimiento";
  prestador_id: string;
}

export default function EmbarcacionesPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [embarcaciones, setEmbarcaciones] = useState<Embarcacion[]>([]);
  const [prestadores, setPrestadores] = useState<Prestador[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filtroEstado, setFiltroEstado] = useState("todos");
  const [filtroTipo, setFiltroTipo] = useState("todos");
  const [busqueda, setBusqueda] = useState("");
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [embarcacionEditando, setEmbarcacionEditando] =
    useState<Embarcacion | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState<CreateEmbarcacionData>({
    nombre: "",
    matricula: "",
    capacidad: 20,
    tipo: "menor",
    estado: "disponible",
    prestador_id: "",
  });

  const loadData = async () => {
    try {
      setLoading(true);
      setError("");

      const [embarcacionesResult, prestadoresResult] = await Promise.all([
        getEmbarcaciones(),
        getUsuarios(1, 100, { rol: "prestador", activo: true }),
      ]);

      if (embarcacionesResult.success) {
        setEmbarcaciones(embarcacionesResult.data.embarcaciones || []);
      } else {
        setError(
          embarcacionesResult.error || "Error al cargar las embarcaciones"
        );
      }

      if (prestadoresResult.success) {
        setPrestadores(prestadoresResult.data.users || []);
      } else {
        setError(prestadoresResult.error || "Error al cargar los prestadores");
      }
    } catch (error: unknown) {
      clientLogger.error("Error al cargar datos de embarcaciones", error, {
        userId: user?.id,
      });
      setError("Error al cargar los datos");
    } finally {
      setLoading(false);
    }
  };

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
      loadData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, authLoading, router]);

  const handleCreateEmbarcacion = async () => {
    if (!formData.nombre || !formData.matricula || !formData.prestador_id) {
      setError("Por favor completa todos los campos requeridos");
      return;
    }

    try {
      setSubmitting(true);
      setError("");

      const result = await createEmbarcacion(formData);

      if (result.success) {
        setShowCreateDialog(false);
        resetForm();
        loadData();
      } else {
        setError(result.error || "Error al crear la embarcación");
      }
    } catch (error: unknown) {
      clientLogger.error("Error al crear embarcación", error, {
        userId: user?.id,
        formData,
      });
      setError("Error al crear la embarcación");
    } finally {
      setSubmitting(false);
    }
  };

  const handleEditEmbarcacion = async () => {
    if (!embarcacionEditando) return;

    try {
      setSubmitting(true);
      setError("");

      const result = await updateEmbarcacion(embarcacionEditando.id, formData);

      if (result.success) {
        setShowEditDialog(false);
        resetForm();
        setEmbarcacionEditando(null);
        loadData();
      } else {
        setError(result.error || "Error al editar la embarcación");
      }
    } catch (error: unknown) {
      clientLogger.error("Error al editar embarcación", error, {
        userId: user?.id,
        embarcacionId: embarcacionEditando?.id,
        formData,
      });
      setError("Error al editar la embarcación");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteEmbarcacion = async (embarcacionId: string) => {
    if (!confirm("¿Estás seguro de que quieres eliminar esta embarcación?"))
      return;

    try {
      const result = await deleteEmbarcacion(embarcacionId);

      if (result.success) {
        loadData();
      } else {
        setError(result.error || "Error al eliminar la embarcación");
      }
    } catch (error: unknown) {
      clientLogger.error("Error al eliminar embarcación", error, {
        userId: user?.id,
        embarcacionId,
      });
      setError("Error al eliminar la embarcación");
    }
  };

  const resetForm = () => {
    setFormData({
      nombre: "",
      matricula: "",
      capacidad: 20,
      tipo: "menor",
      estado: "disponible",
      prestador_id: "",
    });
  };

  const openEditDialog = (embarcacion: Embarcacion) => {
    setEmbarcacionEditando(embarcacion);
    setFormData({
      nombre: embarcacion.nombre,
      matricula: embarcacion.matricula,
      capacidad: embarcacion.capacidad,
      tipo: embarcacion.tipo,
      estado: embarcacion.estado,
      prestador_id: embarcacion.prestador_id,
    });
    setShowEditDialog(true);
  };

  const embarcacionesFiltradas = embarcaciones.filter((embarcacion) => {
    const estadoMatch =
      filtroEstado === "todos" || embarcacion.estado === filtroEstado;
    const tipoMatch = filtroTipo === "todos" || embarcacion.tipo === filtroTipo;
    const busquedaMatch =
      busqueda === "" ||
      embarcacion.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
      embarcacion.matricula.toLowerCase().includes(busqueda.toLowerCase()) ||
      embarcacion.prestador?.nombre
        .toLowerCase()
        .includes(busqueda.toLowerCase());
    return estadoMatch && tipoMatch && busquedaMatch;
  });

  if (authLoading || loading) {
    return <LoadingState />;
  }

  return (
    <div className="min-h-screen space-y-4 md:space-y-6">
      <EmbarcacionesHeader
        onRefresh={loadData}
        onCreateClick={() => setShowCreateDialog(true)}
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
          onEdit={openEditDialog}
          onDelete={handleDeleteEmbarcacion}
        />
      ) : (
        <EmptyState onCreateClick={() => setShowCreateDialog(true)} />
      )}

      <DialogCrearEmbarcacion
        open={showCreateDialog}
        onOpenChange={setShowCreateDialog}
        formData={formData}
        onFormChange={setFormData}
        prestadores={prestadores}
        onSubmit={handleCreateEmbarcacion}
        submitting={submitting}
      />

      <DialogEditarEmbarcacion
        open={showEditDialog}
        onOpenChange={setShowEditDialog}
        formData={formData}
        onFormChange={setFormData}
        prestadores={prestadores}
        onSubmit={handleEditEmbarcacion}
        submitting={submitting}
      />
    </div>
  );
}
