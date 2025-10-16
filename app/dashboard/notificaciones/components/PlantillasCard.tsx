import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MessageSquare, Mail } from "lucide-react";
import { useEffect, useState } from "react";
import { getPlantillas } from "@/actions/notificaciones";
import { getPlantillasEmail } from "@/actions/emails";
import {
  PlantillaMensaje,
  PlantillaEmail,
  CanalNotificacion,
} from "@/lib/types/notificaciones";
import { LoadingState } from "./LoadingState";
import { ErrorAlert } from "./ErrorAlert";
import {
  getTituloTipoNotificacion,
  getDescripcionTipoNotificacion,
} from "./utils";

interface PlantillasCardProps {
  canal: CanalNotificacion;
}

export function PlantillasCard({ canal }: PlantillasCardProps) {
  const [plantillasWhatsApp, setPlantillasWhatsApp] = useState<
    PlantillaMensaje[]
  >([]);
  const [plantillasEmail, setPlantillasEmail] = useState<PlantillaEmail[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadPlantillas = async () => {
    try {
      setLoading(true);
      setError("");

      if (canal === "whatsapp") {
        const result = await getPlantillas();
        if (result.success && result.data) {
          setPlantillasWhatsApp(result.data);
        } else {
          setError(result.error || "Error al cargar plantillas");
        }
      } else if (canal === "email") {
        const result = await getPlantillasEmail();
        if (result.success && result.data) {
          setPlantillasEmail(result.data);
        } else {
          setError(result.error || "Error al cargar plantillas");
        }
      } else {
        // Cargar ambas en paralelo
        const [whatsappResult, emailResult] = await Promise.all([
          getPlantillas(),
          getPlantillasEmail(),
        ]);

        if (whatsappResult.success && whatsappResult.data) {
          setPlantillasWhatsApp(whatsappResult.data);
        }

        if (emailResult.success && emailResult.data) {
          setPlantillasEmail(emailResult.data);
        }

        if (!whatsappResult.success && !emailResult.success) {
          setError("Error al cargar plantillas");
        }
      }
    } catch {
      setError("Error al cargar plantillas");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPlantillas();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [canal]);

  if (loading) {
    return <LoadingState />;
  }

  if (error) {
    return <ErrorAlert error={error} onRetry={loadPlantillas} />;
  }

  return (
    <div className="space-y-6">
      {/* Plantillas WhatsApp */}
      {canal !== "email" && plantillasWhatsApp.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5 text-teal-600" />
              Plantillas WhatsApp
            </CardTitle>
            <CardDescription>
              Plantillas predefinidas para mensajes de WhatsApp
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {plantillasWhatsApp.length === 0 ? (
                <p className="text-center text-gray-600 py-4">
                  No hay plantillas disponibles
                </p>
              ) : (
                plantillasWhatsApp.map((plantilla) => (
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
                        <span className="text-sm text-gray-600">
                          Variables:
                        </span>
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
      )}

      {/* Plantillas Email */}
      {canal !== "whatsapp" && plantillasEmail.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Mail className="h-5 w-5 text-blue-600" />
              Plantillas Email
            </CardTitle>
            <CardDescription>
              Plantillas predefinidas para emails
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {plantillasEmail.map((plantilla) => (
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

                  {/* Asunto del email */}
                  <div className="bg-blue-50 rounded p-3 text-sm">
                    <p className="text-xs text-blue-600 font-semibold mb-1">
                      Asunto:
                    </p>
                    <p className="font-semibold">{plantilla.ejemplo.asunto}</p>
                  </div>

                  {/* Cuerpo del email */}
                  <div className="bg-gray-50 rounded p-3 text-sm">
                    <p className="text-xs text-gray-600 font-semibold mb-1">
                      Mensaje:
                    </p>
                    <p className="font-mono whitespace-pre-wrap">
                      {plantilla.ejemplo.mensaje}
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
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Empty state cuando no hay plantillas */}
      {canal === "whatsapp" && plantillasWhatsApp.length === 0 && (
        <Card>
          <CardContent className="py-8">
            <p className="text-center text-gray-600">
              No hay plantillas de WhatsApp disponibles
            </p>
          </CardContent>
        </Card>
      )}

      {canal === "email" && plantillasEmail.length === 0 && (
        <Card>
          <CardContent className="py-8">
            <p className="text-center text-gray-600">
              No hay plantillas de Email disponibles
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
