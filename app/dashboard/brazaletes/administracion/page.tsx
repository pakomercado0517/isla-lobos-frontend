/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { useEffect, useState } from "react";
import { useAuth, useRouteProtection } from "@/lib/contexts/AuthContext";
import { clientLogger } from "@/lib/logger-client";
import { PanelAdministracion } from "@/components/brazaletes/PanelAdministracion";
import {
  AdministracionHeader,
  AdvertenciaSeguridad,
  InformacionSistema,
  AuthLoadingState,
  ErrorAlert,
  EstadisticasService,
  OperacionesService,
  type EstadisticasAdministracion,
} from "./components";

export default function AdministracionBrazaletesPage() {
  const { isLoading, isAuthorized } = useRouteProtection("conanp");
  const { user } = useAuth();

  const [estadisticas, setEstadisticas] = useState<
    EstadisticasAdministracion | undefined
  >(undefined);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!isLoading && isAuthorized && user) {
      loadEstadisticas();
    }
  }, [isLoading, isAuthorized, user]);

  const loadEstadisticas = async () => {
    try {
      setError("");

      const estadisticasFinales = await EstadisticasService.loadEstadisticas();
      setEstadisticas(estadisticasFinales);
    } catch (error) {
      const errorMsg =
        error instanceof Error ? error.message : "Error desconocido";
      clientLogger.error(
        "Error al cargar estadísticas de administración",
        error,
        { userId: user?.id }
      );
      setError(errorMsg);
    }
  };

  const handleOperacionMasiva = async (operacion: string, datos: unknown) => {
    await OperacionesService.ejecutarOperacionMasiva(operacion, datos);
    await loadEstadisticas(); // Recargar estadísticas después de la operación
  };

  const handleExportarDatos = async (tipo: string) => {
    await OperacionesService.exportarDatos(tipo);
  };

  const handleImportarDatos = async (archivo: File) => {
    await OperacionesService.importarDatos(archivo);
    await loadEstadisticas(); // Recargar estadísticas después de la importación
  };

  const handleLimpiarCache = async () => {
    await OperacionesService.limpiarCache();
  };

  const handleOptimizarBD = async () => {
    await OperacionesService.optimizarBD();
  };

  if (isLoading) {
    return <AuthLoadingState />;
  }

  if (!isAuthorized) {
    return null;
  }

  return (
    <div className="space-y-6">
      <AdministracionHeader />

      <ErrorAlert error={error} />

      <AdvertenciaSeguridad />

      {/* Panel de administración */}
      <PanelAdministracion
        onOperacionMasiva={handleOperacionMasiva}
        onExportarDatos={handleExportarDatos}
        onImportarDatos={handleImportarDatos}
        onLimpiarCache={handleLimpiarCache}
        onOptimizarBD={handleOptimizarBD}
        estadisticas={estadisticas}
      />

      <InformacionSistema user={user} estadisticas={estadisticas} />
    </div>
  );
}
