"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Ship, Calendar } from "lucide-react";
import { getEstadoColor, getTipoColor } from "../../components/utils";
import { formatearFechaRegional } from "@/lib/utils";

interface EmbarcacionDetalle {
  id: string;
  nombre: string;
  matricula: string;
  capacidad: number;
  tipo: "menor" | "mayor";
  estado: "disponible" | "en_uso" | "mantenimiento" | "pendiente_autorizacion";
  createdAt?: string;
  updatedAt?: string;
  created_at?: string;
  updated_at?: string;
}

interface DetallesEmbarcacionProps {
  embarcacion: EmbarcacionDetalle;
}

export function DetallesEmbarcacion({ embarcacion }: DetallesEmbarcacionProps) {
  // Normalizar nombres de campos de fecha (pueden venir como createdAt/updatedAt o created_at/updated_at)
  const fechaCreacionRaw =
    embarcacion.createdAt || embarcacion.created_at || null;
  const fechaActualizacionRaw =
    embarcacion.updatedAt || embarcacion.updated_at || null;

  // Formatear fechas de forma segura
  const fechaCreacion = fechaCreacionRaw
    ? formatearFechaRegional(
        typeof fechaCreacionRaw === "string"
          ? fechaCreacionRaw.split("T")[0]
          : fechaCreacionRaw
      )
    : "No disponible";

  const fechaActualizacion = fechaActualizacionRaw
    ? formatearFechaRegional(
        typeof fechaActualizacionRaw === "string"
          ? fechaActualizacionRaw.split("T")[0]
          : fechaActualizacionRaw
      )
    : "No disponible";

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
          <Ship className="w-5 h-5 sm:w-6 sm:h-6 flex-shrink-0 text-teal-600" />
          Información de la Embarcación
        </CardTitle>
        <CardDescription className="text-xs sm:text-sm">
          Detalles principales de la embarcación
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4 sm:space-y-6">
        {/* Nombre */}
        <div>
          <div className="text-xs sm:text-sm text-slate-600 mb-1 font-medium">
            Nombre
          </div>
          <div className="text-base sm:text-lg font-semibold text-slate-900">
            {embarcacion.nombre}
          </div>
        </div>

        {/* Matrícula */}
        <div>
          <div className="text-xs sm:text-sm text-slate-600 mb-1 font-medium">
            Matrícula
          </div>
          <div className="font-mono text-sm sm:text-base font-medium text-slate-900">
            {embarcacion.matricula}
          </div>
        </div>

        {/* Tipo y Estado */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <div className="text-xs sm:text-sm text-slate-600 mb-2 font-medium">
              Tipo
            </div>
            <Badge className={getTipoColor(embarcacion.tipo)}>
              {embarcacion.tipo === "mayor"
                ? "Embarcación Mayor"
                : "Embarcación Menor"}
            </Badge>
          </div>
          <div>
            <div className="text-xs sm:text-sm text-slate-600 mb-2 font-medium">
              Estado
            </div>
            <Badge className={getEstadoColor(embarcacion.estado)}>
              {embarcacion.estado === "pendiente_autorizacion"
                ? "Pendiente Autorización"
                : embarcacion.estado === "en_uso"
                ? "En Uso"
                : embarcacion.estado === "mantenimiento"
                ? "Mantenimiento"
                : "Disponible"}
            </Badge>
          </div>
        </div>

        {/* Capacidad */}
        <div>
          <div className="text-xs sm:text-sm text-slate-600 mb-1 font-medium">
            Capacidad
          </div>
          <div className="text-lg sm:text-xl font-bold text-teal-600">
            {embarcacion.capacidad} pasajeros
          </div>
        </div>

        {/* Fechas */}
        <div className="pt-4 border-t border-slate-200 space-y-3">
          <div className="flex items-center gap-2 text-xs sm:text-sm text-slate-600">
            <Calendar className="w-4 h-4 flex-shrink-0" />
            <span className="font-medium">Creada:</span>
            <span>{fechaCreacion}</span>
          </div>
          <div className="flex items-center gap-2 text-xs sm:text-sm text-slate-600">
            <Calendar className="w-4 h-4 flex-shrink-0" />
            <span className="font-medium">Última actualización:</span>
            <span>{fechaActualizacion}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
