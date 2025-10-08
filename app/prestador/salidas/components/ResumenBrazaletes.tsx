"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Package } from "lucide-react";
import { BrazaletesPrestador } from "@/lib/types/brazaletes";

interface ResumenBrazaletesProps {
  brazaletesData: BrazaletesPrestador | null;
}

export function ResumenBrazaletes({ brazaletesData }: ResumenBrazaletesProps) {
  if (!brazaletesData) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Package className="w-5 h-5" />
          Resumen de Brazaletes Disponibles
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <div className="text-2xl font-bold text-green-600">
              {brazaletesData.brazaletes.disponibles}
            </div>
            <div className="text-sm text-green-700">Disponibles</div>
          </div>
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <div className="text-2xl font-bold text-blue-600">
              {brazaletesData.brazaletes.asignados}
            </div>
            <div className="text-sm text-blue-700">Asignados</div>
          </div>
          <div className="text-center p-4 bg-purple-50 rounded-lg">
            <div className="text-2xl font-bold text-purple-600">
              {brazaletesData.brazaletes.utilizados}
            </div>
            <div className="text-sm text-purple-700">Utilizados</div>
          </div>
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <div className="text-2xl font-bold text-gray-600">
              {brazaletesData.brazaletes.por_tipo.universal}
            </div>
            <div className="text-sm text-gray-700">Total</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
