import { CheckCircle, Activity, Wrench, AlertTriangle } from "lucide-react";

export function getEstadoIcon(estado: string) {
  switch (estado) {
    case "disponible":
      return <CheckCircle className="w-4 h-4 text-green-500" />;
    case "en_uso":
      return <Activity className="w-4 h-4 text-blue-500" />;
    case "mantenimiento":
      return <Wrench className="w-4 h-4 text-yellow-500" />;
    default:
      return <AlertTriangle className="w-4 h-4 text-gray-500" />;
  }
}

export function getEstadoColor(estado: string): string {
  switch (estado) {
    case "disponible":
      return "bg-green-100 text-green-800";
    case "en_uso":
      return "bg-blue-100 text-blue-800";
    case "mantenimiento":
      return "bg-yellow-100 text-yellow-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
}

export function getTipoColor(tipo: string): string {
  return tipo === "mayor"
    ? "bg-purple-100 text-purple-800"
    : "bg-blue-100 text-blue-800";
}
