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
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <BarChart3 className="w-5 h-5 text-[var(--isla-teal)]" />
          <span>Mis Estadísticas</span>
        </CardTitle>
        <CardDescription>
          Resumen de tu actividad y rendimiento como prestador
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {/* Total de Salidas */}
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4 border border-blue-200">
            <div className="flex items-center justify-between mb-2">
              <Calendar className="w-8 h-8 text-blue-600" />
              <Badge variant="outline" className="bg-blue-200 text-blue-700 border-blue-300">
                Total
              </Badge>
            </div>
            <div className="text-3xl font-bold text-blue-800 mb-1">{totalSalidas}</div>
            <div className="text-sm text-blue-600">
              <span className="flex items-center gap-1">
                <Target className="w-3 h-3" />
                Salidas registradas
              </span>
            </div>
            <div className="text-xs text-blue-500 mt-1">
              {salidasCompletadas} completadas
            </div>
          </div>

          {/* Total de Pasajeros */}
          <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-4 border border-green-200">
            <div className="flex items-center justify-between mb-2">
              <Users className="w-8 h-8 text-green-600" />
              <Badge variant="outline" className="bg-green-200 text-green-700 border-green-300">
                Turistas
              </Badge>
            </div>
            <div className="text-3xl font-bold text-green-800 mb-1">{totalPasajeros}</div>
            <div className="text-sm text-green-600">
              <span className="flex items-center gap-1">
                <TrendingUp className="w-3 h-3" />
                Total transportados
              </span>
            </div>
            <div className="text-xs text-green-500 mt-1">
              Promedio: {promedioOcupacion} por salida
            </div>
          </div>

          {/* Mis Embarcaciones */}
          <div className="bg-gradient-to-br from-teal-50 to-teal-100 rounded-lg p-4 border border-teal-200">
            <div className="flex items-center justify-between mb-2">
              <Ship className="w-8 h-8 text-teal-600" />
              <Badge variant="outline" className="bg-teal-200 text-teal-700 border-teal-300">
                Flota
              </Badge>
            </div>
            <div className="text-3xl font-bold text-teal-800 mb-1">{embarcaciones.length}</div>
            <div className="text-sm text-teal-600">
              <span className="flex items-center gap-1">
                <Ship className="w-3 h-3" />
                Embarcaciones totales
              </span>
            </div>
            <div className="text-xs text-teal-500 mt-1">
              {embarcacionesActivas} disponibles
            </div>
          </div>

          {/* Tasa de Éxito */}
          <div className="bg-gradient-to-br from-amber-50 to-amber-100 rounded-lg p-4 border border-amber-200">
            <div className="flex items-center justify-between mb-2">
              <Award className="w-8 h-8 text-amber-600" />
              <Badge variant="outline" className="bg-amber-200 text-amber-700 border-amber-300">
                Éxito
              </Badge>
            </div>
            <div className="text-3xl font-bold text-amber-800 mb-1">{tasaCompletadas}%</div>
            <div className="text-sm text-amber-600">
              <span className="flex items-center gap-1">
                <Award className="w-3 h-3" />
                Tasa de completadas
              </span>
            </div>
            <div className="text-xs text-amber-500 mt-1">
              {salidasCompletadas} de {totalSalidas} salidas
            </div>
          </div>
        </div>

        {/* Sección de Métricas Detalladas */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 mt-6 sm:mt-8">
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900">
              {embarcaciones.reduce((sum, e) => sum + (e.capacidad || 0), 0)}
            </div>
            <div className="text-sm text-gray-600">Capacidad Total</div>
            <div className="text-xs text-teal-600 mt-1">🚢 Pasajeros máximos</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900">
              {Math.round((promedioOcupacion / (embarcaciones.reduce((sum, e) => sum + (e.capacidad || 0), 0) / embarcaciones.length || 1)) * 100) || 0}%
            </div>
            <div className="text-sm text-gray-600">Ocupación Promedio</div>
            <div className="text-xs text-blue-600 mt-1">📊 Eficiencia</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900">
              {totalSalidas > 0 ? Math.round(totalSalidas / 30) : 0}
            </div>
            <div className="text-sm text-gray-600">Salidas por Mes</div>
            <div className="text-xs text-green-600 mt-1">📈 Promedio estimado</div>
          </div>
        </div>

        {/* Información adicional */}
        <div className="bg-blue-50 rounded-lg p-4 mt-6 border border-blue-200">
          <div className="flex items-start gap-3">
            <div className="bg-blue-100 rounded-full p-2">
              <Clock className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h4 className="font-semibold text-blue-900 mb-1">
                Tu Desempeño
              </h4>
              <p className="text-sm text-blue-700 mb-2">
                {tasaCompletadas >= 80 
                  ? "¡Excelente trabajo! Mantienes una alta tasa de servicios completados."
                  : tasaCompletadas >= 60
                  ? "Buen desempeño. Hay oportunidades para mejorar la tasa de completadas."
                  : "Oportunidad de mejora en completar los servicios programados."
                }
              </p>
              <div className="text-xs text-blue-600">
                🎯 Meta recomendada: 90% de servicios completados | 🚢 Optimizar capacidad de embarcaciones
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}