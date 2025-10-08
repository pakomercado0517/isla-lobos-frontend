"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp } from "lucide-react";
// Tipos para el historial
export interface HistorialStats {
  total_salidas: number;
  total_pasajeros: number;
  promedio_pasajeros_por_salida: number;
  por_estado: {
    programadas: number;
    en_curso: number;
    completadas: number;
    canceladas: number;
  };
}

interface EstadisticasHistorialProps {
  stats: HistorialStats | null;
}

export function EstadisticasHistorial({ stats }: EstadisticasHistorialProps) {
  if (!stats) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="w-5 h-5" />
          Estadísticas del Período
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <div className="text-2xl font-bold text-blue-600">
              {stats.total_salidas}
            </div>
            <div className="text-sm text-blue-700">Total Salidas</div>
          </div>
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <div className="text-2xl font-bold text-green-600">
              {stats.total_pasajeros}
            </div>
            <div className="text-sm text-green-700">Total Pasajeros</div>
          </div>
          <div className="text-center p-4 bg-purple-50 rounded-lg">
            <div className="text-2xl font-bold text-purple-600">
              {stats.promedio_pasajeros_por_salida.toFixed(1)}
            </div>
            <div className="text-sm text-purple-700">Promedio por Salida</div>
          </div>
          <div className="text-center p-4 bg-orange-50 rounded-lg">
            <div className="text-2xl font-bold text-orange-600">
              {stats.por_estado.completadas}
            </div>
            <div className="text-sm text-orange-700">Completadas</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
