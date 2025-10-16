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
        const salidasProcesadas = salidasData.map((salida: Salida) => ({
          id: salida.id,
          fecha: salida.fecha,
          hora_salida: "08:30", // Usar datos reales cuando estén disponibles
          hora_regreso: "10:30",
          numero_pasajeros: salida.numero_pasajeros || 0,
          observaciones: salida.observaciones || "",
          estado: salida.estado,
          destino: salida.destino || "Sin destino",
          bloque: {
            nombre: salida.bloque?.nombre || "Bloque",
            hora_inicio: salida.bloque?.hora_inicio || "08:00",
            hora_fin: salida.bloque?.hora_fin || "10:00",
          },
          embarcacion: {
            nombre: salida.embarcacion?.nombre || "Embarcación",
            capacidad: salida.embarcacion?.capacidad || 30,
          },
        }));

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
    <div className="min-h-screen bg-gradient-to-br from-[var(--isla-light-blue)]/5 to-[var(--isla-teal)]/10">
      <div className="container mx-auto px-4 py-6 space-y-6">
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
