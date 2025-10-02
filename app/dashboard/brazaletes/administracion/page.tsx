"use client";

import { useEffect, useState } from "react";
import { useAuth, useRouteProtection } from "@/lib/contexts/AuthContext";
import {
  getInventarioBrazaletes,
  getLotesBrazaletes,
  getEstadisticasBrazaletes,
} from "@/actions/brazaletes";
import { PanelAdministracion } from "@/components/brazaletes/PanelAdministracion";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertTriangle, Shield } from "lucide-react";

export default function AdministracionBrazaletesPage() {
  const { isLoading, isAuthorized } = useRouteProtection("conanp");
  const { user } = useAuth();

  const [estadisticas, setEstadisticas] = useState<{
    totalBrazaletes: number;
    totalLotes: number;
    totalVentas: number;
    totalUsos: number;
    ultimaActualizacion: string;
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!isLoading && isAuthorized && user) {
      loadEstadisticas();
    }
  }, [isLoading, isAuthorized, user]);

  const loadEstadisticas = async () => {
    try {
      setLoading(true);
      setError("");

      console.log("🔧 Administración: Cargando estadísticas...");

      const [inventarioResult, lotesResult, estadisticasResult] =
        await Promise.all([
          getInventarioBrazaletes(),
          getLotesBrazaletes({ limit: 1 }), // Solo necesitamos el total
          getEstadisticasBrazaletes(),
        ]);

      let totalBrazaletes = 0;
      let totalLotes = 0;
      let totalVentas = 0;
      let totalUsos = 0;

      if (inventarioResult.success && inventarioResult.data) {
        totalBrazaletes =
          inventarioResult.data.total_disponibles +
          inventarioResult.data.por_tipo.isla +
          inventarioResult.data.por_tipo.arrecife;
      }

      if (lotesResult.success && lotesResult.data) {
        totalLotes = lotesResult.data.pagination?.total || 0;
      }

      if (estadisticasResult.success && estadisticasResult.data) {
        totalVentas = estadisticasResult.data.inventario?.total_vendidos || 0;
        totalUsos = estadisticasResult.data.inventario?.total_utilizados || 0;
      }

      setEstadisticas({
        totalBrazaletes,
        totalLotes,
        totalVentas,
        totalUsos,
        ultimaActualizacion: new Date().toISOString(),
      });

      console.log("🔧 Administración: Estadísticas cargadas");
    } catch (error) {
      console.error("🔧 Administración: Error al cargar estadísticas:", error);
      setError(error instanceof Error ? error.message : "Error desconocido");
    } finally {
      setLoading(false);
    }
  };

  const handleOperacionMasiva = async (operacion: string, datos: any) => {
    console.log(
      "🔧 Administración: Ejecutando operación masiva:",
      operacion,
      datos
    );

    // Aquí se implementarían las operaciones masivas reales
    // Por ahora solo simulamos la operación
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // Recargar estadísticas después de la operación
    await loadEstadisticas();
  };

  const handleExportarDatos = async (tipo: string) => {
    console.log("🔧 Administración: Exportando datos:", tipo);

    // Simular exportación
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // En una implementación real, aquí se generaría y descargaría el archivo
    alert(`Datos de ${tipo} exportados exitosamente`);
  };

  const handleImportarDatos = async (archivo: File) => {
    console.log("🔧 Administración: Importando archivo:", archivo.name);

    // Simular importación
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // Recargar estadísticas después de la importación
    await loadEstadisticas();

    alert(`Archivo ${archivo.name} importado exitosamente`);
  };

  const handleLimpiarCache = async () => {
    console.log("🔧 Administración: Limpiando cache...");

    // Simular limpieza de cache
    await new Promise((resolve) => setTimeout(resolve, 1000));

    alert("Cache limpiado exitosamente");
  };

  const handleOptimizarBD = async () => {
    console.log("🔧 Administración: Optimizando base de datos...");

    // Simular optimización
    await new Promise((resolve) => setTimeout(resolve, 2000));

    alert("Base de datos optimizada exitosamente");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Shield className="w-8 h-8 animate-pulse mx-auto mb-4 text-[var(--isla-teal)]" />
          <p className="text-gray-600">Cargando panel de administración...</p>
        </div>
      </div>
    );
  }

  if (!isAuthorized) {
    return null;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Administración de Brazaletes
          </h1>
          <p className="text-gray-600 mt-1">
            Herramientas avanzadas de administración y mantenimiento del sistema
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Shield className="w-6 h-6 text-[var(--isla-teal)]" />
          <span className="text-sm text-gray-600">Panel de Administración</span>
        </div>
      </div>

      {/* Error general */}
      {error && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Advertencia de seguridad */}
      <Alert>
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>
          <strong>Advertencia:</strong> Las operaciones de administración pueden
          afectar múltiples registros. Asegúrate de entender las consecuencias
          antes de ejecutar cualquier operación.
        </AlertDescription>
      </Alert>

      {/* Panel de administración */}
      <PanelAdministracion
        onOperacionMasiva={handleOperacionMasiva}
        onExportarDatos={handleExportarDatos}
        onImportarDatos={handleImportarDatos}
        onLimpiarCache={handleLimpiarCache}
        onOptimizarBD={handleOptimizarBD}
        estadisticas={estadisticas}
      />

      {/* Información adicional */}
      <div className="bg-blue-50 p-6 rounded-lg">
        <h3 className="font-semibold text-blue-900 mb-2">
          Información del Sistema
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-blue-800">
          <div>
            <p>
              <strong>Usuario:</strong> {user?.nombre}
            </p>
            <p>
              <strong>Rol:</strong> {user?.rol}
            </p>
          </div>
          <div>
            <p>
              <strong>Última actualización:</strong>{" "}
              {estadisticas?.ultimaActualizacion
                ? new Date(estadisticas.ultimaActualizacion).toLocaleString(
                    "es-MX"
                  )
                : "N/A"}
            </p>
            <p>
              <strong>Estado del sistema:</strong>{" "}
              <span className="text-green-600">Operativo</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

