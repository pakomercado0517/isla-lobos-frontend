"use client";

import { useEffect, useState, useCallback } from "react";
import { useAuth, useRouteProtection } from "@/lib/contexts/AuthContext";
import { clientLogger } from "@/lib/logger-client";
import { getMisSalidas } from "@/actions/prestador";
import { getBrazaletesUtilizadosSalida } from "@/actions/brazaletes";
import type { Salida } from "@/lib/types/salida";
import type { BrazaletesUtilizadosSalida } from "@/lib/types/brazaletes";
import {
  UsoBrazaletesHeader,
  EstadisticasBrazaletesUtilizados,
  TablaSalidasBrazaletes,
  FiltrosFecha,
  AuthLoadingState,
  LoadingState,
  ErrorAlert,
} from "./components";

interface SalidaConBrazaletes {
  salida: Salida;
  brazaletes: BrazaletesUtilizadosSalida | null;
}

export default function UsoBrazaletesPage() {
  const { isLoading, isAuthorized } = useRouteProtection("prestador");
  const { user } = useAuth();

  // Estados para datos
  const [salidasConBrazaletes, setSalidasConBrazaletes] = useState<
    SalidaConBrazaletes[]
  >([]);

  // Estados para UI
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [fechaInicio, setFechaInicio] = useState("");
  const [fechaFin, setFechaFin] = useState("");

  // Cargar brazaletes de una salida
  const cargarBrazaletesSalida = useCallback(
    async (salidaId: string): Promise<BrazaletesUtilizadosSalida | null> => {
      try {
        const result = await getBrazaletesUtilizadosSalida(salidaId);
        if (result.success && result.data) {
          return result.data;
        }
        return null;
      } catch (error) {
        clientLogger.error(
          `Error al cargar brazaletes de salida ${salidaId}`,
          error,
          { userId: user?.id, salidaId }
        );
        return null;
      }
    },
    [user?.id]
  );

  // Cargar datos
  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      // Obtener salidas (completadas, en_curso, programadas) que puedan tener brazaletes
      const salidasResult = await getMisSalidas({
        limit: 100,
        ...(fechaInicio && { fecha_inicio: fechaInicio }),
        ...(fechaFin && { fecha_fin: fechaFin }),
      });

      if (!salidasResult.success || !salidasResult.data) {
        throw new Error(
          salidasResult.error || "Error al cargar salidas completadas"
        );
      }

      const todasLasSalidas = salidasResult.data.salidas || [];
      
      // Filtrar solo salidas completadas, en_curso o programadas (que pueden tener brazaletes)
      const salidas = todasLasSalidas.filter(
        (salida) =>
          salida.estado === "completada" ||
          salida.estado === "en_curso" ||
          salida.estado === "programada"
      );

      // Cargar brazaletes para cada salida
      const salidasConBrazaletesData: SalidaConBrazaletes[] = await Promise.all(
        salidas.map(async (salida) => {
          const brazaletes = await cargarBrazaletesSalida(salida.id);
          return {
            salida,
            brazaletes,
          };
        })
      );

      // Filtrar solo las que tienen brazaletes utilizados o asignados
      const salidasConBrazaletesFiltradas = salidasConBrazaletesData.filter(
        (item) =>
          item.brazaletes !== null &&
          item.brazaletes.brazaletes_utilizados.length > 0
      );

      // Ordenar por fecha más reciente primero
      salidasConBrazaletesFiltradas.sort((a, b) => {
        const fechaA = new Date(a.salida.fecha).getTime();
        const fechaB = new Date(b.salida.fecha).getTime();
        return fechaB - fechaA;
      });

      setSalidasConBrazaletes(salidasConBrazaletesFiltradas);
    } catch (error) {
      const errorMsg =
        error instanceof Error ? error.message : "Error desconocido";
      clientLogger.error("Error al cargar página de historial de brazaletes", error, {
        userId: user?.id,
      });
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  }, [fechaInicio, fechaFin, cargarBrazaletesSalida, user?.id]);

  useEffect(() => {
    if (!isLoading && isAuthorized && user) {
      loadData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoading, isAuthorized, user, fechaInicio, fechaFin]);

  const handleLimpiarFiltros = () => {
    setFechaInicio("");
    setFechaFin("");
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
    <div className="space-y-4 md:space-y-6 lg:space-y-8">
      <UsoBrazaletesHeader loading={loading} onRefresh={loadData} />

      <div className="space-y-4 md:space-y-6">
        <ErrorAlert error={error} />

        {/* Contenido principal */}
        {loading ? (
          <LoadingState />
        ) : (
          <div className="space-y-4 md:space-y-6">
            {/* Filtros */}
            <FiltrosFecha
              fechaInicio={fechaInicio}
              fechaFin={fechaFin}
              onFechaInicioChange={setFechaInicio}
              onFechaFinChange={setFechaFin}
              onLimpiar={handleLimpiarFiltros}
            />

            {/* Estadísticas */}
            <EstadisticasBrazaletesUtilizados
              salidasConBrazaletes={salidasConBrazaletes}
            />

            {/* Lista de salidas */}
            <TablaSalidasBrazaletes
              salidasConBrazaletes={salidasConBrazaletes}
            />
          </div>
        )}
      </div>
    </div>
  );
}
