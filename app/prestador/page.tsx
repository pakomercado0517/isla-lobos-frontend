"use client";

import { useEffect, useState } from "react";
import { useAuth, useRouteProtection } from "@/lib/contexts/AuthContext";
import { getPrestadorDashboardData } from "@/actions/prestador";
import {
  BienvenidaHeader,
  EmbarcacionesCards,
  SalidasList,
  LoadingState,
  AuthLoadingState,
  ErrorAlert,
} from "./components";

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

      console.log("🚤 Prestador: Cargando datos del dashboard...");
      const result = await getPrestadorDashboardData();

      if (result.success) {
        console.log("🚤 Prestador: Datos recibidos:", result.data);

        // Procesar salidas
        const salidasData = result.data?.salidas?.salidas || [];
        console.log("🚤 Prestador: Salidas raw data:", salidasData);
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
        console.error("🚤 Prestador: Error:", result.error);
        setError(result.error || "Error al cargar los datos");

        // Usar datos de ejemplo como fallback
        setSalidas([]);
        setEmbarcaciones([]);
      }
    } catch (error) {
      console.error("🚤 Prestador: Error cargando datos:", error);
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

  console.log("salidas", salidas);

  return (
    <div className="space-y-8">
      <BienvenidaHeader nombreUsuario={user?.nombre || "Usuario"} />

      <ErrorAlert error={error} />

      <EmbarcacionesCards embarcaciones={embarcaciones} salidas={salidas} />

      <SalidasList salidas={salidas} />
    </div>
  );
}
