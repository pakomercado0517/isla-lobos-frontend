"use client";

import { useEffect, useState, useMemo } from "react";
import { useAuth, useRouteProtection } from "@/lib/contexts/AuthContext";
import { clientLogger } from "@/lib/logger-client";
import { getMisBrazaletes } from "@/actions/brazaletes";
import { FiltroEstadoBrazaletes } from "@/components/brazaletes/FiltroEstadoBrazaletes";
import type { BrazaletesPrestador } from "@/lib/types/brazaletes";
import {
  PrestadorBrazaletesHeader,
  ResumenBrazaletes,
  DistribucionTipo,
  ListaBrazaletes,
  ErrorState,
  AuthLoadingState,
  LoadingState,
  ErrorAlert,
  calcularConteos,
  filtrarBrazaletes,
} from "./components";

export default function PrestadorBrazaletesPage() {
  const { isLoading, isAuthorized } = useRouteProtection("prestador");
  const { user } = useAuth();

  // Estados para datos
  const [brazaletesData, setBrazaletesData] =
    useState<BrazaletesPrestador | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Estados para filtrado
  const [filtroEstado, setFiltroEstado] = useState<
    "todos" | "disponible" | "asignado" | "utilizado" | "perdido"
  >("todos");

  useEffect(() => {
    if (!isLoading && isAuthorized && user) {
      loadData();
    }
  }, [isLoading, isAuthorized, user]);

  const loadData = async () => {
    try {
      setLoading(true);
      setError("");

      const result = await getMisBrazaletes();

      if (result.success && result.data) {
        setBrazaletesData(result.data);
      } else {
        throw new Error(result.message || "Error al cargar brazaletes");
      }
    } catch (error) {
      const errorMsg =
        error instanceof Error ? error.message : "Error desconocido";
      clientLogger.error("Error al cargar brazaletes de prestador", error, {
        userId: user?.id,
      });
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  // Lógica de filtrado y conteos usando utils
  const { brazaletesFiltrados, conteos } = useMemo(() => {
    const conteosCalculados = calcularConteos(brazaletesData);
    const brazaletesFiltrados = filtrarBrazaletes(brazaletesData, filtroEstado);

    return {
      brazaletesFiltrados,
      conteos: conteosCalculados,
    };
  }, [brazaletesData, filtroEstado]);

  // Mostrar loading mientras se verifica la autenticación
  if (isLoading) {
    return <AuthLoadingState />;
  }

  // Si no está autorizado, el hook ya manejó la redirección
  if (!isAuthorized) {
    return null;
  }

  return (
    <div className="space-y-8">
      <PrestadorBrazaletesHeader
        brazaletesData={brazaletesData}
        loading={loading}
        onRefresh={loadData}
      />

      <div className="space-y-6">
        <ErrorAlert error={error} />

        {/* Contenido principal */}
        {loading ? (
          <LoadingState />
        ) : brazaletesData ? (
          <div className="space-y-6">
            {/* Filtro de estado */}
            <FiltroEstadoBrazaletes
              estadoSeleccionado={filtroEstado}
              onEstadoChange={setFiltroEstado}
              conteos={conteos}
            />

            {/* Resumen general */}
            <ResumenBrazaletes
              brazaletesData={brazaletesData}
              filtroEstado={filtroEstado}
              conteos={conteos}
            />

            {/* Distribución por tipo */}
            <DistribucionTipo brazaletesData={brazaletesData} />

            {/* Lista detallada de brazaletes */}
            <ListaBrazaletes
              brazaletesFiltrados={brazaletesFiltrados}
              filtroEstado={filtroEstado}
              onCambiarFiltro={setFiltroEstado}
            />
          </div>
        ) : (
          <ErrorState onRetry={loadData} />
        )}
      </div>
    </div>
  );
}
