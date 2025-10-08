import { TrendingUp } from "lucide-react";

export function EmptyState() {
  return (
    <div className="text-center py-12">
      <TrendingUp className="w-12 h-12 text-gray-400 mx-auto mb-4" />
      <h3 className="text-lg font-medium text-gray-900 mb-2">
        No hay datos disponibles
      </h3>
      <p className="text-gray-600">
        Ajusta los filtros y genera un reporte para ver las estadísticas
      </p>
    </div>
  );
}
