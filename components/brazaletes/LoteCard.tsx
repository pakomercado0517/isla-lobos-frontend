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
import { Package, Calendar, Eye, Edit, AlertTriangle } from "lucide-react";
import { LoteBrazaletes } from "@/lib/types/brazaletes";

interface LoteCardProps {
  lote: LoteBrazaletes;
  onVerDetalles?: (lote: LoteBrazaletes) => void;
  onEditar?: (lote: LoteBrazaletes) => void;
}

export function LoteCard({ lote, onVerDetalles, onEditar }: LoteCardProps) {
  const {
    numero_lote,
    cantidad_total,
    cantidad_disponibles,
    cantidad_vendidos,
    cantidad_utilizados,
    fecha_compra,
    fecha_vencimiento,
    costo_unitario,
    precio_venta,
    proveedor,
    estado,
    observaciones,
  } = lote;

  const porcentajeVendido = (cantidad_vendidos / cantidad_total) * 100;
  const porcentajeUtilizado = (cantidad_utilizados / cantidad_total) * 100;
  const valorTotal = cantidad_total * precio_venta;

  const diasParaVencer = fecha_vencimiento
    ? Math.ceil(
        (new Date(fecha_vencimiento).getTime() - new Date().getTime()) /
          (1000 * 60 * 60 * 24)
      )
    : null;

  const getEstadoColor = () => {
    switch (estado) {
      case "activo":
        return "default";
      case "agotado":
        return "secondary";
      case "vencido":
        return "destructive";
      case "cancelado":
        return "outline";
      default:
        return "default";
    }
  };

  const getTipoColor = () => {
    return "bg-purple-50 text-purple-700";
  };

  const isPorVencer =
    diasParaVencer !== null && diasParaVencer <= 30 && diasParaVencer > 0;
  const isVencido = diasParaVencer !== null && diasParaVencer <= 0;

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <CardTitle className="text-lg">{numero_lote}</CardTitle>
            <CardDescription className="flex items-center gap-2">
              <Badge variant="outline" className={getTipoColor()}>
                🎫 Universal
              </Badge>
              <Badge variant={getEstadoColor()}>{estado}</Badge>
            </CardDescription>
          </div>
          <div className="flex gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onVerDetalles?.(lote)}
              title="Ver detalles"
            >
              <Eye className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onEditar?.(lote)}
              title="Editar lote"
            >
              <Edit className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Alerta de vencimiento */}
        {isPorVencer && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
            <div className="flex items-center gap-2 text-yellow-800">
              <AlertTriangle className="w-4 h-4" />
              <span className="text-sm font-medium">
                Vence en {diasParaVencer} días
              </span>
            </div>
          </div>
        )}

        {isVencido && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3">
            <div className="flex items-center gap-2 text-red-800">
              <AlertTriangle className="w-4 h-4" />
              <span className="text-sm font-medium">
                Vencido hace {Math.abs(diasParaVencer)} días
              </span>
            </div>
          </div>
        )}

        {/* Estadísticas del lote */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">Total:</span>
              <span className="font-semibold">{cantidad_total}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">Disponibles:</span>
              <span className="font-semibold text-green-600">
                {cantidad_disponibles}
              </span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">Vendidos:</span>
              <span className="font-semibold text-blue-600">
                {cantidad_vendidos}
              </span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">Utilizados:</span>
              <span className="font-semibold text-purple-600">
                {cantidad_utilizados}
              </span>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">Costo unit.:</span>
              <span className="font-semibold">${costo_unitario}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">Precio venta:</span>
              <span className="font-semibold">${precio_venta}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">Margen:</span>
              <span className="font-semibold text-green-600">
                ${(precio_venta - costo_unitario).toFixed(2)}
              </span>
            </div>
            <div className="flex items-center justify-between text-sm font-bold border-t pt-1">
              <span>Valor total:</span>
              <span className="text-green-600">${valorTotal.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Barras de progreso */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span>Vendidos</span>
            <span>{porcentajeVendido.toFixed(1)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${porcentajeVendido}%` }}
            ></div>
          </div>

          <div className="flex items-center justify-between text-xs">
            <span>Utilizados</span>
            <span>{porcentajeUtilizado.toFixed(1)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-purple-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${porcentajeUtilizado}%` }}
            ></div>
          </div>
        </div>

        {/* Información adicional */}
        <div className="space-y-2 pt-2 border-t">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Calendar className="w-4 h-4" />
            <span>
              Compra: {new Date(fecha_compra).toLocaleDateString("es-MX")}
            </span>
          </div>

          {fecha_vencimiento && (
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Calendar className="w-4 h-4" />
              <span>
                Vence: {new Date(fecha_vencimiento).toLocaleDateString("es-MX")}
              </span>
            </div>
          )}

          {proveedor && (
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Package className="w-4 h-4" />
              <span>{proveedor}</span>
            </div>
          )}
        </div>

        {observaciones && (
          <div className="pt-2 border-t">
            <p className="text-sm text-gray-600 italic">
              &ldquo;{observaciones}&rdquo;
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
