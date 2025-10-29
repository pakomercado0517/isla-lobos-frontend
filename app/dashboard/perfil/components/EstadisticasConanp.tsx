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
  Users,
  Ship,
  Calendar,
  TrendingUp,
  Activity,
  Shield,
  AlertTriangle,
} from "lucide-react";

export function EstadisticasConanp() {
  return (
    <Card className="mb-4 md:mb-6">
      <CardHeader className="p-4 md:p-6">
        <CardTitle className="flex items-center space-x-2 text-base md:text-lg">
          <BarChart3 className="w-4 h-4 md:w-5 md:h-5 text-[var(--isla-teal)] flex-shrink-0" />
          <span className="truncate">Estadísticas del Sistema</span>
        </CardTitle>
        <CardDescription className="text-xs md:text-sm">
          Resumen de actividad y métricas administrativas
        </CardDescription>
      </CardHeader>
      <CardContent className="p-4 md:p-6">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
          {/* Usuarios Totales */}
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-3 md:p-4 border border-blue-200">
            <div className="flex items-center justify-between mb-2">
              <Users className="w-6 h-6 md:w-8 md:h-8 text-blue-600 flex-shrink-0" />
              <Badge
                variant="outline"
                className="bg-blue-200 text-blue-700 border-blue-300 text-[10px] md:text-xs"
              >
                Users
              </Badge>
            </div>
            <div className="text-2xl md:text-3xl font-bold text-blue-800 mb-1">
              156
            </div>
            <div className="text-xs md:text-sm text-blue-600">
              <span className="flex items-center gap-1">
                <TrendingUp className="w-2.5 h-2.5 md:w-3 md:h-3 flex-shrink-0" />
                +12 este mes
              </span>
            </div>
            <div className="text-[10px] md:text-xs text-blue-500 mt-1 truncate">
              142 Prestadores | 14 CONANP
            </div>
          </div>

          {/* Embarcaciones */}
          <div className="bg-gradient-to-br from-teal-50 to-teal-100 rounded-lg p-3 md:p-4 border border-teal-200">
            <div className="flex items-center justify-between mb-2">
              <Ship className="w-6 h-6 md:w-8 md:h-8 text-teal-600 flex-shrink-0" />
              <Badge
                variant="outline"
                className="bg-teal-200 text-teal-700 border-teal-300 text-[10px] md:text-xs"
              >
                Flota
              </Badge>
            </div>
            <div className="text-2xl md:text-3xl font-bold text-teal-800 mb-1">
              89
            </div>
            <div className="text-xs md:text-sm text-teal-600">
              <span className="flex items-center gap-1">
                <Activity className="w-2.5 h-2.5 md:w-3 md:h-3 flex-shrink-0" />
                82 Activas
              </span>
            </div>
            <div className="text-[10px] md:text-xs text-teal-500 mt-1 truncate">
              7 en mantenimiento
            </div>
          </div>

          {/* Salidas del Mes */}
          <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-3 md:p-4 border border-green-200">
            <div className="flex items-center justify-between mb-2">
              <Calendar className="w-6 h-6 md:w-8 md:h-8 text-green-600 flex-shrink-0" />
              <Badge
                variant="outline"
                className="bg-green-200 text-green-700 border-green-300 text-[10px] md:text-xs"
              >
                Oct
              </Badge>
            </div>
            <div className="text-2xl md:text-3xl font-bold text-green-800 mb-1">
              1,247
            </div>
            <div className="text-xs md:text-sm text-green-600">
              <span className="flex items-center gap-1">
                <TrendingUp className="w-2.5 h-2.5 md:w-3 md:h-3 flex-shrink-0" />
                +18% vs sept
              </span>
            </div>
            <div className="text-[10px] md:text-xs text-green-500 mt-1 truncate">
              Promedio: 40.2/día
            </div>
          </div>

          {/* Alertas del Sistema */}
          <div className="bg-gradient-to-br from-amber-50 to-amber-100 rounded-lg p-3 md:p-4 border border-amber-200">
            <div className="flex items-center justify-between mb-2">
              <Shield className="w-6 h-6 md:w-8 md:h-8 text-amber-600 flex-shrink-0" />
              <Badge
                variant="outline"
                className="bg-amber-200 text-amber-700 border-amber-300 text-[10px] md:text-xs"
              >
                Sistema
              </Badge>
            </div>
            <div className="text-2xl md:text-3xl font-bold text-amber-800 mb-1">
              3
            </div>
            <div className="text-xs md:text-sm text-amber-600">
              <span className="flex items-center gap-1">
                <AlertTriangle className="w-2.5 h-2.5 md:w-3 md:h-3 flex-shrink-0" />
                Pendientes
              </span>
            </div>
            <div className="text-[10px] md:text-xs text-amber-500 mt-1 truncate">
              2 Clima | 1 Mant.
            </div>
          </div>
        </div>

        {/* Sección de Métricas Detalladas */}
        <div className="grid grid-cols-3 gap-3 md:gap-4 mt-4 md:mt-6">
          <div className="text-center">
            <div className="text-lg md:text-2xl font-bold text-gray-900">
              96.8%
            </div>
            <div className="text-[10px] md:text-sm text-gray-600 truncate">
              Uptime
            </div>
            <div className="text-[10px] md:text-xs text-green-600 mt-1">
              ✅ Excelente
            </div>
          </div>
          <div className="text-center">
            <div className="text-lg md:text-2xl font-bold text-gray-900">
              2.1s
            </div>
            <div className="text-[10px] md:text-sm text-gray-600 truncate">
              Respuesta
            </div>
            <div className="text-[10px] md:text-xs text-green-600 mt-1">
              ✅ Óptimo
            </div>
          </div>
          <div className="text-center">
            <div className="text-lg md:text-2xl font-bold text-gray-900">
              127GB
            </div>
            <div className="text-[10px] md:text-sm text-gray-600 truncate">
              Almacenamiento
            </div>
            <div className="text-[10px] md:text-xs text-blue-600 mt-1">
              📊 Normal
            </div>
          </div>
        </div>

        <div className="bg-blue-50 rounded-lg p-3 md:p-4 mt-4 md:mt-6 border border-blue-200">
          <div className="flex items-start gap-2 md:gap-3">
            <div className="bg-blue-100 rounded-full p-1.5 md:p-2 flex-shrink-0">
              <BarChart3 className="w-4 h-4 md:w-5 md:h-5 text-blue-600" />
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="font-semibold text-blue-900 mb-1 text-xs md:text-sm">
                Acceso a Reportes Avanzados
              </h4>
              <p className="text-[10px] md:text-sm text-blue-700 mb-2">
                Como administrador CONANP, tienes acceso completo a todas las
                métricas y reportes del sistema.
              </p>
              <div className="text-[9px] md:text-xs text-blue-600">
                📈 Dashboard | 📊 Exportaciones | 🔍 Analytics
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
