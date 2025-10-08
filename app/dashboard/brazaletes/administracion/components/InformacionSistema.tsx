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
    <div className="bg-blue-50 p-6 rounded-lg">
      <h3 className="font-semibold text-blue-900 mb-2">
        Información del Sistema
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-blue-800">
        <div>
          <p>
            <strong>Usuario:</strong> {user?.nombre || "N/A"}
          </p>
          <p>
            <strong>Rol:</strong> {user?.rol || "N/A"}
          </p>
        </div>
        <div>
          <p>
            <strong>Última actualización:</strong>{" "}
            {estadisticas?.ultimaActualizacion
              ? formatDateForDisplay(estadisticas.ultimaActualizacion)
              : "N/A"}
          </p>
          <p>
            <strong>Estado del sistema:</strong>{" "}
            <span className="text-green-600">Operativo</span>
          </p>
        </div>
      </div>
    </div>
  );
}
