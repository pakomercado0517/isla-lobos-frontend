import { Button } from "@/components/ui/button";
import { Ticket } from "lucide-react";
import { UsoBrazaletesCard } from "@/components/brazaletes/UsoBrazaletesCard";
import type { BrazaletesCardUso } from "@/lib/types/brazaletes";
import type { Salida } from "@/lib/types/salida";

interface TabBrazaletesProps {
  salida: Salida;
  usosBrazaletes: BrazaletesCardUso[];
  onRegistrarBrazaletes: () => void;
  puedeMostrarBotonRegistrar: boolean;
}

export function TabBrazaletes({
  salida,
  usosBrazaletes,
  onRegistrarBrazaletes,
  puedeMostrarBotonRegistrar,
}: TabBrazaletesProps) {
  return (
    <div className="space-y-4">
      {/* Header con contador */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">
          Brazaletes Registrados en esta Salida
        </h3>
        <div className="text-sm text-gray-600">
          {usosBrazaletes.length} brazaletes
        </div>
      </div>

      {/* Lista de brazaletes o estado vacío */}
      {usosBrazaletes.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {usosBrazaletes.map((uso) => (
            <UsoBrazaletesCard
              key={uso.id}
              uso={uso}
              onVerDetalles={(_uso) => {}}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-200">
          <Ticket className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No hay brazaletes registrados
          </h3>
          <p className="text-gray-600 mb-4 max-w-md mx-auto">
            {salida.estado === "completada"
              ? "Esta salida no tiene brazaletes registrados."
              : salida.estado === "programada" || salida.estado === "en_curso"
              ? "Puedes registrar los brazaletes utilizados en esta salida."
              : "Los brazaletes solo se pueden registrar en salidas programadas o en curso."}
          </p>
          {puedeMostrarBotonRegistrar && (
            <Button
              onClick={onRegistrarBrazaletes}
              className="bg-[var(--isla-teal)] hover:bg-[var(--isla-teal-dark)] text-white"
            >
              <Ticket className="w-4 h-4 mr-2" />
              Registrar Brazaletes
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
