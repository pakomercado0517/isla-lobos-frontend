"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/contexts/AuthContext";
import {
  crearInvitacion,
  listarInvitaciones,
  eliminarInvitacion,
  getEstadisticasInvitaciones,
} from "@/actions/invitaciones";
import {
  InvitacionesHeader,
  TablaInvitaciones,
  DialogCrearInvitacion,
  EstadisticasCards,
  LoadingState,
  ErrorAlert,
} from "./components";
import { Invitacion, EstadisticasInvitaciones } from "@/lib/types/invitaciones";
import { clientLogger } from "@/lib/logger-client";

interface FormData {
  codigo: string;
  email: string;
  nombre: string;
  rol: "conanp" | "prestador";
  fecha_expiracion: string;
}

export default function InvitacionesPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();

  const [invitaciones, setInvitaciones] = useState<Invitacion[]>([]);
  const [estadisticas, setEstadisticas] =
    useState<EstadisticasInvitaciones | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  // Redirigir si no es CONANP
  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login");
      return;
    }

    if (user && user.rol !== "conanp") {
      router.push("/prestador");
      return;
    }

    if (user && user.rol === "conanp") {
      loadData();
    }
  }, [user, authLoading, router]);

  const loadData = async () => {
    try {
      setLoading(true);
      setError("");

      // Cargar invitaciones y estadísticas en paralelo
      const [invitacionesResult, estadisticasResult] = await Promise.all([
        listarInvitaciones({ page: 1, limit: 50 }),
        getEstadisticasInvitaciones(),
      ]);

      if (invitacionesResult.success && invitacionesResult.data) {
        setInvitaciones(invitacionesResult.data.invitaciones);
      } else {
        setError(invitacionesResult.error || "Error al cargar invitaciones");
      }

      if (estadisticasResult.success && estadisticasResult.data) {
        setEstadisticas(estadisticasResult.data.estadisticas);
      }
    } catch (error: unknown) {
      clientLogger.error("Error al cargar datos de invitaciones", error);
      setError("Error al cargar datos");
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  const handleCreateInvitacion = async (
    formData: FormData,
    enviarEmail: boolean
  ) => {
    setSubmitting(true);
    setError("");
    setSuccessMessage("");

    try {
      // Preparar datos según si se envía email o no
      const datos = {
        codigo: formData.codigo.trim().toUpperCase(),
        rol: formData.rol,
        fecha_expiracion: formData.fecha_expiracion,
        ...(enviarEmail && {
          email: formData.email.trim(),
          nombre: formData.nombre.trim(),
        }),
      };

      const result = await crearInvitacion(datos);

      if (result.success) {
        setShowCreateDialog(false);

        // Mensaje de éxito según si se envió email
        if (result.data?.email_enviado) {
          setSuccessMessage(
            `✅ Invitación creada y email enviado a ${formData.email}`
          );
        } else {
          setSuccessMessage("✅ Invitación creada exitosamente");
        }

        // Recargar datos
        await loadData();

        // Limpiar mensaje después de 5 segundos
        setTimeout(() => setSuccessMessage(""), 5000);
      } else {
        setError(result.error || "Error al crear invitación");
      }
    } catch (error) {
      clientLogger.error("Error al crear invitación", error);
      setError("Error inesperado al crear invitación");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteInvitacion = async (id: string) => {
    if (!confirm("¿Estás seguro de que quieres eliminar esta invitación?")) {
      return;
    }

    try {
      setError("");
      const result = await eliminarInvitacion(id);

      if (result.success) {
        setSuccessMessage("✅ Invitación eliminada exitosamente");
        await loadData();
        setTimeout(() => setSuccessMessage(""), 3000);
      } else {
        setError(result.error || "Error al eliminar invitación");
      }
    } catch (error) {
      clientLogger.error("Error al eliminar invitación", error, {
        invitacionId: id,
      });
      setError("Error al eliminar invitación");
    }
  };

  const handleCopyUrl = (codigo: string) => {
    setSuccessMessage(
      `✅ URL copiada al portapapeles: /registro?codigo=${codigo}`
    );
    setTimeout(() => setSuccessMessage(""), 3000);
  };

  if (authLoading || loading) {
    return <LoadingState />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[var(--isla-cream)] to-[var(--isla-cream-light)] p-6">
      <div className="max-w-7xl mx-auto">
        <InvitacionesHeader
          onRefresh={handleRefresh}
          onCreateClick={() => setShowCreateDialog(true)}
          refreshing={refreshing}
        />

        <ErrorAlert error={error} />

        {successMessage && (
          <div className="mb-6 bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-lg">
            {successMessage}
          </div>
        )}

        <EstadisticasCards estadisticas={estadisticas} />

        <TablaInvitaciones
          invitaciones={invitaciones}
          onDelete={handleDeleteInvitacion}
          onCopyUrl={handleCopyUrl}
        />

        <DialogCrearInvitacion
          open={showCreateDialog}
          onOpenChange={setShowCreateDialog}
          onSubmit={handleCreateInvitacion}
          submitting={submitting}
        />
      </div>
    </div>
  );
}
