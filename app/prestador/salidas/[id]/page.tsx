"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams } from "next/navigation";
import { useAuth, useRouteProtection } from "@/lib/contexts/AuthContext";
import { clientLogger } from "@/lib/logger-client";
import {
  getSalida,
  cancelarSalida,
  completarServicio,
  actualizarSalida,
  getMisEmbarcaciones,
  getBloque,
} from "@/actions/prestador";
import {
  getBrazaletesUtilizadosSalida,
  asignarBrazaletes,
  getMisBrazaletes,
} from "@/actions/brazaletes";
import { PageHeader } from "@/components/ui/page-header";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { UsoBrazaletesForm } from "@/components/brazaletes/UsoBrazaletesForm";
import { RefreshCw, AlertTriangle } from "lucide-react";
import { extraerFechaYYYYMMDD } from "@/lib/utils";
import type { Salida } from "@/lib/types/salida";
import type { Embarcacion } from "@/lib/types/embarcacion";
import type { Brazalete, UsoBrazaleteFormData } from "@/lib/types/brazaletes";
import {
  DetallesSalida,
  InformacionBloque,
  InformacionHora,
  DetallesEmbarcacion,
  DialogEditarSalida,
  DialogIniciarSalida,
  DialogCompletarSalida,
  DialogCancelarSalida,
  AccionesRapidas,
  EstadisticasBrazaletes,
  TabBrazaletes,
  TabHistorial,
} from "./components";

