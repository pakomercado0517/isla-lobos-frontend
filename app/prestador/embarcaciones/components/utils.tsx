import React from "react";
import {
  CheckCircle,
  Activity,
  Wrench,
  AlertTriangle,
  Clock,
} from "lucide-react";

/**
 * Obtiene el icono correspondiente al estado de la embarcación
 */
export function getEstadoIcon(
  estado: "disponible" | "en_uso" | "mantenimiento" | "pendiente_autorizacion"
): React.ReactElement {
  switch (estado) {
    case "disponible":
      return <CheckCircle className="w-4 h-4 text-green-500" />;
    case "en_uso":
      return <Activity className="w-4 h-4 text-blue-500" />;
    case "mantenimiento":
      return <Wrench className="w-4 h-4 text-yellow-500" />;
    case "pendiente_autorizacion":
      return <Clock className="w-4 h-4 text-amber-500" />;
    default:
      return <AlertTriangle className="w-4 h-4 text-gray-500" />;
  }
}

/**
 * Obtiene las clases CSS para el badge de estado
 */
export function getEstadoColor(
  estado: "disponible" | "en_uso" | "mantenimiento" | "pendiente_autorizacion"
): string {
  switch (estado) {
    case "disponible":
      return "bg-green-100 text-green-800";
    case "en_uso":
      return "bg-blue-100 text-blue-800";
    case "mantenimiento":
      return "bg-yellow-100 text-yellow-800";
    case "pendiente_autorizacion":
      return "bg-amber-100 text-amber-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
}

/**
 * Obtiene las clases CSS para el badge de tipo
 */
export function getTipoColor(tipo: "menor" | "mayor"): string {
  return tipo === "mayor"
    ? "bg-purple-100 text-purple-800"
    : "bg-blue-100 text-blue-800";
}

/**
 * Formatea el estado para mostrarlo en la UI
 */
export function formatearEstado(
  estado: "disponible" | "en_uso" | "mantenimiento" | "pendiente_autorizacion"
): string {
  return estado.replace(/_/g, " ");
}
