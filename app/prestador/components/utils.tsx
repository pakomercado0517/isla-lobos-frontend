import {
  Clock,
  CheckCircle,
  XCircle,
} from "lucide-react";

export function getEstadoColor(estado: string): string {
  switch (estado) {
    case "programada":
      return "bg-blue-100 text-blue-800 border-blue-200";
    case "en_curso":
      return "bg-yellow-100 text-yellow-800 border-yellow-200";
    case "completada":
      return "bg-green-100 text-green-800 border-green-200";
    case "cancelada":
      return "bg-red-100 text-red-800 border-red-200";
    default:
      return "bg-gray-100 text-gray-800 border-gray-200";
  }
}

export function getEstadoIcon(estado: string) {
  switch (estado) {
    case "programada":
      return <Clock className="w-4 h-4 text-blue-500" />;
    case "en_curso":
      return <Clock className="w-4 h-4 text-yellow-500" />;
    case "completada":
      return <CheckCircle className="w-4 h-4 text-green-500" />;
    case "cancelada":
      return <XCircle className="w-4 h-4 text-red-500" />;
    default:
      return null;
  }
}

