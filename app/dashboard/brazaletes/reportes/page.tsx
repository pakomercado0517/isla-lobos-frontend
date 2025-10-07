"use client";

import { useEffect, useState, useCallback } from "react";
import { useAuth, useRouteProtection } from "@/lib/contexts/AuthContext";
import {
  getEstadisticasBrazaletes,
  getReporteUtilizacionBrazaletes,
} from "@/actions/brazaletes";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  RefreshCw,
  AlertTriangle,
  TrendingUp,
  Users,
  Calendar,
  Package,
  DollarSign,
  Download,
  Filter,
} from "lucide-react";
import {
  EstadisticasBrazaletes,
  ReporteUtilizacionBrazaletes,
} from "@/lib/types/brazaletes";

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
  const [tipoFiltro, setTipoFiltro] = useState<"isla" | "arrecife" | "todos">(
    "todos"
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
        tipo: tipoFiltro === "todos" ? undefined : ("universal" as const),
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
  }, [fechaInicio, fechaFin, tipoFiltro, prestadorFiltro]);

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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Reportes de Brazaletes
          </h1>
          <p className="text-gray-600 mt-1">
            Estadísticas y análisis de utilización de brazaletes
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={loadData} disabled={loading}>
            <RefreshCw
              className={`w-4 h-4 mr-2 ${loading ? "animate-spin" : ""}`}
            />
            Actualizar
          </Button>
        </div>
      </div>

      {/* Error general */}
      {error && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Filtros */}
      <div className="bg-white p-6 rounded-lg border">
        <div className="flex items-center gap-2 mb-4">
          <Filter className="w-5 h-5" />
          <h3 className="text-lg font-semibold">Filtros de Reporte</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="space-y-2">
            <Label htmlFor="fecha_inicio">Fecha Inicio</Label>
            <Input
              id="fecha_inicio"
              type="date"
              value={fechaInicio}
              onChange={(e) => setFechaInicio(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="fecha_fin">Fecha Fin</Label>
            <Input
              id="fecha_fin"
              type="date"
              value={fechaFin}
              onChange={(e) => setFechaFin(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="tipo">Tipo de Brazalete</Label>
            <select
              id="tipo"
              value={tipoFiltro}
              onChange={(e) =>
                setTipoFiltro(e.target.value as "todos" | "isla" | "arrecife")
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
            >
              <option value="todos">Todos</option>
              <option value="isla">🏝️ Isla</option>
              <option value="arrecife">🐠 Arrecife</option>
            </select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="prestador">Prestador</Label>
            <select
              id="prestador"
              value={prestadorFiltro}
              onChange={(e) => setPrestadorFiltro(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
            >
              <option value="todos">Todos</option>
              {/* Aquí se cargarían los prestadores disponibles */}
            </select>
          </div>
        </div>

        <div className="flex justify-end mt-4">
          <Button onClick={handleGenerarReporte} disabled={generandoReporte}>
            {generandoReporte ? (
              <>
                <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                Generando...
              </>
            ) : (
              <>
                <TrendingUp className="w-4 h-4 mr-2" />
                Generar Reporte
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Contenido principal */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-4 text-[var(--isla-teal)]" />
            <p className="text-gray-600">Cargando reportes...</p>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Estadísticas generales */}
          {estadisticas && (
            <div className="space-y-6">
              {/* Resumen del período */}
              <div className="bg-white p-6 rounded-lg border">
                <h3 className="text-lg font-semibold mb-4">
                  Período de Análisis
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center gap-3">
                    <Calendar className="w-5 h-5 text-gray-500" />
                    <div>
                      <p className="text-sm text-gray-600">Fecha Inicio</p>
                      <p className="font-semibold">
                        {new Date(
                          estadisticas.periodo.fecha_inicio
                        ).toLocaleDateString("es-MX")}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Calendar className="w-5 h-5 text-gray-500" />
                    <div>
                      <p className="text-sm text-gray-600">Fecha Fin</p>
                      <p className="font-semibold">
                        {new Date(
                          estadisticas.periodo.fecha_fin
                        ).toLocaleDateString("es-MX")}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Métricas principales */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-blue-50 p-6 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <Package className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm text-blue-600 font-medium">
                        Total Comprados
                      </p>
                      <p className="text-2xl font-bold text-blue-900">
                        {estadisticas.inventario.total_comprados.toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-green-50 p-6 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-green-100 rounded-lg">
                      <TrendingUp className="w-6 h-6 text-green-600" />
                    </div>
                    <div>
                      <p className="text-sm text-green-600 font-medium">
                        Total Disponibles
                      </p>
                      <p className="text-2xl font-bold text-green-900">
                        {estadisticas.inventario.total_disponibles.toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-purple-50 p-6 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-purple-100 rounded-lg">
                      <Users className="w-6 h-6 text-purple-600" />
                    </div>
                    <div>
                      <p className="text-sm text-purple-600 font-medium">
                        Total Utilizados
                      </p>
                      <p className="text-2xl font-bold text-purple-900">
                        {estadisticas.inventario.total_utilizados.toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-orange-50 p-6 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-orange-100 rounded-lg">
                      <DollarSign className="w-6 h-6 text-orange-600" />
                    </div>
                    <div>
                      <p className="text-sm text-orange-600 font-medium">
                        Ingresos Totales
                      </p>
                      <p className="text-2xl font-bold text-orange-900">
                        $
                        {estadisticas.ingresos.ventas_totales.toLocaleString(
                          "es-MX"
                        )}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Distribución por tipo */}
              <div className="bg-white p-6 rounded-lg border">
                <h3 className="text-lg font-semibold mb-4">
                  Distribución por Tipo
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <Badge
                          variant="outline"
                          className="bg-blue-100 text-blue-700"
                        >
                          🏝️ Isla
                        </Badge>
                        <span className="font-medium">Brazaletes de Isla</span>
                      </div>
                      <span className="text-2xl font-bold text-blue-600">
                        {estadisticas.utilizacion.por_tipo.universal}
                      </span>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-4 bg-teal-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <Badge
                          variant="outline"
                          className="bg-teal-100 text-teal-700"
                        >
                          🐠 Arrecife
                        </Badge>
                        <span className="font-medium">
                          Brazaletes de Arrecife
                        </span>
                      </div>
                      <span className="text-2xl font-bold text-teal-600">
                        {estadisticas.utilizacion.por_tipo.universal}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Distribución por nacionalidad */}
              <div className="bg-white p-6 rounded-lg border">
                <h3 className="text-lg font-semibold mb-4">
                  Distribución por Nacionalidad
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">
                      {estadisticas.utilizacion.por_nacionalidad.locales}
                    </div>
                    <div className="text-sm text-gray-600">🏠 Locales</div>
                  </div>
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">
                      {estadisticas.utilizacion.por_nacionalidad.nacionales}
                    </div>
                    <div className="text-sm text-gray-600">🇲🇽 Nacionales</div>
                  </div>
                  <div className="text-center p-4 bg-purple-50 rounded-lg">
                    <div className="text-2xl font-bold text-purple-600">
                      {
                        estadisticas.utilizacion.por_nacionalidad
                          .internacionales
                      }
                    </div>
                    <div className="text-sm text-gray-600">
                      🌍 Internacionales
                    </div>
                  </div>
                </div>
              </div>

              {/* Ingresos por mes */}
              <div className="bg-white p-6 rounded-lg border">
                <h3 className="text-lg font-semibold mb-4">Ingresos por Mes</h3>
                <div className="space-y-3">
                  {estadisticas.ingresos.por_mes.map((mes, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                    >
                      <div>
                        <p className="font-medium">{mes.mes}</p>
                        <p className="text-sm text-gray-600">
                          {mes.cantidad} brazaletes
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-green-600">
                          ${mes.monto.toLocaleString("es-MX")}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Reporte de utilización detallado */}
          {reporteUtilizacion && (
            <div className="bg-white p-6 rounded-lg border">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">
                  Detalle de Utilización
                </h3>
                <Button variant="outline" size="sm">
                  <Download className="w-4 h-4 mr-2" />
                  Exportar
                </Button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-2">Código</th>
                      <th className="text-left p-2">Tipo</th>
                      <th className="text-left p-2">Precio</th>
                      <th className="text-left p-2">Fecha Uso</th>
                      <th className="text-left p-2">Nacionalidad</th>
                      <th className="text-left p-2">Edad</th>
                      <th className="text-left p-2">Prestador</th>
                    </tr>
                  </thead>
                  <tbody>
                    {reporteUtilizacion.utilizacion_detalle.map(
                      (brazalete, index) => (
                        <tr key={index} className="border-b hover:bg-gray-50">
                          <td className="p-2 font-mono">{brazalete.codigo}</td>
                          <td className="p-2">
                            <Badge
                              variant="outline"
                              className={
                                brazalete.tipo === "universal"
                                  ? "bg-blue-50 text-blue-700"
                                  : "bg-teal-50 text-teal-700"
                              }
                            >
                              {brazalete.tipo === "universal"
                                ? "🏝️ Universal"
                                : "🐠 Universal"}
                            </Badge>
                          </td>
                          <td className="p-2">${brazalete.precio}</td>
                          <td className="p-2">
                            {brazalete.fecha_uso
                              ? new Date(
                                  brazalete.fecha_uso
                                ).toLocaleDateString("es-MX")
                              : "N/A"}
                          </td>
                          <td className="p-2">
                            {brazalete.turista_nacionalidad === "local"
                              ? "🏠 Local"
                              : brazalete.turista_nacionalidad === "nacional"
                              ? "🇲🇽 Nacional"
                              : brazalete.turista_nacionalidad ===
                                "internacional"
                              ? "🌍 Internacional"
                              : "N/A"}
                          </td>
                          <td className="p-2">
                            {brazalete.turista_edad || "N/A"}
                          </td>
                          <td className="p-2">
                            <div>
                              <p className="font-medium">
                                {brazalete.prestador?.nombre || "N/A"}
                              </p>
                              <p className="text-xs text-gray-600">
                                {brazalete.prestador?.email || "N/A"}
                              </p>
                            </div>
                          </td>
                        </tr>
                      )
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Estado vacío */}
          {!estadisticas && !reporteUtilizacion && (
            <div className="text-center py-12">
              <TrendingUp className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No hay datos disponibles
              </h3>
              <p className="text-gray-600">
                Ajusta los filtros y genera un reporte para ver las estadísticas
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
