"use client";

import { useEffect, useState, useCallback } from "react";
import { useAuth, useRouteProtection } from "@/lib/contexts/AuthContext";
import {
  getEstadisticasBrazaletes,
  getReporteUtilizacionBrazaletes,
} from "@/actions/brazaletes";
import {
  EstadisticasBrazaletes,
  ReporteUtilizacionBrazaletes,
} from "@/lib/types/brazaletes";
import {
  ReportesHeader,
  FiltrosReportes,
  PeriodoAnalisis,
  MetricasCards,
  DistribucionTipo,
  DistribucionNacionalidad,
  IngresosPorMes,
  ReporteDetallado,
  EmptyState,
  LoadingState,
  AuthLoadingState,
  ErrorAlert,
} from "./components";

export default function ReportesBrazaletesPage() {
  const { isLoading, isAuthorized } = useRouteProtection("conanp");
  const { user } = useAuth();

  // Estados para datos
  const [estadisticas, setEstadisticas] =
    useState<EstadisticasBrazaletes | null>(null);
  const [reporteUtilizacion, setReporteUtilizacion] =
    useState<ReporteUtilizacionBrazaletes | null>(null);

  // Estados para filtros
  const [fechaInicio, setFechaInicio] = useState(
    new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0]
  );
  const [fechaFin, setFechaFin] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [prestadorFiltro, setPrestadorFiltro] = useState<string>("todos");

  // Estados para UI
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [generandoReporte, setGenerandoReporte] = useState(false);

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      console.log("📊 Reportes Brazaletes: Cargando datos...");

      const filtros = {
        fecha_inicio: fechaInicio,
        fecha_fin: fechaFin,
        tipo: "universal" as const, // Todos los brazaletes son universales
        prestador_id: prestadorFiltro === "todos" ? undefined : prestadorFiltro,
      };

      // Cargar datos en paralelo
      const [estadisticasResult, reporteResult] = await Promise.all([
        getEstadisticasBrazaletes(filtros),
        getReporteUtilizacionBrazaletes(filtros),
      ]);

      if (estadisticasResult.success && estadisticasResult.data) {
        setEstadisticas(estadisticasResult.data);
        console.log(
          "📊 Reportes Brazaletes: Estadísticas cargadas:",
          estadisticasResult.data
        );
      }

      if (reporteResult.success && reporteResult.data) {
        setReporteUtilizacion(reporteResult.data);
        console.log(
          "📊 Reportes Brazaletes: Reporte cargado:",
          reporteResult.data
        );
      }
    } catch (error) {
      console.error("📊 Reportes Brazaletes: Error al cargar datos:", error);
      setError(error instanceof Error ? error.message : "Error desconocido");
    } finally {
      setLoading(false);
    }
  }, [fechaInicio, fechaFin, prestadorFiltro]);

  useEffect(() => {
    if (!isLoading && isAuthorized && user) {
      loadData();
    }
  }, [isLoading, isAuthorized, user, loadData]);

  const handleGenerarReporte = async () => {
    setGenerandoReporte(true);
    try {
      await loadData();
    } finally {
      setGenerandoReporte(false);
    }
  };

  // Mostrar loading mientras se verifica la autenticación
  if (isLoading) {
    return <AuthLoadingState />;
  }

  // Si no está autorizado, el hook ya manejó la redirección
  if (!isAuthorized) {
    return null;
  }

  return (
    <div className="space-y-6">
      <ReportesHeader loading={loading} onRefresh={loadData} />

      <ErrorAlert error={error} />

      <FiltrosReportes
        fechaInicio={fechaInicio}
        fechaFin={fechaFin}
        prestadorFiltro={prestadorFiltro}
        generandoReporte={generandoReporte}
        onFechaInicioChange={setFechaInicio}
        onFechaFinChange={setFechaFin}
        onPrestadorFiltroChange={setPrestadorFiltro}
        onGenerarReporte={handleGenerarReporte}
      />

      {loading ? (
        <LoadingState />
      ) : (
        <div className="space-y-6">
          {estadisticas && (
            <>
              <PeriodoAnalisis estadisticas={estadisticas} />
              <MetricasCards estadisticas={estadisticas} />
              <DistribucionTipo estadisticas={estadisticas} />
              <DistribucionNacionalidad estadisticas={estadisticas} />
              <IngresosPorMes estadisticas={estadisticas} />
            </>
          )}

          {reporteUtilizacion && (
            <ReporteDetallado reporteUtilizacion={reporteUtilizacion} />
          )}

          {!estadisticas && !reporteUtilizacion && <EmptyState />}
        </div>
      )}
    </div>
  );
}
