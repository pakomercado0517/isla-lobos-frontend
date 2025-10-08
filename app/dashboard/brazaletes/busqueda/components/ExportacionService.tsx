import type { Brazalete } from "@/lib/types/brazaletes";
import { 
  formatDateForExport, 
  generateExportFilename, 
  createExportBlob, 
  downloadFile 
} from "./utils";

export class ExportacionService {
  static exportarBrazaletes(brazaletes: Brazalete[], formato: "csv" | "excel"): void {
    if (brazaletes.length === 0) {
      alert("No hay datos para exportar");
      return;
    }

    try {
      // Preparar datos para exportación
      const datosExportacion = brazaletes.map((brazalete) => ({
        codigo: brazalete.codigo,
        tipo: brazalete.tipo,
        estado: brazalete.estado,
        precio: brazalete.precio,
        prestador: brazalete.prestador?.nombre || "",
        lote: brazalete.lote?.numero_lote || "",
        fecha_creacion: formatDateForExport(brazalete.fecha_creacion),
        fecha_asignacion: brazalete.fecha_asignacion
          ? formatDateForExport(brazalete.fecha_asignacion)
          : "",
        fecha_uso: brazalete.fecha_uso
          ? formatDateForExport(brazalete.fecha_uso)
          : "",
        turista_nacionalidad: brazalete.turista_nacionalidad || "",
        turista_edad: brazalete.turista_edad || "",
      }));

      // Generar contenido según formato
      const { content, filename } = this.generarContenido(datosExportacion, formato);
      
      // Crear y descargar archivo
      const blob = createExportBlob(content, formato);
      downloadFile(blob, filename);

      console.log("🔍 Búsqueda: Exportación completada");
    } catch (error) {
      console.error("🔍 Búsqueda: Error al exportar:", error);
      alert("Error al exportar los datos");
    }
  }

  private static generarContenido(
    datos: Array<Record<string, string | number>>, 
    formato: "csv" | "excel"
  ): { content: string; filename: string } {
    const filename = generateExportFilename(formato);
    
    if (formato === "csv") {
      const headers = Object.keys(datos[0]).join(",");
      const rows = datos.map((row) => Object.values(row).join(","));
      const content = [headers, ...rows].join("\n");
      return { content, filename };
    } else {
      // Para Excel, usar formato tab-separated
      const headers = Object.keys(datos[0]).join("\t");
      const rows = datos.map((row) => Object.values(row).join("\t"));
      const content = [headers, ...rows].join("\n");
      return { content, filename };
    }
  }
}
