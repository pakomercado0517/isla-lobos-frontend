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
import { Package, AlertTriangle, DollarSign, Plus, Eye } from "lucide-react";
import { InventarioBrazaletes } from "@/lib/types/brazaletes";

interface InventarioCardProps {
  inventario: InventarioBrazaletes;
  onCrearLote?: () => void;
  onVerDetalles?: () => void;
}

export function InventarioCard({
  inventario,
  onCrearLote,
  onVerDetalles,
}: InventarioCardProps) {
  const {
    total_disponibles,
    por_tipo,
    stock_bajo,
    lotes_activos,
    valor_inventario,
  } = inventario;

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

  return (
    <div className="space-y-6">
      {/* Header con acciones */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            Inventario de Brazaletes
          </h2>
          <p className="text-gray-600">
            Gestión del stock y lotes de brazaletes
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={onVerDetalles}>
            <Eye className="w-4 h-4 mr-2" />
            Ver Detalles
          </Button>
          <Button onClick={onCrearLote}>
            <Plus className="w-4 h-4 mr-2" />
            Nuevo Lote
          </Button>
        </div>
      </div>

      {/* Alerta de stock bajo */}
      {stock_bajo && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            <strong>Stock Bajo:</strong> Solo quedan {total_disponibles}{" "}
            brazaletes disponibles. Se recomienda crear un nuevo lote.
          </AlertDescription>
        </Alert>
      )}

      {/* Cards de métricas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Disponibles */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Disponibles
            </CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {total_disponibles.toLocaleString()}
            </div>
            <div className="flex items-center mt-2">
              <Badge variant={getStockColor()}>{getStockText()}</Badge>
            </div>
          </CardContent>
        </Card>

        {/* Brazaletes Universales */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Brazaletes Universales
            </CardTitle>
            <Badge variant="outline" className="bg-purple-50 text-purple-700">
              🎫 Universal
            </Badge>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">
              {por_tipo.universal.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {((por_tipo.universal / total_disponibles) * 100).toFixed(1)}% del
              total
            </p>
          </CardContent>
        </Card>

        {/* Valor del Inventario */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Valor Inventario
            </CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              $
              {valor_inventario.toLocaleString("es-MX", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {lotes_activos} lotes activos
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Información adicional */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Distribución por tipo */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Distribución por Tipo</CardTitle>
            <CardDescription>
              Porcentaje de brazaletes por categoría
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                  <span className="text-sm font-medium">Universal</span>
                </div>
                <span className="text-sm font-bold">{por_tipo.universal}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-purple-500 h-2 rounded-full transition-all duration-300"
                  style={{
                    width: `${(por_tipo.universal / total_disponibles) * 100}%`,
                  }}
                ></div>
              </div>

              <div className="mt-4 p-3 bg-purple-50 rounded-lg">
                <p className="text-xs text-purple-700">
                  🎫 Los brazaletes universales son válidos para todas las áreas
                  naturales protegidas (isla y arrecife)
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Estado del inventario */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Estado del Inventario</CardTitle>
            <CardDescription>Resumen del estado actual</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm">Lotes Activos</span>
                <Badge variant="secondary">{lotes_activos}</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Estado del Stock</span>
                <Badge variant={getStockColor()}>{getStockText()}</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Valor Total</span>
                <span className="text-sm font-bold text-green-600">
                  ${valor_inventario.toLocaleString("es-MX")}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
