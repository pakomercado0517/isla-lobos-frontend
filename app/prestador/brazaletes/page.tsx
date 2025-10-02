"use client";

import { useEffect, useState } from "react";
import { useAuth, useRouteProtection } from "@/lib/contexts/AuthContext";
import { getMisBrazaletes } from "@/actions/brazaletes";
import { PageHeader } from "@/components/ui/page-header";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import {
  Package,
  RefreshCw,
  AlertTriangle,
  TrendingUp,
  Calendar,
} from "lucide-react";
import { BrazaletesPrestador } from "@/lib/types/brazaletes";

export default function PrestadorBrazaletesPage() {
  const { isLoading, isAuthorized } = useRouteProtection("prestador");
  const { user } = useAuth();

  // Estados para datos
  const [brazaletesData, setBrazaletesData] =
    useState<BrazaletesPrestador | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!isLoading && isAuthorized && user) {
      loadData();
    }
  }, [isLoading, isAuthorized, user]);

  const loadData = async () => {
    try {
      setLoading(true);
      setError("");

      console.log("🎫 Prestador Brazaletes: Cargando datos...");

      const result = await getMisBrazaletes();

      if (result.success && result.data) {
        setBrazaletesData(result.data);
        console.log("🎫 Prestador Brazaletes: Datos cargados:", result.data);
      } else {
        throw new Error(result.message || "Error al cargar brazaletes");
      }
    } catch (error) {
      console.error("🎫 Prestador Brazaletes: Error al cargar datos:", error);
      setError(error instanceof Error ? error.message : "Error desconocido");
    } finally {
      setLoading(false);
    }
  };

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

  console.log("brazaletesData", brazaletesData);

  return (
    <div className="min-h-screen bg-gray-50/50">
      <PageHeader
        title="Mis Brazaletes"
        description="Gestiona tus brazaletes para las salidas turísticas"
        breadcrumbs={[
          { label: "Dashboard", href: "/prestador" },
          { label: "Brazaletes" },
        ]}
        backHref="/prestador"
        backLabel="Volver al Dashboard"
        onRefresh={loadData}
        refreshing={loading}
        badge={
          brazaletesData
            ? {
                text: `${brazaletesData.detalle.length} brazaletes`,
                variant: "secondary",
              }
            : undefined
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

        {/* Contenido principal */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-4 text-[var(--isla-teal)]" />
              <p className="text-gray-600">Cargando tus brazaletes...</p>
            </div>
          </div>
        ) : brazaletesData ? (
          <div className="space-y-6">
            {/* Resumen general */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-green-50 p-6 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <Package className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm text-green-600 font-medium">
                      Disponibles
                    </p>
                    <p className="text-2xl font-bold text-green-900">
                      {brazaletesData.brazaletes.disponibles}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-yellow-50 p-6 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-yellow-100 rounded-lg">
                    <Calendar className="w-6 h-6 text-yellow-600" />
                  </div>
                  <div>
                    <p className="text-sm text-yellow-600 font-medium">
                      Asignados
                    </p>
                    <p className="text-2xl font-bold text-yellow-900">
                      {brazaletesData.brazaletes.asignados}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-purple-50 p-6 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <TrendingUp className="w-6 h-6 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-sm text-purple-600 font-medium">
                      Utilizados
                    </p>
                    <p className="text-2xl font-bold text-purple-900">
                      {brazaletesData.brazaletes.utilizados}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Distribución por tipo */}
            <div className="bg-white p-6 rounded-lg border">
              <h3 className="text-lg font-semibold mb-4">
                Distribución por Tipo
              </h3>
              <div className="grid grid-cols-1 gap-6">
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-4 bg-purple-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <Badge
                        variant="outline"
                        className="bg-purple-100 text-purple-700"
                      >
                        🎫 Universal
                      </Badge>
                      <span className="font-medium">
                        Brazaletes Universales
                      </span>
                    </div>
                    <span className="text-2xl font-bold text-purple-600">
                      {brazaletesData.brazaletes.por_tipo.universal}
                    </span>
                  </div>
                </div>
              </div>
              <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-600">
                  Los brazaletes universales son válidos para todas las áreas
                  naturales protegidas disponibles.
                </p>
              </div>
            </div>

            {/* Lista detallada de brazaletes */}
            <div className="bg-white p-6 rounded-lg border">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Detalle de Brazaletes</h3>
                <Badge variant="outline">
                  {brazaletesData.detalle.length} brazaletes
                </Badge>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {brazaletesData.detalle.map((brazalete) => (
                  <div
                    key={brazalete.id}
                    className="p-4 border rounded-lg hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Badge
                          variant="outline"
                          className="bg-purple-50 text-purple-700"
                        >
                          🎫 Universal
                        </Badge>
                        <span className="font-mono text-sm font-medium">
                          {brazalete.codigo}
                        </span>
                      </div>
                      <Badge
                        className={
                          brazalete.estado === "disponible"
                            ? "bg-green-100 text-green-800"
                            : brazalete.estado === "asignado"
                            ? "bg-yellow-100 text-yellow-800"
                            : brazalete.estado === "utilizado"
                            ? "bg-purple-100 text-purple-800"
                            : "bg-red-100 text-red-800"
                        }
                      >
                        {brazalete.estado}
                      </Badge>
                    </div>

                    <div className="space-y-1 text-sm text-gray-600">
                      <div className="flex justify-between">
                        <span>Precio:</span>
                        <span className="font-medium">${brazalete.precio}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Lote:</span>
                        <span className="font-medium">
                          {brazalete.lote?.numero_lote}
                        </span>
                      </div>
                      {brazalete.fecha_asignacion && (
                        <div className="flex justify-between">
                          <span>Asignado:</span>
                          <span className="font-medium">
                            {new Date(
                              brazalete.fecha_asignacion
                            ).toLocaleDateString("es-MX")}
                          </span>
                        </div>
                      )}
                      {brazalete.fecha_uso && (
                        <div className="flex justify-between">
                          <span>Utilizado:</span>
                          <span className="font-medium">
                            {new Date(brazalete.fecha_uso).toLocaleDateString(
                              "es-MX"
                            )}
                          </span>
                        </div>
                      )}
                      {brazalete.salida && (
                        <div className="flex justify-between">
                          <span>Salida:</span>
                          <span className="font-medium">
                            {brazalete.salida.numero_pasajeros} pasajeros
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {brazaletesData.detalle.length === 0 && (
                <div className="text-center py-8">
                  <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    No tienes brazaletes asignados
                  </h3>
                  <p className="text-gray-600">
                    Contacta a CONANP para obtener brazaletes para tus salidas
                  </p>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="text-center py-12">
            <AlertTriangle className="w-12 h-12 text-red-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Error al cargar datos
            </h3>
            <p className="text-gray-600 mb-4">
              No se pudieron cargar tus brazaletes
            </p>
            <Button onClick={loadData}>
              <RefreshCw className="w-4 h-4 mr-2" />
              Reintentar
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
