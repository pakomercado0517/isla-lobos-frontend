"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/contexts/AuthContext";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  BarChart3,
  Download,
  FileText,
  RefreshCw,
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  Users,
  Ship,
  Activity,
  DollarSign,
} from "lucide-react";

interface EstadisticasGenerales {
  total_usuarios: number;
  total_embarcaciones: number;
  embarcaciones_activas: number;
  total_salidas_hoy: number;
  total_pasajeros_hoy: number;
  ocupacion_promedio: number;
  ingresos_estimados: number;
  salidas_este_mes: number;
  pasajeros_este_mes: number;
  tendencia_mes_anterior: number;
}

interface OcupacionPorDia {
  fecha: string;
  total_salidas: number;
  total_pasajeros: number;
  ocupacion_porcentaje: number;
  ingresos_estimados: number;
}

interface ReportePorPrestador {
  prestador_id: string;
  prestador_nombre: string;
  total_salidas: number;
  total_pasajeros: number;
  embarcaciones_count: number;
  ultima_salida: string;
  ingresos_estimados: number;
}

interface ReporteData {
  estadisticas: EstadisticasGenerales;
  ocupacion_por_dia: OcupacionPorDia[];
  reporte_por_prestador: ReportePorPrestador[];
}

export default function ReportesPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [reporteData, setReporteData] = useState<ReporteData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [fechaInicio, setFechaInicio] = useState(
    new Date(new Date().getFullYear(), new Date().getMonth(), 1)
      .toISOString()
      .split("T")[0]
  );
  const [fechaFin, setFechaFin] = useState(
    new Date().toISOString().split("T")[0]
  );

  const loadReporteData = async () => {
    try {
      setLoading(true);
      setError("");

      // Simulamos las llamadas a la API con datos de ejemplo
      // En producción, estas serían llamadas reales a los endpoints
      const estadisticas: EstadisticasGenerales = {
        total_usuarios: 25,
        total_embarcaciones: 15,
        embarcaciones_activas: 12,
        total_salidas_hoy: 8,
        total_pasajeros_hoy: 180,
        ocupacion_promedio: 75,
        ingresos_estimados: 45000,
        salidas_este_mes: 120,
        pasajeros_este_mes: 2800,
        tendencia_mes_anterior: 12.5,
      };

      const ocupacion_por_dia: OcupacionPorDia[] = Array.from(
        { length: 7 },
        (_, i) => {
          const fecha = new Date();
          fecha.setDate(fecha.getDate() - i);
          return {
            fecha: fecha.toISOString().split("T")[0],
            total_salidas: Math.floor(Math.random() * 15) + 5,
            total_pasajeros: Math.floor(Math.random() * 300) + 100,
            ocupacion_porcentaje: Math.floor(Math.random() * 40) + 60,
            ingresos_estimados: Math.floor(Math.random() * 10000) + 5000,
          };
        }
      );

      const reporte_por_prestador: ReportePorPrestador[] = [
        {
          prestador_id: "1",
          prestador_nombre: "Juan Pérez",
          total_salidas: 35,
          total_pasajeros: 850,
          embarcaciones_count: 3,
          ultima_salida: new Date().toISOString(),
          ingresos_estimados: 21250,
        },
        {
          prestador_id: "2",
          prestador_nombre: "María González",
          total_salidas: 28,
          total_pasajeros: 720,
          embarcaciones_count: 2,
          ultima_salida: new Date().toISOString(),
          ingresos_estimados: 18000,
        },
        {
          prestador_id: "3",
          prestador_nombre: "Carlos Rodríguez",
          total_salidas: 22,
          total_pasajeros: 580,
          embarcaciones_count: 2,
          ultima_salida: new Date().toISOString(),
          ingresos_estimados: 14500,
        },
      ];

      setReporteData({
        estadisticas,
        ocupacion_por_dia,
        reporte_por_prestador,
      });

      // TODO: Implementar llamadas reales a la API
      // const [estadisticasRes, ocupacionRes, prestadoresRes] = await Promise.all([
      //   ApiClient.get("/api/dashboard/estadisticas", { params: { fecha_inicio: fechaInicio, fecha_fin: fechaFin } }),
      //   ApiClient.get("/api/dashboard/ocupacion", { params: { fecha_inicio: fechaInicio, fecha_fin: fechaFin } }),
      //   ApiClient.get("/api/salidas/estadisticas", { params: { fecha_inicio: fechaInicio, fecha_fin: fechaFin, grupo_por: "prestador" } })
      // ]);
    } catch (error: unknown) {
      console.error("Error cargando reportes:", error);
      setError(
        error instanceof Error ? error.message : "Error al cargar los reportes"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login");
      return;
    }

    if (user && user.rol !== "conanp") {
      router.push("/prestador");
      return;
    }

    if (user) {
      loadReporteData();
    }
  }, [user, authLoading, router]);

  const handleExportReport = async (formato: "excel" | "pdf") => {
    try {
      // TODO: Implementar exportación real
      // const response = await ApiClient.get(`/api/reportes/export`, {
      //   params: { formato, fecha_inicio: fechaInicio, fecha_fin: fechaFin },
      //   responseType: 'blob'
      // });

      alert(
        `Función de exportación a ${formato.toUpperCase()} será implementada próximamente`
      );
    } catch (error: unknown) {
      console.error("Error exportando reporte:", error);
      setError("Error al exportar el reporte");
    }
  };

  const getTendenciaIcon = (valor: number) => {
    if (valor > 0) {
      return <TrendingUp className="w-4 h-4 text-green-500" />;
    } else if (valor < 0) {
      return <TrendingDown className="w-4 h-4 text-red-500" />;
    }
    return null;
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("es-MX", {
      style: "currency",
      currency: "MXN",
    }).format(amount);
  };

  if (authLoading || loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-teal-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600">Cargando reportes...</p>
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
          <Button onClick={loadReporteData}>
            <RefreshCw className="w-4 h-4 mr-2" />
            Reintentar
          </Button>
        </div>
      </div>
    );
  }

  if (!reporteData) {
    return null;
  }

  const { estadisticas, ocupacion_por_dia, reporte_por_prestador } =
    reporteData;

  return (
    <div className="space-y-6">
      {/* Header con controles */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            Reportes y Estadísticas
          </h1>
          <p className="text-slate-600">
            Análisis detallado de operaciones y rendimiento
          </p>
        </div>
        <div className="mt-4 sm:mt-0 flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Label htmlFor="fecha-inicio" className="text-sm font-medium">
              Desde:
            </Label>
            <Input
              id="fecha-inicio"
              type="date"
              value={fechaInicio}
              onChange={(e) => setFechaInicio(e.target.value)}
              className="w-auto"
            />
          </div>
          <div className="flex items-center space-x-2">
            <Label htmlFor="fecha-fin" className="text-sm font-medium">
              Hasta:
            </Label>
            <Input
              id="fecha-fin"
              type="date"
              value={fechaFin}
              onChange={(e) => setFechaFin(e.target.value)}
              className="w-auto"
            />
          </div>
          <Button onClick={loadReporteData} variant="outline" size="sm">
            <RefreshCw className="w-4 h-4 mr-2" />
            Actualizar
          </Button>
        </div>
      </div>

      {/* Métricas principales */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Salidas Este Mes
            </CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {estadisticas.salidas_este_mes}
            </div>
            <div className="flex items-center text-xs text-muted-foreground">
              {getTendenciaIcon(estadisticas.tendencia_mes_anterior)}
              <span className="ml-1">
                {estadisticas.tendencia_mes_anterior > 0 ? "+" : ""}
                {estadisticas.tendencia_mes_anterior}% vs mes anterior
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Pasajeros Este Mes
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {estadisticas.pasajeros_este_mes.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              Promedio{" "}
              {Math.round(
                estadisticas.pasajeros_este_mes / estadisticas.salidas_este_mes
              )}{" "}
              por salida
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Ocupación Promedio
            </CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {estadisticas.ocupacion_promedio}%
            </div>
            <p className="text-xs text-muted-foreground">Capacidad utilizada</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Ingresos Estimados
            </CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(estadisticas.ingresos_estimados)}
            </div>
            <p className="text-xs text-muted-foreground">Este mes</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="ocupacion" className="space-y-4">
        <TabsList>
          <TabsTrigger value="ocupacion">Ocupación por Día</TabsTrigger>
          <TabsTrigger value="prestadores">Reporte por Prestador</TabsTrigger>
          <TabsTrigger value="exportar">Exportar Reportes</TabsTrigger>
        </TabsList>

        <TabsContent value="ocupacion" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Ocupación Diaria</CardTitle>
              <CardDescription>
                Análisis de salidas y pasajeros por día (últimos 7 días)
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Fecha</TableHead>
                    <TableHead>Salidas</TableHead>
                    <TableHead>Pasajeros</TableHead>
                    <TableHead>Ocupación</TableHead>
                    <TableHead>Ingresos Est.</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {ocupacion_por_dia.map((dia) => (
                    <TableRow key={dia.fecha}>
                      <TableCell className="font-medium">
                        {new Date(dia.fecha).toLocaleDateString("es-MX", {
                          weekday: "short",
                          month: "short",
                          day: "numeric",
                        })}
                      </TableCell>
                      <TableCell>{dia.total_salidas}</TableCell>
                      <TableCell>{dia.total_pasajeros}</TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <div className="w-full bg-gray-200 rounded-full h-2 max-w-[60px]">
                            <div
                              className={`h-2 rounded-full ${
                                dia.ocupacion_porcentaje >= 90
                                  ? "bg-red-500"
                                  : dia.ocupacion_porcentaje >= 70
                                  ? "bg-yellow-500"
                                  : "bg-green-500"
                              }`}
                              style={{ width: `${dia.ocupacion_porcentaje}%` }}
                            />
                          </div>
                          <span className="text-sm font-medium">
                            {dia.ocupacion_porcentaje}%
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        {formatCurrency(dia.ingresos_estimados)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="prestadores" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Rendimiento por Prestador</CardTitle>
              <CardDescription>
                Estadísticas de actividad por prestador de servicios
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Prestador</TableHead>
                    <TableHead>Embarcaciones</TableHead>
                    <TableHead>Salidas</TableHead>
                    <TableHead>Pasajeros</TableHead>
                    <TableHead>Última Salida</TableHead>
                    <TableHead>Ingresos Est.</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {reporte_por_prestador.map((prestador) => (
                    <TableRow key={prestador.prestador_id}>
                      <TableCell className="font-medium">
                        {prestador.prestador_nombre}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <Ship className="w-4 h-4 mr-1" />
                          {prestador.embarcaciones_count}
                        </div>
                      </TableCell>
                      <TableCell>{prestador.total_salidas}</TableCell>
                      <TableCell>{prestador.total_pasajeros}</TableCell>
                      <TableCell>
                        {new Date(prestador.ultima_salida).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        {formatCurrency(prestador.ingresos_estimados)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="exportar" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <FileText className="w-5 h-5 mr-2" />
                  Exportar a Excel
                </CardTitle>
                <CardDescription>
                  Descarga un archivo Excel con todos los datos del período
                  seleccionado
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="text-sm text-muted-foreground">
                    Incluye:
                    <ul className="list-disc list-inside mt-2 space-y-1">
                      <li>Estadísticas generales</li>
                      <li>Ocupación por día</li>
                      <li>Reporte por prestador</li>
                      <li>Detalle de salidas</li>
                    </ul>
                  </div>
                  <Button
                    onClick={() => handleExportReport("excel")}
                    className="w-full"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Descargar Excel
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <FileText className="w-5 h-5 mr-2" />
                  Exportar a PDF
                </CardTitle>
                <CardDescription>
                  Genera un reporte ejecutivo en formato PDF
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="text-sm text-muted-foreground">
                    Incluye:
                    <ul className="list-disc list-inside mt-2 space-y-1">
                      <li>Resumen ejecutivo</li>
                      <li>Gráficas de tendencias</li>
                      <li>Análisis comparativo</li>
                      <li>Recomendaciones</li>
                    </ul>
                  </div>
                  <Button
                    onClick={() => handleExportReport("pdf")}
                    className="w-full"
                    variant="outline"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Descargar PDF
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