export default function SalidaDetailPage() {
  const { isLoading, isAuthorized } = useRouteProtection("prestador");
  const { user } = useAuth();
  const params = useParams();
  const salidaId = params.id as string;

  // Estados de datos
  const [salida, setSalida] = useState<Salida | null>(null);
  const [bloqueActualizado, setBloqueActualizado] = useState<
    Salida["bloque"] | null
  >(null);
  const [usosBrazaletes, setUsosBrazaletes] = useState<Brazalete[]>([]);
  const [brazaletesDisponibles, setBrazaletesDisponibles] = useState<
    Brazalete[]
  >([]);
  const [embarcaciones, setEmbarcaciones] = useState<Embarcacion[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Estados de dialogs
  const [dialogEditar, setDialogEditar] = useState(false);
  const [dialogIniciar, setDialogIniciar] = useState(false);
  const [dialogCompletar, setDialogCompletar] = useState(false);
  const [dialogCancelar, setDialogCancelar] = useState(false);
  const [dialogBrazaletes, setDialogBrazaletes] = useState(false);

  // Estados de loading de acciones
  const [loadingEditar, setLoadingEditar] = useState(false);
  const [loadingIniciar, setLoadingIniciar] = useState(false);
  const [loadingCompletar, setLoadingCompletar] = useState(false);
  const [loadingCancelar, setLoadingCancelar] = useState(false);
  const [loadingBrazaletes, setLoadingBrazaletes] = useState(false);

  // Cargar datos
  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const [salidaResult, usosResult, embarcacionesResult, brazaletesResult] =
        await Promise.all([
          getSalida(salidaId),
          getBrazaletesUtilizadosSalida(salidaId),
          getMisEmbarcaciones(),
          getMisBrazaletes(),
        ]);

      if (salidaResult.success && salidaResult.data) {
        const salidaCargada = salidaResult.data.salida;
        setSalida(salidaCargada);

        // Si la salida tiene bloque_id, cargar datos completos del bloque
        if (salidaCargada.bloque_id) {
          try {
            const bloqueResult = await getBloque(salidaCargada.bloque_id);

            if (bloqueResult.success && bloqueResult.data?.bloque) {
              setBloqueActualizado(bloqueResult.data.bloque);
            }
          } catch (bloqueError) {
            clientLogger.error(
              "Error al cargar datos completos del bloque (opcional)",
              bloqueError,
              { bloqueId: salidaCargada.bloque_id }
            );
            // No se pudieron cargar los datos del bloque
          }
        }
      } else {
        throw new Error("Error al cargar la salida");
      }

      if (usosResult.success && usosResult.data) {
        setUsosBrazaletes(usosResult.data.brazaletes_utilizados || []);
      }

      if (embarcacionesResult.success && embarcacionesResult.data) {
        const salidaCargada = salidaResult.data?.salida;
        const embarcacionesDisponibles =
          embarcacionesResult.data.embarcaciones.filter(
            (e: Embarcacion) =>
              e.estado === "disponible" ||
              e.id === salidaCargada?.embarcacion?.id
          );
        setEmbarcaciones(embarcacionesDisponibles);
      }

      if (brazaletesResult.success && brazaletesResult.data) {
        // Filtrar solo brazaletes disponibles
        const brazaletesDisp = brazaletesResult.data.detalle.filter(
          (b: Brazalete) => b.estado === "disponible"
        );
        setBrazaletesDisponibles(brazaletesDisp);
      }
    } catch (error) {
      const errorMsg =
        error instanceof Error ? error.message : "Error desconocido";
      clientLogger.error("Error al cargar detalles de salida", error, {
        userId: user?.id,
        salidaId,
      });
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  }, [salidaId]);

  useEffect(() => {
    if (!isLoading && isAuthorized && user && salidaId) {
      loadData();
    }
  }, [isLoading, isAuthorized, user, salidaId, loadData]);

  // Handlers de acciones
  const handleEditar = async (datos: {
    numero_pasajeros: number;
    embarcacion_id: string;
    observaciones: string;
  }) => {
    try {
      setLoadingEditar(true);
      const result = await actualizarSalida(salidaId, datos);
      if (result.success) {
        await loadData();
      } else {
        throw new Error(result.error || "Error al editar");
      }
    } catch (error) {
      const errorMsg =
        error instanceof Error ? error.message : "Error desconocido";
      clientLogger.error("Error al editar salida", error, {
        userId: user?.id,
        salidaId,
        datos,
      });
      setError(errorMsg);
    } finally {
      setLoadingEditar(false);
    }
  };

  const handleIniciar = async () => {
    try {
      setLoadingIniciar(true);
      const result = await actualizarSalida(salidaId, { estado: "en_curso" });
      if (result.success) {
        await loadData();
      } else {
        throw new Error(result.error || "Error al iniciar");
      }
    } catch (error) {
      const errorMsg =
        error instanceof Error ? error.message : "Error desconocido";
      clientLogger.error("Error al iniciar salida", error, {
        userId: user?.id,
        salidaId,
      });
      setError(errorMsg);
    } finally {
      setLoadingIniciar(false);
    }
  };

  const handleCompletar = async () => {
    try {
      setLoadingCompletar(true);
      const fechaServicio = extraerFechaYYYYMMDD(salida!.fecha);

      const result = await completarServicio(salidaId, fechaServicio);
      if (result.success) {
        await loadData();
      } else {
        throw new Error(result.error || "Error al completar");
      }
    } catch (error) {
      const errorMsg =
        error instanceof Error ? error.message : "Error desconocido";
      clientLogger.error("Error al completar servicio", error, {
        userId: user?.id,
        salidaId,
      });
      setError(errorMsg);
    } finally {
      setLoadingCompletar(false);
    }
  };

  const handleCancelar = async (motivo: string) => {
    try {
      setLoadingCancelar(true);
      const result = await cancelarSalida(salidaId, motivo);
      if (result.success) {
        await loadData();
      } else {
        throw new Error(result.message || "Error al cancelar");
      }
    } catch (error) {
      const errorMsg =
        error instanceof Error ? error.message : "Error desconocido";
      clientLogger.error("Error al cancelar salida", error, {
        userId: user?.id,
        salidaId,
      });
      setError(errorMsg);
    } finally {
      setLoadingCancelar(false);
    }
  };

  const handleRegistrarBrazaletes = async (data: UsoBrazaleteFormData) => {
    try {
      setLoadingBrazaletes(true);
      const fechaAsignacion = extraerFechaYYYYMMDD(salida!.fecha);

      const result = await asignarBrazaletes({
        salida_id: data.salida_id,
        cantidad: data.cantidad,
        fecha_asignacion: fechaAsignacion,
      });

      if (result.success) {
        setDialogBrazaletes(false);
        await loadData();
      } else {
        throw new Error(result.message || "Error al asignar brazaletes");
      }
    } catch (error) {
      const errorMsg =
        error instanceof Error ? error.message : "Error desconocido";
      clientLogger.error("Error al registrar brazaletes en salida", error, {
        userId: user?.id,
        salidaId,
        data,
      });
      setError(errorMsg);
    } finally {
      setLoadingBrazaletes(false);
    }
  };

  // Loading y estados
  if (isLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <RefreshCw className="w-8 h-8 animate-spin text-[var(--isla-teal)]" />
      </div>
    );
  }

  if (!isAuthorized || !salida) {
    return (
      <div className="px-6 py-6">
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>{error || "Salida no encontrada"}</AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50/50">
      <PageHeader
        title={`Salida #${salida.id.slice(-8)}`}
        description="Detalles y gestión de la salida turística"
        breadcrumbs={[
          { label: "Dashboard", href: "/prestador" },
          { label: "Salidas", href: "/prestador/salidas" },
          { label: `#${salida.id.slice(-8)}` },
        ]}
        backHref="/prestador/salidas"
        onRefresh={loadData}
        refreshing={loading}
        badge={{ text: salida.estado, variant: "secondary" }}
      />

      <div className="px-6 py-6 space-y-6">
        {error && (
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <DetallesSalida salida={salida} />
            <InformacionBloque
              salida={
                bloqueActualizado
                  ? { ...salida, bloque: bloqueActualizado }
                  : salida
              }
            />
            <InformacionHora salida={salida} />
          </div>

          <div className="space-y-6">
            <AccionesRapidas
              salida={salida}
              onEditar={() => setDialogEditar(true)}
              onIniciar={() => setDialogIniciar(true)}
              onCompletar={() => setDialogCompletar(true)}
              onCancelar={() => setDialogCancelar(true)}
            />
            <DetallesEmbarcacion salida={salida} />
            <EstadisticasBrazaletes brazaletes={usosBrazaletes} />
          </div>
        </div>

        <Tabs defaultValue="brazaletes">
          <TabsList>
            <TabsTrigger value="brazaletes">
              Brazaletes ({usosBrazaletes.length})
            </TabsTrigger>
            <TabsTrigger value="historial">Historial</TabsTrigger>
          </TabsList>
          <TabsContent value="brazaletes">
            <TabBrazaletes
              salida={salida}
              usosBrazaletes={usosBrazaletes.map((b) => ({
                ...b,
                fecha_asignacion: b.fecha_asignacion || "",
                fecha_uso: b.fecha_uso || null,
                precio: String(b.precio),
                prestador_id: b.prestador_id || "",
                salida_id: b.salida_id || salidaId,
                turista_nacionalidad: b.turista_nacionalidad || null,
                turista_edad: b.turista_edad || null,
                lote: b.lote || {
                  numero_lote: "N/A",
                  tipo: "universal" as const,
                },
                prestador: b.prestador || { nombre: "N/A", email: "N/A" },
              }))}
              onRegistrarBrazaletes={() => setDialogBrazaletes(true)}
              puedeMostrarBotonRegistrar={
                (salida.estado === "programada" ||
                  salida.estado === "en_curso") &&
                usosBrazaletes.length === 0 &&
                brazaletesDisponibles.length > 0
              }
            />
          </TabsContent>
          <TabsContent value="historial">
            <TabHistorial salida={salida} />
          </TabsContent>
        </Tabs>
      </div>

      {/* Dialogs */}
      <DialogEditarSalida
        open={dialogEditar}
        onOpenChange={setDialogEditar}
        salida={salida}
        embarcaciones={embarcaciones}
        onConfirmar={handleEditar}
        isLoading={loadingEditar}
      />
      <DialogIniciarSalida
        open={dialogIniciar}
        onOpenChange={setDialogIniciar}
        salida={salida}
        onConfirmar={handleIniciar}
        isLoading={loadingIniciar}
      />
      <DialogCompletarSalida
        open={dialogCompletar}
        onOpenChange={setDialogCompletar}
        salida={salida}
        onConfirmar={handleCompletar}
        isLoading={loadingCompletar}
      />
      <DialogCancelarSalida
        open={dialogCancelar}
        onOpenChange={setDialogCancelar}
        salida={salida}
        onConfirmar={handleCancelar}
        isLoading={loadingCancelar}
      />
      <Dialog open={dialogBrazaletes} onOpenChange={setDialogBrazaletes}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Registrar Brazaletes</DialogTitle>
            <DialogDescription>
              Registra los brazaletes utilizados en esta salida
            </DialogDescription>
          </DialogHeader>
          <UsoBrazaletesForm
            onSubmit={handleRegistrarBrazaletes}
            loading={loadingBrazaletes}
            error={error}
            salidaId={salida.id}
            salidaFecha={extraerFechaYYYYMMDD(salida.fecha)}
            brazaletesDisponibles={brazaletesDisponibles}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
