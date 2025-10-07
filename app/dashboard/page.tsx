"use client";

import { useEffect, useState } from "react";
import { useAuth, useRouteProtection } from "@/lib/contexts/AuthContext";
import { getAllDashboardData } from "@/actions/dashboard";
import {
  getInventarioBrazaletes,
  getAlertasBrazaletes,
} from "@/actions/brazaletes";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Users,
  Ship,
  Calendar,
  Activity,
  AlertTriangle,
  Cloud,
  BarChart3,
  Bell,
  RefreshCw,
  Eye,
  ArrowRight,
  AlertCircle,
  Wind,
  Waves,
  Anchor,
  Package,
  UserX,
  Wrench,
  XCircle,
  Info,
} from "lucide-react";
import Link from "next/link";
import { BrazaletesStats } from "@/components/brazaletes/BrazaletesStats";
import { DashboardData, AlertaSistema } from "@/lib/types/dashboard";
import {
  DashboardBrazaletes,
  AlertaBrazaletes,
  InventarioBrazaletes,
} from "@/lib/types/brazaletes";

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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());

  useEffect(() => {
    // Solo cargar datos si el usuario está autorizado y no está cargando
    if (!isLoading && isAuthorized && user) {
      loadDashboardData();
    }
  }, [isLoading, isAuthorized, user]);

  console.log("dashboardData", dashboardData);

  // Mostrar loading mientras se verifica la autenticación
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

  // Si no está autorizado, el hook ya manejó la redirección
  if (!isAuthorized) {
    return null;
  }

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      setError("");

      console.log("📊 Dashboard: Cargando datos...");

      // Cargar datos del dashboard y brazaletes en paralelo
      const [dashboardResult, brazaletesResult, alertasResult] =
        await Promise.all([
          getAllDashboardData(),
          getInventarioBrazaletes(),
          getAlertasBrazaletes(),
        ]);

      if (dashboardResult.success) {
        console.log("📊 Dashboard: Datos recibidos:", dashboardResult.data);
        setDashboardData(
          (dashboardResult.data as unknown as DashboardData) || null
        );
      } else {
        console.error("📊 Dashboard: Error:", dashboardResult.error);
        console.error("📊 Dashboard: Resultado completo:", dashboardResult);
        setError(
          dashboardResult.error || "Error al cargar los datos del dashboard"
        );
      }

      if (brazaletesResult.success && brazaletesResult.data) {
        console.log(
          "🎫 Dashboard: Inventario de brazaletes cargado:",
          brazaletesResult.data
        );
        setBrazaletesData(
          (brazaletesResult.data as unknown as DashboardBrazaletes) || null
        );
      } else {
        console.warn(
          "🎫 Dashboard: No se pudieron cargar los datos de brazaletes"
        );
      }

      if (alertasResult.success && alertasResult.data) {
        console.log(
          "🚨 Dashboard: Alertas de brazaletes cargadas:",
          alertasResult.data
        );
        setBrazaletesAlertas(alertasResult.data || []);
      }

      setLastUpdate(new Date());
    } catch (error) {
      console.error("📊 Dashboard: Error cargando datos:", error);
      setError("Error al cargar los datos del dashboard");
    } finally {
      setLoading(false);
    }
  };

  const refreshData = () => {
    loadDashboardData();
  };

  const getEstadoPuertoColor = (estado: string) => {
    switch (estado) {
      case "abierto":
        return "bg-green-100 text-green-800 border-green-200";
      case "restricciones":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "cerrado":
        return "bg-red-100 text-red-800 border-red-200";
      case "emergencia":
        return "bg-red-200 text-red-900 border-red-300";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getEstadoPuertoIcon = (estado: string) => {
    switch (estado) {
      case "abierto":
        return "🟢";
      case "restricciones":
        return "🟡";
      case "cerrado":
        return "🔴";
      case "emergencia":
        return "⚡";
      default:
        return "⚪";
    }
  };

  const getSeveridadIconColor = (severidad: string): string => {
    switch (severidad) {
      case "critica":
        return "text-red-600";
      case "alta":
        return "text-orange-600";
      case "media":
        return "text-amber-600";
      case "baja":
        return "text-blue-600";
      default:
        return "text-gray-600";
    }
  };

  const getAlertaIcon = (tipo: string) => {
    switch (tipo) {
      case "permisos_vencidos":
      case "permisos_por_vencer":
      case "permiso":
        return UserX;
      case "clima_oleaje_alto":
        return Waves;
      case "clima_viento_fuerte":
        return Wind;
      case "puerto_cerrado":
      case "puerto_restricciones":
        return Anchor;
      case "stock_bajo":
      case "lote_por_vencer":
      case "prestador_sin_stock":
        return Package;
      case "embarcacion_mantenimiento":
      case "mantenimiento":
        return Wrench;
      case "bloque_suspendido":
        return XCircle;
      case "capacidad_critica":
      case "capacidad":
        return AlertCircle;
      case "clima":
        return Cloud;
      case "seguridad":
        return AlertTriangle;
      default:
        return Info;
    }
  };

  if (isLoading || loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-teal-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600">Cargando dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-2xl mx-auto">
        <Alert className="border-red-200 bg-red-50">
          <AlertTriangle className="h-4 w-4 text-red-600" />
          <AlertDescription className="text-red-700">{error}</AlertDescription>
        </Alert>
        <div className="mt-4 text-center">
          <Button onClick={refreshData}>
            <RefreshCw className="w-4 h-4 mr-2" />
            Reintentar
          </Button>
        </div>
      </div>
    );
  }

  if (!dashboardData) {
    return null;
  }

  const { estadisticas, clima, alertas } = dashboardData;

  return (
    <div className="space-y-8">
      {/* Header con última actualización */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">
            Bienvenido, {user?.nombre}
          </h2>
          <p className="text-slate-600">
            Última actualización: {lastUpdate.toLocaleString()}
          </p>
        </div>
        <Button onClick={refreshData} variant="outline">
          <RefreshCw className="w-4 h-4 mr-2" />
          Actualizar
        </Button>
      </div>

      {/* Métricas principales */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Usuarios
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {estadisticas.total_usuarios}
            </div>
            <p className="text-xs text-muted-foreground">
              Prestadores registrados
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Embarcaciones</CardTitle>
            <Ship className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {estadisticas.total_embarcaciones}
            </div>
            <p className="text-xs text-muted-foreground">
              {estadisticas.embarcaciones_activas} activas
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Salidas Hoy</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {estadisticas.total_salidas_hoy}
            </div>
            <p className="text-xs text-muted-foreground">
              {estadisticas.total_pasajeros_hoy} pasajeros
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ocupación</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {estadisticas.ocupacion_promedio}%
            </div>
            <p className="text-xs text-muted-foreground">
              Promedio últimos 7 días
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Card de Brazaletes */}
      {brazaletesData && (
        <BrazaletesStats
          inventario={brazaletesData as unknown as InventarioBrazaletes}
          alertas={brazaletesAlertas}
          loading={loading}
        />
      )}

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        {/* Estado del puerto y clima */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Cloud className="w-5 h-5 mr-2" />
                Estado del Puerto
              </CardTitle>
              <CardDescription>
                Condiciones meteorológicas actuales
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Estado:</span>
                <Badge className={getEstadoPuertoColor(clima.estado_puerto)}>
                  {getEstadoPuertoIcon(clima.estado_puerto)}{" "}
                  {clima.estado_puerto.toUpperCase()}
                </Badge>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">
                    {clima.oleaje}m
                  </div>
                  <p className="text-xs text-muted-foreground">Oleaje</p>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">
                    {clima.viento_velocidad}
                  </div>
                  <p className="text-xs text-muted-foreground">Viento (km/h)</p>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Viento:</span>
                <span className="text-sm">
                  {clima.viento_velocidad} km/h {clima.viento_direccion}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Visibilidad:</span>
                <span className="text-sm capitalize">{clima.visibilidad}</span>
              </div>
            </CardContent>
          </Card>

          {/* Actividad reciente */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Activity className="w-5 h-5 mr-2" />
                Actividad Reciente
              </CardTitle>
              <CardDescription>Últimas operaciones del sistema</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center space-x-4">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">
                      Nueva embarcación registrada
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Hace 2 horas
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">
                      Bloque horario actualizado
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Hace 4 horas
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">
                      Reporte de clima actualizado
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Hace 6 horas
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Acciones rápidas y alertas */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Acciones Rápidas</CardTitle>
              <CardDescription>
                Acceso directo a funciones principales
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button
                asChild
                className="w-full justify-between"
                variant="outline"
              >
                <Link href="/dashboard/bloques">
                  <div className="flex items-center">
                    <Calendar className="w-4 h-4 mr-2" />
                    Gestionar Bloques
                  </div>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </Button>

              <Button
                asChild
                className="w-full justify-between"
                variant="outline"
              >
                <Link href="/dashboard/embarcaciones">
                  <div className="flex items-center">
                    <Ship className="w-4 h-4 mr-2" />
                    Administrar Flota
                  </div>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </Button>

              <Button
                asChild
                className="w-full justify-between"
                variant="outline"
              >
                <Link href="/dashboard/usuarios">
                  <div className="flex items-center">
                    <Users className="w-4 h-4 mr-2" />
                    Gestionar Usuarios
                  </div>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </Button>

              <Button
                asChild
                className="w-full justify-between"
                variant="outline"
              >
                <Link href="/dashboard/reportes">
                  <div className="flex items-center">
                    <BarChart3 className="w-4 h-4 mr-2" />
                    Ver Reportes
                  </div>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </Button>
            </CardContent>
          </Card>

          {/* Alertas */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center">
                  <Bell className="w-5 h-5 mr-2" />
                  Alertas del Sistema
                </div>
                {alertas && alertas.length > 0 && (
                  <Badge className="bg-red-500 hover:bg-red-600 text-white">
                    {alertas.length}
                  </Badge>
                )}
              </CardTitle>
              <CardDescription>
                Notificaciones y acciones requeridas
              </CardDescription>
            </CardHeader>
            <CardContent>
              {alertas && alertas.length > 0 ? (
                <div className="space-y-4">
                  {alertas.slice(0, 5).map((alerta: AlertaSistema) => {
                    const IconComponent = getAlertaIcon(alerta.tipo);
                    return (
                      <div
                        key={alerta.id}
                        className="flex items-start space-x-4"
                      >
                        <IconComponent
                          className={`w-5 h-5 ${getSeveridadIconColor(
                            alerta.severidad
                          )} flex-shrink-0 mt-0.5`}
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-slate-900">
                            {alerta.titulo}
                          </p>
                          <p className="text-xs text-muted-foreground mt-0.5">
                            {alerta.mensaje}
                          </p>
                          <p className="text-xs text-muted-foreground mt-1">
                            {new Date(alerta.fecha).toLocaleDateString(
                              "es-MX",
                              {
                                day: "numeric",
                                month: "short",
                                hour: "2-digit",
                                minute: "2-digit",
                              }
                            )}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                  {alertas.length > 5 && (
                    <Button variant="outline" size="sm" className="w-full mt-2">
                      <Eye className="w-4 h-4 mr-2" />
                      Ver todas las alertas ({alertas.length})
                    </Button>
                  )}
                </div>
              ) : (
                <div className="text-center py-6">
                  <Bell className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground">
                    No hay alertas activas
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
