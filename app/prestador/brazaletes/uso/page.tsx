"use client";

import { useEffect, useState } from "react";
import { useAuth, useRouteProtection } from "@/lib/contexts/AuthContext";
import {
  getMisBrazaletes,
  marcarBrazaletesUtilizados,
} from "@/actions/brazaletes";
import { getMisSalidas } from "@/actions/prestador";
import { UsoBrazaletesForm } from "@/components/brazaletes/UsoBrazaletesForm";
import { UsoBrazaletesCard } from "@/components/brazaletes/UsoBrazaletesCard";
import { BrazaletesCardUso } from "@/lib/types/brazaletes";
import { Button } from "@/components/ui/button";
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
import { Badge } from "@/components/ui/badge";
import {
  Package,
  Plus,
  RefreshCw,
  AlertTriangle,
  TrendingUp,
  Calendar,
} from "lucide-react";
import {
  BrazaletesPrestador,
  UsoBrazaleteFormData,
  UsoBrazaleteSalida,
} from "@/lib/types/brazaletes";
import { formatearFechaSalida } from "@/lib/utils";
import { Salida } from "@/lib/types/salida";

export default function UsoBrazaletesPage() {
  const { isLoading, isAuthorized } = useRouteProtection("prestador");
  const { user } = useAuth();

  // Estados para datos
  const [brazaletesData, setBrazaletesData] =
    useState<BrazaletesPrestador | null>(null);
  const [salidasDisponibles, setSalidasDisponibles] = useState<Salida[]>([]);
  const [registrosUso, setRegistrosUso] = useState<UsoBrazaleteSalida[]>([]);

  // Estados para UI
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showUsoForm, setShowUsoForm] = useState(false);
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

      console.log("🎫 Uso Brazaletes: Cargando datos...");

      // Cargar datos en paralelo
      const [brazaletesResult, salidasResult] = await Promise.all([
        getMisBrazaletes(),
        getMisSalidas({ limit: 50 }), // Todas las salidas (se filtrarán después)
      ]);

      if (brazaletesResult.success && brazaletesResult.data) {
        setBrazaletesData(brazaletesResult.data);
        console.log(
          "🎫 Uso Brazaletes: Brazaletes cargados:",
          brazaletesResult.data
        );
      }

      if (salidasResult.success && salidasResult.data) {
        setSalidasDisponibles(salidasResult.data.salidas || []);
        console.log(
          "🎫 Uso Brazaletes: Salidas cargadas:",
          salidasResult.data.salidas?.length
        );
      }

      // Cargar registros de uso (esto se implementaría con un endpoint específico)
      setRegistrosUso([]);
    } catch (error) {
      console.error("🎫 Uso Brazaletes: Error al cargar datos:", error);
      setError(error instanceof Error ? error.message : "Error desconocido");
    } finally {
      setLoading(false);
    }
  };

  const handleRegistrarUso = async (data: UsoBrazaleteFormData) => {
    try {
      setRegistrandoUso(true);
      setUsoError("");

      console.log("🎫 Uso Brazaletes: Registrando uso:", data);

      // Convertir UsoBrazaleteFormData a formato esperado por marcarBrazaletesUtilizados
      const fechaActual = new Date().toISOString().split("T")[0]; // YYYY-MM-DD
      const result = await marcarBrazaletesUtilizados({
        salida_id: data.salida_id,
        fecha_uso: fechaActual,
      });

      if (result.success) {
        console.log("🎫 Uso Brazaletes: Uso registrado exitosamente");
        setShowUsoForm(false);
        await loadData(); // Recargar datos
      } else {
        throw new Error(result.message || "Error al registrar uso");
      }
    } catch (error) {
      console.error("🎫 Uso Brazaletes: Error al registrar uso:", error);
      setUsoError(error instanceof Error ? error.message : "Error desconocido");
    } finally {
      setRegistrandoUso(false);
    }
  };

  console.log("salidasDisponibles", salidasDisponibles);

  // Filtrar brazaletes disponibles para uso
  // Los brazaletes "asignados" son los que el prestador compró y aún no ha usado
  const brazaletesDisponibles =
    brazaletesData?.detalle.filter((b) => b.estado === "asignado") || [];

  // Filtrar salidas que pueden tener brazaletes registrados
  // Se pueden registrar brazaletes en salidas programadas, en curso o completadas
  const salidasConBrazaletes =
    salidasDisponibles.filter(
      (salida) =>
        salida.numero_pasajeros > 0 &&
        (salida.estado === "programada" ||
          salida.estado === "en_curso" ||
          salida.estado === "completada")
    ) || [];

  // Mostrar loading mientras se verifica la autenticación
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

  // Si no está autorizado, el hook ya manejó la redirección
  if (!isAuthorized) {
    return null;
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-[var(--isla-dark-teal)]">
            Registro de Uso de Brazaletes
          </h1>
          <p className="text-gray-600 mt-2">
            Registra el uso de brazaletes en tus salidas turísticas
          </p>
        </div>
        <div className="flex items-center gap-3">
          {brazaletesData && (
            <Badge
              variant={
                brazaletesDisponibles.length > 0 ? "secondary" : "destructive"
              }
              className="text-sm"
            >
              {brazaletesDisponibles.length} disponibles
            </Badge>
          )}
          <Button
            variant="outline"
            size="sm"
            onClick={loadData}
            disabled={loading}
            className="border-[var(--isla-teal)] text-[var(--isla-teal)] hover:bg-[var(--isla-teal)] hover:text-white"
          >
            <RefreshCw
              className={`w-4 h-4 mr-2 ${loading ? "animate-spin" : ""}`}
            />
            Actualizar
          </Button>
        </div>
      </div>

      <div className="space-y-6">
        {/* Error general */}
        {error && (
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Contenido principal */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-4 text-[var(--isla-teal)]" />
              <p className="text-gray-600">Cargando datos de brazaletes...</p>
            </div>
          </div>
        ) : (
          <Tabs defaultValue="registro" className="space-y-6">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="registro">Nuevo Registro</TabsTrigger>
              <TabsTrigger value="historial">
                Historial ({registrosUso.length})
              </TabsTrigger>
            </TabsList>

            {/* Tab de Registro */}
            <TabsContent value="registro" className="space-y-6">
              {/* Resumen de brazaletes disponibles */}
              {brazaletesData && (
                <div className="bg-white p-6 rounded-lg border">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold">
                      Brazaletes Disponibles
                    </h3>
                    <Badge variant="outline">
                      {brazaletesDisponibles.length} disponibles
                    </Badge>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">
                        {brazaletesData.brazaletes.disponibles}
                      </div>
                      <div className="text-sm text-gray-600">
                        Total Disponibles
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Salidas disponibles */}
              <div className="bg-white p-6 rounded-lg border">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold">Salidas Disponibles</h3>
                  <Badge variant="outline">
                    {salidasConBrazaletes.length} salidas
                  </Badge>
                </div>

                {salidasConBrazaletes && salidasConBrazaletes.length > 0 ? (
                  <div className="space-y-3">
                    {salidasConBrazaletes.slice(0, 5).map((salida) => (
                      <div
                        key={salida.id}
                        className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                      >
                        <div>
                          <p className="font-medium">
                            {formatearFechaSalida(salida.fecha)}
                          </p>
                          <p className="text-sm text-gray-600">
                            {salida.numero_pasajeros} pasajeros
                            {salida.embarcacion?.nombre &&
                              ` • ${salida.embarcacion.nombre}`}
                          </p>
                        </div>
                        <Badge variant="outline">{salida.estado}</Badge>
                      </div>
                    ))}
                    {salidasConBrazaletes.length > 5 && (
                      <div className="text-center text-sm text-gray-500">
                        ... y {salidasConBrazaletes.length - 5} salidas más
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      No hay salidas disponibles
                    </h3>
                    <p className="text-gray-600">
                      Registra algunas salidas (programadas, en curso o
                      completadas) para poder registrar el uso de brazaletes
                    </p>
                  </div>
                )}
              </div>

              {/* Formulario de registro */}
              {brazaletesDisponibles.length > 0 &&
              salidasConBrazaletes &&
              salidasConBrazaletes.length > 0 ? (
                <div className="bg-white p-6 rounded-lg border">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-semibold">
                      Registrar Uso de Brazaletes
                    </h3>
                    <Dialog open={showUsoForm} onOpenChange={setShowUsoForm}>
                      <DialogTrigger asChild>
                        <Button>
                          <Plus className="w-4 h-4 mr-2" />
                          Nuevo Registro
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
                        <DialogHeader>
                          <DialogTitle>Registrar Uso de Brazaletes</DialogTitle>
                          <DialogDescription>
                            Registra los brazaletes utilizados en una salida
                            turística
                          </DialogDescription>
                        </DialogHeader>
                        <UsoBrazaletesForm
                          onSubmit={handleRegistrarUso}
                          loading={registrandoUso}
                          error={usoError}
                          salidaId=""
                          salidaFecha=""
                          brazaletesDisponibles={brazaletesDisponibles}
                        />
                      </DialogContent>
                    </Dialog>
                  </div>

                  <div className="text-center py-8">
                    <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      ¿Listo para registrar brazaletes?
                    </h3>
                    <p className="text-gray-600 mb-4">
                      Haz clic en &quot;Nuevo Registro&quot; para comenzar a
                      registrar el uso de brazaletes
                    </p>
                  </div>
                </div>
              ) : (
                <div className="text-center py-12">
                  <AlertTriangle className="w-12 h-12 text-yellow-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    No puedes registrar brazaletes en este momento
                  </h3>
                  <p className="text-gray-600 mb-4">
                    {brazaletesDisponibles.length === 0
                      ? "No tienes brazaletes disponibles para registrar. Debes comprar brazaletes primero."
                      : "No tienes salidas programadas, en curso o completadas disponibles. Registra una salida primero."}
                  </p>
                  <Button onClick={loadData}>
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Verificar Estado
                  </Button>
                </div>
              )}
            </TabsContent>

            {/* Tab de Historial */}
            <TabsContent value="historial" className="space-y-6">
              {registrosUso.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {registrosUso.map((registro, index) => (
                    <UsoBrazaletesCard
                      key={registro.salida_id || `registro-${index}`}
                      uso={registro as unknown as BrazaletesCardUso}
                      onVerDetalles={(registro) => {
                        console.log("Ver detalles del registro:", registro);
                        // TODO: Implementar vista de detalles
                      }}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <TrendingUp className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    No hay registros de uso
                  </h3>
                  <p className="text-gray-600">
                    Los registros de uso de brazaletes aparecerán aquí una vez
                    que comiences a registrar
                  </p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        )}
      </div>
    </div>
  );
}
