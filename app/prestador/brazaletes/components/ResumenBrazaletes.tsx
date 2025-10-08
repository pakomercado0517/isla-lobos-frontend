import { Package, Calendar, TrendingUp } from "lucide-react";
import type { BrazaletesPrestador } from "@/lib/types/brazaletes";
import type { ConteosBrazaletes } from "./utils";

interface ResumenBrazaletesProps {
  brazaletesData: BrazaletesPrestador;
  filtroEstado: "todos" | "disponible" | "asignado" | "utilizado" | "perdido";
  conteos: ConteosBrazaletes;
}

export function ResumenBrazaletes({
  brazaletesData,
  filtroEstado,
  conteos,
}: ResumenBrazaletesProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* Disponibles */}
      <div className="bg-green-50 p-6 rounded-lg">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-green-100 rounded-lg">
            <Package className="w-6 h-6 text-green-600" />
          </div>
          <div>
            <p className="text-sm text-green-600 font-medium">Disponibles</p>
            <p className="text-2xl font-bold text-green-900">
              {brazaletesData.brazaletes.disponibles}
            </p>
            {filtroEstado !== "todos" && filtroEstado === "disponible" && (
              <p className="text-xs text-green-700 mt-1">
                Mostrando {conteos.disponible} de{" "}
                {brazaletesData.brazaletes.disponibles}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Asignados */}
      <div className="bg-yellow-50 p-6 rounded-lg">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-yellow-100 rounded-lg">
            <Calendar className="w-6 h-6 text-yellow-600" />
          </div>
          <div>
            <p className="text-sm text-yellow-600 font-medium">Asignados</p>
            <p className="text-2xl font-bold text-yellow-900">
              {brazaletesData.brazaletes.asignados}
            </p>
            {filtroEstado !== "todos" && filtroEstado === "asignado" && (
              <p className="text-xs text-yellow-700 mt-1">
                Mostrando {conteos.asignado} de{" "}
                {brazaletesData.brazaletes.asignados}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Utilizados */}
      <div className="bg-purple-50 p-6 rounded-lg">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-purple-100 rounded-lg">
            <TrendingUp className="w-6 h-6 text-purple-600" />
          </div>
          <div>
            <p className="text-sm text-purple-600 font-medium">Utilizados</p>
            <p className="text-2xl font-bold text-purple-900">
              {brazaletesData.brazaletes.utilizados}
            </p>
            {filtroEstado !== "todos" && filtroEstado === "utilizado" && (
              <p className="text-xs text-purple-700 mt-1">
                Mostrando {conteos.utilizado} de{" "}
                {brazaletesData.brazaletes.utilizados}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
