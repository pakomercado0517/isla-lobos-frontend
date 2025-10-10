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
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center">
            <Cloud className="w-5 h-5 mr-2" />
            Estado del Puerto
          </div>
          <Link href="/dashboard/clima">
            <Button variant="ghost" size="sm">
              <ExternalLink className="w-4 h-4" />
            </Button>
          </Link>
        </CardTitle>
        <CardDescription>Condiciones meteorológicas actuales</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Alerta si condiciones peligrosas */}
        {condicionPeligrosa && (
          <Alert variant="destructive" className="mb-4">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription className="text-xs">
              Condiciones desfavorables para navegación
            </AlertDescription>
          </Alert>
        )}

        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">Estado:</span>
          <Badge className={getEstadoPuertoColor(clima.estado_puerto)}>
            {getEstadoPuertoIcon(clima.estado_puerto)}{" "}
            {clima.estado_puerto.toUpperCase()}
          </Badge>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="text-center">
            <div
              className={`text-2xl font-bold ${
                clima.oleaje > 2.5 ? "text-red-600" : "text-blue-600"
              }`}
            >
              {clima.oleaje}m
            </div>
            <p className="text-xs text-muted-foreground">Oleaje</p>
            {clima.oleaje > 2.5 && (
              <p className="text-xs text-red-600 font-medium">Alto</p>
            )}
          </div>
          <div className="text-center">
            <div
              className={`text-2xl font-bold ${
                clima.viento_velocidad > 30 ? "text-red-600" : "text-green-600"
              }`}
            >
              {clima.viento_velocidad}
            </div>
            <p className="text-xs text-muted-foreground">Viento (km/h)</p>
            {clima.viento_velocidad > 30 && (
              <p className="text-xs text-red-600 font-medium">Fuerte</p>
            )}
          </div>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">Viento:</span>
          <span className="text-sm font-semibold">
            {clima.viento_velocidad} km/h {clima.viento_direccion}
          </span>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">Visibilidad:</span>
          <Badge
            variant="outline"
            className={
              clima.visibilidad === "baja" ? "border-red-500 text-red-700" : ""
            }
          >
            {clima.visibilidad}
          </Badge>
        </div>

        {clima.fuente && (
          <div className="flex items-center justify-between border-t pt-3">
            <span className="text-xs text-muted-foreground">Fuente:</span>
            <span className="text-xs font-medium">{clima.fuente}</span>
          </div>
        )}

        {/* Link para ver detalles */}
        <Link href="/dashboard/clima" className="block">
          <Button variant="outline" className="w-full" size="sm">
            Ver Detalles Completos
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
}
