import { TrendingUp } from "lucide-react";
import { UsoBrazaletesCard } from "@/components/brazaletes/UsoBrazaletesCard";
import type {
  UsoBrazaleteSalida,
  BrazaletesCardUso,
} from "@/lib/types/brazaletes";

interface HistorialUsoProps {
  registrosUso: UsoBrazaleteSalida[];
}

export function HistorialUso({ registrosUso }: HistorialUsoProps) {
  if (registrosUso.length === 0) {
    return (
      <div className="text-center py-6 md:py-12 px-4">
        <TrendingUp className="w-10 h-10 md:w-12 md:h-12 text-gray-400 mx-auto mb-3 md:mb-4" />
        <h3 className="text-base md:text-lg font-medium text-gray-900 mb-2">
          No hay registros de uso
        </h3>
        <p className="text-xs md:text-sm text-gray-600 max-w-sm mx-auto">
          Los registros de uso de brazaletes aparecerán aquí una vez que
          comiences a registrar
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-6">
      {registrosUso.map((registro, index) => (
        <UsoBrazaletesCard
          key={registro.salida_id || `registro-${index}`}
          uso={registro as unknown as BrazaletesCardUso}
          onVerDetalles={(_registro) => {
            // TODO: Implementar vista de detalles
          }}
        />
      ))}
    </div>
  );
}
