import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FileText } from "lucide-react";
import { useEffect, useState } from "react";
import { getPlantillas } from "@/actions/notificaciones";
import { PlantillaMensaje } from "@/lib/types/notificaciones";
import { LoadingState } from "./LoadingState";
import { ErrorAlert } from "./ErrorAlert";
import {
  getTituloTipoNotificacion,
  getDescripcionTipoNotificacion,
} from "./utils";

export function PlantillasCard() {
  const [plantillas, setPlantillas] = useState<PlantillaMensaje[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadPlantillas();
  }, []);

  const loadPlantillas = async () => {
    try {
      setLoading(true);
      const result = await getPlantillas();

      if (result.success && result.data) {
        setPlantillas(result.data);
      } else {
        setError(result.error || "Error al cargar plantillas");
      }
    } catch {
      setError("Error al cargar plantillas");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <LoadingState />;
  }

  if (error) {
    return <ErrorAlert error={error} onRetry={loadPlantillas} />;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5" />
          Plantillas Disponibles
        </CardTitle>
        <CardDescription>Plantillas predefinidas de mensajes</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {plantillas.length === 0 ? (
            <p className="text-center text-gray-600 py-4">
              No hay plantillas disponibles
            </p>
          ) : (
            plantillas.map((plantilla) => (
              <div
                key={plantilla.tipo}
                className="border rounded-lg p-4 space-y-2"
              >
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold">
                    {getTituloTipoNotificacion(plantilla.tipo)}
                  </h3>
                  <Badge variant="outline">{plantilla.tipo}</Badge>
                </div>
                <p className="text-sm text-gray-600">
                  {getDescripcionTipoNotificacion(plantilla.tipo)}
                </p>
                <div className="bg-gray-50 rounded p-3 text-sm">
                  <p className="font-mono whitespace-pre-wrap">
                    {plantilla.ejemplo}
                  </p>
                </div>
                {plantilla.variables.length > 0 && (
                  <div className="flex gap-2 flex-wrap">
                    <span className="text-sm text-gray-600">Variables:</span>
                    {plantilla.variables.map((variable) => (
                      <Badge
                        key={variable}
                        variant="secondary"
                        className="text-xs"
                      >
                        {`{${variable}}`}
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}
