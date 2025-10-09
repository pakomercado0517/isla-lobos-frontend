import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { Embarcacion } from "@/lib/types/embarcacion";
import type { Salida } from "@/lib/types/salida";
import { getEstadoColor } from "./utils";

interface EmbarcacionesCardsProps {
  embarcaciones: Embarcacion[];
  salidas: Salida[];
}

export function EmbarcacionesCards({
  embarcaciones,
  salidas,
}: EmbarcacionesCardsProps) {
  const getSalidasHoyPorEmbarcacion = (embarcacionId: string) => {
    const hoy = new Date().toLocaleDateString("es-MX");
    return salidas.filter((salida) => {
      const fechaSalida =
        salida.fecha instanceof Date
          ? salida.fecha.toLocaleDateString("es-MX")
          : salida.fecha;

      return (
        salida.embarcacion?.nombre ===
          embarcaciones.find((e) => e.id === embarcacionId)?.nombre &&
        fechaSalida === hoy &&
        salida.estado !== "cancelada" &&
        salida.estado !== "completada" &&
        salida.estado !== "cancelada_por_clima" &&
        salida.estado !== "cancelada_capitaria"
      );
    });
  };

  const getEmbarcacionBadgeColor = (embarcacionId: string) => {
    const salidasHoy = getSalidasHoyPorEmbarcacion(embarcacionId);
    return salidasHoy.length === 0
      ? "bg-green-100 text-green-800 border-green-200"
      : "bg-blue-100 text-blue-800 border-blue-200";
  };

  const getEmbarcacionBadgeText = (embarcacionId: string) => {
    const salidasHoy = getSalidasHoyPorEmbarcacion(embarcacionId);
    if (salidasHoy.length === 0) return "Sin salidas hoy";
    if (salidasHoy.length === 1) return "1 salida hoy";
    return `${salidasHoy.length} salidas hoy`;
  };

  return (
    <div className="mb-8">
      <h2 className="text-xl font-semibold text-[var(--isla-dark-teal)] mb-4">
        Mis Embarcaciones
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {embarcaciones.map((embarcacion) => {
          const salidasHoy = getSalidasHoyPorEmbarcacion(embarcacion.id);
          return (
            <Card key={embarcacion.id}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg">
                      {embarcacion.nombre}
                    </CardTitle>
                    <CardDescription>{embarcacion.matricula}</CardDescription>
                  </div>
                  <Badge
                    className={`${getEmbarcacionBadgeColor(
                      embarcacion.id
                    )} text-xs`}
                  >
                    {getEmbarcacionBadgeText(embarcacion.id)}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Capacidad:</span>
                    <span className="font-medium">
                      {embarcacion.capacidad} personas
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Tipo:</span>
                    <span className="font-medium capitalize">
                      {embarcacion.tipo === "mayor"
                        ? "Embarcación Mayor"
                        : "Embarcación Menor"}
                    </span>
                  </div>

                  {/* Información de salidas de hoy */}
                  {salidasHoy.length > 0 && (
                    <div className="mt-3 pt-2 border-t border-gray-200">
                      <div className="text-xs text-gray-600 mb-1">
                        Salidas programadas hoy:
                      </div>
                      {salidasHoy.map((salida) => (
                        <div
                          key={salida.id}
                          className="text-xs text-gray-700 bg-blue-50 p-2 rounded mb-1"
                        >
                          <div className="flex justify-between items-center">
                            <span className="font-medium">
                              {salida.destino}
                            </span>
                            <Badge
                              variant="outline"
                              className={`text-xs ${getEstadoColor(
                                salida.estado
                              )}`}
                            >
                              {salida.estado.replace("_", " ")}
                            </Badge>
                          </div>
                          <div className="text-gray-600 mt-1">
                            {salida.bloque?.hora_inicio} -{" "}
                            {salida.bloque?.hora_fin} •{" "}
                            {salida.numero_pasajeros} pasajeros
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
