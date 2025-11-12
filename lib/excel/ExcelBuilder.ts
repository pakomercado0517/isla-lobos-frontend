/**
 * ExcelBuilder - Clase principal para generar archivos Excel profesionales de CONANP
 * Orchestador de todos los generadores de reportes y hojas Excel
 */

import ExcelJS, { Workbook, Buffer } from "exceljs";
import { 
  EstadisticasGenerales, 
  OcupacionPorDia, 
  ReportePorPrestador, 
  FiltrosReporte 
} from "@/actions/reportes";

export interface ExcelReportData {
  estadisticas: EstadisticasGenerales;
  ocupacion_por_dia: OcupacionPorDia[];
  reporte_por_prestador: ReportePorPrestador[];
}

export interface ExcelGenerationOptions {
  includeCharts?: boolean;
  includeConditionalFormatting?: boolean;
  pageFormat?: "A4" | "Letter";
  orientation?: "portrait" | "landscape";
}

export class ExcelBuilder {
  private workbook: Workbook;
  private options: ExcelGenerationOptions;
  private filtros?: FiltrosReporte;

  constructor(options: ExcelGenerationOptions = {}) {
    this.workbook = new ExcelJS.Workbook();
    this.options = {
      includeCharts: true,
      includeConditionalFormatting: true,
      pageFormat: "A4",
      orientation: "landscape",
      ...options,
    };

    // Configurar metadata del workbook
    this.workbook.creator = "Sistema Isla Lobos - CONANP";
    this.workbook.lastModifiedBy = "CONANP";
    this.workbook.created = new Date();
    this.workbook.modified = new Date();
    this.workbook.lastPrinted = new Date();
    
    // Configurar propiedades del documento
    // Las propiedades se configurarán según las disponibles en ExcelJS
  }

  /**
   * Configura filtros de fechas para el reporte
   */
  setDateRange(filtros: FiltrosReporte): ExcelBuilder {
    this.filtros = filtros;
    return this;
  }

  /**
   * Genera el reporte ejecutivo completo con múltiples hojas
   */
  async generateExecutiveReport(data: ExcelReportData): Promise<Buffer> {
    // Importar generadores dinámicamente para mejor performance
    const [
      { generateExecutiveSummary },
      { generateProvidersReport },
      { generateOccupancyReport }
    ] = await Promise.all([
      import("./generators/ExecutiveReport"),
      import("./generators/ProvidersReport"),  
      import("./generators/OccupancyReport")
    ]);

    try {
      // 1. Hoja de Resumen Ejecutivo
      await generateExecutiveSummary(
        this.workbook,
        data,
        this.filtros,
        {
          includeCharts: this.options.includeCharts,
          includeConditionalFormatting: this.options.includeConditionalFormatting,
        }
      );

      // 2. Hoja de Análisis por Prestadores
      await generateProvidersReport(
        this.workbook,
        data.reporte_por_prestador,
        this.filtros,
        {
          includeCharts: this.options.includeCharts,
          includeConditionalFormatting: this.options.includeConditionalFormatting,
        }
      );

      // 3. Hoja de Ocupación Diaria
      await generateOccupancyReport(
        this.workbook,
        data.ocupacion_por_dia,
        this.filtros,
        {
          includeCharts: this.options.includeCharts,
          includeConditionalFormatting: this.options.includeConditionalFormatting,
        }
      );

      // Configurar hoja activa (la primera)
      this.workbook.views = [
        {
          x: 0, y: 0, width: 10000, height: 20000,
          firstSheet: 0, activeTab: 0, visibility: "visible"
        }
      ];

      // Generar buffer del archivo Excel
      return await this.workbook.xlsx.writeBuffer();

    } catch (error) {
      throw new Error(
        `Error al generar reporte ejecutivo: ${
          error instanceof Error ? error.message : "Error desconocido"
        }`
      );
    }
  }

  /**
   * Genera solo el reporte de prestadores
   */
  async generateProvidersOnlyReport(providers: ReportePorPrestador[]): Promise<Buffer> {
    const { generateProvidersReport } = await import("./generators/ProvidersReport");
    
    try {
      await generateProvidersReport(
        this.workbook,
        providers,
        this.filtros,
        {
          includeCharts: this.options.includeCharts,
          includeConditionalFormatting: this.options.includeConditionalFormatting,
        }
      );

      return await this.workbook.xlsx.writeBuffer();
    } catch (error) {
      throw new Error(
        `Error al generar reporte de prestadores: ${
          error instanceof Error ? error.message : "Error desconocido"
        }`
      );
    }
  }

  /**
   * Genera solo el reporte de ocupación
   */
  async generateOccupancyOnlyReport(ocupacion: OcupacionPorDia[]): Promise<Buffer> {
    const { generateOccupancyReport } = await import("./generators/OccupancyReport");
    
    try {
      await generateOccupancyReport(
        this.workbook,
        ocupacion,
        this.filtros,
        {
          includeCharts: this.options.includeCharts,
          includeConditionalFormatting: this.options.includeConditionalFormatting,
        }
      );

      return await this.workbook.xlsx.writeBuffer();
    } catch (error) {
      throw new Error(
        `Error al generar reporte de ocupación: ${
          error instanceof Error ? error.message : "Error desconocido"
        }`
      );
    }
  }

