import { Card, CardContent } from "@/components/ui/card";
import { Shield, AlertTriangle, X, Zap } from "lucide-react";
import { PuertoStatus } from "@/lib/types/public";

interface EstadoPuertoProps {
  puerto: PuertoStatus | null;
  loading: boolean;
}

/**
 * Mapeo de iconos según el estado del puerto
 */
const getEstadoIcon = (estado: string) => {
  switch (estado) {
    case "abierto":
      return Shield;
    case "restricciones":
      return AlertTriangle;
    case "cerrado":
      return X;
    case "emergencia":
      return Zap;
    default:
      return Shield;
  }
};

/**
 * Mapeo de colores CSS según el color de la API
 */
const getColorClasses = (color: string) => {
  switch (color) {
    case "green":
      return "from-[var(--isla-green)] to-[var(--isla-green)]/80";
    case "yellow":
      return "from-yellow-500 to-yellow-600";
    case "red":
      return "from-red-500 to-red-600";
    case "gray":
    default:
      return "from-gray-500 to-gray-600";
  }
};

export function EstadoPuerto({ puerto, loading }: EstadoPuertoProps) {
  // Estado de loading
  if (loading) {
    return (
      <Card className="border-0 shadow-lg bg-gradient-to-r from-gray-500 to-gray-600">
        <CardContent className="p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-90">Puerto</p>
              <p className="text-2xl font-bold animate-pulse">Cargando...</p>
            </div>
            <Shield className="w-8 h-8 animate-pulse" />
          </div>
        </CardContent>
      </Card>
    );
  }

  // Estado de error o datos no disponibles
  if (!puerto) {
    return (
      <Card className="border-0 shadow-lg bg-gradient-to-r from-gray-500 to-gray-600">
        <CardContent className="p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-90">Puerto</p>
              <p className="text-2xl font-bold">No disponible</p>
            </div>
            <Shield className="w-8 h-8" />
          </div>
        </CardContent>
      </Card>
    );
  }

  // Obtener componentes dinámicos
  const IconComponent = getEstadoIcon(puerto.estado);
  const colorClasses = getColorClasses(puerto.color);

  return (
    <Card className={`border-0 shadow-lg bg-gradient-to-r ${colorClasses}`}>
      <CardContent className="p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm opacity-90">Puerto</p>
            <p className="text-2xl font-bold" title={`Estado: ${puerto.estado}`}>
              {puerto.texto}
            </p>
            <p className="text-xs opacity-75 mt-1">
              Actualizado: {puerto.ultima_actualizacion}
            </p>
          </div>
          <IconComponent className="w-8 h-8" />
        </div>
      </CardContent>
    </Card>
  );
}