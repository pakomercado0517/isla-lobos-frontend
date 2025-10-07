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
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-xl">
            <Package className="w-6 h-6" />
            Brazaletes
          </CardTitle>
          <CardDescription className="text-base">
            Cargando inventario...
          </CardDescription>
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
    <Card className="shadow-md">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-3 text-2xl">
              <Package className="w-7 h-7 text-teal-600" />
              Brazaletes
            </CardTitle>
            <CardDescription className="text-base mt-1">
              Estado del inventario y alertas
            </CardDescription>
          </div>
          <Link href="/dashboard/brazaletes">
            <Button variant="outline" size="lg" className="gap-2">
              <Eye className="w-5 h-5" />
              Ver Detalles
            </Button>
          </Link>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Resumen de Alertas - Compacto en Grid */}
        {alertasCriticas.length > 0 && (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-semibold text-gray-900 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-red-600" />
                Alertas Importantes
              </h3>
              <Badge
                variant="destructive"
                className="text-sm px-2 py-0.5 font-bold"
              >
                {alertasCriticas.length}
              </Badge>
            </div>

            {/* Grid de alertas - 4 columnas en pantallas medianas/grandes */}
            <div className="grid w-full items-start gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
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

                // Crear clase de ícono basada en severidad
                let iconColorClass = "";
                if (alerta.severidad === "critica")
                  iconColorClass = "[&>svg]:text-red-600";
                else if (alerta.severidad === "alta")
                  iconColorClass = "[&>svg]:text-orange-600";
                else if (alerta.severidad === "media")
                  iconColorClass = "[&>svg]:text-yellow-600";
                else if (alerta.severidad === "baja")
                  iconColorClass = "[&>svg]:text-blue-600";
                else iconColorClass = "[&>svg]:text-gray-600";

                return (
                  <Alert
                    key={index}
                    className={`${style.bg} ${style.border} border-2 ${iconColorClass}`}
                  >
                    <IconComponent />
                    <AlertTitle className={`${style.text} font-bold`}>
                      {alertaInfo.titulo}
                    </AlertTitle>
                    <AlertDescription
                      className={`${style.text} text-sm font-medium`}
                    >
                      {alerta.mensaje}
                    </AlertDescription>
                  </Alert>
                );
              })}
            </div>

            {/* Botón para expandir/colapsar alertas */}
            {alertasCriticas.length > 4 && (
              <Button
                variant="outline"
                className="w-full text-sm py-2"
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

        {/* Estado del Inventario - Mejorado con iconos claros */}
        <div className="bg-gradient-to-br from-teal-50 to-blue-50 rounded-lg p-5 border-2 border-teal-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Package className="w-5 h-5 text-teal-600" />
            Estado del Inventario
          </h3>

          <div className="space-y-4">
            {/* Total Disponibles - MUY VISIBLE */}
            <div className="bg-white rounded-lg p-4 border-2 border-gray-200">
              <div className="flex items-center justify-between">
                <span className="text-base font-medium text-gray-700">
                  Brazaletes Disponibles
                </span>
                <div className="text-right">
                  <div className="text-4xl font-bold text-teal-600">
                    {total_disponibles.toLocaleString()}
                  </div>
                  <Badge
                    variant={getStockColor()}
                    className="text-sm mt-2 px-3 py-1"
                  >
                    {stock_bajo ? (
                      <XCircle className="w-4 h-4 mr-1 inline" />
                    ) : total_disponibles < 100 ? (
                      <AlertCircle className="w-4 h-4 mr-1 inline" />
                    ) : (
                      <CheckCircle2 className="w-4 h-4 mr-1 inline" />
                    )}
                    {getStockText()}
                  </Badge>
                </div>
              </div>
            </div>

            {/* Información adicional en grid */}
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-white rounded-lg p-4 text-center border-2 border-gray-200">
                <div className="text-2xl font-bold text-green-600">
                  $
                  {valor_inventario.toLocaleString("es-MX", {
                    minimumFractionDigits: 0,
                    maximumFractionDigits: 0,
                  })}
                </div>
                <div className="text-sm text-gray-600 mt-1 font-medium">
                  Valor Total
                </div>
              </div>

              <div className="bg-white rounded-lg p-4 text-center border-2 border-gray-200">
                <div className="text-2xl font-bold text-blue-600">
                  {lotes_activos}
                </div>
                <div className="text-sm text-gray-600 mt-1 font-medium">
                  Lotes Activos
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Botón de acción principal - MUY VISIBLE */}
        <Link href="/dashboard/brazaletes" className="block">
          <Button
            className="w-full text-lg py-7 bg-teal-600 hover:bg-teal-700 text-white font-semibold shadow-lg"
            size="lg"
          >
            <Package className="w-6 h-6 mr-3" />
            Gestionar Inventario de Brazaletes
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
}
