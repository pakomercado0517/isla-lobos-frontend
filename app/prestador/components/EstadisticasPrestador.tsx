"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  BarChart3,
  Calendar,
  Ship,
  Users,
  Clock,
  Award,
  Target,
  TrendingUp,
} from "lucide-react";
import type { Salida } from "@/lib/types/salida";
import type { Embarcacion } from "@/lib/types/embarcacion";

interface EstadisticasPrestadorProps {
  salidas: Salida[];
  embarcaciones: Embarcacion[];
}

export function EstadisticasPrestador({ salidas, embarcaciones }: EstadisticasPrestadorProps) {
  // Calcular estadísticas
  const totalSalidas = salidas.length;
  const totalPasajeros = salidas.reduce((sum, salida) => sum + (salida.numero_pasajeros || 0), 0);
  const salidasCompletadas = salidas.filter(s => s.estado === 'completada').length;
  const embarcacionesActivas = embarcaciones.filter(e => e.estado === 'disponible').length;
  const promedioOcupacion = totalSalidas > 0 ? Math.round((totalPasajeros / totalSalidas)) : 0;
  const tasaCompletadas = totalSalidas > 0 ? Math.round((salidasCompletadas / totalSalidas) * 100) : 0;

  return (
    <Card className="mb-4 sm:mb-6">
      <CardHeader className="p-4 sm:p-6">
        <CardTitle className="flex items-center space-x-2 text-base sm:text-lg">
          <BarChart3 className="w-4 h-4 sm:w-5 sm:h-5 text-[var(--isla-teal)]" />
          <span>Mis Estadísticas</span>
        </CardTitle>
        <CardDescription className="text-xs sm:text-sm mt-1">
          Resumen de tu actividad y rendimiento como prestador
        </CardDescription>
      </CardHeader>
      <CardContent className="p-4 sm:p-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
          {/* Total de Salidas */}
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-3 sm:p-4 border border-blue-200">
            <div className="flex items-center justify-between mb-1.5 sm:mb-2">
              <Calendar className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-blue-600" />
              <Badge variant="outline" className="bg-blue-200 text-blue-700 border-blue-300 text-xs px-2 py-0.5">
                Total
              </Badge>
            </div>
            <div className="text-2xl sm:text-3xl font-bold text-blue-800 mb-0.5 sm:mb-1">{totalSalidas}</div>
            <div className="text-xs sm:text-sm text-blue-600">
              <span className="flex items-center gap-1">
                <Target className="w-3 h-3" />
                Salidas registradas
              </span>
            </div>
            <div className="text-xs text-blue-500 mt-0.5 sm:mt-1">
              {salidasCompletadas} completadas
            </div>
          </div>

          {/* Total de Pasajeros */}
          <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-3 sm:p-4 border border-green-200">
            <div className="flex items-center justify-between mb-1.5 sm:mb-2">
              <Users className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-green-600" />
              <Badge variant="outline" className="bg-green-200 text-green-700 border-green-300 text-xs px-2 py-0.5">
                Turistas
              </Badge>
            </div>
            <div className="text-2xl sm:text-3xl font-bold text-green-800 mb-0.5 sm:mb-1">{totalPasajeros}</div>
            <div className="text-xs sm:text-sm text-green-600">
              <span className="flex items-center gap-1">
                <TrendingUp className="w-3 h-3" />
                Total transportados
              </span>
            </div>
            <div className="text-xs text-green-500 mt-0.5 sm:mt-1">
              Promedio: {promedioOcupacion} por salida
            </div>
          </div>

          {/* Mis Embarcaciones */}
          <div className="bg-gradient-to-br from-teal-50 to-teal-100 rounded-lg p-3 sm:p-4 border border-teal-200">
            <div className="flex items-center justify-between mb-1.5 sm:mb-2">
              <Ship className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-teal-600" />
              <Badge variant="outline" className="bg-teal-200 text-teal-700 border-teal-300 text-xs px-2 py-0.5">
                Flota
              </Badge>
            </div>
            <div className="text-2xl sm:text-3xl font-bold text-teal-800 mb-0.5 sm:mb-1">{embarcaciones.length}</div>
            <div className="text-xs sm:text-sm text-teal-600">
              <span className="flex items-center gap-1">
                <Ship className="w-3 h-3" />
                Embarcaciones totales
              </span>
            </div>
            <div className="text-xs text-teal-500 mt-0.5 sm:mt-1">
              {embarcacionesActivas} disponibles
            </div>
          </div>

          {/* Tasa de Éxito */}
          <div className="bg-gradient-to-br from-amber-50 to-amber-100 rounded-lg p-3 sm:p-4 border border-amber-200">
            <div className="flex items-center justify-between mb-1.5 sm:mb-2">
              <Award className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-amber-600" />
              <Badge variant="outline" className="bg-amber-200 text-amber-700 border-amber-300 text-xs px-2 py-0.5">
                Éxito
              </Badge>
            </div>
            <div className="text-2xl sm:text-3xl font-bold text-amber-800 mb-0.5 sm:mb-1">{tasaCompletadas}%</div>
            <div className="text-xs sm:text-sm text-amber-600">
              <span className="flex items-center gap-1">
                <Award className="w-3 h-3" />
                Tasa de completadas
              </span>
            </div>
            <div className="text-xs text-amber-500 mt-0.5 sm:mt-1">
              {salidasCompletadas} de {totalSalidas} salidas
            </div>
          </div>
        </div>

        {/* Sección de Métricas Detalladas */}
        <div className="grid grid-cols-3 gap-2 sm:gap-4 md:gap-6 mt-4 sm:mt-6 md:mt-8">
          <div className="text-center p-2 sm:p-0">
            <div className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900">
              {embarcaciones.reduce((sum, e) => sum + (e.capacidad || 0), 0)}
            </div>
            <div className="text-xs sm:text-sm text-gray-600 mt-0.5">Capacidad Total</div>
            <div className="text-xs text-teal-600 mt-0.5 sm:mt-1">🚢 Máximos</div>
          </div>
          <div className="text-center p-2 sm:p-0">
            <div className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900">
              {Math.round((promedioOcupacion / (embarcaciones.reduce((sum, e) => sum + (e.capacidad || 0), 0) / embarcaciones.length || 1)) * 100) || 0}%
            </div>
            <div className="text-xs sm:text-sm text-gray-600 mt-0.5">Ocupación</div>
            <div className="text-xs text-blue-600 mt-0.5 sm:mt-1">📊 Eficiencia</div>
          </div>
          <div className="text-center p-2 sm:p-0">
            <div className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900">
              {totalSalidas > 0 ? Math.round(totalSalidas / 30) : 0}
            </div>
            <div className="text-xs sm:text-sm text-gray-600 mt-0.5">Por Mes</div>
            <div className="text-xs text-green-600 mt-0.5 sm:mt-1">📈 Estimado</div>
          </div>
        </div>

        {/* Información adicional */}
        <div className="bg-blue-50 rounded-lg p-3 sm:p-4 mt-4 sm:mt-6 border border-blue-200">
          <div className="flex items-start gap-2 sm:gap-3">
            <div className="bg-blue-100 rounded-full p-1.5 sm:p-2 flex-shrink-0">
              <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="font-semibold text-blue-900 mb-1 text-sm sm:text-base">
                Tu Desempeño
              </h4>
              <p className="text-xs sm:text-sm text-blue-700 mb-1.5 sm:mb-2">
                {tasaCompletadas >= 80 
                  ? "¡Excelente trabajo! Mantienes una alta tasa de servicios completados."
                  : tasaCompletadas >= 60
                  ? "Buen desempeño. Hay oportunidades para mejorar la tasa de completadas."
                  : "Oportunidad de mejora en completar los servicios programados."
                }
              </p>
              <div className="text-xs text-blue-600">
                🎯 Meta: 90% completados | 🚢 Optimizar capacidad
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}