import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, RefreshCw } from "lucide-react";
import { EstadoServicioWhatsApp } from "@/lib/types/notificaciones";

interface NotificacionesHeaderProps {
  estadoServicio: EstadoServicioWhatsApp | null;
  onRefresh: () => void;
}

const isDevelopment = process.env.NODE_ENV === "development";
const numeroTest = process.env.NEXT_PUBLIC_TWILIO_TEST_NUMBER;

export function NotificacionesHeader({
  estadoServicio,
  onRefresh,
}: NotificacionesHeaderProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-teal-700">
            Notificaciones WhatsApp
          </h1>
          <p className="text-gray-600 mt-1">Envío de mensajes a prestadores</p>
        </div>

        <div className="flex gap-2 items-center">
          {isDevelopment && (
            <Badge variant="outline" className="bg-yellow-50 border-yellow-300">
              🧪 Modo Desarrollo
            </Badge>
          )}

          {estadoServicio && (
            <Badge
              variant={estadoServicio.configurado ? "default" : "destructive"}
              className="flex items-center gap-1"
            >
              {estadoServicio.configurado
                ? "🟢 Twilio Activo"
                : "🔴 No Configurado"}
            </Badge>
          )}

          <Button variant="outline" size="sm" onClick={onRefresh}>
            <RefreshCw className="h-4 w-4 mr-1" />
            Actualizar
          </Button>
        </div>
      </div>

      {isDevelopment && numeroTest && (
        <Alert className="border-yellow-300 bg-yellow-50">
          <AlertCircle className="h-4 w-4 text-yellow-600" />
          <AlertTitle className="text-yellow-800">Modo Desarrollo</AlertTitle>
          <AlertDescription className="text-yellow-700">
            Todos los mensajes serán enviados a: <strong>{numeroTest}</strong>
            <br />
            En producción, se enviarán a los números reales de los usuarios.
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
}
