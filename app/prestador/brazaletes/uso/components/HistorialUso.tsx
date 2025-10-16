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
      <div className="text-center py-12">
        <TrendingUp className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          No hay registros de uso
        </h3>
        <p className="text-gray-600">
          Los registros de uso de brazaletes aparecerán aquí una vez que
          comiences a registrar
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
