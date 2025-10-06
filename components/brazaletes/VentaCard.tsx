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
import { Calendar, User, Package, Eye } from "lucide-react";
import { VentaBrazaletes } from "@/lib/types/brazaletes";

interface VentaCardProps {
  venta: VentaBrazaletes;
  onVerDetalles?: (venta: VentaBrazaletes) => void;
}

export function VentaCard({ venta, onVerDetalles }: VentaCardProps) {
  const {
    id,
    cantidad,
    precio_unitario,
    total,
    fecha_venta,
    metodo_pago,
    estado_pago,
    observaciones,
    prestador,
    lote,
  } = venta;

  const getEstadoPagoColor = () => {
    switch (estado_pago) {
      case "pagado":
        return "bg-green-100 text-green-800 border-green-200";
      case "pendiente":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "cancelado":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getMetodoPagoIcon = () => {
    switch (metodo_pago) {
      case "efectivo":
        return "💵";
      case "transferencia":
        return "🏦";
      case "credito":
        return "💳";
      case "debito":
        return "💳";
      default:
        return "💰";
    }
  };

  const getTipoColor = () => {
    return "bg-purple-50 text-purple-700";
  };

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <CardTitle className="text-lg">Venta #{id.slice(-8)}</CardTitle>
            <CardDescription className="flex items-center gap-2">
              <Badge variant="outline" className={getTipoColor()}>
                🎫 Universal
              </Badge>
              <Badge className={getEstadoPagoColor()}>{estado_pago}</Badge>
            </CardDescription>
          </div>
          <div className="flex gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onVerDetalles?.(venta)}
              title="Ver detalles"
            >
              <Eye className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Información del prestador */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm">
            <User className="w-4 h-4 text-gray-500" />
            <span className="font-medium">Prestador:</span>
          </div>
          <div className="pl-6 space-y-1">
            <div className="font-semibold">{prestador?.nombre || "N/A"}</div>
            <div className="text-sm text-gray-600">
              {prestador?.email || "N/A"}
            </div>
            {prestador?.telefono && (
              <div className="text-sm text-gray-600">{prestador.telefono}</div>
            )}
          </div>
        </div>

        {/* Detalles de la venta */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">Cantidad:</span>
              <span className="font-semibold">{cantidad}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">Precio unit.:</span>
              <span className="font-semibold">${precio_unitario}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">Total:</span>
              <span className="font-semibold text-green-600">${total}</span>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">Método pago:</span>
              <span className="font-semibold flex items-center gap-1">
                {getMetodoPagoIcon()}
                {metodo_pago}
              </span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">Lote:</span>
              <span className="font-semibold text-xs">
                {lote?.numero_lote || "N/A"}
              </span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">Estado:</span>
              <Badge variant="outline" className={getEstadoPagoColor()}>
                {estado_pago}
              </Badge>
            </div>
          </div>
        </div>

        {/* Información temporal */}
        <div className="space-y-2 pt-2 border-t">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Calendar className="w-4 h-4" />
            <span>
              Venta:{" "}
              {new Date(fecha_venta).toLocaleDateString("es-MX", {
                year: "numeric",
                month: "short",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </span>
          </div>
        </div>

        {/* Observaciones */}
        {observaciones && (
          <div className="pt-2 border-t">
            <div className="flex items-start gap-2">
              <Package className="w-4 h-4 text-gray-500 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-gray-700">
                  Observaciones:
                </p>
                <p className="text-sm text-gray-600 italic">
                  &quot;{observaciones}&quot;
                </p>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
