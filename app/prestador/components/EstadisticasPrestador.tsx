"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Calendar,
  Ship,
  Users,
  Award,
  TrendingUp,
} from "lucide-react";
import type { Salida } from "@/lib/types/salida";
import type { Embarcacion } from "@/lib/types/embarcacion";

interface EstadisticasPrestadorProps {
  salidas: Salida[];
  embarcaciones: Embarcacion[];
}

interface MetricCardProps {
  icon: React.ElementType;
  label: string;
  value: string | number;
  subtitle: string;
  gradient: string;
  iconColor: string;
}

function MetricCard({ icon: Icon, label, value, subtitle, gradient, iconColor }: MetricCardProps) {
  return (
    <div className={`${gradient} rounded-xl lg:rounded-2xl p-4 sm:p-5 lg:p-6 xl:p-7 border border-gray-100 shadow-sm hover:shadow-lg transition-all duration-300 group`}>
      <div className="flex items-start justify-between mb-3 lg:mb-4">
        <div className={`p-2.5 lg:p-3 xl:p-3.5 rounded-lg lg:rounded-xl ${iconColor} bg-white/50 group-hover:bg-white/70 transition-colors`}>
          <Icon className="w-5 h-5 sm:w-6 sm:h-6 lg:w-7 lg:h-7 xl:w-8 xl:h-8" />
        </div>
      </div>
      <div className="space-y-1 lg:space-y-2">
        <p className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold text-gray-900">{value}</p>
        <p className="text-sm lg:text-base xl:text-lg font-semibold text-gray-700">{label}</p>
        <p className="text-xs lg:text-sm text-gray-500">{subtitle}</p>
      </div>
    </div>
  );
}

export function EstadisticasPrestador({ salidas, embarcaciones }: EstadisticasPrestadorProps) {
  // Calcular estadísticas
  const totalSalidas = salidas.length;
  const totalPasajeros = salidas.reduce((sum, salida) => sum + (salida.numero_pasajeros || 0), 0);
  const salidasCompletadas = salidas.filter(s => s.estado === 'completada').length;
  const embarcacionesActivas = embarcaciones.filter(e => e.estado === 'disponible').length;
  const promedioOcupacion = totalSalidas > 0 ? Math.round((totalPasajeros / totalSalidas)) : 0;
  const tasaCompletadas = totalSalidas > 0 ? Math.round((salidasCompletadas / totalSalidas) * 100) : 0;
  const capacidadTotal = embarcaciones.reduce((sum, e) => sum + (e.capacidad || 0), 0);
  const ocupacionPromedio = embarcaciones.length > 0 
    ? Math.round((promedioOcupacion / (capacidadTotal / embarcaciones.length || 1)) * 100) || 0
    : 0;

  return (
    <Card className="border-gray-100 shadow-sm">
      <CardHeader className="pb-4 px-4 sm:px-6 lg:px-8 pt-6 lg:pt-8">
        <CardTitle className="text-lg sm:text-xl lg:text-2xl xl:text-3xl font-bold text-gray-900">
          Resumen de Actividad
        </CardTitle>
      </CardHeader>
      <CardContent className="px-4 sm:px-6 lg:px-8 pb-6 lg:pb-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 xl:gap-8">
          <MetricCard
            icon={Calendar}
            label="Salidas Registradas"
            value={totalSalidas}
            subtitle={`${salidasCompletadas} completadas`}
            gradient="bg-gradient-to-br from-blue-50 to-blue-50/50"
            iconColor="text-blue-600"
          />
          
          <MetricCard
            icon={Users}
            label="Total Pasajeros"
            value={totalPasajeros}
            subtitle={`Promedio: ${promedioOcupacion} por salida`}
            gradient="bg-gradient-to-br from-green-50 to-green-50/50"
            iconColor="text-green-600"
          />
          
          <MetricCard
            icon={Ship}
            label="Embarcaciones"
            value={embarcaciones.length}
            subtitle={`${embarcacionesActivas} disponibles`}
            gradient="bg-gradient-to-br from-[var(--isla-teal)]/10 to-[var(--isla-teal)]/5"
            iconColor="text-[var(--isla-teal)]"
          />
          
          <MetricCard
            icon={Award}
            label="Tasa de Éxito"
            value={`${tasaCompletadas}%`}
            subtitle={`${salidasCompletadas} de ${totalSalidas} salidas`}
            gradient="bg-gradient-to-br from-amber-50 to-amber-50/50"
            iconColor="text-amber-600"
          />
        </div>

        {/* Métricas secundarias - más compactas */}
        {embarcaciones.length > 0 && (
          <div className="grid grid-cols-3 gap-3 sm:gap-4 lg:gap-6 xl:gap-8 mt-6 lg:mt-8 pt-6 lg:pt-8 border-t border-gray-100">
            <div className="text-center">
              <div className="text-xl sm:text-2xl lg:text-3xl xl:text-4xl font-bold text-gray-900 mb-1 lg:mb-2">
                {capacidadTotal}
              </div>
              <p className="text-xs sm:text-sm lg:text-base text-gray-600 font-medium">Capacidad Total</p>
            </div>
            <div className="text-center">
              <div className="text-xl sm:text-2xl lg:text-3xl xl:text-4xl font-bold text-gray-900 mb-1 lg:mb-2">
                {ocupacionPromedio}%
              </div>
              <p className="text-xs sm:text-sm lg:text-base text-gray-600 font-medium">Ocupación</p>
            </div>
            <div className="text-center">
              <div className="text-xl sm:text-2xl lg:text-3xl xl:text-4xl font-bold text-gray-900 mb-1 lg:mb-2">
                {totalSalidas > 0 ? Math.round(totalSalidas / 30) : 0}
              </div>
              <p className="text-xs sm:text-sm lg:text-base text-gray-600 font-medium">Promedio/Mes</p>
            </div>
          </div>
        )}

        {/* Feedback de desempeño - minimalista */}
        {tasaCompletadas < 100 && (
          <div className="mt-6 lg:mt-8 pt-6 lg:pt-8 border-t border-gray-100">
            <div className="flex items-start gap-3 lg:gap-4 p-4 lg:p-5 xl:p-6 bg-gray-50 rounded-xl lg:rounded-2xl">
              <TrendingUp className="w-5 h-5 lg:w-6 lg:h-6 xl:w-7 xl:h-7 text-[var(--isla-teal)] shrink-0 mt-0.5" />
              <div className="flex-1 min-w-0">
                <p className="text-sm lg:text-base xl:text-lg font-semibold text-gray-900 mb-1 lg:mb-2">
                  {tasaCompletadas >= 80 
                    ? "Excelente desempeño"
                    : tasaCompletadas >= 60
                    ? "Buen desempeño"
                    : "Oportunidad de mejora"
                  }
                </p>
                <p className="text-xs lg:text-sm text-gray-600">
                  {tasaCompletadas >= 80 
                    ? "Mantén esta tasa de servicios completados."
                    : tasaCompletadas >= 60
                    ? "Hay oportunidades para mejorar la tasa de completadas."
                    : "Enfócate en completar los servicios programados."
                  }
                </p>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}