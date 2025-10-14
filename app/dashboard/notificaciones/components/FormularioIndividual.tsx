import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Send, Info } from "lucide-react";
import { useState } from "react";
import { enviarNotificacion } from "@/actions/notificaciones";
import {
  TipoNotificacion,
  PrioridadNotificacion,
} from "@/lib/types/notificaciones";
import {
  validarTelefono,
  validarMensajeLength,
  formatearTelefono,
} from "./utils";
import { clientLogger } from "@/lib/logger-client";

const isDevelopment = process.env.NODE_ENV === "development";
const numeroTest = process.env.NEXT_PUBLIC_TWILIO_TEST_NUMBER;

export function FormularioIndividual() {
  const [telefono, setTelefono] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [tipo, setTipo] = useState<TipoNotificacion>("recordatorio_generico");
  const [prioridad, setPrioridad] = useState<PrioridadNotificacion>("media");
  const [enviando, setEnviando] = useState(false);
  const [resultado, setResultado] = useState<string>("");

  const validacionMensaje = validarMensajeLength(mensaje);
  const telefonoValido = validarTelefono(telefono);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!telefonoValido) {
      setResultado("❌ El teléfono debe tener 10 dígitos");
      return;
    }

    if (!validacionMensaje.valid) {
      setResultado(`❌ ${validacionMensaje.message}`);
      return;
    }

    try {
      setEnviando(true);
      setResultado("");

      clientLogger.info("Enviando notificación individual", {
        telefono,
        tipo,
        prioridad,
      });

      const result = await enviarNotificacion({
        telefono,
        mensaje,
        tipo,
        prioridad,
      });

      if (result.success) {
        setResultado("✅ Notificación enviada exitosamente");
        clientLogger.info("Notificación enviada", {
          messageId: result.data?.message_id,
        });

        // Limpiar formulario
        setMensaje("");
      } else {
        setResultado(`❌ Error: ${result.error}`);
        clientLogger.error("Error al enviar notificación", result.error);
      }
    } catch (error) {
      setResultado("❌ Error al enviar notificación");
      clientLogger.error("Error crítico al enviar notificación", error);
    } finally {
      setEnviando(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Envío Individual</CardTitle>
        <CardDescription>
          Enviar mensaje de WhatsApp a un número específico
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="telefono">Número de Teléfono *</Label>
            <Input
              id="telefono"
              type="tel"
              placeholder="2291234567"
              value={telefono}
              onChange={(e) => setTelefono(e.target.value.replace(/\D/g, ""))}
              maxLength={10}
              required
            />
            {telefono && (
              <p className="text-sm text-gray-600">
                {telefonoValido
                  ? `✓ ${formatearTelefono(telefono)}`
                  : "⚠ Debe tener 10 dígitos"}
              </p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="tipo">Tipo de Notificación</Label>
              <Select
                value={tipo}
                onValueChange={(v) => setTipo(v as TipoNotificacion)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="recordatorio_generico">
                    Recordatorio
                  </SelectItem>
                  <SelectItem value="alerta_clima">Alerta Clima</SelectItem>
                  <SelectItem value="permiso_por_vencer">
                    Permiso por Vencer
                  </SelectItem>
                  <SelectItem value="confirmacion_salida">
                    Confirmación Salida
                  </SelectItem>
                  <SelectItem value="stock_brazaletes_bajo">
                    Stock Bajo
                  </SelectItem>
                  <SelectItem value="bienvenida">Bienvenida</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="prioridad">Prioridad</Label>
              <Select
                value={prioridad}
                onValueChange={(v) => setPrioridad(v as PrioridadNotificacion)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="baja">Baja</SelectItem>
                  <SelectItem value="media">Media</SelectItem>
                  <SelectItem value="alta">Alta</SelectItem>
                  <SelectItem value="urgente">Urgente</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="mensaje">Mensaje *</Label>
            <Textarea
              id="mensaje"
              placeholder="Escribe tu mensaje aquí..."
              value={mensaje}
              onChange={(e) => setMensaje(e.target.value)}
              rows={6}
              required
              className="resize-none"
            />
            <p
              className={`text-sm ${
                validacionMensaje.valid ? "text-gray-600" : "text-red-600"
              }`}
            >
              {validacionMensaje.message}
            </p>
          </div>

          {telefono && isDevelopment && numeroTest && (
            <Alert className="border-blue-300 bg-blue-50">
              <Info className="h-4 w-4 text-blue-600" />
              <AlertTitle className="text-blue-800">Destinatario</AlertTitle>
              <AlertDescription className="text-blue-700 space-y-1">
                <p>
                  <strong>Original:</strong> {formatearTelefono(telefono)}
                </p>
                <p>
                  <strong>Se enviará a:</strong> {numeroTest} (modo desarrollo)
                </p>
              </AlertDescription>
            </Alert>
          )}

          {resultado && (
            <Alert
              variant={resultado.includes("✅") ? "default" : "destructive"}
            >
              <AlertDescription>{resultado}</AlertDescription>
            </Alert>
          )}

          <Button
            type="submit"
            disabled={enviando || !telefonoValido || !validacionMensaje.valid}
            className="w-full"
          >
            <Send className="h-4 w-4 mr-2" />
            {enviando ? "Enviando..." : "Enviar Notificación"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
