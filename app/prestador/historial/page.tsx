"use client";

import { useEffect, useState, useCallback } from "react";
import { useAuth, useRouteProtection } from "@/lib/contexts/AuthContext";
import { clientLogger } from "@/lib/logger-client";
import { getMisSalidas, getMisEstadisticas } from "@/actions/prestador";
import { RefreshCw } from "lucide-react";
import { Salida } from "@/lib/types/salida";
import {
  HeaderHistorial,
  EstadosHistorial,
  TablaHistorial,
} from "./components";
import {
  EstadisticasHistorial,
  HistorialStats,
} from "./components/EstadisticasHistorial";
import {
  FiltrosHistorial,
  HistorialFilters,
} from "./components/FiltrosHistorial";
import { PaginacionHistorial } from "./components/PaginacionHistorial";

// Utilidades locales
const getDefaultFilters = (): HistorialFilters => {
  const fechaFin = new Date();
  const fechaInicio = new Date();
  fechaInicio.setDate(fechaFin.getDate() - 30);

  // Extraer fechas sin conversión de timezone
  const yearFin = fechaFin.getFullYear();
  const monthFin = String(fechaFin.getMonth() + 1).padStart(2, "0");
  const dayFin = String(fechaFin.getDate()).padStart(2, "0");

  const yearInicio = fechaInicio.getFullYear();
  const monthInicio = String(fechaInicio.getMonth() + 1).padStart(2, "0");
  const dayInicio = String(fechaInicio.getDate()).padStart(2, "0");

  return {
    fechaInicio: `${yearInicio}-${monthInicio}-${dayInicio}`,
    fechaFin: `${yearFin}-${monthFin}-${dayFin}`,
    estado: "todos",
    page: 1,
    limit: 10,
  };
};

const getCleanFilters = (): HistorialFilters => ({
  fechaInicio: "",
  fechaFin: "",
  estado: "todos",
  page: 1,
  limit: 10,
});

export default function HistorialPage() {
  const { isLoading, isAuthorized } = useRouteProtection("prestador");
  const { user } = useAuth();

  const [salidas, setSalidas] = useState<Salida[]>([]);
  const [stats, setStats] = useState<HistorialStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalSalidas, setTotalSalidas] = useState(0);

  const [filters, setFilters] = useState<HistorialFilters>(getDefaultFilters());

  const loadData = useCallback(async (filtersToUse: HistorialFilters) => {
    try {
      setLoading(true);
      setError("");

      // Cargar salidas con filtros
      const salidasResult = await getMisSalidas({
        page: filtersToUse.page,
        limit: filtersToUse.limit,
        fecha: filtersToUse.fechaInicio,
        estado:
          filtersToUse.estado === "todos" ? undefined : filtersToUse.estado,
      });

      if (salidasResult.success && salidasResult.data) {
        setSalidas(salidasResult.data.salidas || []);
        setTotalPages(salidasResult.data.pagination?.totalPages || 1);
        setTotalSalidas(salidasResult.data.pagination?.total || 0);
      } else {
        throw new Error("Error al cargar salidas");
      }

      // Intentar cargar estadísticas (opcional, puede fallar si no hay permisos)
      try {
        const statsResult = await getMisEstadisticas(
          filtersToUse.fechaInicio,
          filtersToUse.fechaFin
        );

        if (statsResult.success && statsResult.data) {
          setStats(statsResult.data.estadisticas);
        }
      } catch (statsError) {
        clientLogger.error(
          "Error al cargar estadísticas del historial (opcional)",
          statsError,
          { userId: user?.id }
        );
        // Las estadísticas son opcionales, no fallar la operación completa
        setStats(null);
      }
    } catch (error) {
      const errorMsg =
        error instanceof Error ? error.message : "Error desconocido";
      clientLogger.error("Error al cargar historial de prestador", error, {
        userId: user?.id,
        filtros: filtersToUse,
      });
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!isLoading && isAuthorized && user) {
      const defaultFilters = getDefaultFilters();
      setFilters(defaultFilters);
      loadData(defaultFilters);
    }
  }, [isLoading, isAuthorized, user, loadData]);

  const handleFilterChange = (
    key: keyof HistorialFilters,
    value: string | number
  ) => {
    const newFilters = { ...filters, [key]: value, page: 1 }; // Reset a página 1
    setFilters(newFilters);
    setCurrentPage(1);
    loadData(newFilters);
  };

  const handlePageChange = (newPage: number) => {
    const newFilters = { ...filters, page: newPage };
    setFilters(newFilters);
    setCurrentPage(newPage);
    loadData(newFilters);
  };

  const handleActualizar = () => {
    loadData(filters);
  };

  const handleLimpiarFiltros = () => {
    const cleanFilters = getCleanFilters();
    setFilters(cleanFilters);
    setCurrentPage(1);
    loadData(cleanFilters);
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
    <div className="space-y-8">
      {/* Header */}
      <HeaderHistorial
        totalSalidas={totalSalidas}
        loading={loading}
        onActualizar={handleActualizar}
        onLimpiarFiltros={handleLimpiarFiltros}
      />

      <div className="space-y-6">
        {/* Estados especiales */}
        <EstadosHistorial
          loading={loading}
          error={error}
          salidasLength={salidas.length}
          onLimpiarFiltros={handleLimpiarFiltros}
        />

        {/* Estadísticas del período */}
        <EstadisticasHistorial stats={stats} />

        {/* Filtros */}
        <FiltrosHistorial
          filters={filters}
          onFilterChange={handleFilterChange}
        />

        {/* Lista de salidas */}
        {!loading && !error && salidas.length > 0 && (
          <div className="space-y-4">
            <TablaHistorial salidas={salidas} />

            {/* Paginación */}
            <PaginacionHistorial
              currentPage={currentPage}
              totalPages={totalPages}
              totalSalidas={totalSalidas}
              filters={filters}
              onPageChange={handlePageChange}
            />
          </div>
        )}
      </div>
    </div>
  );
}
