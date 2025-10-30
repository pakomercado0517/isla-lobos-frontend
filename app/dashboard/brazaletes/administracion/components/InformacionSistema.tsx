import type { User } from "@/lib/types/auth";
import { formatDateForDisplay } from "./utils";

interface InformacionSistemaProps {
  user: User | null;
  estadisticas?: {
    totalBrazaletes: number;
    totalLotes: number;
    totalVentas: number;
    totalUsos: number;
    ultimaActualizacion: string;
  };
}

export function InformacionSistema({ user, estadisticas }: InformacionSistemaProps) {
  return (
    <div className="bg-blue-50 p-4 sm:p-6 rounded-lg mx-2 sm:mx-0">
      <h3 className="font-semibold text-sm sm:text-base text-blue-900 mb-3">
        Información del Sistema
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 text-xs sm:text-sm text-blue-800">
        <div className="space-y-1.5">
          <p className="break-words">
            <strong>Usuario:</strong> {user?.nombre || "N/A"}
          </p>
          <p>
            <strong>Rol:</strong> {user?.rol || "N/A"}
          </p>
        </div>
        <div className="space-y-1.5">
          <p className="break-words">
            <strong>Última actualización:</strong>{" "}
            {estadisticas?.ultimaActualizacion
              ? formatDateForDisplay(estadisticas.ultimaActualizacion)
              : "N/A"}
          </p>
          <p>
            <strong>Estado del sistema:</strong>{" "}
            <span className="text-green-600 font-medium">Operativo</span>
          </p>
        </div>
      </div>
    </div>
  );
}
