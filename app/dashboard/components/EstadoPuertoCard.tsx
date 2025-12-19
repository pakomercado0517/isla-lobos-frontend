"use client";

import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Cloud, ExternalLink, AlertTriangle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface ClimaData {
  estado_puerto: string;
  oleaje: number;
  viento_velocidad: number;
  viento_direccion: string;
  visibilidad: string;
  fuente?: string;
}

interface EstadoPuertoCardProps {
  clima: ClimaData;
}

function getEstadoPuertoColor(estado: string): string {
  switch (estado) {
    case "abierto":
      return "bg-green-100 text-green-800 border-green-200";
    case "restricciones":
      return "bg-yellow-100 text-yellow-800 border-yellow-200";
    case "cerrado":
      return "bg-red-100 text-red-800 border-red-200";
    case "emergencia":
      return "bg-red-200 text-red-900 border-red-300";
    default:
      return "bg-gray-100 text-gray-800 border-gray-200";
  }
}

function getEstadoPuertoIcon(estado: string): string {
  switch (estado) {
    case "abierto":
      return "🟢";
    case "restricciones":
      return "🟡";
    case "cerrado":
      return "🔴";
    case "emergencia":
      return "⚡";
    default:
      return "⚪";
  }
}

function esCondicionPeligrosa(clima: ClimaData): boolean {
  return (
    clima.oleaje > 2.5 ||
    clima.viento_velocidad > 30 ||
    clima.visibilidad === "baja" ||
    clima.estado_puerto === "cerrado" ||
    clima.estado_puerto === "emergencia"
  );
}

export function EstadoPuertoCard({ clima }: EstadoPuertoCardProps) {
  const condicionPeligrosa = esCondicionPeligrosa(clima);

  return (
    <Card className="border-gray-100 shadow-sm">
      <CardHeader className="pb-4 px-4 sm:px-6 lg:px-8 pt-6 lg:pt-8">
        <div className="flex items-center justify-between mb-1">
          <CardTitle className="text-lg sm:text-xl lg:text-2xl xl:text-3xl font-bold text-gray-900 flex items-center gap-2">
            <Cloud className="w-5 h-5 sm:w-6 sm:h-6 lg:w-7 lg:h-7 text-[var(--isla-teal)]" />
            Estado del Puerto
          </CardTitle>
          <Link href="/dashboard/clima">
            <Button variant="ghost" size="sm" className="h-8 w-8 lg:h-10 lg:w-10 p-0">
              <ExternalLink className="w-4 h-4 lg:w-5 lg:h-5" />
            </Button>
          </Link>
        </div>
        <CardDescription className="text-sm lg:text-base text-gray-600">
          Condiciones meteorológicas actuales
        </CardDescription>
      </CardHeader>
      <CardContent className="px-4 sm:px-6 lg:px-8 pb-6 lg:pb-8 space-y-4 lg:space-y-6">
        {/* Alerta si condiciones peligrosas */}
        {condicionPeligrosa && (
          <Alert variant="destructive" className="mb-4 rounded-lg lg:rounded-xl">
            <AlertTriangle className="h-4 w-4 lg:w-5 lg:h-5" />
            <AlertDescription className="text-xs lg:text-sm font-medium">
              Condiciones desfavorables para navegación
            </AlertDescription>
          </Alert>
        )}

        {/* Estado del puerto destacado */}
        <div className="bg-gray-50 rounded-xl lg:rounded-2xl p-4 lg:p-5 border border-gray-200">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm lg:text-base font-semibold text-gray-700">Estado</span>
            <Badge className={`${getEstadoPuertoColor(clima.estado_puerto)} text-xs lg:text-sm font-medium px-3 lg:px-4 py-1 lg:py-1.5`}>
              {getEstadoPuertoIcon(clima.estado_puerto)}{" "}
              {clima.estado_puerto.charAt(0).toUpperCase() + clima.estado_puerto.slice(1)}
            </Badge>
          </div>
        </div>

        {/* Métricas principales */}
        <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:gap-6">
          <div className="bg-blue-50 rounded-lg lg:rounded-xl p-3 sm:p-4 lg:p-5 text-center border border-blue-100">
            <div
              className={`text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold mb-1 lg:mb-2 ${
                clima.oleaje > 2.5 ? "text-red-600" : "text-blue-600"
              }`}
            >
              {clima.oleaje}m
            </div>
            <p className="text-xs sm:text-sm lg:text-base text-gray-600 font-medium">Oleaje</p>
            {clima.oleaje > 2.5 && (
              <p className="text-xs lg:text-sm text-red-600 font-semibold mt-1">Alto</p>
            )}
          </div>
          <div className="bg-green-50 rounded-lg lg:rounded-xl p-3 sm:p-4 lg:p-5 text-center border border-green-100">
            <div
              className={`text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold mb-1 lg:mb-2 ${
                clima.viento_velocidad > 30 ? "text-red-600" : "text-green-600"
              }`}
            >
              {clima.viento_velocidad}
            </div>
            <p className="text-xs sm:text-sm lg:text-base text-gray-600 font-medium">Viento (km/h)</p>
            {clima.viento_velocidad > 30 && (
              <p className="text-xs lg:text-sm text-red-600 font-semibold mt-1">Fuerte</p>
            )}
          </div>
        </div>

        {/* Información adicional */}
        <div className="space-y-2 lg:space-y-3 pt-2 lg:pt-3 border-t border-gray-100">
          <div className="flex items-center justify-between">
            <span className="text-xs sm:text-sm lg:text-base text-gray-600">Dirección viento</span>
            <span className="text-xs sm:text-sm lg:text-base font-semibold text-gray-900">
              {clima.viento_direccion}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-xs sm:text-sm lg:text-base text-gray-600">Visibilidad</span>
            <Badge
              variant="outline"
              className={`text-xs lg:text-sm ${
                clima.visibilidad === "baja" 
                  ? "border-red-500 text-red-700 bg-red-50" 
                  : "border-gray-300"
              }`}
            >
              {clima.visibilidad}
            </Badge>
          </div>
        </div>

        {/* Fuente si existe */}
        {clima.fuente && (
          <div className="pt-2 lg:pt-3 border-t border-gray-100">
            <div className="flex items-center justify-between">
              <span className="text-xs lg:text-sm text-gray-500">Fuente</span>
              <span className="text-xs lg:text-sm font-medium text-gray-700">{clima.fuente}</span>
            </div>
          </div>
        )}

        {/* Botón para ver detalles */}
        <Link href="/dashboard/clima" className="block pt-2">
          <Button variant="outline" className="w-full border-[var(--isla-teal)] text-[var(--isla-teal)] hover:bg-[var(--isla-teal)] hover:text-white text-sm lg:text-base h-9 lg:h-10" size="sm">
            Ver Detalles Completos
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
}
