"use client";

import { useEffect, useState, useCallback } from "react";
import { useAuth, useRouteProtection } from "@/lib/contexts/AuthContext";
import { clientLogger } from "@/lib/logger-client";
import { buscarBrazaletes, getLotesBrazaletes } from "@/actions/brazaletes";
import { getUsuarios } from "@/actions/dashboard";
import { BusquedaAvanzada } from "@/components/brazaletes/BusquedaAvanzada";
import { ResultadosBusqueda } from "@/components/brazaletes/ResultadosBusqueda";
import { User } from "@/lib/types/auth";
import {
  FiltrosBrazaletes,
  Brazalete,
  RespuestaBusquedaBrazaletes,
} from "@/lib/types/brazaletes";
import {
  BusquedaHeader,
  EstadoInicial,
  AuthLoadingState,
  ErrorAlert,
  ExportacionService,
  LocalStorageService,
  type FiltroGuardado,
} from "./components";

export default function BusquedaBrazaletesPage() {
  const { isLoading, isAuthorized } = useRouteProtection("conanp");
  const { user } = useAuth();

  const [brazaletes, setBrazaletes] = useState<Brazalete[]>([]);
  const [estadisticas, setEstadisticas] =
    useState<RespuestaBusquedaBrazaletes["estadisticas"]>();
  const [pagination, setPagination] =
    useState<RespuestaBusquedaBrazaletes["pagination"]>();
  const [filtrosAplicados, setFiltrosAplicados] =
    useState<RespuestaBusquedaBrazaletes["filtros_aplicados"]>();
  const [prestadores, setPrestadores] = useState<
    Array<{ id: string; nombre: string }>
  >([]);
  const [lotes, setLotes] = useState<
    Array<{ id: string; numero_lote: string }>
  >([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [filtrosActivos, setFiltrosActivos] = useState<FiltrosBrazaletes>({});
  const [filtrosGuardados, setFiltrosGuardados] = useState<FiltroGuardado[]>(
    []
  );

  const loadInitialData = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      // Cargar prestadores y lotes para los filtros
      const [prestadoresResult, lotesResult] = await Promise.all([
        getUsuarios(1, 100, { rol: "prestador", activo: true }),
        getLotesBrazaletes({ limit: 100 }),
      ]);

      if (prestadoresResult.success && prestadoresResult.data) {
        const prestadoresData =
          prestadoresResult.data.users?.map((usuario: User) => ({
            id: usuario.id,
            nombre: usuario.nombre,
          })) || [];
        setPrestadores(prestadoresData);
      }

      if (lotesResult.success && lotesResult.data) {
        const lotesData =
          lotesResult.data.lotes?.map((lote) => ({
            id: lote.id,
            numero_lote: lote.numero_lote,
          })) || [];
        setLotes(lotesData);
      }

      // Cargar filtros guardados
      const filtrosGuardados = LocalStorageService.loadFiltrosGuardados();
      setFiltrosGuardados(filtrosGuardados);
    } catch (error) {
      const errorMsg =
        error instanceof Error ? error.message : "Error desconocido";
      clientLogger.error("Error al cargar datos iniciales de búsqueda", error, {
        userId: user?.id,
      });
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!isLoading && isAuthorized && user) {
      loadInitialData();
    }
  }, [isLoading, isAuthorized, user, loadInitialData]);

  const handleSearch = async (filtros: FiltrosBrazaletes) => {
    try {
      setLoading(true);
      setError("");
      setFiltrosActivos(filtros);

      const result = await buscarBrazaletes(filtros);

      if (result.success && result.data) {
        setBrazaletes(result.data.brazaletes || []);
        setEstadisticas(result.data.estadisticas);
        setPagination(result.data.pagination);
        setFiltrosAplicados(result.data.filtros_aplicados);
      } else {
        throw new Error(result.message || "Error al buscar brazaletes");
      }
    } catch (error) {
      const errorMsg =
        error instanceof Error ? error.message : "Error desconocido";
      clientLogger.error("Error al buscar brazaletes", error, {
        userId: user?.id,
        filtros,
      });
      setError(errorMsg);
      setBrazaletes([]);
    } finally {
      setLoading(false);
    }
  };

  const handlePaginar = async (page: number) => {
    try {
      setLoading(true);
      const filtrosConPagina = { ...filtrosActivos, page };

      const result = await buscarBrazaletes(filtrosConPagina);

      if (result.success && result.data) {
        setBrazaletes(result.data.brazaletes || []);
        setEstadisticas(result.data.estadisticas);
        setPagination(result.data.pagination);
        setFiltrosAplicados(result.data.filtros_aplicados);
      } else {
        throw new Error(result.message || "Error al cambiar página");
      }
    } catch (error) {
      const errorMsg =
        error instanceof Error ? error.message : "Error desconocido";
      clientLogger.error("Error al paginar resultados de búsqueda", error, {
        userId: user?.id,
        page,
      });
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveFiltros = (nombre: string, filtros: FiltrosBrazaletes) => {
    const nuevosFiltros = LocalStorageService.addFiltroGuardado(
      nombre,
      filtros
    );
    setFiltrosGuardados(nuevosFiltros);
  };

  const handleExportar = (formato: "csv" | "excel") => {
    ExportacionService.exportarBrazaletes(brazaletes, formato);
  };

  const handleBuscarTodos = () => handleSearch({});
  const handleVerDisponibles = () => handleSearch({ estado: "disponible" });
  const handleVerUtilizados = () => handleSearch({ estado: "utilizado" });

  if (isLoading) {
    return <AuthLoadingState />;
  }

  if (!isAuthorized) {
    return null;
  }

  const hasActiveFilters = Object.keys(filtrosActivos).length > 0;
  const hasResults = brazaletes.length > 0;

  return (
    <div className="space-y-6">
      <BusquedaHeader loading={loading} onBuscarTodos={handleBuscarTodos} />

      <ErrorAlert error={error} />

      {/* Componente de búsqueda */}
      <BusquedaAvanzada
        onSearch={handleSearch}
        loading={loading}
        resultadosCount={brazaletes.length}
        filtrosGuardados={filtrosGuardados}
        onSaveFiltros={handleSaveFiltros}
        prestadores={prestadores}
        lotes={lotes}
      />

      {/* Resultados */}
      {hasActiveFilters && (
        <ResultadosBusqueda
          brazaletes={brazaletes}
          estadisticas={estadisticas}
          pagination={pagination}
          filtrosAplicados={filtrosAplicados}
          loading={loading}
          onVerDetalle={(brazalete) => {}}
          onExportar={handleExportar}
          onActualizar={() => handleSearch(filtrosActivos)}
          onPaginar={handlePaginar}
        />
      )}

      {/* Estado inicial */}
      {!hasActiveFilters && !hasResults && (
        <EstadoInicial
          loading={loading}
          onVerDisponibles={handleVerDisponibles}
          onVerUtilizados={handleVerUtilizados}
        />
      )}
    </div>
  );
}
