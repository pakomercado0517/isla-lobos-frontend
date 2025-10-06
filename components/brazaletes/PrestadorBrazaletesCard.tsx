"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Package, Eye, Users } from "lucide-react";
import { BrazaletesPrestador } from "@/lib/types/brazaletes";

interface PrestadorBrazaletesCardProps {
  data: BrazaletesPrestador;
  onVerDetalles?: (prestadorId: string) => void;
}

export function PrestadorBrazaletesCard({
  data,
  onVerDetalles,
}: PrestadorBrazaletesCardProps) {
  const { prestador, brazaletes, detalle } = data;

  const getTipoColor = () => {
    return "bg-purple-50 text-purple-700";
  };

  const getEstadoColor = (estado: string) => {
    switch (estado) {
      case "disponible":
        return "bg-green-100 text-green-800";
      case "asignado":
        return "bg-yellow-100 text-yellow-800";
      case "utilizado":
        return "bg-purple-100 text-purple-800";
      case "perdido":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <CardTitle className="text-xl">{prestador.nombre}</CardTitle>
            <CardDescription>
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4" />
                <span>{prestador.email}</span>
              </div>
            </CardDescription>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onVerDetalles?.(prestador.id)}
            title="Ver detalles"
          >
            <Eye className="w-4 h-4" />
          </Button>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Resumen de brazaletes */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">
              {brazaletes.disponibles}
            </div>
            <div className="text-sm text-gray-600">Disponibles</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-yellow-600">
              {brazaletes.asignados}
            </div>
            <div className="text-sm text-gray-600">Asignados</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">
              {brazaletes.utilizados}
            </div>
            <div className="text-sm text-gray-600">Utilizados</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">
              {brazaletes.disponibles + brazaletes.asignados}
            </div>
            <div className="text-sm text-gray-600">Total</div>
          </div>
        </div>

        {/* Distribución por tipo */}
        <div className="space-y-3">
          <h4 className="font-semibold">Por Tipo</h4>
          <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
            <div className="flex items-center gap-2">
              <Badge variant="outline" className={getTipoColor()}>
                🎫 Universal
              </Badge>
            </div>
            <span className="font-bold text-purple-600">
              {brazaletes.por_tipo.universal}
            </span>
          </div>
        </div>

        {/* Lista de brazaletes recientes */}
        <div className="space-y-3">
          <h4 className="font-semibold">Brazaletes Recientes</h4>
          <div className="space-y-2 max-h-32 overflow-y-auto">
            {detalle.slice(0, 5).map((brazalete) => (
              <div
                key={brazalete.id}
                className="flex items-center justify-between p-2 bg-gray-50 rounded-lg text-sm"
              >
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className={getTipoColor()}>
                    🎫
                  </Badge>
                  <span className="font-mono text-xs">{brazalete.codigo}</span>
                </div>
                <Badge className={getEstadoColor(brazalete.estado)}>
                  {brazalete.estado}
                </Badge>
              </div>
            ))}
            {detalle.length > 5 && (
              <div className="text-center text-sm text-gray-500">
                ... y {detalle.length - 5} más
              </div>
            )}
          </div>
        </div>

        {/* Acción rápida */}
        <div className="pt-2 border-t">
          <Button
            variant="outline"
            size="sm"
            className="w-full"
            onClick={() => onVerDetalles?.(prestador.id)}
          >
            <Package className="w-4 h-4 mr-2" />
            Ver Todos los Brazaletes
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
