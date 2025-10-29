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
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  Package,
  AlertTriangle,
  DollarSign,
  Plus,
  Eye,
  CheckCircle2,
  XCircle,
  AlertCircle,
  TrendingUp,
  Boxes,
} from "lucide-react";
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

  const getStockIcon = () => {
    if (stock_bajo) return <XCircle className="w-8 h-8" />;
    if (total_disponibles < 100) return <AlertCircle className="w-8 h-8" />;
    return <CheckCircle2 className="w-8 h-8" />;
  };

  const getStockBgColor = () => {
    if (stock_bajo) return "bg-red-50 border-red-200";
    if (total_disponibles < 100) return "bg-yellow-50 border-yellow-200";
    return "bg-green-50 border-green-200";
  };

  const getStockTextColor = () => {
    if (stock_bajo) return "text-red-700";
    if (total_disponibles < 100) return "text-yellow-700";
    return "text-green-700";
  };

  return (
    <div className="space-y-6">
      {/* Header con acciones - Mejorado y Responsive */}
      <div className="flex flex-col sm:flex-row items-center sm:items-start justify-between gap-4">
        <div className="text-center sm:text-left w-full sm:w-auto">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 flex flex-col sm:flex-row items-center gap-2 sm:gap-3">
            <Package className="w-6 sm:w-8 h-6 sm:h-8 text-teal-600" />
            <span>Inventario de Brazaletes</span>
          </h2>
          <p className="text-base sm:text-lg text-gray-600 mt-1">
            Control completo del stock y lotes de brazaletes
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 w-full sm:w-auto">
          <Button
            variant="outline"
            size="lg"
            onClick={onVerDetalles}
            className="w-full sm:w-auto h-10 sm:h-11 text-sm sm:text-base gap-2"
          >
            <Eye className="w-4 sm:w-5 h-4 sm:h-5" />
            Ver Detalles
          </Button>
          <Button
            onClick={onCrearLote}
            size="lg"
            className="w-full sm:w-auto h-10 sm:h-11 text-sm sm:text-base gap-2 bg-teal-600 hover:bg-teal-700"
          >
            <Plus className="w-4 sm:w-5 h-4 sm:h-5" />
            Nuevo Lote
          </Button>
        </div>
      </div>

      {/* Alerta de stock bajo - MÁS VISIBLE y Responsive */}
      {stock_bajo && (
        <Alert
          variant="destructive"
          className="border-2 border-red-300 p-4 sm:p-5"
        >
          <div className="flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left gap-4">
            <AlertTriangle className="h-6 sm:h-8 w-6 sm:w-8 mt-0 sm:mt-1" />
            <div className="flex-1">
              <AlertTitle className="text-lg sm:text-xl font-bold mb-2">
                ⚠️ ¡Atención! Stock Crítico
              </AlertTitle>
              <AlertDescription className="text-sm sm:text-base leading-relaxed">
                Solo quedan{" "}
                <strong className="text-lg sm:text-xl">
                  {total_disponibles}
                </strong>{" "}
                brazaletes disponibles. Es necesario crear un nuevo lote para
                mantener el inventario.
              </AlertDescription>
              <div className="mt-3">
                <Button
                  onClick={onCrearLote}
                  variant="destructive"
                  size="lg"
                  className="w-full sm:w-auto h-10 sm:h-11 text-sm sm:text-base gap-2"
                >
                  <Plus className="w-4 sm:w-5 h-4 sm:h-5" />
                  Crear Nuevo Lote Ahora
                </Button>
              </div>
            </div>
          </div>
        </Alert>
      )}

      {/* Card principal del inventario - MUY DESTACADO */}
      <Card className={`${getStockBgColor()} border-4 shadow-lg`}>
        <CardContent className="p-4 sm:p-6 md:p-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 sm:gap-6">
            <div className="flex flex-col sm:flex-row items-center text-center sm:text-left gap-4 sm:gap-6 w-full sm:w-auto">
              <div className={`${getStockTextColor()}`}>{getStockIcon()}</div>
              <div>
                <h3 className="text-base sm:text-lg font-medium text-gray-700 mb-2">
                  Brazaletes Disponibles en Inventario
                </h3>
                <div className="flex flex-col sm:flex-row items-center sm:items-baseline gap-2 sm:gap-3">
                  <span
                    className={`text-4xl sm:text-5xl md:text-6xl font-bold ${getStockTextColor()}`}
                  >
                    {total_disponibles.toLocaleString()}
                  </span>
                  <Badge
                    variant={getStockColor()}
                    className="text-sm sm:text-base md:text-lg px-3 sm:px-4 py-1 sm:py-2 font-semibold"
                  >
                    {getStockText()}
                  </Badge>
                </div>
              </div>
            </div>

            {/* Información rápida */}
            <div className="grid grid-cols-2 gap-3 sm:gap-6 text-center w-full md:w-auto">
              <div className="bg-white rounded-lg sm:rounded-xl p-3 sm:p-4 md:p-5 shadow-md border-2 border-gray-200">
                <DollarSign className="w-6 sm:w-7 md:w-8 h-6 sm:h-7 md:h-8 text-green-600 mx-auto mb-2" />
                <div className="text-xl sm:text-2xl md:text-3xl font-bold text-green-600">
                  $
                  {valor_inventario.toLocaleString("es-MX", {
                    minimumFractionDigits: 0,
                    maximumFractionDigits: 0,
                  })}
                </div>
                <p className="text-xs sm:text-sm text-gray-600 font-medium mt-1">
                  Valor Total
                </p>
              </div>

              <div className="bg-white rounded-lg sm:rounded-xl p-3 sm:p-4 md:p-5 shadow-md border-2 border-gray-200">
                <Boxes className="w-6 sm:w-7 md:w-8 h-6 sm:h-7 md:h-8 text-blue-600 mx-auto mb-2" />
                <div className="text-xl sm:text-2xl md:text-3xl font-bold text-blue-600">
                  {lotes_activos}
                </div>
                <p className="text-xs sm:text-sm text-gray-600 font-medium mt-1">
                  Lotes Activos
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Información adicional en cards grandes */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        {/* Distribución por tipo - Más visual */}
        <Card className="border-2">
          <CardHeader className="pb-3 sm:pb-4">
            <CardTitle className="text-xl sm:text-2xl flex flex-col sm:flex-row items-center gap-2 text-center sm:text-left">
              <TrendingUp className="w-5 sm:w-6 h-5 sm:h-6 text-purple-600" />
              <span>Distribución por Tipo</span>
            </CardTitle>
            <CardDescription className="text-sm sm:text-base text-center sm:text-left">
              Brazaletes disponibles por categoría
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 sm:space-y-6">
            <div className="bg-purple-50 rounded-lg sm:rounded-xl p-4 sm:p-6 border-2 border-purple-200">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-2 sm:gap-0 mb-4">
                <div className="flex items-center space-x-2 sm:space-x-3">
                  <div className="w-5 sm:w-6 h-5 sm:h-6 bg-purple-500 rounded-lg"></div>
                  <span className="text-base sm:text-lg font-semibold">
                    🎫 Universal
                  </span>
                </div>
                <span className="text-2xl sm:text-3xl font-bold text-purple-600">
                  {por_tipo.universal.toLocaleString()}
                </span>
              </div>

              <div className="w-full bg-gray-200 rounded-full h-3 sm:h-4 shadow-inner">
                <div
                  className="bg-gradient-to-r from-purple-500 to-purple-600 h-3 sm:h-4 rounded-full transition-all duration-300 flex items-center justify-end pr-2"
                  style={{
                    width: `${(por_tipo.universal / total_disponibles) * 100}%`,
                  }}
                >
                  <span className="text-[10px] sm:text-xs font-bold text-white">
                    {((por_tipo.universal / total_disponibles) * 100).toFixed(
                      1
                    )}
                    %
                  </span>
                </div>
              </div>
            </div>

            <Alert className="bg-purple-50 border-purple-200 border-2">
              <Package className="h-4 sm:h-5 w-4 sm:w-5 text-purple-600" />
              <AlertDescription className="text-sm sm:text-base text-purple-700 leading-relaxed">
                Los brazaletes <strong>universales</strong> son válidos para
                todas las áreas naturales protegidas, incluyendo isla y
                arrecifes.
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>

        {/* Estado del inventario - Más visual */}
        <Card className="border-2">
          <CardHeader className="pb-3 sm:pb-4">
            <CardTitle className="text-xl sm:text-2xl flex flex-col sm:flex-row items-center gap-2 text-center sm:text-left">
              <CheckCircle2 className="w-5 sm:w-6 h-5 sm:h-6 text-teal-600" />
              <span>Resumen del Estado</span>
            </CardTitle>
            <CardDescription className="text-sm sm:text-base text-center sm:text-left">
              Información general del inventario
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 sm:space-y-4">
            <div className="bg-gradient-to-br from-teal-50 to-blue-50 rounded-lg sm:rounded-xl p-4 sm:p-5 border-2 border-teal-200">
              <div className="space-y-3 sm:space-y-4">
                <div className="flex flex-col sm:flex-row items-center justify-between p-3 bg-white rounded-lg border border-gray-200 gap-2 sm:gap-0">
                  <span className="text-sm sm:text-base font-medium text-gray-700">
                    Lotes Activos
                  </span>
                  <Badge
                    variant="secondary"
                    className="text-base sm:text-lg px-3 sm:px-4 py-0.5 sm:py-1 font-bold"
                  >
                    {lotes_activos}
                  </Badge>
                </div>

                <div className="flex flex-col sm:flex-row items-center justify-between p-3 bg-white rounded-lg border border-gray-200 gap-2 sm:gap-0">
                  <span className="text-sm sm:text-base font-medium text-gray-700">
                    Estado del Stock
                  </span>
                  <Badge
                    variant={getStockColor()}
                    className="text-base sm:text-lg px-3 sm:px-4 py-0.5 sm:py-1 font-bold"
                  >
                    {getStockIcon()}
                    <span className="ml-2">{getStockText()}</span>
                  </Badge>
                </div>

                <div className="flex flex-col sm:flex-row items-center justify-between p-3 bg-white rounded-lg border border-gray-200 gap-2 sm:gap-0">
                  <span className="text-sm sm:text-base font-medium text-gray-700">
                    Valor Total
                  </span>
                  <span className="text-lg sm:text-xl font-bold text-green-600">
                    ${valor_inventario.toLocaleString("es-MX")}
                  </span>
                </div>
              </div>
            </div>

            {/* Indicador visual del nivel de stock */}
            <div className="p-3 sm:p-4 bg-gray-50 rounded-lg border-2 border-gray-200">
              <p className="text-xs sm:text-sm font-medium text-gray-700 mb-2 text-center sm:text-left">
                Nivel de Stock
              </p>
              <div className="w-full bg-gray-200 rounded-full h-5 sm:h-6 relative overflow-hidden">
                <div
                  className={`h-5 sm:h-6 rounded-full transition-all duration-500 ${
                    stock_bajo
                      ? "bg-gradient-to-r from-red-500 to-red-600"
                      : total_disponibles < 100
                      ? "bg-gradient-to-r from-yellow-500 to-yellow-600"
                      : "bg-gradient-to-r from-green-500 to-green-600"
                  }`}
                  style={{
                    width: `${Math.min((total_disponibles / 500) * 100, 100)}%`,
                  }}
                ></div>
                <div className="absolute inset-0 flex items-center justify-center text-xs sm:text-sm font-bold text-gray-700">
                  {total_disponibles} brazaletes
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
