"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Ship,
  Edit,
  Users,
  Hash,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Wrench,
} from "lucide-react";
import { Embarcacion } from "@/lib/types/embarcacion";

interface TablaEmbarcacionesProps {
  embarcaciones: Embarcacion[];
  onEditEmbarcacion: (embarcacion: Embarcacion) => void;
}

export function TablaEmbarcaciones({
  embarcaciones,
  onEditEmbarcacion,
}: TablaEmbarcacionesProps) {
  // Utilidades para estados
  const getEstadoIcon = (estado: string) => {
    switch (estado) {
      case "disponible":
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case "en_uso":
        return <AlertTriangle className="w-4 h-4 text-yellow-600" />;
      case "mantenimiento":
        return <Wrench className="w-4 h-4 text-red-600" />;
      default:
        return <XCircle className="w-4 h-4 text-gray-600" />;
    }
  };

  const getEstadoColor = (estado: string) => {
    switch (estado) {
      case "disponible":
        return "bg-green-100 text-green-800 border-green-200";
      case "en_uso":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "mantenimiento":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getTipoColor = (tipo: string) => {
    switch (tipo) {
      case "mayor":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "menor":
        return "bg-purple-100 text-purple-800 border-purple-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {embarcaciones.map((embarcacion) => (
        <Card
          key={embarcacion.id}
          className="hover:shadow-lg transition-shadow"
        >
          <CardHeader className="pb-3">
            <div className="flex items-start justify-between">
              <div className="flex items-center space-x-2">
                <Ship className="w-5 h-5 text-[var(--isla-teal)]" />
                <CardTitle className="text-lg">{embarcacion.nombre}</CardTitle>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onEditEmbarcacion(embarcacion)}
                className="text-gray-500 hover:text-[var(--isla-teal)]"
              >
                <Edit className="w-4 h-4" />
              </Button>
            </div>
            <CardDescription className="flex items-center space-x-2">
              <Hash className="w-4 h-4" />
              <span>{embarcacion.matricula}</span>
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Users className="w-4 h-4 text-gray-500" />
                <span className="text-sm text-gray-600">
                  {embarcacion.capacidad} pasajeros
                </span>
              </div>
              <Badge className={getTipoColor(embarcacion.tipo)}>
                {embarcacion.tipo === "mayor" ? "Mayor" : "Menor"}
              </Badge>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                {getEstadoIcon(embarcacion.estado)}
                <span className="text-sm text-gray-600">
                  {embarcacion.estado.replace("_", " ")}
                </span>
              </div>
              <Badge className={getEstadoColor(embarcacion.estado)}>
                {embarcacion.estado.replace("_", " ")}
              </Badge>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
