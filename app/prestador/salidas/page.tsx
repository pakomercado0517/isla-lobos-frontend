"use client";

import { useEffect, useState } from "react";
import { useAuth, useRouteProtection } from "@/lib/contexts/AuthContext";
import { getMisSalidas } from "@/actions/prestador";
import {
  marcarBrazaletesUtilizados,
  getMisBrazaletes,
} from "@/actions/brazaletes";
import { UsoBrazaletesForm } from "@/components/brazaletes/UsoBrazaletesForm";
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
import {
  Ship,
  Calendar,
  Clock,
  Plus,
  RefreshCw,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Package,
  Users,
  Ticket,
} from "lucide-react";
import Link from "next/link";
import { Salida } from "@/lib/types/salida";
import {
  BrazaletesPrestador,
  UsoBrazaleteFormData,
} from "@/lib/types/brazaletes";
import { formatearFechaSalida } from "@/lib/utils";

export default function SalidasPage() {
  const { isLoading, isAuthorized } = useRouteProtection("prestador");
  const { user } = useAuth();

  const [salidas, setSalidas] = useState<Salida[]>([]);
  const [brazaletesData, setBrazaletesData] =
    useState<BrazaletesPrestador | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedSalida, setSelectedSalida] = useState<Salida | null>(null);
  const [showUsoDialog, setShowUsoDialog] = useState(false);
  const [registrandoUso, setRegistrandoUso] = useState(false);
  const [usoError, setUsoError] = useState("");

  useEffect(() => {
    if (!isLoading && isAuthorized && user) {
      loadData();
    }
  }, [isLoading, isAuthorized, user]);

  const loadData = async () => {
    try {
      setLoading(true);
      setError("");

      console.log("🚢 Salidas: Cargando datos...");

      const [salidasResult, brazaletesResult] = await Promise.all([
        getMisSalidas(),
        getMisBrazaletes(),
      ]);

      if (salidasResult.success && salidasResult.data) {
        setSalidas(salidasResult.data.salidas || []);
        console.log(
          "🚢 Salidas: Salidas cargadas:",
          salidasResult.data.salidas?.length
        );
      } else {
        throw new Error("Error al cargar salidas");
      }

      if (brazaletesResult.success && brazaletesResult.data) {
        setBrazaletesData(brazaletesResult.data);
        console.log("🎫 Salidas: Brazaletes cargados:", brazaletesResult.data);
      }
    } catch (error) {
      console.error("🚢 Salidas: Error al cargar datos:", error);
      setError(error instanceof Error ? error.message : "Error desconocido");
    } finally {
      setLoading(false);
    }
  };

  const handleRegistrarUso = async (data: UsoBrazaleteFormData) => {
    try {
      setRegistrandoUso(true);
      setUsoError("");

      console.log("🎫 Salidas: Registrando uso:", data);

      // Convertir UsoBrazaleteFormData a formato esperado por marcarBrazaletesUtilizados
      const fechaActual = new Date().toISOString().split("T")[0]; // YYYY-MM-DD
      const result = await marcarBrazaletesUtilizados({
        salida_id: data.salida_id,
        fecha_uso: fechaActual,
      });

      if (result.success) {
        console.log("🎫 Salidas: Uso registrado exitosamente");
        setShowUsoDialog(false);
        setSelectedSalida(null);
        await loadData(); // Recargar datos
      } else {
        throw new Error(result.message || "Error al registrar uso");
      }
    } catch (error) {
      console.error("🎫 Salidas: Error al registrar uso:", error);
      setUsoError(error instanceof Error ? error.message : "Error desconocido");
    } finally {
      setRegistrandoUso(false);
    }
  };

  const openUsoDialog = (salida: Salida) => {
    setSelectedSalida(salida);
    setShowUsoDialog(true);
    setUsoError("");
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
          <p className="text-gray-600">Verificando autenticación...</p>
        </div>
      </div>
    );
  }

  if (!isAuthorized) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50/50">
      <PageHeader
        title="Mis Salidas"
        description="Gestiona tus salidas turísticas y registra el uso de brazaletes"
        breadcrumbs={[
          { label: "Dashboard", href: "/prestador" },
          { label: "Salidas" },
        ]}
        backHref="/prestador"
        backLabel="Volver al Dashboard"
        onRefresh={loadData}
        refreshing={loading}
        badge={
          salidas.length > 0
            ? {
                text: `${salidas.length} salidas`,
                variant: "secondary",
              }
            : undefined
        }
        actions={
          <Button
            className="bg-[var(--isla-teal)] hover:bg-[var(--isla-teal-dark)] text-white"
            asChild
          >
            <Link href="/prestador/nueva-salida">
              <Plus className="w-4 h-4 mr-2" />
              Nueva Salida
            </Link>
          </Button>
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

        {/* Resumen de brazaletes */}
        {brazaletesData && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="w-5 h-5" />
                Resumen de Brazaletes Disponibles
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">
                    {brazaletesData.brazaletes.disponibles}
                  </div>
                  <div className="text-sm text-green-700">Disponibles</div>
                </div>
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">
                    {brazaletesData.brazaletes.asignados}
                  </div>
                  <div className="text-sm text-blue-700">Asignados</div>
                </div>
                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <div className="text-2xl font-bold text-purple-600">
                    {brazaletesData.brazaletes.utilizados}
                  </div>
                  <div className="text-sm text-purple-700">Utilizados</div>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <div className="text-2xl font-bold text-gray-600">
                    {brazaletesData.brazaletes.por_tipo.universal}
                  </div>
                  <div className="text-sm text-gray-700">Total</div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Lista de salidas */}
        <div className="space-y-4">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-4 text-[var(--isla-teal)]" />
                <p className="text-gray-600">Cargando salidas...</p>
              </div>
            </div>
          ) : salidas.length > 0 ? (
            <div className="grid grid-cols-1 gap-4">
              {salidas.map((salida) => (
                <Card
                  key={salida.id}
                  className="hover:shadow-lg transition-shadow"
                >
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-3">
                          <Badge className={getEstadoColor(salida.estado)}>
                            <span className="flex items-center gap-1">
                              {getEstadoIcon(salida.estado)}
                              {salida.estado}
                            </span>
                          </Badge>
                          <div className="text-sm text-gray-600">
                            ID: {salida.id.slice(-8)}
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-gray-500" />
                            <div>
                              <div className="text-sm text-gray-600">Fecha</div>
                              <div className="font-medium">
                                {formatearFechaSalida(salida.fecha)}
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            <Ship className="w-4 h-4 text-gray-500" />
                            <div>
                              <div className="text-sm text-gray-600">
                                Embarcación
                              </div>
                              <div className="font-medium">
                                {salida.embarcacion?.nombre ||
                                  "Sin embarcación"}
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            <Users className="w-4 h-4 text-gray-500" />
                            <div>
                              <div className="text-sm text-gray-600">
                                Pasajeros
                              </div>
                              <div className="font-medium">
                                {salida.numero_pasajeros}
                              </div>
                            </div>
                          </div>
                        </div>

                        {salida.observaciones && (
                          <div className="mb-4">
                            <div className="text-sm text-gray-600 mb-1">
                              Observaciones
                            </div>
                            <p className="text-sm bg-gray-50 p-2 rounded">
                              {salida.observaciones}
                            </p>
                          </div>
                        )}
                      </div>

                      <div className="flex flex-col gap-2 ml-4">
                        {salida.estado === "completada" && (
                          <Dialog
                            open={
                              showUsoDialog && selectedSalida?.id === salida.id
                            }
                            onOpenChange={setShowUsoDialog}
                          >
                            <DialogTrigger asChild>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => openUsoDialog(salida)}
                                className="border-[var(--isla-teal)] text-[var(--isla-teal)] hover:bg-[var(--isla-teal)] hover:text-white"
                              >
                                <Ticket className="w-4 h-4 mr-2" />
                                Registrar Brazaletes
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                              <DialogHeader>
                                <DialogTitle>
                                  Registrar Uso de Brazaletes
                                </DialogTitle>
                                <DialogDescription>
                                  Registra los brazaletes utilizados en esta
                                  salida
                                </DialogDescription>
                              </DialogHeader>
                              <UsoBrazaletesForm
                                onSubmit={handleRegistrarUso}
                                loading={registrandoUso}
                                error={usoError}
                                salidasDisponibles={[
                                  {
                                    id: salida.id,
                                    fecha: salida.fecha.toString(),
                                    numero_pasajeros: salida.numero_pasajeros,
                                    embarcacion_nombre:
                                      salida.embarcacion?.nombre,
                                    destino: salida.destino,
                                  },
                                ]}
                              />
                            </DialogContent>
                          </Dialog>
                        )}

                        <Button variant="outline" size="sm" asChild>
                          <Link href={`/prestador/salidas/${salida.id}`}>
                            Ver Detalles
                          </Link>
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-gray-50 rounded-lg">
              <Ship className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No tienes salidas registradas
              </h3>
              <p className="text-gray-600 mb-4">
                Crea tu primera salida para comenzar a gestionar tus servicios
                turísticos
              </p>
              <Button
                className="bg-[var(--isla-teal)] hover:bg-[var(--isla-teal-dark)] text-white"
                asChild
              >
                <Link href="/prestador/nueva-salida">
                  <Plus className="w-4 h-4 mr-2" />
                  Crear Primera Salida
                </Link>
              </Button>
            </div>
          )}
        </div>
      </div>
      );
    </div>
  );
}
