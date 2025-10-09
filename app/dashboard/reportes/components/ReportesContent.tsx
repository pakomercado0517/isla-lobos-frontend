"use client";

import { useState, useTransition } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  ReportesHeader,
  MetricasCards,
  TablaOcupacionDiaria,
  TablaPrestadores,
  ExportacionCards,
  LoadingState,
  ErrorState,
} from "./index";
import {
  getAllReportesData,
  exportarReporte,
  type EstadisticasGenerales,
  type OcupacionPorDia,
  type ReportePorPrestador,
} from "@/actions/reportes";

interface ReporteData {
  estadisticas: EstadisticasGenerales;
  ocupacion_por_dia: OcupacionPorDia[];
  reporte_por_prestador: ReportePorPrestador[];
}

interface ReportesContentProps {
  initialData: ReporteData;
  initialFechaInicio: string;
  initialFechaFin: string;
  initialError?: string;
}

export function ReportesContent({
  initialData,
  initialFechaInicio,
  initialFechaFin,
  initialError = "",
}: ReportesContentProps) {
  const [reporteData, setReporteData] = useState<ReporteData>(initialData);
  const [fechaInicio, setFechaInicio] = useState(initialFechaInicio);
  const [fechaFin, setFechaFin] = useState(initialFechaFin);
  const [error, setError] = useState(initialError);
  const [isPending, startTransition] = useTransition();

  const handleRefresh = () => {
    startTransition(async () => {
      try {
        setError("");
        console.log("🔄 Recargando datos con filtros:", {
          fechaInicio,
          fechaFin,
        });

        const result = await getAllReportesData({
          fecha_inicio: fechaInicio,
          fecha_fin: fechaFin,
        });

        if (result.success && result.data) {
          // Asegurar que estadisticas siempre tenga un valor
          const dataConEstadisticas = {
            ...result.data,
            estadisticas: result.data.estadisticas || {
              total_usuarios: 0,
              total_embarcaciones: 0,
              embarcaciones_activas: 0,
              total_salidas_hoy: 0,
              total_pasajeros_hoy: 0,
              ocupacion_promedio: 0,
              ingresos_estimados: 0,
              salidas_este_mes: 0,
              pasajeros_este_mes: 0,
              tendencia_mes_anterior: 0,
            },
          };
          setReporteData(dataConEstadisticas);
          console.log("✅ Datos recargados exitosamente");
        } else {
          setError(result.error || "Error al cargar los reportes");
          console.error("❌ Error al recargar:", result.error);
        }
      } catch (error) {
        const errorMessage =
          error instanceof Error
            ? error.message
            : "Error al cargar los reportes";
        setError(errorMessage);
        console.error("❌ Error inesperado:", error);
      }
    });
  };

  const handleExportReport = async (
    tipo: "ejecutivo" | "prestadores" | "ocupacion"
  ) => {
    try {
      console.log(`📄 Exportando reporte ${tipo}...`);

      // Importar dinámicamente la función de descarga
      const { descargarCSV } = await import("@/lib/utils/csv-generator");

      const result = await exportarReporte(tipo, {
        fecha_inicio: fechaInicio,
        fecha_fin: fechaFin,
      });

      if (result.success && result.csv && result.nombreArchivo) {
        // Descargar el archivo CSV
        descargarCSV(result.csv, result.nombreArchivo);

        console.log(`✅ Reporte ${tipo} descargado: ${result.nombreArchivo}`);

        // Mostrar mensaje de éxito breve (opcional)
        // Si quieres un toast, puedes implementarlo aquí
      } else {
        const errorMsg = result.error || `Error al exportar reporte ${tipo}`;
        setError(errorMsg);
        alert(errorMsg);
      }
    } catch (error) {
      console.error("Error exportando reporte:", error);
      const errorMsg = "Error inesperado al exportar el reporte";
      setError(errorMsg);
      alert(errorMsg);
    }
  };

  const { estadisticas, ocupacion_por_dia, reporte_por_prestador } =
    reporteData;

  if (isPending) {
    return <LoadingState />;
  }

  if (error) {
    return <ErrorState error={error} onRetry={handleRefresh} />;
  }

  return (
    <div className="space-y-6">
      <ReportesHeader
        fechaInicio={fechaInicio}
        fechaFin={fechaFin}
        onFechaInicioChange={setFechaInicio}
        onFechaFinChange={setFechaFin}
        onRefresh={handleRefresh}
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
            onExportEjecutivo={() => handleExportReport("ejecutivo")}
            onExportPrestadores={() => handleExportReport("prestadores")}
            onExportOcupacion={() => handleExportReport("ocupacion")}
            isLoading={isPending}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
