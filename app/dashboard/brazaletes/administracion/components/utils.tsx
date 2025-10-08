export function formatDateForDisplay(dateString: string): string {
  return new Date(dateString).toLocaleString("es-MX");
}

export function generateDateRange(days: number = 30): { fechaInicio: string; fechaFin: string } {
  const fechaFin = new Date();
  const fechaInicio = new Date();
  fechaInicio.setDate(fechaInicio.getDate() - days);

  return {
    fechaInicio: fechaInicio.toISOString().split("T")[0],
    fechaFin: fechaFin.toISOString().split("T")[0],
  };
}

export function calculateEstadisticasFinales(
  inventarioResult: { success: boolean; data?: { total_disponibles?: number } } | undefined,
  lotesResult: { success: boolean; data?: { pagination?: { total?: number } } } | undefined,
  estadisticasResult: { success: boolean; data?: { inventario?: { total_vendidos?: number; total_utilizados?: number } } } | undefined,
  reporteVentasResult: { success: boolean; data?: { resumen?: { total_ventas?: number } } } | undefined
): {
  totalBrazaletes: number;
  totalLotes: number;
  totalVentas: number;
  totalUsos: number;
  ultimaActualizacion: string;
} {
  let totalBrazaletes = 0;
  let totalLotes = 0;
  let totalVentas = 0;
  let totalUsos = 0;

  if (inventarioResult?.success && inventarioResult?.data) {
    totalBrazaletes = inventarioResult.data.total_disponibles || 0;
  }

  if (lotesResult?.success && lotesResult?.data) {
    totalLotes = lotesResult.data.pagination?.total || 0;
  }

  if (estadisticasResult?.success && estadisticasResult?.data) {
    totalVentas = estadisticasResult.data.inventario?.total_vendidos || 0;
    totalUsos = estadisticasResult.data.inventario?.total_utilizados || 0;
  }

  // Si las estadísticas no tienen ventas, intentar obtenerlas del reporte de ventas
  if (totalVentas === 0 && reporteVentasResult?.success && reporteVentasResult?.data) {
    totalVentas = reporteVentasResult.data.resumen?.total_ventas || 0;
  }

  return {
    totalBrazaletes,
    totalLotes,
    totalVentas,
    totalUsos,
    ultimaActualizacion: new Date().toISOString(),
  };
}
