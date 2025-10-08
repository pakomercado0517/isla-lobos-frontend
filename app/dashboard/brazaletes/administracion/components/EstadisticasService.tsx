import {
  getInventarioBrazaletes,
  getLotesBrazaletes,
  getEstadisticasBrazaletes,
  getReporteVentasBrazaletes,
} from "@/actions/brazaletes";
import { generateDateRange, calculateEstadisticasFinales } from "./utils";

export interface EstadisticasAdministracion {
  totalBrazaletes: number;
  totalLotes: number;
  totalVentas: number;
  totalUsos: number;
  ultimaActualizacion: string;
}

export class EstadisticasService {
  static async loadEstadisticas(): Promise<EstadisticasAdministracion> {
    console.log("🔧 Administración: Cargando estadísticas...");

    const { fechaInicio, fechaFin } = generateDateRange(30);

    const [
      inventarioResult,
      lotesResult,
      estadisticasResult,
      reporteVentasResult,
    ] = await Promise.all([
      getInventarioBrazaletes(),
      getLotesBrazaletes({ limit: 1 }), // Solo necesitamos el total
      getEstadisticasBrazaletes({
        fecha_inicio: fechaInicio,
        fecha_fin: fechaFin,
      }),
      getReporteVentasBrazaletes({
        fecha_inicio: fechaInicio,
        fecha_fin: fechaFin,
      }),
    ]);

    // Log de resultados para debugging
    if (inventarioResult.success && inventarioResult.data) {
      console.log("🔧 Administración: Inventario cargado:", inventarioResult.data);
    }

    if (estadisticasResult.success && estadisticasResult.data) {
      console.log("🔧 Administración: Estadísticas cargadas:", estadisticasResult.data);
    } else {
      console.error("🔧 Administración: Error al cargar estadísticas:", estadisticasResult);
    }

    if (reporteVentasResult.success && reporteVentasResult.data) {
      console.log("🔧 Administración: Reporte de ventas cargado:", reporteVentasResult.data);
    } else {
      console.error("🔧 Administración: Error al cargar reporte de ventas:", reporteVentasResult);
    }

    const estadisticasFinales = calculateEstadisticasFinales(
      inventarioResult,
      lotesResult,
      estadisticasResult,
      reporteVentasResult
    );

    console.log("🔧 Administración: Estadísticas finales:", estadisticasFinales);

    return estadisticasFinales;
  }
}
