import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, XCircle, Send } from "lucide-react";
import { EstadoServicioWhatsApp } from "@/lib/types/notificaciones";
import { useState } from "react";
import { enviarMensajePrueba } from "@/actions/notificaciones";
import { clientLogger } from "@/lib/logger-client";

interface EstadoServicioCardProps {
  estadoServicio: EstadoServicioWhatsApp | null;
}

const isDevelopment = process.env.NODE_ENV === "development";
const numeroTest = process.env.NEXT_PUBLIC_TWILIO_TEST_NUMBER;

export function EstadoServicioCard({
  estadoServicio,
}: EstadoServicioCardProps) {
  const [enviandoPrueba, setEnviandoPrueba] = useState(false);
  const [mensajePrueba, setMensajePrueba] = useState<string>("");

  const handleEnviarPrueba = async () => {
    if (!numeroTest) {
      setMensajePrueba("No hay número de prueba configurado");
      return;
    }

    try {
      setEnviandoPrueba(true);
      setMensajePrueba("");

      clientLogger.info("Enviando mensaje de prueba", { numeroTest });

      const result = await enviarMensajePrueba(numeroTest);

      if (result.success) {
        setMensajePrueba("✅ Mensaje de prueba enviado exitosamente");
        clientLogger.info("Mensaje de prueba enviado", {
          messageId: result.data?.message_id,
        });
      } else {
        setMensajePrueba(`❌ Error: ${result.error}`);
        clientLogger.error("Error al enviar mensaje de prueba", result.error);
      }
    } catch (error) {
      setMensajePrueba("❌ Error al enviar mensaje de prueba");
      clientLogger.error("Error crítico al enviar mensaje de prueba", error);
    } finally {
      setEnviandoPrueba(false);
    }
  };

  if (!estadoServicio) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {estadoServicio.configurado ? (
            <CheckCircle className="h-5 w-5 text-green-600" />
          ) : (
            <XCircle className="h-5 w-5 text-red-600" />
          )}
          Estado del Servicio
        </CardTitle>
        <CardDescription>Información del servicio de WhatsApp</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-600">Proveedor</p>
            <p className="font-semibold">{estadoServicio.proveedor}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Estado</p>
            <Badge
              variant={estadoServicio.configurado ? "default" : "destructive"}
            >
              {estadoServicio.configurado ? "Configurado" : "No Configurado"}
            </Badge>
          </div>
        </div>

        {isDevelopment && numeroTest && estadoServicio.configurado && (
          <div className="pt-4 border-t space-y-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleEnviarPrueba}
              disabled={enviandoPrueba}
              className="w-full"
            >
              <Send className="h-4 w-4 mr-2" />
              {enviandoPrueba ? "Enviando..." : "Enviar Mensaje de Prueba"}
            </Button>
            {mensajePrueba && (
              <p className="text-sm text-center">{mensajePrueba}</p>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
