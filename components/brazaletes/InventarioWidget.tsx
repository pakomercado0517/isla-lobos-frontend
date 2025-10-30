"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Package, AlertTriangle, DollarSign } from "lucide-react";
import { InventarioBrazaletes } from "@/lib/types/brazaletes";

interface InventarioWidgetProps {
  inventario: InventarioBrazaletes;
  className?: string;
}

export function InventarioWidget({
  inventario,
  className,
}: InventarioWidgetProps) {
  const {
    total_disponibles,
    por_tipo,
    stock_bajo,
    lotes_activos,
    valor_inventario,
  } = inventario;

  const getStockStatus = () => {
    if (stock_bajo) {
      return {
        color: "text-red-600",
        bgColor: "bg-red-50",
        borderColor: "border-red-200",
        icon: AlertTriangle,
        message: "Stock Bajo",
      };
    } else if (total_disponibles < 50) {
      return {
        color: "text-yellow-600",
        bgColor: "bg-yellow-50",
        borderColor: "border-yellow-200",
        icon: AlertTriangle,
        message: "Stock Moderado",
      };
    } else {
      return {
        color: "text-green-600",
        bgColor: "bg-green-50",
        borderColor: "border-green-200",
        icon: Package,
        message: "Stock Adecuado",
      };
    }
  };

  const stockStatus = getStockStatus();
  const StockIcon = stockStatus.icon;

  return (
    <Card className={className}>
      <CardHeader className="pb-3 p-4 sm:p-6">
        <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
          <Package className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
          <span className="truncate">Inventario de Brazaletes</span>
        </CardTitle>
        <CardDescription className="text-xs sm:text-sm">
          Estado actual del inventario disponible
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3 sm:space-y-4 p-4 sm:p-6">
        {/* Estado del stock */}
        <div
          className={`p-2 sm:p-3 rounded-lg border ${stockStatus.bgColor} ${stockStatus.borderColor}`}
        >
          <div className="flex items-center gap-2">
            <StockIcon className={`w-3 h-3 sm:w-4 sm:h-4 ${stockStatus.color} flex-shrink-0`} />
            <span className={`font-medium text-xs sm:text-sm ${stockStatus.color}`}>
              {stockStatus.message}
            </span>
          </div>
        </div>

        {/* Alerta de stock bajo */}
        {stock_bajo && (
          <Alert variant="destructive" className="p-3">
            <AlertTriangle className="h-3 w-3 sm:h-4 sm:w-4" />
            <AlertDescription className="text-xs sm:text-sm">
              <strong>Atención:</strong> El inventario está por debajo del nivel
              mínimo recomendado. Considera realizar una nueva compra de
              brazaletes.
            </AlertDescription>
          </Alert>
        )}

        {/* Estadísticas principales */}
        <div className="grid grid-cols-2 gap-3 sm:gap-4">
          <div className="text-center p-2 sm:p-3 bg-blue-50 rounded-lg">
            <div className="text-xl sm:text-2xl font-bold text-blue-900">
              {total_disponibles.toLocaleString()}
            </div>
            <div className="text-xs sm:text-sm text-blue-600">Total Disponible</div>
          </div>

          <div className="text-center p-2 sm:p-3 bg-purple-50 rounded-lg">
            <div className="text-xl sm:text-2xl font-bold text-purple-900">
              {lotes_activos}
            </div>
            <div className="text-xs sm:text-sm text-purple-600">Lotes Activos</div>
          </div>
        </div>

        {/* Desglose por tipo */}
        <div className="space-y-2">
          <h4 className="font-medium text-sm sm:text-base text-gray-900">Disponible por Tipo</h4>
          <div className="space-y-2">
            {Object.entries(por_tipo).map(([tipo, cantidad]) => (
              <div
                key={tipo}
                className="flex items-center justify-between p-2 bg-gray-50 rounded"
              >
                <div className="flex items-center gap-2 min-w-0">
                  <span className="text-base sm:text-lg flex-shrink-0">
                    {tipo === "universal"
                      ? "🎫"
                      : tipo === "isla"
                      ? "🏝️"
                      : "🐠"}
                  </span>
                  <span className="font-medium capitalize text-xs sm:text-sm truncate">{tipo}</span>
                </div>
                <Badge variant="outline" className="font-semibold text-xs flex-shrink-0">
                  {cantidad.toLocaleString()}
                </Badge>
              </div>
            ))}
          </div>
        </div>

        {/* Valor del inventario */}
        <div className="pt-2 border-t">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 min-w-0">
              <DollarSign className="w-3 h-3 sm:w-4 sm:h-4 text-green-600 flex-shrink-0" />
              <span className="font-medium text-xs sm:text-sm text-gray-900 truncate">
                Valor del Inventario
              </span>
            </div>
            <span className="text-base sm:text-lg font-bold text-green-600 flex-shrink-0">
              ${valor_inventario.toLocaleString("es-MX")}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
