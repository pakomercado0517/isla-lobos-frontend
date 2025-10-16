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
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <BarChart3 className="w-5 h-5 text-[var(--isla-teal)]" />
          <span>Estadísticas del Sistema</span>
        </CardTitle>
        <CardDescription>
          Resumen de actividad y métricas administrativas de CONANP
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {/* Usuarios Totales */}
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4 border border-blue-200">
            <div className="flex items-center justify-between mb-2">
              <Users className="w-8 h-8 text-blue-600" />
              <Badge variant="outline" className="bg-blue-200 text-blue-700 border-blue-300">
                Usuarios
              </Badge>
            </div>
            <div className="text-3xl font-bold text-blue-800 mb-1">156</div>
            <div className="text-sm text-blue-600">
              <span className="flex items-center gap-1">
                <TrendingUp className="w-3 h-3" />
                +12 este mes
              </span>
            </div>
            <div className="text-xs text-blue-500 mt-1">
              142 Prestadores | 14 CONANP
            </div>
          </div>

          {/* Embarcaciones */}
          <div className="bg-gradient-to-br from-teal-50 to-teal-100 rounded-lg p-4 border border-teal-200">
            <div className="flex items-center justify-between mb-2">
              <Ship className="w-8 h-8 text-teal-600" />
              <Badge variant="outline" className="bg-teal-200 text-teal-700 border-teal-300">
                Flota
              </Badge>
            </div>
            <div className="text-3xl font-bold text-teal-800 mb-1">89</div>
            <div className="text-sm text-teal-600">
              <span className="flex items-center gap-1">
                <Activity className="w-3 h-3" />
                82 Activas
              </span>
            </div>
            <div className="text-xs text-teal-500 mt-1">
              7 en mantenimiento
            </div>
          </div>

          {/* Salidas del Mes */}
          <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-4 border border-green-200">
            <div className="flex items-center justify-between mb-2">
              <Calendar className="w-8 h-8 text-green-600" />
              <Badge variant="outline" className="bg-green-200 text-green-700 border-green-300">
                Octubre
              </Badge>
            </div>
            <div className="text-3xl font-bold text-green-800 mb-1">1,247</div>
            <div className="text-sm text-green-600">
              <span className="flex items-center gap-1">
                <TrendingUp className="w-3 h-3" />
                +18% vs sept
              </span>
            </div>
            <div className="text-xs text-green-500 mt-1">
              Promedio: 40.2/día
            </div>
          </div>

          {/* Alertas del Sistema */}
          <div className="bg-gradient-to-br from-amber-50 to-amber-100 rounded-lg p-4 border border-amber-200">
            <div className="flex items-center justify-between mb-2">
              <Shield className="w-8 h-8 text-amber-600" />
              <Badge variant="outline" className="bg-amber-200 text-amber-700 border-amber-300">
                Sistema
              </Badge>
            </div>
            <div className="text-3xl font-bold text-amber-800 mb-1">3</div>
            <div className="text-sm text-amber-600">
              <span className="flex items-center gap-1">
                <AlertTriangle className="w-3 h-3" />
                Pendientes
              </span>
            </div>
            <div className="text-xs text-amber-500 mt-1">
              2 Clima | 1 Mantenimiento
            </div>
          </div>
        </div>

        {/* Sección de Métricas Detalladas */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 mt-6 sm:mt-8">
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900">96.8%</div>
            <div className="text-sm text-gray-600">Uptime del Sistema</div>
            <div className="text-xs text-green-600 mt-1">✅ Excelente</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900">2.1s</div>
            <div className="text-sm text-gray-600">Tiempo de Respuesta</div>
            <div className="text-xs text-green-600 mt-1">✅ Óptimo</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900">127GB</div>
            <div className="text-sm text-gray-600">Almacenamiento Usado</div>
            <div className="text-xs text-blue-600 mt-1">📊 Normal</div>
          </div>
        </div>

        <div className="bg-blue-50 rounded-lg p-4 mt-6 border border-blue-200">
          <div className="flex items-start gap-3">
            <div className="bg-blue-100 rounded-full p-2">
              <BarChart3 className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h4 className="font-semibold text-blue-900 mb-1">
                Acceso a Reportes Avanzados
              </h4>
              <p className="text-sm text-blue-700 mb-2">
                Como administrador CONANP, tienes acceso completo a todas las 
                métricas y reportes del sistema.
              </p>
              <div className="text-xs text-blue-600">
                📈 Dashboard Completo | 📊 Exportaciones | 🔍 Analytics Detallado
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}