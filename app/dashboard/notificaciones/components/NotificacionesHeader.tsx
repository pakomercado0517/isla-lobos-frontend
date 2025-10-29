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
    <div className="space-y-3 md:space-y-4">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div className="min-w-0">
          <h1 className="text-xl md:text-3xl font-bold text-teal-700 truncate">
            Sistema de Notificaciones
          </h1>
          <p className="text-xs md:text-sm text-gray-600 mt-1">
            Envío de mensajes por múltiples canales
          </p>
        </div>

        <div className="flex flex-wrap gap-2 items-center">
          {isDevelopment && (
            <Badge
              variant="outline"
              className="bg-yellow-50 border-yellow-300 text-[10px] md:text-xs"
            >
              🧪 Desarrollo
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
                className="flex items-center gap-1 text-[10px] md:text-xs"
              >
                <MessageSquare className="h-2 w-2 md:h-3 md:w-3" />
                <span className="hidden sm:inline">
                  {estadoServicios.whatsapp.configurado
                    ? "WhatsApp"
                    : "WhatsApp No Config."}
                </span>
                <span className="sm:hidden">WA</span>
              </Badge>

              <Badge
                variant={
                  estadoServicios.email.configurado ? "default" : "destructive"
                }
                className="flex items-center gap-1 text-[10px] md:text-xs"
              >
                <Mail className="h-2 w-2 md:h-3 md:w-3" />
                <span className="hidden sm:inline">
                  {estadoServicios.email.configurado
                    ? "Email"
                    : "Email No Config."}
                </span>
                <span className="sm:hidden">@</span>
              </Badge>
            </>
          )}

          <Button
            variant="outline"
            size="sm"
            onClick={onRefresh}
            className="h-8 md:h-9 text-xs md:text-sm"
          >
            <RefreshCw className="h-3 w-3 md:h-4 md:w-4 mr-1" />
            <span className="hidden sm:inline">Actualizar</span>
            <span className="sm:hidden">↻</span>
          </Button>
        </div>
      </div>

      {/* Selector de Canal */}
      <div className="flex flex-col gap-3 md:flex-row md:gap-2 p-3 md:p-4 bg-gradient-to-r from-teal-50 to-blue-50 rounded-lg border border-teal-200">
        <div className="flex items-center gap-2">
          <Send className="h-4 w-4 md:h-5 md:w-5 text-teal-600 flex-shrink-0" />
          <span className="text-xs md:text-sm font-medium text-gray-700">
            Canal de envío:
          </span>
        </div>

        <div className="grid grid-cols-3 gap-2 md:flex md:flex-1 md:justify-end">
          <Button
            variant={canalSeleccionado === "whatsapp" ? "default" : "outline"}
            size="sm"
            onClick={() => onCanalChange("whatsapp")}
            className={`h-8 md:h-9 text-xs md:text-sm ${
              canalSeleccionado === "whatsapp"
                ? "bg-teal-600 hover:bg-teal-700"
                : ""
            }`}
          >
            <MessageSquare className="h-3 w-3 md:h-4 md:w-4 md:mr-1" />
            <span className="hidden md:inline">WhatsApp</span>
            <span className="md:hidden">WA</span>
          </Button>

          <Button
            variant={canalSeleccionado === "email" ? "default" : "outline"}
            size="sm"
            onClick={() => onCanalChange("email")}
            className={`h-8 md:h-9 text-xs md:text-sm ${
              canalSeleccionado === "email"
                ? "bg-blue-600 hover:bg-blue-700"
                : ""
            }`}
          >
            <Mail className="h-3 w-3 md:h-4 md:w-4 md:mr-1" />
            Email
          </Button>

          <Button
            variant={canalSeleccionado === "ambos" ? "default" : "outline"}
            size="sm"
            onClick={() => onCanalChange("ambos")}
            className={`h-8 md:h-9 text-xs md:text-sm ${
              canalSeleccionado === "ambos"
                ? "bg-purple-600 hover:bg-purple-700"
                : ""
            }`}
          >
            <Send className="h-3 w-3 md:h-4 md:w-4 md:mr-1" />
            <span className="hidden md:inline">Ambos</span>
            <span className="md:hidden">2</span>
          </Button>
        </div>
      </div>

      {isDevelopment && numeroTest && canalSeleccionado !== "email" && (
        <Alert className="border-yellow-300 bg-yellow-50">
          <AlertCircle className="h-3 w-3 md:h-4 md:w-4 text-yellow-600 flex-shrink-0" />
          <AlertTitle className="text-yellow-800 text-xs md:text-sm">
            Modo Desarrollo
          </AlertTitle>
          <AlertDescription className="text-yellow-700 text-[10px] md:text-xs break-words">
            Los mensajes de WhatsApp serán enviados a:{" "}
            <strong className="break-all">{numeroTest}</strong>
            <br />
            En producción, se enviarán a los números reales de los usuarios.
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
}
