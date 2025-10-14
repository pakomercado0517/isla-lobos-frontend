import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Users, Send } from "lucide-react";
import { useState } from "react";
import { enviarNotificacionMasiva } from "@/actions/notificaciones";
import { validarMensajeLength } from "./utils";
import { clientLogger } from "@/lib/logger-client";

export function FormularioMasivo() {
  const [mensaje, setMensaje] = useState("");
  const [usuariosIds, setUsuariosIds] = useState<string>("");
  const [enviando, setEnviando] = useState(false);
  const [resultado, setResultado] = useState("");

  const validacionMensaje = validarMensajeLength(mensaje);
  const idsArray = usuariosIds
    .split(",")
    .map((id) => id.trim())
    .filter(Boolean);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (idsArray.length === 0) {
      setResultado("❌ Ingrese al menos un ID de usuario");
      return;
    }

    if (!validacionMensaje.valid) {
      setResultado(`❌ ${validacionMensaje.message}`);
      return;
    }

    try {
      setEnviando(true);
      setResultado("");

      clientLogger.info("Enviando notificación masiva", {
        totalUsuarios: idsArray.length,
      });

      const result = await enviarNotificacionMasiva({
        usuarios_ids: idsArray,
        mensaje,
        tipo: "recordatorio_generico",
      });

      if (result.success && result.data) {
        const { enviados, fallidos, total } = result.data.resumen;
        setResultado(
          `✅ ${enviados}/${total} mensajes enviados, ${fallidos} fallidos`
        );
        clientLogger.info("Notificación masiva completada", {
          total,
          enviados,
          fallidos,
        });
        setMensaje("");
      } else {
        setResultado(`❌ Error: ${result.error}`);
        clientLogger.error("Error al enviar notificación masiva", result.error);
      }
    } catch (error) {
      setResultado("❌ Error al enviar notificaciones");
      clientLogger.error("Error crítico al enviar notificación masiva", error);
    } finally {
      setEnviando(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="h-5 w-5" />
          Envío Masivo
        </CardTitle>
        <CardDescription>
          Enviar el mismo mensaje a múltiples usuarios
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="usuarios">
              IDs de Usuarios (separados por comas) *
            </Label>
            <Textarea
              id="usuarios"
              placeholder="uuid-1, uuid-2, uuid-3..."
              value={usuariosIds}
              onChange={(e) => setUsuariosIds(e.target.value)}
              rows={3}
              required
            />
            <p className="text-sm text-gray-600">
              {idsArray.length > 0
                ? `${idsArray.length} usuario(s) seleccionado(s)`
                : "0 usuarios"}
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="mensajeMasivo">Mensaje *</Label>
            <Textarea
              id="mensajeMasivo"
              placeholder="Escribe tu mensaje aquí..."
              value={mensaje}
              onChange={(e) => setMensaje(e.target.value)}
              rows={6}
              required
            />
            <p
              className={`text-sm ${
                validacionMensaje.valid ? "text-gray-600" : "text-red-600"
              }`}
            >
              {validacionMensaje.message}
            </p>
          </div>

          {resultado && (
            <Alert
              variant={resultado.includes("✅") ? "default" : "destructive"}
            >
              <AlertDescription>{resultado}</AlertDescription>
            </Alert>
          )}

          <Button
            type="submit"
            disabled={
              enviando || idsArray.length === 0 || !validacionMensaje.valid
            }
            className="w-full"
          >
            <Send className="h-4 w-4 mr-2" />
            {enviando
              ? "Enviando..."
              : `Enviar a ${idsArray.length} Usuario(s)`}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
