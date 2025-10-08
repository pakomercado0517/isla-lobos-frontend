import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Package } from "lucide-react";
import type { BrazaletesPrestador } from "@/lib/types/brazaletes";
import { getEstadoBadgeClass } from "./utils";

interface ListaBrazaletesProps {
  brazaletesFiltrados: BrazaletesPrestador["detalle"];
  filtroEstado: "todos" | "disponible" | "asignado" | "utilizado" | "perdido";
  onCambiarFiltro: (estado: "todos") => void;
}

export function ListaBrazaletes({
  brazaletesFiltrados,
  filtroEstado,
  onCambiarFiltro,
}: ListaBrazaletesProps) {
  if (brazaletesFiltrados.length === 0) {
    return (
      <div className="bg-white p-6 rounded-lg border">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Detalle de Brazaletes</h3>
          <Badge variant="outline">0 brazaletes</Badge>
        </div>
        
        <div className="text-center py-8">
          <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {filtroEstado === "todos"
              ? "No tienes brazaletes asignados"
              : `No tienes brazaletes con estado "${filtroEstado}"`}
          </h3>
          <p className="text-gray-600">
            {filtroEstado === "todos"
              ? "Contacta a CONANP para obtener brazaletes para tus salidas"
              : "Intenta cambiar el filtro para ver otros brazaletes"}
          </p>
          {filtroEstado !== "todos" && (
            <Button
              variant="outline"
              onClick={() => onCambiarFiltro("todos")}
              className="mt-4"
            >
              Ver todos los brazaletes
            </Button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-lg border">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Detalle de Brazaletes</h3>
        <div className="flex items-center gap-2">
          <Badge variant="outline">
            {brazaletesFiltrados.length} brazaletes
          </Badge>
          {filtroEstado !== "todos" && (
            <Badge variant="secondary">Filtrado: {filtroEstado}</Badge>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {brazaletesFiltrados.map((brazalete) => (
          <div
            key={brazalete.id}
            className="p-4 border rounded-lg hover:shadow-md transition-shadow"
          >
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center gap-2">
                <Badge
                  variant="outline"
                  className="bg-purple-50 text-purple-700"
                >
                  🎫 Universal
                </Badge>
                <span className="font-mono text-sm font-medium">
                  {brazalete.codigo}
                </span>
              </div>
              <Badge className={getEstadoBadgeClass(brazalete.estado)}>
                {brazalete.estado}
              </Badge>
            </div>

            <div className="space-y-1 text-sm text-gray-600">
              <div className="flex justify-between">
                <span>Precio:</span>
                <span className="font-medium">${brazalete.precio}</span>
              </div>
              <div className="flex justify-between">
                <span>Lote:</span>
                <span className="font-medium">
                  {brazalete.lote?.numero_lote}
                </span>
              </div>
              {brazalete.fecha_asignacion && (
                <div className="flex justify-between">
                  <span>Asignado:</span>
                  <span className="font-medium">
                    {new Date(
                      brazalete.fecha_asignacion
                    ).toLocaleDateString("es-MX")}
                  </span>
                </div>
              )}
              {brazalete.fecha_uso && (
                <div className="flex justify-between">
                  <span>Utilizado:</span>
                  <span className="font-medium">
                    {new Date(brazalete.fecha_uso).toLocaleDateString(
                      "es-MX"
                    )}
                  </span>
                </div>
              )}
              {brazalete.salida && (
                <div className="flex justify-between">
                  <span>Salida:</span>
                  <span className="font-medium">
                    {brazalete.salida.numero_pasajeros} pasajeros
                  </span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
