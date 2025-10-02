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
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Package,
  AlertTriangle,
  TrendingUp,
  DollarSign,
  Eye,
} from "lucide-react";
import Link from "next/link";
import { InventarioBrazaletes, AlertaBrazaletes } from "@/lib/types/brazaletes";

interface BrazaletesStatsProps {
  inventario: InventarioBrazaletes;
  alertas?: AlertaBrazaletes[];
  loading?: boolean;
}

export function BrazaletesStats({
  inventario,
  alertas = [],
  loading = false,
}: BrazaletesStatsProps) {
  const {
    total_disponibles,
    por_tipo,
    stock_bajo,
    lotes_activos,
    valor_inventario,
  } = inventario;

  const alertasCriticas = alertas.filter(
    (alerta) => alerta.severidad === "alta" || alerta.severidad === "critica"
  );

  const getStockColor = () => {
    if (stock_bajo) return "destructive";
    if (total_disponibles < 100) return "secondary";
    return "default";
  };

  const getStockText = () => {
    if (stock_bajo) return "Stock Crítico";
    if (total_disponibles < 100) return "Stock Bajo";
    return "Stock Normal";
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="w-5 h-5" />
            Brazaletes
          </CardTitle>
          <CardDescription>Cargando inventario...</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-8 bg-gray-200 rounded w-1/2"></div>
            <div className="h-4 bg-gray-200 rounded w-1/4"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Package className="w-5 h-5" />
              Brazaletes
            </CardTitle>
            <CardDescription>Inventario de brazaletes</CardDescription>
          </div>
          <Link href="/dashboard/brazaletes">
            <Button variant="ghost" size="sm">
              <Eye className="w-4 h-4" />
            </Button>
          </Link>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Alertas críticas */}
        {alertasCriticas.length > 0 && (
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              {alertasCriticas.length} alerta
              {alertasCriticas.length > 1 ? "s" : ""} crítica
              {alertasCriticas.length > 1 ? "s" : ""}
            </AlertDescription>
          </Alert>
        )}

        {/* Alerta de stock bajo */}
        {stock_bajo && (
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              <strong>Stock Bajo:</strong> Solo quedan {total_disponibles}{" "}
              brazaletes
            </AlertDescription>
          </Alert>
        )}

        {/* Estadísticas principales */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Total Disponibles</span>
            <div className="text-right">
              <div className="text-2xl font-bold">
                {total_disponibles.toLocaleString()}
              </div>
              <Badge variant={getStockColor()} className="text-xs">
                {getStockText()}
              </Badge>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="text-center">
              <div className="text-lg font-semibold text-blue-600">
                {por_tipo.isla}
              </div>
              <div className="text-xs text-gray-600">Isla</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-semibold text-teal-600">
                {por_tipo.arrecife}
              </div>
              <div className="text-xs text-gray-600">Arrecife</div>
            </div>
          </div>

          <div className="flex items-center justify-between pt-2 border-t">
            <span className="text-sm text-gray-600">Valor Inventario</span>
            <span className="text-lg font-bold text-green-600">
              $
              {valor_inventario.toLocaleString("es-MX", {
                minimumFractionDigits: 0,
                maximumFractionDigits: 0,
              })}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Lotes Activos</span>
            <span className="text-sm font-semibold">{lotes_activos}</span>
          </div>
        </div>

        {/* Acción rápida */}
        <div className="pt-2 border-t">
          <Link href="/dashboard/brazaletes">
            <Button variant="outline" size="sm" className="w-full">
              <Package className="w-4 h-4 mr-2" />
              Gestionar Inventario
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
