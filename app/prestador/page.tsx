"use client";

import { useEffect, useState } from "react";
import { useAuth, useRouteProtection } from "@/lib/contexts/AuthContext";
import { clientLogger } from "@/lib/logger-client";
import { getPrestadorDashboardData } from "@/actions/prestador";
import {
  EmbarcacionesCards,
  SalidasList,
  LoadingState,
  AuthLoadingState,
  ErrorAlert,
} from "./components";
import { DashboardHeader } from "./components/DashboardHeader";
import { EstadisticasPrestador } from "./components/EstadisticasPrestador";

import type { Salida } from "@/lib/types/salida";
import type { Embarcacion } from "@/lib/types/embarcacion";

export default function PrestadorPage() {
  const { isLoading, isAuthorized } = useRouteProtection("prestador");
  const { user } = useAuth();
  const [salidas, setSalidas] = useState<Salida[]>([]);
  const [embarcaciones, setEmbarcaciones] = useState<Embarcacion[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    // Solo cargar datos si el usuario está autorizado y no está cargando
    if (!isLoading && isAuthorized && user) {
      loadData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoading, isAuthorized, user]);

  // Mostrar loading mientras se verifica la autenticación
  if (isLoading) {
    return <AuthLoadingState />;
  }

  // Si no está autorizado, el hook ya manejó la redirección
  if (!isAuthorized) {
    return null;
  }

  const loadData = async () => {
    try {
      setLoading(true);
      setError("");

      const result = await getPrestadorDashboardData();

      if (result.success) {
        // Procesar salidas
        const salidasData = result.data?.salidas?.salidas || [];
        const salidasProcesadas: Salida[] = salidasData.map(
          (salida: Salida) => ({
            id: salida.id,
            prestador_id: salida.prestador_id || "",
            embarcacion_id: salida.embarcacion_id || "",
            bloque_id: salida.bloque_id,
            hora: salida.hora,
            fecha: salida.fecha,
            numero_pasajeros: salida.numero_pasajeros || 0,
            destino: salida.destino || "Sin destino",
            observaciones: salida.observaciones || "",
            estado: salida.estado,
            motivo_cancelacion: salida.motivo_cancelacion,
            createdAt: salida.createdAt,
            updatedAt: salida.updatedAt,
            bloque: salida.bloque
              ? {
                  id: salida.bloque.id,
                  nombre: salida.bloque.nombre,
                  hora_inicio: salida.bloque.hora_inicio,
                  hora_fin: salida.bloque.hora_fin,
                  capacidad_total: salida.bloque.capacidad_total,
                  capacidad_registrada: salida.bloque.capacidad_registrada,
                  capacidad_disponible: salida.bloque.capacidad_disponible,
                }
              : undefined,
            embarcacion: salida.embarcacion
              ? {
                  id: salida.embarcacion.id,
                  nombre: salida.embarcacion.nombre,
                  capacidad: salida.embarcacion.capacidad,
                  matricula: salida.embarcacion.matricula,
                  tipo: salida.embarcacion.tipo,
                  estado: salida.embarcacion.estado,
                }
              : undefined,
          })
        );

        // Procesar embarcaciones
        const embarcacionesData =
          result.data?.embarcaciones?.embarcaciones || [];
        const embarcacionesProcesadas = embarcacionesData.map(
          (embarcacion: Embarcacion) => ({
            id: embarcacion.id,
            nombre: embarcacion.nombre,
            matricula: embarcacion.matricula,
            capacidad: embarcacion.capacidad,
            tipo: embarcacion.tipo,
            estado: embarcacion.estado,
          })
        );

        setSalidas(salidasProcesadas);
        setEmbarcaciones(embarcacionesProcesadas);
      } else {
        setError(result.error || "Error al cargar los datos");

        // Usar datos de ejemplo como fallback
        setSalidas([]);
        setEmbarcaciones([]);
      }
    } catch (error) {
      clientLogger.error("Error al cargar dashboard de prestador", error, {
        userId: user?.id,
      });
      setError("Error al cargar los datos");

      // Usar datos de ejemplo como fallback
      setSalidas([]);
      setEmbarcaciones([]);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <LoadingState />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16 max-w-7xl xl:max-w-[90rem] 2xl:max-w-[100rem] py-6 sm:py-8 lg:py-10 xl:py-12 space-y-6 lg:space-y-8 xl:space-y-10">
        <DashboardHeader nombreUsuario={user?.nombre || "Usuario"} />

        <ErrorAlert error={error} />

        <EstadisticasPrestador
          embarcaciones={embarcaciones}
          salidas={salidas}
        />

        <EmbarcacionesCards embarcaciones={embarcaciones} salidas={salidas} />

        <SalidasList salidas={salidas} />
      </div>
    </div>
  );
}
