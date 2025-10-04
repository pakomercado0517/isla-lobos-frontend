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
import { Package, Calendar, MapPin, Eye, TrendingUp } from "lucide-react";
import { BrazaletesCardUso } from "@/lib/types/brazaletes";

interface UsoBrazaletesCardProps {
  uso: BrazaletesCardUso;
  onVerDetalles?: (uso: BrazaletesCardUso) => void;
}

export function UsoBrazaletesCard({
  uso,
  onVerDetalles,
}: UsoBrazaletesCardProps) {
  const {
    salida_id,
    fecha_creacion,
    fecha_asignacion,
    estado,
    fecha_uso,
    errores,
    codigo,
  } = uso;

  const getNacionalidadIcon = (nacionalidad: string) => {
    switch (nacionalidad) {
      case "local":
        return "🏠";
      case "nacional":
        return "🇲🇽";
      case "internacional":
        return "🌍";
      default:
        return "👤";
    }
  };

  const getNacionalidadText = (nacionalidad: string) => {
    switch (nacionalidad) {
      case "local":
        return "Local";
      case "nacional":
        return "Nacional";
      case "internacional":
        return "Internacional";
      default:
        return "No especificada";
    }
  };

  const getFecha = () => {
    const fecha: string | null =
      estado === "asignado" ? fecha_creacion : fecha_uso;
    return new Date(fecha!).toLocaleDateString("es-MX");
  };

  console.log("uso", uso);

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <CardTitle className="text-lg">
              Salida #{salida_id.slice(-8)}
            </CardTitle>
            <CardDescription className="flex items-center gap-2">
              <Badge variant="outline" className="bg-green-100 text-green-700">
                {`Brazalete: ${codigo}`}
              </Badge>
              {errores && errores.length > 0 && (
                <Badge variant="destructive">
                  {errores.length} error{errores.length > 1 ? "es" : ""}
                </Badge>
              )}
            </CardDescription>
          </div>
          <div className="flex gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onVerDetalles?.(uso)}
              title="Ver detalles"
            >
              <Eye className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Información de la salida */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm">
            <MapPin className="w-4 h-4 text-gray-500" />
            <span className="font-medium">Salida:</span>
          </div>
          <div className="pl-6 space-y-1">
            <div className="font-semibold">ID: {salida_id}</div>
            <div className="text-sm text-gray-600">
              {new Date(fecha_asignacion).toLocaleDateString("es-MX", {
                year: "numeric",
                month: "long",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </div>
          </div>
        </div>

        {/* Estadísticas de brazaletes */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">Estado:</span>
              <Badge variant="outline" className="bg-green-100 text-green-700">
                {estado.toUpperCase()}
              </Badge>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">
                Fecha {estado === "asignado" ? "registro" : "utilización"}:
              </span>
              <span className="font-semibold">{getFecha()}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">Hora:</span>
              <span className="font-semibold">
                {new Date(fecha_creacion).toLocaleTimeString("es-MX", {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
            </div>
          </div>
        </div>

        {/* Errores si los hay */}
        {errores && errores.length > 0 && (
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm">
              <TrendingUp className="w-4 h-4 text-red-500" />
              <span className="font-medium text-red-700">
                Errores encontrados:
              </span>
            </div>
            <div className="pl-6 space-y-1">
              {errores.slice(0, 2).map((error, index) => (
                <div key={index} className="text-sm text-red-600">
                  • {error}
                </div>
              ))}
              {errores.length > 2 && (
                <div className="text-sm text-red-600">
                  ... y {errores.length - 2} error
                  {errores.length - 2 > 1 ? "es" : ""} más
                </div>
              )}
            </div>
          </div>
        )}

        {/* Información temporal */}
        <div className="space-y-2 pt-2 border-t">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Calendar className="w-4 h-4" />
            <span>
              Registrado:{" "}
              {new Date(fecha_creacion).toLocaleDateString("es-MX", {
                year: "numeric",
                month: "short",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </span>
          </div>
        </div>

        {/* Acción rápida */}
        <div className="pt-2 border-t">
          <Button
            variant="outline"
            size="sm"
            className="w-full"
            onClick={() => onVerDetalles?.(uso)}
          >
            <Package className="w-4 h-4 mr-2" />
            Ver Detalles del Registro
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
