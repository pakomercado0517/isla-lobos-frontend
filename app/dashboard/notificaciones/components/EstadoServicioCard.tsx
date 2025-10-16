import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, XCircle, Send, MessageSquare, Mail } from "lucide-react";
import {
  EstadoServiciosNotificaciones,
  CanalNotificacion,
} from "@/lib/types/notificaciones";
import { useState } from "react";
import { enviarMensajePrueba } from "@/actions/notificaciones";
import { clientLogger } from "@/lib/logger-client";

interface EstadoServicioCardProps {
  estadoServicios: EstadoServiciosNotificaciones | null;
  canalSeleccionado: CanalNotificacion;
}

const isDevelopment = process.env.NODE_ENV === "development";
const numeroTest = process.env.NEXT_PUBLIC_TWILIO_TEST_NUMBER;

export function EstadoServicioCard({
  estadoServicios,
  canalSeleccionado,
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

  if (!estadoServicios) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {canalSeleccionado === "whatsapp" && (
            <MessageSquare className="h-5 w-5 text-teal-600" />
          )}
          {canalSeleccionado === "email" && (
            <Mail className="h-5 w-5 text-blue-600" />
          )}
          {canalSeleccionado === "ambos" && (
            <Send className="h-5 w-5 text-purple-600" />
          )}
          Estado de Servicios
        </CardTitle>
        <CardDescription>
          {canalSeleccionado === "whatsapp" &&
            "Información del servicio WhatsApp"}
          {canalSeleccionado === "email" && "Información del servicio Email"}
          {canalSeleccionado === "ambos" && "Información de ambos servicios"}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* WhatsApp Service */}
        {canalSeleccionado !== "email" && (
          <div className="space-y-2">
            <div className="flex items-center gap-2 pb-2 border-b">
              <MessageSquare className="h-4 w-4 text-teal-600" />
              <span className="text-sm font-semibold">WhatsApp</span>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600">Proveedor</p>
                <p className="font-semibold">
                  {estadoServicios.whatsapp.proveedor}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Estado</p>
                <Badge
                  variant={
                    estadoServicios.whatsapp.configurado
                      ? "default"
                      : "destructive"
                  }
                  className="flex items-center gap-1 w-fit"
                >
                  {estadoServicios.whatsapp.configurado ? (
                    <CheckCircle className="h-3 w-3" />
                  ) : (
                    <XCircle className="h-3 w-3" />
                  )}
                  {estadoServicios.whatsapp.configurado
                    ? "Configurado"
                    : "No Configurado"}
                </Badge>
              </div>
            </div>
          </div>
        )}

        {/* Email Service */}
        {canalSeleccionado !== "whatsapp" && (
          <div className="space-y-2">
            <div className="flex items-center gap-2 pb-2 border-b">
              <Mail className="h-4 w-4 text-blue-600" />
              <span className="text-sm font-semibold">Email</span>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600">Proveedor</p>
                <p className="font-semibold">
                  {estadoServicios.email.proveedor}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Estado</p>
                <Badge
                  variant={
                    estadoServicios.email.configurado
                      ? "default"
                      : "destructive"
                  }
                  className="flex items-center gap-1 w-fit"
                >
                  {estadoServicios.email.configurado ? (
                    <CheckCircle className="h-3 w-3" />
                  ) : (
                    <XCircle className="h-3 w-3" />
                  )}
                  {estadoServicios.email.configurado
                    ? "Configurado"
                    : "No Configurado"}
                </Badge>
              </div>
            </div>
            {estadoServicios.email.emailRemitente && (
              <div className="mt-2">
                <p className="text-sm text-gray-600">Email Remitente</p>
                <p className="font-mono text-sm">
                  {estadoServicios.email.emailRemitente}
                </p>
              </div>
            )}
          </div>
        )}

        {isDevelopment &&
          numeroTest &&
          estadoServicios.whatsapp.configurado &&
          canalSeleccionado !== "email" && (
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
