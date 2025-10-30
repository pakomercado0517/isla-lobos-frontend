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
      <CardHeader className="pb-3 p-4 sm:p-6">
        <div className="flex items-start justify-between gap-2">
          <div className="space-y-1 min-w-0 flex-1">
            <CardTitle className="text-base sm:text-lg truncate">Venta #{id.slice(-8)}</CardTitle>
            <CardDescription className="flex items-center gap-1 sm:gap-2 flex-wrap">
              <Badge variant="outline" className={`${getTipoColor()} text-xs`}>
                🎫 Universal
              </Badge>
              <Badge className={`${getEstadoPagoColor()} text-xs`}>{estado_pago}</Badge>
            </CardDescription>
          </div>
          <div className="flex gap-1 flex-shrink-0">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onVerDetalles?.(venta)}
              title="Ver detalles"
              className="h-8 w-8 p-0"
            >
              <Eye className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-3 sm:space-y-4 p-4 sm:p-6">
        {/* Información del prestador */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-xs sm:text-sm">
            <User className="w-3 h-3 sm:w-4 sm:h-4 text-gray-500 flex-shrink-0" />
            <span className="font-medium">Prestador:</span>
          </div>
          <div className="pl-5 sm:pl-6 space-y-1">
            <div className="font-semibold text-sm sm:text-base truncate">{prestador?.nombre || "N/A"}</div>
            <div className="text-xs sm:text-sm text-gray-600 truncate">
              {prestador?.email || "N/A"}
            </div>
            {prestador?.telefono && (
              <div className="text-xs sm:text-sm text-gray-600">{prestador.telefono}</div>
            )}
          </div>
        </div>

        {/* Detalles de la venta */}
        <div className="grid grid-cols-2 gap-3 sm:gap-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs sm:text-sm">
              <span className="text-gray-600">Cantidad:</span>
              <span className="font-semibold">{cantidad}</span>
            </div>
            <div className="flex items-center justify-between text-xs sm:text-sm">
              <span className="text-gray-600">Precio unit.:</span>
              <span className="font-semibold">${precio_unitario}</span>
            </div>
            <div className="flex items-center justify-between text-xs sm:text-sm">
              <span className="text-gray-600">Total:</span>
              <span className="font-semibold text-green-600">${total}</span>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs sm:text-sm gap-1">
              <span className="text-gray-600">Método:</span>
              <span className="font-semibold flex items-center gap-1 text-xs sm:text-sm">
                {getMetodoPagoIcon()}
                <span className="truncate">{metodo_pago}</span>
              </span>
            </div>
            <div className="flex items-center justify-between text-xs sm:text-sm gap-1">
              <span className="text-gray-600">Lote:</span>
              <span className="font-semibold text-xs truncate">
                {lote?.numero_lote || "N/A"}
              </span>
            </div>
            <div className="flex items-center justify-between text-xs sm:text-sm gap-1">
              <span className="text-gray-600">Estado:</span>
              <Badge variant="outline" className={`${getEstadoPagoColor()} text-xs`}>
                {estado_pago}
              </Badge>
            </div>
          </div>
        </div>

        {/* Información temporal */}
        <div className="space-y-2 pt-2 border-t">
          <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-600">
            <Calendar className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
            <span className="truncate">
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
              <Package className="w-3 h-3 sm:w-4 sm:h-4 text-gray-500 mt-0.5 flex-shrink-0" />
              <div className="min-w-0 flex-1">
                <p className="text-xs sm:text-sm font-medium text-gray-700">
                  Observaciones:
                </p>
                <p className="text-xs sm:text-sm text-gray-600 italic break-words">
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
