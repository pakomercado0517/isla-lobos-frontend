"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Cloud } from "lucide-react";

interface ClimaData {
  estado_puerto: string;
  oleaje: number;
  viento_velocidad: number;
  viento_direccion: string;
  visibilidad: string;
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

export function EstadoPuertoCard({ clima }: EstadoPuertoCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Cloud className="w-5 h-5 mr-2" />
          Estado del Puerto
        </CardTitle>
        <CardDescription>Condiciones meteorológicas actuales</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">Estado:</span>
          <Badge className={getEstadoPuertoColor(clima.estado_puerto)}>
            {getEstadoPuertoIcon(clima.estado_puerto)}{" "}
            {clima.estado_puerto.toUpperCase()}
          </Badge>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">
              {clima.oleaje}m
            </div>
            <p className="text-xs text-muted-foreground">Oleaje</p>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">
              {clima.viento_velocidad}
            </div>
            <p className="text-xs text-muted-foreground">Viento (km/h)</p>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">Viento:</span>
          <span className="text-sm">
            {clima.viento_velocidad} km/h {clima.viento_direccion}
          </span>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">Visibilidad:</span>
          <span className="text-sm capitalize">{clima.visibilidad}</span>
        </div>
      </CardContent>
    </Card>
  );
}

