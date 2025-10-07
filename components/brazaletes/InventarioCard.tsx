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
      {/* Header con acciones - Mejorado */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <Package className="w-8 h-8 text-teal-600" />
            Inventario de Brazaletes
          </h2>
          <p className="text-lg text-gray-600 mt-1">
            Control completo del stock y lotes de brazaletes
          </p>
        </div>
        <div className="flex gap-3">
          <Button
            variant="outline"
            size="lg"
            onClick={onVerDetalles}
            className="gap-2"
          >
            <Eye className="w-5 h-5" />
            <span className="hidden sm:inline">Ver Detalles</span>
          </Button>
          <Button
            onClick={onCrearLote}
            size="lg"
            className="gap-2 bg-teal-600 hover:bg-teal-700"
          >
            <Plus className="w-5 h-5" />
            Nuevo Lote
          </Button>
        </div>
      </div>

      {/* Alerta de stock bajo - MÁS VISIBLE */}
      {stock_bajo && (
        <Alert variant="destructive" className="border-2 border-red-300 p-5">
          <div className="flex items-start gap-4">
            <AlertTriangle className="h-8 w-8 mt-1" />
            <div className="flex-1">
              <AlertTitle className="text-xl font-bold mb-2">
                ⚠️ ¡Atención! Stock Crítico
              </AlertTitle>
              <AlertDescription className="text-base leading-relaxed">
                Solo quedan{" "}
                <strong className="text-xl">{total_disponibles}</strong>{" "}
                brazaletes disponibles. Es necesario crear un nuevo lote para
                mantener el inventario.
              </AlertDescription>
              <div className="mt-3">
                <Button
                  onClick={onCrearLote}
                  variant="destructive"
                  size="lg"
                  className="gap-2"
                >
                  <Plus className="w-5 h-5" />
                  Crear Nuevo Lote Ahora
                </Button>
              </div>
            </div>
          </div>
        </Alert>
      )}

      {/* Card principal del inventario - MUY DESTACADO */}
      <Card className={`${getStockBgColor()} border-4 shadow-lg`}>
        <CardContent className="p-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-6">
              <div className={`${getStockTextColor()}`}>{getStockIcon()}</div>
              <div>
                <h3 className="text-lg font-medium text-gray-700 mb-2">
                  Brazaletes Disponibles en Inventario
                </h3>
                <div className="flex items-baseline gap-3">
                  <span className={`text-6xl font-bold ${getStockTextColor()}`}>
                    {total_disponibles.toLocaleString()}
                  </span>
                  <Badge
                    variant={getStockColor()}
                    className="text-lg px-4 py-2 font-semibold"
                  >
                    {getStockText()}
                  </Badge>
                </div>
              </div>
            </div>

            {/* Información rápida */}
            <div className="grid grid-cols-2 gap-6 text-center">
              <div className="bg-white rounded-xl p-5 shadow-md border-2 border-gray-200">
                <DollarSign className="w-8 h-8 text-green-600 mx-auto mb-2" />
                <div className="text-3xl font-bold text-green-600">
                  $
                  {valor_inventario.toLocaleString("es-MX", {
                    minimumFractionDigits: 0,
                    maximumFractionDigits: 0,
                  })}
                </div>
                <p className="text-sm text-gray-600 font-medium mt-1">
                  Valor Total
                </p>
              </div>

              <div className="bg-white rounded-xl p-5 shadow-md border-2 border-gray-200">
                <Boxes className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                <div className="text-3xl font-bold text-blue-600">
                  {lotes_activos}
                </div>
                <p className="text-sm text-gray-600 font-medium mt-1">
                  Lotes Activos
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Información adicional en cards grandes */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Distribución por tipo - Más visual */}
        <Card className="border-2">
          <CardHeader className="pb-4">
            <CardTitle className="text-2xl flex items-center gap-2">
              <TrendingUp className="w-6 h-6 text-purple-600" />
              Distribución por Tipo
            </CardTitle>
            <CardDescription className="text-base">
              Brazaletes disponibles por categoría
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="bg-purple-50 rounded-xl p-6 border-2 border-purple-200">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-6 h-6 bg-purple-500 rounded-lg"></div>
                  <span className="text-lg font-semibold">🎫 Universal</span>
                </div>
                <span className="text-3xl font-bold text-purple-600">
                  {por_tipo.universal.toLocaleString()}
                </span>
              </div>

              <div className="w-full bg-gray-200 rounded-full h-4 shadow-inner">
                <div
                  className="bg-gradient-to-r from-purple-500 to-purple-600 h-4 rounded-full transition-all duration-300 flex items-center justify-end pr-2"
                  style={{
                    width: `${(por_tipo.universal / total_disponibles) * 100}%`,
                  }}
                >
                  <span className="text-xs font-bold text-white">
                    {((por_tipo.universal / total_disponibles) * 100).toFixed(
                      1
                    )}
                    %
                  </span>
                </div>
              </div>
            </div>

            <Alert className="bg-purple-50 border-purple-200 border-2">
              <Package className="h-5 w-5 text-purple-600" />
              <AlertDescription className="text-base text-purple-700 leading-relaxed">
                Los brazaletes <strong>universales</strong> son válidos para
                todas las áreas naturales protegidas, incluyendo isla y
                arrecifes.
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>

        {/* Estado del inventario - Más visual */}
        <Card className="border-2">
          <CardHeader className="pb-4">
            <CardTitle className="text-2xl flex items-center gap-2">
              <CheckCircle2 className="w-6 h-6 text-teal-600" />
              Resumen del Estado
            </CardTitle>
            <CardDescription className="text-base">
              Información general del inventario
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-gradient-to-br from-teal-50 to-blue-50 rounded-xl p-5 border-2 border-teal-200">
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-200">
                  <span className="text-base font-medium text-gray-700">
                    Lotes Activos
                  </span>
                  <Badge
                    variant="secondary"
                    className="text-lg px-4 py-1 font-bold"
                  >
                    {lotes_activos}
                  </Badge>
                </div>

                <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-200">
                  <span className="text-base font-medium text-gray-700">
                    Estado del Stock
                  </span>
                  <Badge
                    variant={getStockColor()}
                    className="text-lg px-4 py-1 font-bold"
                  >
                    {getStockIcon()}
                    <span className="ml-2">{getStockText()}</span>
                  </Badge>
                </div>

                <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-200">
                  <span className="text-base font-medium text-gray-700">
                    Valor Total
                  </span>
                  <span className="text-xl font-bold text-green-600">
                    ${valor_inventario.toLocaleString("es-MX")}
                  </span>
                </div>
              </div>
            </div>

            {/* Indicador visual del nivel de stock */}
            <div className="p-4 bg-gray-50 rounded-lg border-2 border-gray-200">
              <p className="text-sm font-medium text-gray-700 mb-2">
                Nivel de Stock
              </p>
              <div className="w-full bg-gray-200 rounded-full h-6 relative overflow-hidden">
                <div
                  className={`h-6 rounded-full transition-all duration-500 ${
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
                <div className="absolute inset-0 flex items-center justify-center text-sm font-bold text-gray-700">
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
