"use client";

import { useEffect, useState } from "react";
import { useAuth, useRouteProtection } from "@/lib/contexts/AuthContext";
import { getAllDashboardData, getActividadReciente } from "@/actions/dashboard";
import {
  getInventarioBrazaletes,
  getAlertasBrazaletes,
} from "@/actions/brazaletes";
import { Users, Ship, Calendar, BarChart3 } from "lucide-react";
import { BrazaletesStats } from "@/components/brazaletes/BrazaletesStats";
import { DashboardData } from "@/lib/types/dashboard";
import { clientLogger } from "@/lib/logger-client";
import {
  DashboardBrazaletes,
  AlertaBrazaletes,
  InventarioBrazaletes,
} from "@/lib/types/brazaletes";
import {
  DashboardHeader,
  MetricaCard,
  EstadoPuertoCard,
  ActividadRecienteCard,
  AccionesRapidasCard,
  AlertasSistemaCard,
  LoadingState,
  ErrorState,
} from "./components";

export default function DashboardPage() {
  const { isLoading, isAuthorized } = useRouteProtection("conanp");
  const { user } = useAuth();
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(
    null
  );
  const [brazaletesData, setBrazaletesData] =
    useState<DashboardBrazaletes | null>(null);
  const [brazaletesAlertas, setBrazaletesAlertas] = useState<
    AlertaBrazaletes[]
  >([]);
  const [actividadReciente, setActividadReciente] = useState<
    Array<{
      id: string;
      tipo: string;
      titulo: string;
      descripcion: string;
      fecha: string;
      color: string;
    }>
  >([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());

  useEffect(() => {
    // Solo cargar datos si el usuario está autorizado y no está cargando
    if (!isLoading && isAuthorized && user) {
      loadDashboardData();
    }
  }, [isLoading, isAuthorized, user]);

  // Mostrar loading mientras se verifica la autenticación
  if (isLoading) {
    return <LoadingState mensaje="Verificando autenticación..." />;
  }

  // Si no está autorizado, el hook ya manejó la redirección
  if (!isAuthorized) {
    return null;
  }

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      setError("");

      // Cargar datos del dashboard y brazaletes en paralelo
      const [
        dashboardResult,
        brazaletesResult,
        alertasResult,
        actividadResult,
      ] = await Promise.all([
        getAllDashboardData(),
        getInventarioBrazaletes(),
        getAlertasBrazaletes(),
        getActividadReciente(10),
      ]);

      if (dashboardResult.success) {
        setDashboardData(
          (dashboardResult.data as unknown as DashboardData) || null
        );
      } else {
        setError(
          dashboardResult.error || "Error al cargar los datos del dashboard"
        );
      }

      if (brazaletesResult.success && brazaletesResult.data) {
        setBrazaletesData(
          (brazaletesResult.data as unknown as DashboardBrazaletes) || null
        );
      }

      if (alertasResult.success && alertasResult.data) {
        setBrazaletesAlertas(alertasResult.data || []);
      }

      if (actividadResult.success && actividadResult.data) {
        setActividadReciente(actividadResult.data || []);
      }

      setLastUpdate(new Date());
    } catch (error) {
      clientLogger.error("Error al cargar dashboard", error);
      setError("Error al cargar los datos del dashboard");
    } finally {
      setLoading(false);
    }
  };

  if (isLoading || loading) {
    return <LoadingState mensaje="Cargando dashboard..." />;
  }

  if (error) {
    return <ErrorState error={error} onRetry={loadDashboardData} />;
  }

  if (!dashboardData) {
    return null;
  }

  const { estadisticas, clima, alertas } = dashboardData;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16 max-w-7xl xl:max-w-[90rem] 2xl:max-w-[100rem] py-6 sm:py-8 lg:py-10 xl:py-12 space-y-6 lg:space-y-8 xl:space-y-10">
        {/* Header con última actualización */}
        <DashboardHeader
          userName={user?.nombre || "Usuario"}
          lastUpdate={lastUpdate}
          onRefresh={loadDashboardData}
        />

        {/* Métricas principales */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6 xl:gap-8">
          <MetricaCard
            titulo="Total Usuarios"
            valor={estadisticas.total_usuarios}
            descripcion="Prestadores registrados"
            Icon={Users}
          />
          <MetricaCard
            titulo="Embarcaciones"
            valor={estadisticas.total_embarcaciones}
            descripcion={`${estadisticas.embarcaciones_activas} activas`}
            Icon={Ship}
          />
          <MetricaCard
            titulo="Salidas Hoy"
            valor={estadisticas.total_salidas_hoy}
            descripcion={`${estadisticas.total_pasajeros_hoy} pasajeros`}
            Icon={Calendar}
          />
          <MetricaCard
            titulo="Ocupación"
            valor={`${estadisticas.ocupacion_promedio}%`}
            descripcion="Promedio últimos 7 días"
            Icon={BarChart3}
          />
        </div>

        {/* Card de Brazaletes */}
        {brazaletesData && (
          <BrazaletesStats
            inventario={brazaletesData as unknown as InventarioBrazaletes}
            alertas={brazaletesAlertas}
            loading={loading}
          />
        )}

        <div className="grid grid-cols-1 gap-6 lg:gap-8 xl:gap-10 lg:grid-cols-2">
          {/* Estado del puerto y clima */}
          <div className="space-y-6 lg:space-y-8">
            <EstadoPuertoCard clima={clima} />
            <ActividadRecienteCard actividades={actividadReciente} />
          </div>

          {/* Acciones rápidas y alertas */}
          <div className="space-y-6 lg:space-y-8">
            <AccionesRapidasCard />
            <AlertasSistemaCard alertas={alertas} />
          </div>
        </div>
      </div>
    </div>
  );
}
