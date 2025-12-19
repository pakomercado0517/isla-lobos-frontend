"use client";

import { useState } from "react";
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
  Eye,
  PackageX,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
  ChevronDown,
  ChevronUp,
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
  const [mostrarTodasAlertas, setMostrarTodasAlertas] = useState(false);
  const { total_disponibles, stock_bajo, lotes_activos, valor_inventario } =
    inventario;

  // Agrupar alertas por severidad
  const alertasPorSeveridad = {
    critica: alertas.filter((a) => a.severidad === "critica"),
    alta: alertas.filter((a) => a.severidad === "alta"),
    media: alertas.filter((a) => a.severidad === "media"),
    baja: alertas.filter((a) => a.severidad === "baja"),
  };

  // Incluir alertas críticas, altas y medias (para prestadores con stock bajo)
  const alertasCriticas = [
    ...alertasPorSeveridad.critica,
    ...alertasPorSeveridad.alta,
    ...alertasPorSeveridad.media,
  ];

  // Función para detectar el tipo de alerta basándose en el mensaje
  const detectarTipoAlerta = (mensaje: string, tipo: string) => {
    const mensajeLower = mensaje.toLowerCase();

    // Si el tipo es "lote_por_vencer", siempre usar ese
    if (tipo === "lote_por_vencer") {
      return {
        tipo: "lote_por_vencer",
        IconComponent: Clock,
        titulo: "Lote por Vencer",
      };
    }

    // Si el tipo es "stock_bajo" (inventario general de CONANP)
    if (tipo === "stock_bajo") {
      return {
        tipo: "stock_bajo",
        IconComponent: PackageX,
        titulo: "Stock Bajo",
      };
    }

    // Si el tipo es "prestador_sin_stock", detectar subtipo por mensaje
    if (tipo === "prestador_sin_stock") {
      // Detectar stock agotado (0 brazaletes) - CRÍTICO
      if (
        mensajeLower.includes("no tiene brazaletes") ||
        mensajeLower.includes("stock agotado") ||
        mensajeLower.includes("🔴")
      ) {
        return {
          tipo: "prestador_sin_stock",
          IconComponent: AlertTriangle,
          titulo: "Stock Agotado",
        };
      }

      // Detectar stock crítico (1 brazalete)
      if (
        mensajeLower.includes("solo 1 brazalete") ||
        mensajeLower.includes("stock crítico")
      ) {
        return {
          tipo: "prestador_sin_stock",
          IconComponent: AlertTriangle,
          titulo: "Stock Crítico",
        };
      }

      // Detectar stock muy bajo (2-5 brazaletes)
      if (
        mensajeLower.includes("stock muy bajo") ||
        mensajeLower.includes("casi sin stock")
      ) {
        return {
          tipo: "prestador_sin_stock",
          IconComponent: PackageX,
          titulo: "Stock Muy Bajo",
        };
      }

      // Detectar stock bajo general (6-9 o más)
      if (
        mensajeLower.includes("stock bajo") ||
        mensajeLower.includes("necesita reabastecimiento")
      ) {
        return {
          tipo: "prestador_sin_stock",
          IconComponent: PackageX,
          titulo: "Stock Bajo",
        };
      }

      // Fallback para prestador_sin_stock sin palabras clave específicas
      return {
        tipo: "prestador_sin_stock",
        IconComponent: AlertTriangle,
        titulo: "Prestador Sin Stock",
      };
    }

    // Default para otros tipos
    return {
      tipo: "general",
      IconComponent: AlertTriangle,
      titulo: "Alerta",
    };
  };

  // Función para obtener colores según severidad
  const getSeveridadStyle = (severidad: string) => {
    switch (severidad) {
      case "critica":
        return {
          bg: "bg-red-50",
          border: "border-red-300",
          text: "text-red-800",
          iconClass: "text-red-600",
        };
      case "alta":
        return {
          bg: "bg-orange-50",
          border: "border-orange-300",
          text: "text-orange-800",
          iconClass: "text-orange-600",
        };
      case "media":
        return {
          bg: "bg-yellow-50",
          border: "border-yellow-300",
          text: "text-yellow-800",
          iconClass: "text-yellow-600",
        };
      case "baja":
        return {
          bg: "bg-blue-50",
          border: "border-blue-300",
          text: "text-blue-800",
          iconClass: "text-blue-600",
        };
      default:
        return {
          bg: "bg-gray-50",
          border: "border-gray-300",
          text: "text-gray-800",
          iconClass: "text-gray-600",
        };
    }
  };

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
      <Card className="border-gray-100 shadow-sm">
        <CardHeader className="pb-4 px-4 sm:px-6 pt-6">
          <CardTitle className="text-lg sm:text-xl font-bold text-gray-900 flex items-center gap-2">
            <Package className="w-5 h-5 sm:w-6 sm:h-6 text-[var(--isla-teal)]" />
            Brazaletes
          </CardTitle>
          <CardDescription className="text-sm text-gray-600">
            Cargando inventario...
          </CardDescription>
        </CardHeader>
        <CardContent className="px-4 sm:px-6 pb-6">
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
    <Card className="border-gray-100 shadow-sm">
      <CardHeader className="pb-4 px-4 sm:px-6 lg:px-8 pt-6 lg:pt-8">
        <div className="flex items-center justify-between gap-4 lg:gap-6">
          <div className="flex-1">
            <CardTitle className="text-lg sm:text-xl lg:text-2xl xl:text-3xl font-bold text-gray-900 flex items-center gap-2 lg:gap-3">
              <Package className="w-5 h-5 sm:w-6 sm:h-6 lg:w-7 lg:h-7 text-[var(--isla-teal)]" />
              Brazaletes
            </CardTitle>
            <CardDescription className="text-sm lg:text-base text-gray-600 mt-1 lg:mt-2">
              Estado del inventario y alertas
            </CardDescription>
          </div>
          <Link href="/dashboard/brazaletes" className="shrink-0">
            <Button
              variant="outline"
              size="sm"
              className="border-[var(--isla-teal)] text-[var(--isla-teal)] hover:bg-[var(--isla-teal)] hover:text-white text-sm lg:text-base px-4 lg:px-6 h-9 lg:h-10"
            >
              <Eye className="w-4 h-4 lg:w-5 lg:h-5 mr-2" />
              Ver Detalles
            </Button>
          </Link>
        </div>
      </CardHeader>

      <CardContent className="px-4 sm:px-6 lg:px-8 pb-6 lg:pb-8 space-y-6 lg:space-y-8">
        {/* Resumen de Alertas - Diseño mejorado */}
        {alertasCriticas.length > 0 && (
          <div className="space-y-3 lg:space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm sm:text-base lg:text-lg font-semibold text-gray-900 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-red-600" />
                Alertas Importantes
              </h3>
              <Badge
                variant="destructive"
                className="text-xs lg:text-sm font-semibold px-2.5 lg:px-3 py-0.5 lg:py-1"
              >
                {alertasCriticas.length}
              </Badge>
            </div>

            {/* Grid de alertas - Máximo 2 columnas en desktop para mejor legibilidad */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 lg:gap-4">
              {(mostrarTodasAlertas
                ? alertasCriticas
                : alertasCriticas.slice(0, 4)
              ).map((alerta, index) => {
                const style = getSeveridadStyle(alerta.severidad);
                const alertaInfo = detectarTipoAlerta(
                  alerta.mensaje,
                  alerta.tipo
                );
                const IconComponent = alertaInfo.IconComponent;

                return (
                  <div
                    key={index}
                    className={`${style.bg} ${style.border} border rounded-lg lg:rounded-xl p-4 sm:p-5 lg:p-6 hover:shadow-md transition-all duration-300`}
                  >
                    <div className="flex items-start gap-3 lg:gap-4">
                      <div className={`p-2.5 lg:p-3 rounded-lg lg:rounded-xl bg-white/70 ${style.iconClass} flex-shrink-0`}>
                        <IconComponent className="w-5 h-5 sm:w-6 sm:h-6 lg:w-7 lg:h-7" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className={`${style.text} font-semibold text-sm sm:text-base lg:text-lg mb-1.5 lg:mb-2`}>
                          {alertaInfo.titulo}
                        </h4>
                        <p className={`${style.text} text-xs sm:text-sm lg:text-base opacity-90 leading-relaxed`}>
                          {alerta.mensaje}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Botón para expandir/colapsar alertas */}
            {alertasCriticas.length > 4 && (
              <Button
                variant="outline"
                className="w-full text-sm border-gray-300 text-gray-700 hover:bg-gray-50"
                size="sm"
                onClick={() => setMostrarTodasAlertas(!mostrarTodasAlertas)}
              >
                {mostrarTodasAlertas ? (
                  <>
                    <ChevronUp className="w-4 h-4 mr-2" />
                    Mostrar menos
                  </>
                ) : (
                  <>
                    <ChevronDown className="w-4 h-4 mr-2" />
                    Ver {alertasCriticas.length - 4} alerta
                    {alertasCriticas.length - 4 > 1 ? "s" : ""} más
                  </>
                )}
              </Button>
            )}
          </div>
        )}

        {/* Estado del Inventario - Diseño mejorado */}
        <div className="bg-gray-50 rounded-xl lg:rounded-2xl p-4 sm:p-5 lg:p-6 border border-gray-200">
          <h3 className="text-base sm:text-lg lg:text-xl xl:text-2xl font-semibold text-gray-900 mb-4 lg:mb-6 flex items-center gap-2 lg:gap-3">
            <Package className="w-5 h-5 lg:w-6 lg:h-6 text-[var(--isla-teal)]" />
            Estado del Inventario
          </h3>

          <div className="space-y-4 lg:space-y-6">
            {/* Total Disponibles - Destacado */}
            <div className="bg-white rounded-lg lg:rounded-xl p-4 sm:p-5 lg:p-6 border border-gray-200">
              <div className="flex items-center justify-between mb-3 lg:mb-4">
                <span className="text-sm sm:text-base lg:text-lg font-medium text-gray-700">
                  Brazaletes Disponibles
                </span>
                <Badge
                  variant={getStockColor()}
                  className="text-xs lg:text-sm font-semibold px-2.5 lg:px-3 py-1 lg:py-1.5"
                >
                  {stock_bajo ? (
                    <XCircle className="w-3 h-3 lg:w-4 lg:h-4 mr-1.5 inline" />
                  ) : total_disponibles < 100 ? (
                    <AlertCircle className="w-3 h-3 lg:w-4 lg:h-4 mr-1.5 inline" />
                  ) : (
                    <CheckCircle2 className="w-3 h-3 lg:w-4 lg:h-4 mr-1.5 inline" />
                  )}
                  {getStockText()}
                </Badge>
              </div>
              <div className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold text-[var(--isla-teal)]">
                {total_disponibles.toLocaleString()}
              </div>
            </div>

            {/* Información adicional en grid */}
            <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:gap-6">
              <div className="bg-white rounded-lg lg:rounded-xl p-3 sm:p-4 lg:p-5 text-center border border-gray-200">
                <div className="text-xl sm:text-2xl lg:text-3xl xl:text-4xl font-bold text-green-600 mb-1 lg:mb-2">
                  $
                  {valor_inventario.toLocaleString("es-MX", {
                    minimumFractionDigits: 0,
                    maximumFractionDigits: 0,
                  })}
                </div>
                <div className="text-xs sm:text-sm lg:text-base text-gray-600 font-medium">
                  Valor Total
                </div>
              </div>

              <div className="bg-white rounded-lg lg:rounded-xl p-3 sm:p-4 lg:p-5 text-center border border-gray-200">
                <div className="text-xl sm:text-2xl lg:text-3xl xl:text-4xl font-bold text-blue-600 mb-1 lg:mb-2">
                  {lotes_activos}
                </div>
                <div className="text-xs sm:text-sm lg:text-base text-gray-600 font-medium">
                  Lotes Activos
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Botón de acción principal */}
        <Link href="/dashboard/brazaletes" className="block">
          <Button
            className="w-full bg-[var(--isla-teal)] hover:bg-[var(--isla-teal-dark)] text-white font-semibold text-sm sm:text-base lg:text-lg h-11 sm:h-12 lg:h-14 flex items-center justify-center"
            size="lg"
          >
            <Package className="w-5 h-5 lg:w-6 lg:h-6 mr-2 lg:mr-3" />
            <span className="hidden sm:inline">
              Gestionar Inventario de Brazaletes
            </span>
            <span className="sm:hidden">Gestionar Inventario</span>
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
}
