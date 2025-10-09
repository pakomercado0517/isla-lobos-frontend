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
    const { fechaInicio, fechaFin } = generateDateRange(30);

    const [
      inventarioResult,
      lotesResult,
      estadisticasResult,
      reporteVentasResult,
    ] = await Promise.all([
      getInventarioBrazaletes(),
      getLotesBrazaletes({ limit: 1 }),
      getEstadisticasBrazaletes({
        fecha_inicio: fechaInicio,
        fecha_fin: fechaFin,
      }),
      getReporteVentasBrazaletes({
        fecha_inicio: fechaInicio,
        fecha_fin: fechaFin,
      }),
    ]);

    const estadisticasFinales = calculateEstadisticasFinales(
      inventarioResult,
      lotesResult,
      estadisticasResult,
      reporteVentasResult
    );

    return estadisticasFinales;
  }
}
