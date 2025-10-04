"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth, useRouteProtection } from "@/lib/contexts/AuthContext";
import { getSalida, cancelarSalida } from "@/actions/prestador";
import {
  marcarBrazaletesUtilizados,
  getBrazaletesUtilizadosSalida,
} from "@/actions/brazaletes";
import { UsoBrazaletesForm } from "@/components/brazaletes/UsoBrazaletesForm";
import { UsoBrazaletesCard } from "@/components/brazaletes/UsoBrazaletesCard";
import { PageHeader } from "@/components/ui/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Calendar,
  Clock,
  Ship,
  Users,
  RefreshCw,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Ticket,
  Trash2,
} from "lucide-react";
import { useParams } from "next/navigation";
import { Salida } from "@/lib/types/salida";
import { formatearFechaSalida } from "@/lib/utils";
import {
  BrazaletesCardUso,
  UsoBrazaleteFormData,
} from "@/lib/types/brazaletes";

export default function SalidaDetailPage() {
  const { isLoading, isAuthorized } = useRouteProtection("prestador");
  const { user } = useAuth();
  const params = useParams();
  const router = useRouter();
  const salidaId = params.id as string;

  const [salida, setSalida] = useState<Salida | null>(null);
  const [usosBrazaletes, setUsosBrazaletes] = useState<BrazaletesCardUso[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showUsoDialog, setShowUsoDialog] = useState(false);
  const [registrandoUso, setRegistrandoUso] = useState(false);
  const [usoError, setUsoError] = useState("");
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    if (!isLoading && isAuthorized && user && salidaId) {
      loadData();
    }
  }, [isLoading, isAuthorized, user, salidaId]);

  const loadData = async () => {
    try {
      setLoading(true);
      setError("");

      console.log("🚢 Salida Detail: Cargando datos para salida:", salidaId);

      const [salidaResult, usosResult] = await Promise.all([
        getSalida(salidaId),
        getBrazaletesUtilizadosSalida(salidaId),
      ]);

      if (salidaResult.success && salidaResult.data) {
        setSalida(salidaResult.data.salida);
        console.log("🚢 Salida Detail: Salida cargada:", salidaResult.data);
      } else {
        throw new Error("Error al cargar la salida");
      }

      if (usosResult.success && usosResult.data) {
        // Convertir Brazalete[] a BrazaletesCardUso[]
        const brazaletesConvertidos = (
          usosResult.data.brazaletes_utilizados || []
        ).map((brazalete) => ({
          ...brazalete,
          // Asegurar que fecha_asignacion no sea undefined
          fecha_asignacion: brazalete.fecha_asignacion || "",
          // Convertir precio a string
          precio: String(brazalete.precio),
        })) as BrazaletesCardUso[];

        setUsosBrazaletes(brazaletesConvertidos);
        console.log("usosResult", usosResult);
        console.log(
          "🚢 Salida Detail: Usos cargados:",
          brazaletesConvertidos.length
        );
      }
    } catch (error) {
      console.error("🚢 Salida Detail: Error al cargar datos:", error);
      setError(error instanceof Error ? error.message : "Error desconocido");
    } finally {
      setLoading(false);
    }
  };

  const handleRegistrarUso = async (data: UsoBrazaleteFormData) => {
    try {
      setRegistrandoUso(true);
      setUsoError("");

      console.log("🎫 Salida Detail: Registrando uso:", data);

      // Convertir UsoBrazaleteFormData a formato esperado por marcarBrazaletesUtilizados
      const fechaActual = new Date().toISOString().split("T")[0]; // YYYY-MM-DD
      const result = await marcarBrazaletesUtilizados({
        salida_id: data.salida_id,
        fecha_uso: fechaActual,
      });

      if (result.success) {
        console.log("🎫 Salida Detail: Uso registrado exitosamente");
        setShowUsoDialog(false);
        await loadData(); // Recargar datos
      } else {
        throw new Error(result.message || "Error al registrar uso");
      }
    } catch (error) {
      console.error("🎫 Salida Detail: Error al registrar uso:", error);
      setUsoError(error instanceof Error ? error.message : "Error desconocido");
    } finally {
      setRegistrandoUso(false);
    }
  };

  const handleCancelarSalida = async () => {
    if (!salida) return;

    if (!confirm("¿Estás seguro de que quieres cancelar esta salida?")) {
      return;
    }

    try {
      setActionLoading(true);
      setError("");

      console.log("🚢 Salida Detail: Cancelando salida:", salida!.id);
      const result = await cancelarSalida(salida!.id);

      if (result.success) {
        console.log("🚢 Salida Detail: Salida cancelada exitosamente");
        await loadData(); // Recargar datos
      } else {
        throw new Error(result.message || "Error al cancelar la salida");
      }
    } catch (error) {
      console.error("🚢 Salida Detail: Error al cancelar salida:", error);
      setError(error instanceof Error ? error.message : "Error desconocido");
    } finally {
      setActionLoading(false);
    }
  };

  const getEstadoColor = (estado: string) => {
    switch (estado) {
      case "activa":
        return "bg-green-100 text-green-800 border-green-200";
      case "completada":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "cancelada":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getEstadoIcon = (estado: string) => {
    switch (estado) {
      case "activa":
        return <CheckCircle className="w-4 h-4" />;
      case "completada":
        return <CheckCircle className="w-4 h-4" />;
      case "cancelada":
        return <XCircle className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-4 text-[var(--isla-teal)]" />
          <p className="text-gray-600">Cargando salida...</p>
        </div>
      </div>
    );
  }

  if (!isAuthorized) {
    return null;
  }

  if (!salida) {
    return (
      <div className="min-h-screen bg-gray-50/50">
        <PageHeader
          title="Salida no encontrada"
          description="La salida que buscas no existe o no tienes permisos para verla"
          breadcrumbs={[
            { label: "Dashboard", href: "/prestador" },
            { label: "Salidas", href: "/prestador/salidas" },
            { label: "Detalles" },
          ]}
          backHref="/prestador/salidas"
          backLabel="Volver a Salidas"
          badge={{
            text: "Error",
            variant: "destructive",
          }}
        />

        <div className="px-6 py-6">
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        </div>
      </div>
    );
  }

  console.log("salida", salida);

  return (
    <div className="min-h-screen bg-gray-50/50">
      <PageHeader
        title={`Salida #${salida.id.slice(-8)}`}
        description="Detalles y gestión de la salida turística"
        breadcrumbs={[
          { label: "Dashboard", href: "/prestador" },
          { label: "Salidas", href: "/prestador/salidas" },
          { label: `Salida #${salida!.id.slice(-8)}` },
        ]}
        backHref="/prestador/salidas"
        backLabel="Volver a Salidas"
        onRefresh={loadData}
        refreshing={loading}
        badge={{
          text: salida!.estado,
          variant:
            salida!.estado === "programada"
              ? "secondary"
              : salida!.estado === "completada"
              ? "secondary"
              : "destructive",
        }}
        actions={
          salida!.estado === "programada" ? (
            <Button
              variant="destructive"
              onClick={handleCancelarSalida}
              disabled={actionLoading}
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Cancelar Salida
            </Button>
          ) : undefined
        }
      />

      <div className="px-6 py-6 space-y-6">
        {/* Error general */}
        {error && (
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Información principal */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Información de la salida */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <Ship className="w-5 h-5" />
                    Información de la Salida
                  </span>
                  <Badge className={getEstadoColor(salida!.estado)}>
                    <span className="flex items-center gap-1">
                      {getEstadoIcon(salida!.estado)}
                      {salida!.estado}
                    </span>
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-gray-500" />
                    <div>
                      <div className="text-sm text-gray-600">Fecha y Hora</div>
                      <div className="font-medium">
                        {formatearFechaSalida(salida!.fecha)}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-gray-500" />
                    <div>
                      <div className="text-sm text-gray-600">Pasajeros</div>
                      <div className="font-medium">
                        {salida!.numero_pasajeros}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Ship className="w-4 h-4 text-gray-500" />
                    <div>
                      <div className="text-sm text-gray-600">Embarcación</div>
                      <div className="font-medium">
                        {salida!.embarcacion?.nombre || "Sin embarcación"}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-gray-500" />
                    <div>
                      <div className="text-sm text-gray-600">Destino</div>
                      <div className="font-medium">{salida.destino}</div>
                    </div>
                  </div>
                </div>

                {salida!.observaciones && (
                  <div>
                    <div className="text-sm text-gray-600 mb-2">
                      Observaciones
                    </div>
                    <div className="bg-gray-50 p-3 rounded-lg text-sm">
                      {salida!.observaciones}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Acciones rápidas */}
          <div className="space-y-4">
            {salida!.estado === "programada" && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Ticket className="w-5 h-5" />
                    Acciones Rápidas
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Dialog open={showUsoDialog} onOpenChange={setShowUsoDialog}>
                    <DialogTrigger asChild>
                      <Button className="w-full bg-[var(--isla-teal)] hover:bg-[var(--isla-teal-dark)] text-white">
                        <Ticket className="w-4 h-4 mr-2" />
                        Registrar Brazaletes
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                      <DialogHeader>
                        <DialogTitle>Registrar Uso de Brazaletes</DialogTitle>
                        <DialogDescription>
                          Registra los brazaletes utilizados en esta salida
                        </DialogDescription>
                      </DialogHeader>
                      <UsoBrazaletesForm
                        onSubmit={handleRegistrarUso}
                        loading={registrandoUso}
                        error={usoError}
                        salidasDisponibles={[
                          {
                            id: salida!.id,
                            fecha:
                              salida!.fecha instanceof Date
                                ? salida!.fecha.toISOString().split("T")[0]
                                : salida!.fecha,
                            numero_pasajeros: salida!.numero_pasajeros,
                            embarcacion_nombre: salida!.embarcacion?.nombre,
                            destino: salida!.destino,
                          },
                        ]}
                      />
                    </DialogContent>
                  </Dialog>
                </CardContent>
              </Card>
            )}

            {/* Resumen de brazaletes utilizados */}
            <Card>
              <CardHeader>
                <CardTitle>Brazaletes Utilizados</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  <div className="text-3xl font-bold text-[var(--isla-teal)]">
                    {usosBrazaletes.length}
                  </div>
                  <div className="text-sm text-gray-600">
                    Brazaletes registrados
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Tabs para más información */}
        <Tabs defaultValue="brazaletes" className="w-full">
          <TabsList>
            <TabsTrigger value="brazaletes">Brazaletes Utilizados</TabsTrigger>
            <TabsTrigger value="historial">Historial</TabsTrigger>
          </TabsList>

          <TabsContent value="brazaletes" className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">
                Brazaletes Registrados en esta Salida
              </h3>
            </div>

            {usosBrazaletes.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {usosBrazaletes.map((uso) => (
                  <UsoBrazaletesCard
                    key={uso.id}
                    uso={uso}
                    onVerDetalles={(uso) =>
                      console.log("Ver detalles de uso:", uso)
                    }
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-8 bg-gray-50 rounded-lg">
                <Ticket className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No hay brazaletes registrados
                </h3>
                <p className="text-gray-600 mb-4">
                  {salida!.estado === "completada"
                    ? "Registra los brazaletes utilizados en esta salida"
                    : "Los brazaletes solo se pueden registrar en salidas completadas"}
                </p>
                {salida!.estado === "completada" && (
                  <Dialog open={showUsoDialog} onOpenChange={setShowUsoDialog}>
                    <DialogTrigger asChild>
                      <Button className="bg-[var(--isla-teal)] hover:bg-[var(--isla-teal-dark)] text-white">
                        <Ticket className="w-4 h-4 mr-2" />
                        Registrar Brazaletes
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                      <DialogHeader>
                        <DialogTitle>Registrar Uso de Brazaletes</DialogTitle>
                        <DialogDescription>
                          Registra los brazaletes utilizados en esta salida
                        </DialogDescription>
                      </DialogHeader>
                      <UsoBrazaletesForm
                        onSubmit={handleRegistrarUso}
                        loading={registrandoUso}
                        error={usoError}
                        salidasDisponibles={[
                          {
                            id: salida!.id,
                            fecha:
                              salida!.fecha instanceof Date
                                ? salida!.fecha.toISOString().split("T")[0]
                                : salida!.fecha,
                            numero_pasajeros: salida!.numero_pasajeros,
                            embarcacion_nombre: salida!.embarcacion?.nombre,
                            destino: salida!.destino,
                          },
                        ]}
                      />
                    </DialogContent>
                  </Dialog>
                )}
              </div>
            )}
          </TabsContent>

          <TabsContent value="historial" className="space-y-4">
            <div className="text-center py-8 bg-gray-50 rounded-lg">
              <Clock className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Historial de Cambios
              </h3>
              <p className="text-gray-600">
                El historial de cambios se mostrará aquí cuando esté disponible
              </p>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
