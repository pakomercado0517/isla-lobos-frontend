"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Package, Users, TrendingUp, Calendar } from "lucide-react";
import type { Salida } from "@/lib/types/salida";
import type { BrazaletesUtilizadosSalida } from "@/lib/types/brazaletes";

interface EstadisticasBrazaletesUtilizadosProps {
  salidasConBrazaletes: Array<{
    salida: Salida;
    brazaletes: BrazaletesUtilizadosSalida | null;
  }>;
}

export function EstadisticasBrazaletesUtilizados({
  salidasConBrazaletes,
}: EstadisticasBrazaletesUtilizadosProps) {
  const totalSalidas = salidasConBrazaletes.length;
  const totalBrazaletes = salidasConBrazaletes.reduce(
    (sum, item) =>
      sum + (item.brazaletes?.estadisticas.total_brazaletes || 0),
    0
  );

  const porNacionalidad = salidasConBrazaletes.reduce(
    (acc, item) => {
      if (item.brazaletes?.estadisticas.por_nacionalidad) {
        acc.locales += item.brazaletes.estadisticas.por_nacionalidad.locales;
        acc.nacionales +=
          item.brazaletes.estadisticas.por_nacionalidad.nacionales;
        acc.internacionales +=
          item.brazaletes.estadisticas.por_nacionalidad.internacionales;
      }
      return acc;
    },
    { locales: 0, nacionales: 0, internacionales: 0 }
  );

  const estadisticas = [
    {
      label: "Salidas con Brazaletes",
      value: totalSalidas,
      icon: Calendar,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      label: "Total Brazaletes Utilizados",
      value: totalBrazaletes,
      icon: Package,
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
    {
      label: "Locales",
      value: porNacionalidad.locales,
      icon: Users,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
    },
    {
      label: "Nacionales",
      value: porNacionalidad.nacionales,
      icon: Users,
      color: "text-orange-600",
      bgColor: "bg-orange-50",
    },
    {
      label: "Internacionales",
      value: porNacionalidad.internacionales,
      icon: Users,
      color: "text-teal-600",
      bgColor: "bg-teal-50",
    },
  ];

  if (totalSalidas === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-base sm:text-lg flex items-center gap-2">
            <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5" />
            Estadísticas
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-6 md:py-8">
            <Package className="w-10 h-10 md:w-12 md:h-12 text-gray-400 mx-auto mb-3 md:mb-4" />
            <p className="text-sm md:text-base text-gray-600">
              No hay estadísticas disponibles aún
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base sm:text-lg flex items-center gap-2">
          <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5" />
          Estadísticas de Uso
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 md:gap-4">
          {estadisticas.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div
                key={index}
                className={`${stat.bgColor} rounded-lg p-3 md:p-4 border border-transparent hover:border-gray-200 transition-colors`}
              >
                <div className="flex items-center justify-between mb-2">
                  <Icon className={`w-4 h-4 sm:w-5 sm:h-5 ${stat.color}`} />
                </div>
                <div className="space-y-1">
                  <p className="text-xs sm:text-sm text-gray-600 font-medium">
                    {stat.label}
                  </p>
                  <p
                    className={`text-xl sm:text-2xl font-bold ${stat.color} break-words`}
                  >
                    {stat.value.toLocaleString("es-MX")}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
