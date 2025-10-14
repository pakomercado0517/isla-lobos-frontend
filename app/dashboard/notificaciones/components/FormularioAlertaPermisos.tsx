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
import { AlertCircle } from "lucide-react";
import { useState } from "react";
import { enviarAlertaPermisos } from "@/actions/notificaciones";
import { clientLogger } from "@/lib/logger-client";

export function FormularioAlertaPermisos() {
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

      clientLogger.info("Enviando alertas de permisos", {
        diasAnticipacion: dias,
      });

      const result = await enviarAlertaPermisos({
        dias_anticipacion: dias,
      });

      if (result.success && result.data) {
        const { enviados, fallidos, total } = result.data.resumen;

        if (total === 0) {
          setResultado("ℹ️ No hay prestadores con permisos por vencer");
        } else {
          setResultado(
            `✅ ${enviados}/${total} alertas enviadas, ${fallidos} fallidos`
          );
        }

        clientLogger.info("Alertas de permisos enviadas", {
          total,
          enviados,
          fallidos,
        });
      } else {
        setResultado(`❌ Error: ${result.error}`);
        clientLogger.error("Error al enviar alertas de permisos", result.error);
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
          <AlertCircle className="h-5 w-5" />
          Alerta de Permisos
        </CardTitle>
        <CardDescription>
          Notificar a prestadores con permisos próximos a vencer
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

          <Button type="submit" disabled={enviando} className="w-full">
            {enviando ? "Enviando..." : "Enviar Alertas de Permisos"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