  /**
   * Genera reporte mensual con estilo de plantilla profesional
   */
  async generateMonthlyAnalysisReport(ocupacion: OcupacionPorDia[]): Promise<Buffer> {
    const { generateMonthlyAnalysisReport } = await import("./generators/MonthlyAnalysisReport");
    
    try {
      await generateMonthlyAnalysisReport(
        this.workbook,
        ocupacion,
        this.filtros,
        {
          includeCharts: this.options.includeCharts,
        }
      );

      return await this.workbook.xlsx.writeBuffer();
    } catch (error) {
      throw new Error(
        `Error al generar reporte mensual: ${
          error instanceof Error ? error.message : "Error desconocido"
        }`
      );
    }
  }

  /**
   * Genera nombre de archivo basado en filtros y tipo
   */
  generateFileName(type: "ejecutivo" | "prestadores" | "ocupacion" | "mensual"): string {
    const timestamp = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
    
    let filename = `Isla_Lobos_${type}_${timestamp}`;
    
    if (this.filtros?.fecha_inicio && this.filtros?.fecha_fin) {
      const inicio = this.filtros.fecha_inicio.replace(/-/g, '');
      const fin = this.filtros.fecha_fin.replace(/-/g, '');
      filename = `Isla_Lobos_${type}_${inicio}_${fin}_${timestamp}`;
    }
    
    return `${filename}.xlsx`;
  }

  /**
   * Convierte el buffer a base64 para descarga en navegador
   */
  static bufferToBase64(buffer: Buffer): string {
    const uint8Array = new Uint8Array(buffer);
    let binary = '';
    uint8Array.forEach(byte => binary += String.fromCharCode(byte));
    return btoa(binary);
  }

  /**
   * Crea un blob para descarga directa
   */
  static bufferToBlob(buffer: Buffer): Blob {
    return new Blob([buffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    });
  }

  /**
   * Obtiene estadísticas del archivo generado
   */
  getFileStats(): {
    worksheets: number;
    totalCells: number;
    hasCharts: boolean;
    hasConditionalFormatting: boolean;
  } {
    let totalCells = 0;
    let hasConditionalFormatting = false;

    this.workbook.worksheets.forEach(worksheet => {
      // Contar celdas utilizadas
      worksheet.eachRow({ includeEmpty: false }, () => {
        totalCells++;
      });

      // Verificar formato condicional
      try {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        if ((worksheet as any).conditionalFormattings && (worksheet as any).conditionalFormattings.length > 0) {
          hasConditionalFormatting = true;
        }
      } catch {
        // Ignorar errores de propiedades no disponibles
      }
    });

    return {
      worksheets: this.workbook.worksheets.length,
      totalCells,
      hasCharts: false, // Se implementará en versiones futuras
      hasConditionalFormatting,
    };
  }

  /**
   * Limpia recursos y reinicia el workbook
   */
  reset(): ExcelBuilder {
    this.workbook = new ExcelJS.Workbook();
    return this;
  }

  /**
   * Agrega protección al archivo (opcional)
   */
  addProtection(password?: string): ExcelBuilder {
    if (password && this.workbook.properties) {
      // Las propiedades de seguridad no están disponibles en el tipo actual
      // Esta funcionalidad se puede implementar a nivel de hoja individual
    }
    return this;
  }
}

// Función helper para uso directo sin instanciar la clase
export async function generateExcelReport(
  type: "ejecutivo" | "prestadores" | "ocupacion" | "mensual",
  data: ExcelReportData | ReportePorPrestador[] | OcupacionPorDia[],
  filtros?: FiltrosReporte,
  options?: ExcelGenerationOptions
): Promise<{ buffer: Buffer; filename: string; stats: { worksheets: number; totalCells: number; hasCharts: boolean; hasConditionalFormatting: boolean } }> {
  const builder = new ExcelBuilder(options);
  
  if (filtros) {
    builder.setDateRange(filtros);
  }

  let buffer: Buffer;
  
  try {
    switch (type) {
      case "ejecutivo":
        buffer = await builder.generateExecutiveReport(data as ExcelReportData);
        break;
      case "prestadores":
        buffer = await builder.generateProvidersOnlyReport(data as ReportePorPrestador[]);
        break;
      case "ocupacion":
        buffer = await builder.generateOccupancyOnlyReport(data as OcupacionPorDia[]);
        break;
      case "mensual":
        buffer = await builder.generateMonthlyAnalysisReport(data as OcupacionPorDia[]);
        break;
      default:
        throw new Error(`Tipo de reporte no soportado: ${type}`);
    }

    return {
      buffer,
      filename: builder.generateFileName(type),
      stats: builder.getFileStats(),
    };
  } catch (error) {
    throw new Error(
      `Error en generateExcelReport: ${
        error instanceof Error ? error.message : "Error desconocido"
      }`
    );
  }
}