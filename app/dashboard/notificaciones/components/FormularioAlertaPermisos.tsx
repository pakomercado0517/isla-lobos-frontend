import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, MessageSquare, Mail, Send } from "lucide-react";
import { useState } from "react";
import { enviarAlertaPermisos } from "@/actions/notificaciones";
import { enviarAlertaPermisosEmail } from "@/actions/emails";
import { CanalNotificacion } from "@/lib/types/notificaciones";
import { clientLogger } from "@/lib/logger-client";

interface FormularioAlertaPermisosProps {
  canal: CanalNotificacion;
}

export function FormularioAlertaPermisos({
  canal,
}: FormularioAlertaPermisosProps) {
  const [diasAnticipacion, setDiasAnticipacion] = useState("30");
  const [enviando, setEnviando] = useState(false);
  const [resultado, setResultado] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const dias = parseInt(diasAnticipacion);

    if (isNaN(dias) || dias < 1 || dias > 90) {
      setResultado("❌ Los días deben estar entre 1 y 90");
      return;
    }

    try {
      setEnviando(true);
      setResultado("");

      const datosAlerta = {
        dias_anticipacion: dias,
      };

      if (canal === "whatsapp") {
        // Enviar solo por WhatsApp
        clientLogger.info("Enviando alertas de permisos por WhatsApp", {
          diasAnticipacion: dias,
        });

        const result = await enviarAlertaPermisos(datosAlerta);

        if (result.success && result.data) {
          const { enviados, fallidos, total } = result.data.resumen;
          if (total === 0) {
            setResultado("ℹ️ No hay prestadores con permisos por vencer");
          } else {
            setResultado(
              `✅ WhatsApp: ${enviados}/${total} alertas enviadas${
                fallidos > 0 ? `, ${fallidos} fallidos` : ""
              }`
            );
          }
        } else {
          setResultado(`❌ Error: ${result.error}`);
        }
      } else if (canal === "email") {
        // Enviar solo por Email
        clientLogger.info("Enviando alertas de permisos por Email", {
          diasAnticipacion: dias,
        });

        const result = await enviarAlertaPermisosEmail(datosAlerta);

        if (result.success && result.data) {
          const { enviados, fallidos, total } = result.data.resumen;
          if (total === 0) {
            setResultado("ℹ️ No hay prestadores con permisos por vencer");
          } else {
            setResultado(
              `✅ Email: ${enviados}/${total} alertas enviadas${
                fallidos > 0 ? `, ${fallidos} fallidos` : ""
              }`
            );
          }
        } else {
          setResultado(`❌ Error: ${result.error}`);
        }
      } else {
        // Enviar por ambos canales
        clientLogger.info("Enviando alertas de permisos por ambos canales", {
          diasAnticipacion: dias,
        });

        const [whatsappResult, emailResult] = await Promise.all([
          enviarAlertaPermisos(datosAlerta),
          enviarAlertaPermisosEmail(datosAlerta),
        ]);

        const whatsappEnviados = whatsappResult.data?.resumen.enviados || 0;
        const emailEnviados = emailResult.data?.resumen.enviados || 0;
        const whatsappTotal = whatsappResult.data?.resumen.total || 0;
        const emailTotal = emailResult.data?.resumen.total || 0;

        if (whatsappTotal === 0 && emailTotal === 0) {
          setResultado("ℹ️ No hay prestadores con permisos por vencer");
        } else if (whatsappResult.success && emailResult.success) {
          setResultado(
            `✅ Alertas enviadas - WhatsApp: ${whatsappEnviados}/${whatsappTotal}, Email: ${emailEnviados}/${emailTotal}`
          );
        } else if (whatsappResult.success && !emailResult.success) {
          setResultado(
            `⚠️ WhatsApp enviado (${whatsappEnviados}/${whatsappTotal}), pero Email falló: ${emailResult.error}`
          );
        } else if (!whatsappResult.success && emailResult.success) {
          setResultado(
            `⚠️ Email enviado (${emailEnviados}/${emailTotal}), pero WhatsApp falló: ${whatsappResult.error}`
          );
        } else {
          setResultado(
            `❌ Ambos canales fallaron. WhatsApp: ${whatsappResult.error}, Email: ${emailResult.error}`
          );
        }
      }
    } catch (error) {
      setResultado("❌ Error al enviar alertas de permisos");
      clientLogger.error("Error crítico al enviar alertas de permisos", error);
    } finally {
      setEnviando(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {canal === "whatsapp" && (
            <MessageSquare className="h-5 w-5 text-teal-600" />
          )}
          {canal === "email" && <Mail className="h-5 w-5 text-blue-600" />}
          {canal === "ambos" && (
            <AlertCircle className="h-5 w-5 text-purple-600" />
          )}
          Alerta de Permisos
        </CardTitle>
        <CardDescription>
          {canal === "whatsapp" &&
            "Notificar por WhatsApp a prestadores con permisos próximos a vencer"}
          {canal === "email" &&
            "Notificar por Email a prestadores con permisos próximos a vencer"}
          {canal === "ambos" &&
            "Notificar por ambos canales a prestadores con permisos próximos a vencer"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="dias">Días de Anticipación</Label>
            <Input
              id="dias"
              type="number"
              min="1"
              max="90"
              placeholder="30"
              value={diasAnticipacion}
              onChange={(e) => setDiasAnticipacion(e.target.value)}
              required
            />
            <p className="text-sm text-gray-600">
              Notificar a prestadores cuyo permiso vence en {diasAnticipacion}{" "}
              día(s) o menos
            </p>
          </div>

          {resultado && (
            <Alert
              variant={
                resultado.includes("✅") || resultado.includes("ℹ️")
                  ? "default"
                  : "destructive"
              }
            >
              <AlertDescription>{resultado}</AlertDescription>
            </Alert>
          )}

          <Button
            type="submit"
            disabled={enviando}
            className={`w-full ${
              canal === "whatsapp"
                ? "bg-teal-600 hover:bg-teal-700"
                : canal === "email"
                ? "bg-blue-600 hover:bg-blue-700"
                : "bg-purple-600 hover:bg-purple-700"
            }`}
          >
            {canal === "whatsapp" && <MessageSquare className="h-4 w-4 mr-2" />}
            {canal === "email" && <Mail className="h-4 w-4 mr-2" />}
            {canal === "ambos" && <Send className="h-4 w-4 mr-2" />}
            {enviando
              ? "Enviando..."
              : canal === "whatsapp"
              ? "Enviar Alertas por WhatsApp"
              : canal === "email"
              ? "Enviar Alertas por Email"
              : "Enviar Alertas por Ambos Canales"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
