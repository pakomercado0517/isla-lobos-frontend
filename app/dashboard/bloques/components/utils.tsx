import {
  CheckCircle,
  XCircle,
  AlertTriangle,
} from "lucide-react";

export function getEstadoIcon(estado: string) {
  switch (estado) {
    case "activo":
      return <CheckCircle className="w-4 h-4 text-green-500" />;
    case "lleno":
      return <XCircle className="w-4 h-4 text-red-500" />;
    case "suspendido_por_clima":
      return <AlertTriangle className="w-4 h-4 text-yellow-500" />;
    case "cerrado_capitaria":
      return <XCircle className="w-4 h-4 text-gray-500" />;
    default:
      return <AlertTriangle className="w-4 h-4 text-gray-500" />;
  }
}

export function getEstadoColor(estado: string): string {
  switch (estado) {
    case "activo":
      return "bg-green-100 text-green-800";
    case "lleno":
      return "bg-red-100 text-red-800";
    case "suspendido_por_clima":
      return "bg-yellow-100 text-yellow-800";
    case "cerrado_capitaria":
      return "bg-gray-100 text-gray-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
}

export function getOcupacionColor(registrados: number, total: number): string {
  const porcentaje = (registrados / total) * 100;
  if (porcentaje >= 100) return "text-red-600";
  if (porcentaje >= 80) return "text-yellow-600";
  return "text-green-600";
}

