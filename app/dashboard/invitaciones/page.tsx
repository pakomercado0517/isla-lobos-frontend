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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Invitacion, EstadisticasInvitaciones } from "@/lib/types/invitaciones";
import { clientLogger } from "@/lib/logger-client";
import { extraerFechaYYYYMMDD } from "@/lib/utils";

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
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [successTitle, setSuccessTitle] = useState("");
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [invitacionToDelete, setInvitacionToDelete] = useState<string | null>(
    null
  );

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
      // Preparar datos - email y nombre ahora SIEMPRE incluidos
      // IMPORTANTE: Usar extraerFechaYYYYMMDD() para enviar solo YYYY-MM-DD sin conversiones de timezone
      const datos = {
        codigo: formData.codigo.trim().toUpperCase(),
        email: formData.email.trim(), // ✅ Siempre incluido
        nombre: formData.nombre.trim(), // ✅ Siempre incluido
        rol: formData.rol,
        fecha_expiracion: extraerFechaYYYYMMDD(formData.fecha_expiracion),
      };

      const result = await crearInvitacion(datos);

      if (result.success) {
        setShowCreateDialog(false);

        // Mensaje de éxito según si se envió email automático
        if (enviarEmail && result.data?.email_enviado) {
          setSuccessTitle("¡Invitación Creada y Email Enviado!");
          setSuccessMessage(
            `La invitación para ${formData.nombre} ha sido creada exitosamente y se ha enviado un email a ${formData.email} con el enlace de registro.`
          );
        } else if (enviarEmail && !result.data?.email_enviado) {
          setSuccessTitle("¡Invitación Creada!");
          setSuccessMessage(
            `La invitación para ${formData.nombre} (${formData.email}) ha sido creada, pero no se pudo enviar el email automáticamente. Comparte el código manualmente.`
          );
        } else {
          setSuccessTitle("¡Invitación Creada!");
          setSuccessMessage(
            `La invitación para ${formData.nombre} (${formData.email}) ha sido creada exitosamente. Comparte el código manualmente o envía el enlace desde la tabla.`
          );
        }

        // Mostrar AlertDialog de éxito
        setShowSuccessDialog(true);

        // Recargar datos
        await loadData();
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

  const handleDeleteInvitacion = (id: string) => {
    setInvitacionToDelete(id);
    setShowDeleteDialog(true);
  };

  const confirmDeleteInvitacion = async () => {
    if (!invitacionToDelete) return;

    try {
      setError("");
      setShowDeleteDialog(false);
      const result = await eliminarInvitacion(invitacionToDelete);

      if (result.success) {
        setSuccessTitle("¡Invitación Eliminada!");
        setSuccessMessage("La invitación ha sido eliminada exitosamente.");
        setShowSuccessDialog(true);
        await loadData();
      } else {
        setError(result.error || "Error al eliminar invitación");
      }
    } catch (error) {
      clientLogger.error("Error al eliminar invitación", error, {
        invitacionId: invitacionToDelete,
      });
      setError("Error al eliminar invitación");
    } finally {
      setInvitacionToDelete(null);
    }
  };

  const handleCopyUrl = (codigo: string) => {
    setSuccessTitle("¡URL Copiada!");
    setSuccessMessage(
      `El enlace de registro ha sido copiado al portapapeles: /registro?codigo=${codigo}`
    );
    setShowSuccessDialog(true);
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

        {/* AlertDialog de éxito */}
        <AlertDialog
          open={showSuccessDialog}
          onOpenChange={setShowSuccessDialog}
        >
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle className="flex items-center gap-2">
                <span className="text-green-600">✅</span>
                {successTitle}
              </AlertDialogTitle>
              <AlertDialogDescription>{successMessage}</AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogAction
                onClick={() => setShowSuccessDialog(false)}
                className="bg-[var(--isla-teal)] hover:bg-[var(--isla-teal-dark)]"
              >
                Entendido
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        {/* AlertDialog de confirmación de eliminación */}
        <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle className="flex items-center gap-2">
                <span className="text-red-600">⚠️</span>
                Confirmar Eliminación
              </AlertDialogTitle>
              <AlertDialogDescription>
                ¿Estás seguro de que quieres eliminar esta invitación? Esta
                acción no se puede deshacer.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel onClick={() => setShowDeleteDialog(false)}>
                Cancelar
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={confirmDeleteInvitacion}
                className="bg-red-600 hover:bg-red-700 text-white"
              >
                Eliminar
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
}
