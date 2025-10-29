"use client";

import { useState, useTransition } from "react";
import { clientLogger } from "@/lib/logger-client";
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
  exportarReporteExcel,
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
        } else {
          setError(result.error || "Error al cargar los reportes");
        }
      } catch (error) {
        const errorMessage =
          error instanceof Error
            ? error.message
            : "Error al cargar los reportes";
        clientLogger.error("Error al cargar reportes", error, {
          filtros: { fechaInicio, fechaFin },
        });
        setError(errorMessage);
      }
    });
  };

  const handleExportReport = async (
    tipo: "ejecutivo" | "prestadores" | "ocupacion"
  ) => {
    try {
      // Importar dinámicamente la función de descarga
      const { descargarCSV } = await import("@/lib/utils/csv-generator");

      const result = await exportarReporte(tipo, {
        fecha_inicio: fechaInicio,
        fecha_fin: fechaFin,
      });

      if (result.success && result.csv && result.nombreArchivo) {
        // Descargar el archivo CSV
        descargarCSV(result.csv, result.nombreArchivo);

        // Mostrar mensaje de éxito breve (opcional)
        // Si quieres un toast, puedes implementarlo aquí
      } else {
        const errorMsg = result.error || `Error al exportar reporte ${tipo}`;
        setError(errorMsg);
        alert(errorMsg);
      }
    } catch (error) {
      const errorMsg = "Error inesperado al exportar el reporte";
      clientLogger.error("Error al exportar reporte", error, { tipo });
      setError(errorMsg);
      alert(errorMsg);
    }
  };

  const handleExportExcelReport = async (
    tipo: "ejecutivo" | "prestadores" | "ocupacion"
  ) => {
    try {
      const result = await exportarReporteExcel(tipo, {
        fecha_inicio: fechaInicio,
        fecha_fin: fechaFin,
      });

      if (result.success && result.data) {
        // Convertir base64 a blob y descargar
        const bytes = atob(result.data.buffer);
        const byteNumbers = new Array(bytes.length);
        for (let i = 0; i < bytes.length; i++) {
          byteNumbers[i] = bytes.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);
        const blob = new Blob([byteArray], {
          type: result.data.mimeType,
        });

        // Crear enlace de descarga
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = result.data.filename;
        link.style.display = "none";

        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        // Limpiar URL
        URL.revokeObjectURL(url);
      } else {
        const errorMsg =
          result.error || `Error al exportar reporte Excel ${tipo}`;
        setError(errorMsg);
        alert(errorMsg);
      }
    } catch (error) {
      const errorMsg = "Error inesperado al exportar el reporte Excel";
      clientLogger.error("Error al exportar reporte Excel", error, { tipo });
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
    <div className="space-y-4 md:space-y-6">
      <ReportesHeader
        fechaInicio={fechaInicio}
        fechaFin={fechaFin}
        onFechaInicioChange={setFechaInicio}
        onFechaFinChange={setFechaFin}
        onRefresh={handleRefresh}
      />

      <MetricasCards estadisticas={estadisticas} />

      <Tabs defaultValue="ocupacion" className="space-y-4 md:space-y-4">
        <TabsList className="grid w-full grid-cols-3 gap-1">
          <TabsTrigger value="ocupacion" className="text-xs md:text-sm">
            Ocupación
          </TabsTrigger>
          <TabsTrigger value="prestadores" className="text-xs md:text-sm">
            Prestadores
          </TabsTrigger>
          <TabsTrigger value="exportar" className="text-xs md:text-sm">
            Exportar
          </TabsTrigger>
        </TabsList>

        <TabsContent value="ocupacion" className="space-y-4 mt-4 md:mt-6">
          <TablaOcupacionDiaria ocupacion={ocupacion_por_dia} />
        </TabsContent>

        <TabsContent value="prestadores" className="space-y-4 mt-4 md:mt-6">
          <TablaPrestadores prestadores={reporte_por_prestador} />
        </TabsContent>

        <TabsContent value="exportar" className="space-y-4 mt-4 md:mt-6">
          <ExportacionCards
            onExportEjecutivo={() => handleExportReport("ejecutivo")}
            onExportPrestadores={() => handleExportReport("prestadores")}
            onExportOcupacion={() => handleExportReport("ocupacion")}
            onExportEjecutivoExcel={() => handleExportExcelReport("ejecutivo")}
            onExportPrestadoresExcel={() =>
              handleExportExcelReport("prestadores")
            }
            onExportOcupacionExcel={() => handleExportExcelReport("ocupacion")}
            isLoading={isPending}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
