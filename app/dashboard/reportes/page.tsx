"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/contexts/AuthContext";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  ReportesHeader,
  MetricasCards,
  TablaOcupacionDiaria,
  TablaPrestadores,
  ExportacionCards,
  LoadingState,
  ErrorState,
} from "./components";

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

  if (authLoading || loading) {
    return <LoadingState />;
  }

  if (error) {
    return <ErrorState error={error} onRetry={loadReporteData} />;
  }

  if (!reporteData) {
    return null;
  }

  const { estadisticas, ocupacion_por_dia, reporte_por_prestador } =
    reporteData;

  return (
    <div className="space-y-6">
      <ReportesHeader
        fechaInicio={fechaInicio}
        fechaFin={fechaFin}
        onFechaInicioChange={setFechaInicio}
        onFechaFinChange={setFechaFin}
        onRefresh={loadReporteData}
      />

      <MetricasCards estadisticas={estadisticas} />

      <Tabs defaultValue="ocupacion" className="space-y-4">
        <TabsList>
          <TabsTrigger value="ocupacion">Ocupación por Día</TabsTrigger>
          <TabsTrigger value="prestadores">Reporte por Prestador</TabsTrigger>
          <TabsTrigger value="exportar">Exportar Reportes</TabsTrigger>
        </TabsList>

        <TabsContent value="ocupacion" className="space-y-4">
          <TablaOcupacionDiaria ocupacion={ocupacion_por_dia} />
        </TabsContent>

        <TabsContent value="prestadores" className="space-y-4">
          <TablaPrestadores prestadores={reporte_por_prestador} />
        </TabsContent>

        <TabsContent value="exportar" className="space-y-4">
          <ExportacionCards
            onExportExcel={() => handleExportReport("excel")}
            onExportPDF={() => handleExportReport("pdf")}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
