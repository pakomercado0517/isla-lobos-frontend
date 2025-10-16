import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  AlertCircle,
  RefreshCw,
  MessageSquare,
  Mail,
  Send,
} from "lucide-react";
import {
  EstadoServiciosNotificaciones,
  CanalNotificacion,
} from "@/lib/types/notificaciones";

interface NotificacionesHeaderProps {
  estadoServicios: EstadoServiciosNotificaciones | null;
  canalSeleccionado: CanalNotificacion;
  onCanalChange: (canal: CanalNotificacion) => void;
  onRefresh: () => void;
}

const isDevelopment = process.env.NODE_ENV === "development";
const numeroTest = process.env.NEXT_PUBLIC_TWILIO_TEST_NUMBER;

export function NotificacionesHeader({
  estadoServicios,
  canalSeleccionado,
  onCanalChange,
  onRefresh,
}: NotificacionesHeaderProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-teal-700">
            Sistema de Notificaciones
          </h1>
          <p className="text-gray-600 mt-1">
            Envío de mensajes por múltiples canales
          </p>
        </div>

        <div className="flex gap-2 items-center">
          {isDevelopment && (
            <Badge variant="outline" className="bg-yellow-50 border-yellow-300">
              🧪 Modo Desarrollo
            </Badge>
          )}

          {estadoServicios && (
            <>
              <Badge
                variant={
                  estadoServicios.whatsapp.configurado
                    ? "default"
                    : "destructive"
                }
                className="flex items-center gap-1"
              >
                <MessageSquare className="h-3 w-3" />
                {estadoServicios.whatsapp.configurado
                  ? "WhatsApp"
                  : "WhatsApp No Configurado"}
              </Badge>

              <Badge
                variant={
                  estadoServicios.email.configurado ? "default" : "destructive"
                }
                className="flex items-center gap-1"
              >
                <Mail className="h-3 w-3" />
                {estadoServicios.email.configurado
                  ? "Email"
                  : "Email No Configurado"}
              </Badge>
            </>
          )}

          <Button variant="outline" size="sm" onClick={onRefresh}>
            <RefreshCw className="h-4 w-4 mr-1" />
            Actualizar
          </Button>
        </div>
      </div>

      {/* Selector de Canal */}
      <div className="flex gap-2 p-4 bg-gradient-to-r from-teal-50 to-blue-50 rounded-lg border border-teal-200">
        <div className="flex items-center gap-2 flex-1">
          <Send className="h-5 w-5 text-teal-600" />
          <span className="text-sm font-medium text-gray-700">
            Canal de envío:
          </span>
        </div>

        <div className="flex gap-2">
          <Button
            variant={canalSeleccionado === "whatsapp" ? "default" : "outline"}
            size="sm"
            onClick={() => onCanalChange("whatsapp")}
            className={
              canalSeleccionado === "whatsapp"
                ? "bg-teal-600 hover:bg-teal-700"
                : ""
            }
          >
            <MessageSquare className="h-4 w-4 mr-1" />
            WhatsApp
          </Button>

          <Button
            variant={canalSeleccionado === "email" ? "default" : "outline"}
            size="sm"
            onClick={() => onCanalChange("email")}
            className={
              canalSeleccionado === "email"
                ? "bg-blue-600 hover:bg-blue-700"
                : ""
            }
          >
            <Mail className="h-4 w-4 mr-1" />
            Email
          </Button>

          <Button
            variant={canalSeleccionado === "ambos" ? "default" : "outline"}
            size="sm"
            onClick={() => onCanalChange("ambos")}
            className={
              canalSeleccionado === "ambos"
                ? "bg-purple-600 hover:bg-purple-700"
                : ""
            }
          >
            <Send className="h-4 w-4 mr-1" />
            Ambos Canales
          </Button>
        </div>
      </div>

      {isDevelopment && numeroTest && canalSeleccionado !== "email" && (
        <Alert className="border-yellow-300 bg-yellow-50">
          <AlertCircle className="h-4 w-4 text-yellow-600" />
          <AlertTitle className="text-yellow-800">Modo Desarrollo</AlertTitle>
          <AlertDescription className="text-yellow-700">
            Los mensajes de WhatsApp serán enviados a:{" "}
            <strong>{numeroTest}</strong>
            <br />
            En producción, se enviarán a los números reales de los usuarios.
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
}
