"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAuth, useRouteProtection } from "@/lib/contexts/AuthContext";
import { clientLogger } from "@/lib/logger-client";
import { getEmbarcacionById, updateEmbarcacion } from "@/actions/dashboard";
import { PageHeader } from "@/components/ui/page-header";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertTriangle } from "lucide-react";
import {
  DetallesEmbarcacion,
  InformacionPrestador,
  AccionesRapidas,
  LoadingState,
  ErrorState,
  DialogRechazarEmbarcacion,
} from "./components";

interface EmbarcacionDetalle {
  id: string;
  nombre: string;
  matricula: string;
  capacidad: number;
  tipo: "menor" | "mayor";
  estado: "disponible" | "en_uso" | "mantenimiento" | "pendiente_autorizacion";
  prestador_id: string;
  prestador?: {
    id: string;
    nombre: string;
    email: string;
    telefono: string;
  };
  createdAt?: string;
  updatedAt?: string;
  created_at?: string;
  updated_at?: string;
}

export default function EmbarcacionDetailPage() {
  const { isLoading, isAuthorized } = useRouteProtection("conanp");
  const { user } = useAuth();
  const params = useParams();
  const router = useRouter();
  const embarcacionId = params.id as string;

  const [embarcacion, setEmbarcacion] = useState<EmbarcacionDetalle | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [loadingAutorizar, setLoadingAutorizar] = useState(false);
  const [loadingRechazar, setLoadingRechazar] = useState(false);
  const [dialogRechazarOpen, setDialogRechazarOpen] = useState(false);

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const result = await getEmbarcacionById(embarcacionId);

      if (result.success && result.data) {
        // Normalizar la estructura de datos si es necesario
        const embarcacionData = result.data;
        clientLogger.info("Embarcación cargada exitosamente", {
          embarcacionId,
          data: embarcacionData,
        });
        setEmbarcacion(embarcacionData as EmbarcacionDetalle);
      } else {
        throw new Error(result.error || "Error al cargar la embarcación");
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Error desconocido";
      setError(errorMessage);
      clientLogger.error("Error al cargar embarcación:", err, {
        embarcacionId,
        userId: user?.id,
      });
    } finally {
      setLoading(false);
    }
  }, [embarcacionId, user?.id]);

  useEffect(() => {
    if (!isLoading && isAuthorized) {
      loadData();
    }
  }, [isLoading, isAuthorized, loadData]);

  const handleAutorizar = async () => {
    if (!embarcacion) return;

    try {
      setLoadingAutorizar(true);
      setError("");

      const result = await updateEmbarcacion(embarcacion.id, {
        estado: "disponible",
      });

      if (result.success) {
        clientLogger.info("Embarcación autorizada exitosamente", {
          embarcacionId: embarcacion.id,
          userId: user?.id,
        });
        // Recargar datos para actualizar el estado
        await loadData();
      } else {
        throw new Error(result.error || "Error al autorizar la embarcación");
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Error desconocido";
      setError(errorMessage);
      clientLogger.error("Error al autorizar embarcación:", err, {
        embarcacionId: embarcacion?.id,
        userId: user?.id,
      });
    } finally {
      setLoadingAutorizar(false);
    }
  };

  const handleRechazar = async (motivo: string) => {
    if (!embarcacion) return;

    try {
      setLoadingRechazar(true);
      setError("");

      // Por ahora, cambiar el estado a "mantenimiento" como estado de rechazo
      // TODO: En el futuro, agregar un estado específico "rechazada" en el backend
      const result = await updateEmbarcacion(embarcacion.id, {
        estado: "mantenimiento",
      });

      if (result.success) {
        clientLogger.info("Embarcación rechazada exitosamente", {
          embarcacionId: embarcacion.id,
          motivo,
          userId: user?.id,
        });
        setDialogRechazarOpen(false);
        // Recargar datos para actualizar el estado
        await loadData();
      } else {
        throw new Error(result.error || "Error al rechazar la embarcación");
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Error desconocido";
      setError(errorMessage);
      clientLogger.error("Error al rechazar embarcación:", err, {
        embarcacionId: embarcacion?.id,
        userId: user?.id,
      });
    } finally {
      setLoadingRechazar(false);
    }
  };

  const handleEditar = () => {
    if (!embarcacion) return;
    // Redirigir a la página de edición o abrir un dialog de edición
    // Por ahora, simplemente redirigimos a la lista de embarcaciones
    router.push("/dashboard/embarcaciones");
  };

  if (isLoading) {
    return <LoadingState />;
  }

  if (!isAuthorized) {
    return null;
  }

  if (loading) {
    return <LoadingState />;
  }

  if (error && !embarcacion) {
    return <ErrorState error={error} onRetry={loadData} />;
  }

  if (!embarcacion) {
    return (
      <ErrorState
        error="Embarcación no encontrada"
        onRetry={loadData}
      />
    );
  }

  return (
    <div className="min-h-screen space-y-4 md:space-y-6">
      <PageHeader
        title={embarcacion.nombre}
        description={`Matrícula: ${embarcacion.matricula}`}
        breadcrumbs={[
          { label: "Dashboard", href: "/dashboard" },
          { label: "Embarcaciones", href: "/dashboard/embarcaciones" },
          { label: embarcacion.nombre },
        ]}
        backHref="/dashboard/embarcaciones"
        backLabel="Volver a Embarcaciones"
        onRefresh={loadData}
        refreshing={loading}
        badge={{
          text:
            embarcacion.estado === "pendiente_autorizacion"
              ? "Pendiente Autorización"
              : embarcacion.estado === "en_uso"
              ? "En Uso"
              : embarcacion.estado === "mantenimiento"
              ? "Mantenimiento"
              : "Disponible",
          variant:
            embarcacion.estado === "pendiente_autorizacion"
              ? "default"
              : embarcacion.estado === "en_uso"
              ? "secondary"
              : embarcacion.estado === "mantenimiento"
              ? "destructive"
              : "default",
        }}
      />

      {error && (
        <Alert variant="destructive" className="mx-4 sm:mx-6 lg:mx-8">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="px-4 sm:px-6 lg:px-8 space-y-4 md:space-y-6">
        {/* Grid principal */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
          {/* Columna izquierda: Detalles */}
          <div className="lg:col-span-2 space-y-4 md:space-y-6">
            <DetallesEmbarcacion embarcacion={embarcacion} />
            <InformacionPrestador prestador={embarcacion.prestador || null} />
          </div>

          {/* Columna derecha: Acciones */}
          <div className="space-y-4 md:space-y-6">
            <AccionesRapidas
              embarcacion={embarcacion}
              onAutorizar={handleAutorizar}
              onRechazar={() => setDialogRechazarOpen(true)}
              onEditar={handleEditar}
              loadingAutorizar={loadingAutorizar}
              loadingRechazar={loadingRechazar}
            />
          </div>
        </div>
      </div>

      {/* Dialog Rechazar */}
      <DialogRechazarEmbarcacion
        open={dialogRechazarOpen}
        onOpenChange={setDialogRechazarOpen}
        onConfirm={handleRechazar}
        embarcacionNombre={embarcacion.nombre}
        loading={loadingRechazar}
      />
    </div>
  );
}

