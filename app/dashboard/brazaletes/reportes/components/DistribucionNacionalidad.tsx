import type { EstadisticasBrazaletes } from "@/lib/types/brazaletes";

interface DistribucionNacionalidadProps {
  estadisticas: EstadisticasBrazaletes;
}

export function DistribucionNacionalidad({
  estadisticas,
}: DistribucionNacionalidadProps) {
  return (
    <div className="bg-white p-6 rounded-lg border">
      <h3 className="text-lg font-semibold mb-4">
        Distribución por Nacionalidad
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="text-center p-4 bg-green-50 rounded-lg">
          <div className="text-2xl font-bold text-green-600">
            {estadisticas.utilizacion.por_nacionalidad.locales}
          </div>
          <div className="text-sm text-gray-600">🏠 Locales</div>
        </div>
        <div className="text-center p-4 bg-blue-50 rounded-lg">
          <div className="text-2xl font-bold text-blue-600">
            {estadisticas.utilizacion.por_nacionalidad.nacionales}
          </div>
          <div className="text-sm text-gray-600">🇲🇽 Nacionales</div>
        </div>
        <div className="text-center p-4 bg-purple-50 rounded-lg">
          <div className="text-2xl font-bold text-purple-600">
            {estadisticas.utilizacion.por_nacionalidad.internacionales}
          </div>
          <div className="text-sm text-gray-600">🌍 Internacionales</div>
        </div>
      </div>
    </div>
  );
}
